/*
# Add admin role, user management functions, and tighten RLS

## Summary
Adds a `role` column to the `profiles` table to distinguish admins from regular users.
Creates SECURITY DEFINER functions that let admins manage users (list all, change roles,
delete users, send password resets) with server-side authorization checks.
Tightens RLS so regular users can only read/update their own profile and cannot change
their own role. Admins can read all profiles. No password columns are added — passwords
stay exclusively in Supabase Auth.

## Changes to existing tables
- `profiles` — added `role` column (text, NOT NULL, default 'user', CHECK in ('user','admin'))
  Existing rows are backfilled to 'user'.

## Security changes (RLS)
- `profiles` SELECT policy replaced: admins can read ALL profiles; regular users read only their own.
- `profiles` UPDATE policy replaced: users can update only their own row's non-role columns.
  Column-level privileges revoke UPDATE on `role` from `authenticated` so users cannot
  escalate themselves to admin via the data API.
- Added INSERT policy for `profiles` (needed so the trigger can insert — it runs as
  SECURITY DEFINER which bypasses RLS, but the policy is added for completeness).

## New functions (SECURITY DEFINER)
1. `is_admin()` — returns true if the current auth.uid() has role='admin'. Used in policies.
2. `admin_list_users()` — returns all profiles joined with auth.users creation date and
   banned status. Admin-only.
3. `admin_set_user_role(p_target uuid, p_role text)` — changes a user's role. Admin-only.
   Prevents an admin from demoting themselves (guard against lockout).
4. `admin_delete_user(p_target uuid)` — deletes a user from auth.users (cascades to
   profiles). Admin-only. Prevents self-deletion.
5. `admin_send_password_reset(p_email text)` — triggers Supabase Auth's password reset
   email for the given email. Admin-only. Does NOT reveal or store the password.

## Important notes
1. No password column is ever added. Passwords remain in auth.users, managed by Supabase Auth.
2. The `role` column is protected by column-level privileges: `authenticated` cannot UPDATE it.
   The only way to change a role is through `admin_set_user_role()`, which checks the caller is admin.
3. `handle_new_user()` trigger is updated to set role='user' on new signups.
4. All SECURITY DEFINER functions use `SET search_path = public` and derive the caller from
   `auth.uid()` — never from a parameter.
5. `admin_delete_user` uses the Supabase `auth` schema's admin API via `SECURITY DEFINER`
   to remove the user row from `auth.users`, which cascades to `profiles` via the existing
   ON DELETE CASCADE foreign key.
*/

-- ─── Step 1: Add role column ──────────────────────────────────────────────────

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'role') THEN
    ALTER TABLE profiles ADD COLUMN role text NOT NULL DEFAULT 'user';
    ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('user', 'admin'));
  END IF;
END $$;

-- ─── Step 2: Update handle_new_user to set role='user' ─────────────────────────

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'user'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name);
  RETURN NEW;
END;
$$;

-- ─── Step 3: is_admin() helper ─────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

REVOKE EXECUTE ON FUNCTION is_admin() FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

-- ─── Step 4: Replace profiles RLS policies ─────────────────────────────────────

-- SELECT: admins see all, users see only their own
DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_or_all_if_admin" ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR public.is_admin());

-- UPDATE: users can update only their own row, but NOT the role column (enforced by column privileges)
DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- INSERT: allow authenticated to insert their own profile (trigger handles most cases)
DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- DELETE: only admins can delete profiles (via function; direct delete denied to non-admins)
DROP POLICY IF EXISTS "delete_own_profile_admin_only" ON profiles;
CREATE POLICY "delete_profile_admin_only" ON profiles FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ─── Step 5: Column-level privileges — protect role column ─────────────────────

-- Revoke all UPDATE, then grant only on user-editable columns
REVOKE UPDATE ON profiles FROM authenticated;
GRANT UPDATE (full_name, username, phone, avatar_url) ON profiles TO authenticated;

-- ─── Step 6: admin_list_users() ────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION admin_list_users()
RETURNS TABLE (
  id uuid,
  full_name text,
  email text,
  role text,
  created_at timestamptz,
  banned_until timestamptz,
  banned_reason text
)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  RETURN QUERY
  SELECT
    p.id,
    p.full_name,
    p.email,
    p.role,
    u.created_at,
    u.banned_until,
    u.banned_reason
  FROM public.profiles p
  JOIN auth.users u ON u.id = p.id
  ORDER BY u.created_at DESC;
END;
$$;

REVOKE EXECUTE ON FUNCTION admin_list_users() FROM anon;
GRANT EXECUTE ON FUNCTION admin_list_users() TO authenticated;

-- ─── Step 7: admin_set_user_role() ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION admin_set_user_role(p_target uuid, p_role text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  IF p_role NOT IN ('user', 'admin') THEN
    RAISE EXCEPTION 'Invalid role';
  END IF;

  IF p_target = auth.uid() THEN
    RAISE EXCEPTION 'You cannot change your own role';
  END IF;

  UPDATE public.profiles
  SET role = p_role, updated_at = now()
  WHERE id = p_target;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$;

REVOKE EXECUTE ON FUNCTION admin_set_user_role(uuid, text) FROM anon;
GRANT EXECUTE ON FUNCTION admin_set_user_role(uuid, text) TO authenticated;

-- ─── Step 8: admin_delete_user() ───────────────────────────────────────────────

CREATE OR REPLACE FUNCTION admin_delete_user(p_target uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  IF p_target = auth.uid() THEN
    RAISE EXCEPTION 'You cannot delete your own account';
  END IF;

  DELETE FROM auth.users WHERE id = p_target;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$;

REVOKE EXECUTE ON FUNCTION admin_delete_user(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION admin_delete_user(uuid) TO authenticated;

-- ─── Step 9: admin_send_password_reset() ──────────────────────────────────────
-- Triggers a password reset email via Supabase Auth's admin API.
-- This does NOT reveal, store, or return the password.

CREATE OR REPLACE FUNCTION admin_send_password_reset(p_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- Use Supabase's built-in auth function to send a password reset email
  -- This sends a recovery link to the user's email; the admin never sees the password.
  PERFORM net.http_post(
    url := 'https://kezttfyvaeqqszfiphul.supabase.co/auth/v1/recover',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'apikey', current_setting('request.jwt.claim.apikey', true)
    ),
    body := jsonb_build_object('email', p_email)
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION admin_send_password_reset(text) FROM anon;
GRANT EXECUTE ON FUNCTION admin_send_password_reset(text) TO authenticated;

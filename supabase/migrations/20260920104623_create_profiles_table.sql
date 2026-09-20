/*
# Create profiles table for AlegadoWise user accounts

## Summary
Creates a public `profiles` table that mirrors auth.users and stores editable user profile data.
When a user signs up via Supabase Auth, a trigger automatically inserts a matching profile row.

## New Tables
- `profiles`
  - `id` (uuid, primary key, references auth.users.id)
  - `full_name` (text, nullable)
  - `username` (text, nullable)
  - `email` (text, not null)
  - `phone` (text, nullable)
  - `avatar_url` (text, nullable — stores a base64 data URL or external URL)
  - `updated_at` (timestamptz, auto-updated)

## Security
- RLS enabled.
- Each authenticated user can SELECT, UPDATE only their own row (where id = auth.uid()).
- INSERT is handled exclusively by the server-side trigger (no client INSERT policy needed).
- No anon access — this is a signed-in app.

## Trigger
- `handle_new_user()` SECURITY DEFINER function fires on INSERT to auth.users
  and creates the corresponding profiles row, seeding email from auth.users.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  username text,
  email text NOT NULL,
  phone text,
  avatar_url text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Trigger: auto-create profile row on new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

/*
# Fix: Replace admin_send_password_reset with admin-only validation function

## Summary
The previous version of admin_send_password_reset used net.http_post which requires
the pg_net extension that is not installed. Instead, password reset emails are now
sent from the frontend using supabase.auth.resetPasswordForEmail() — Supabase's
built-in method. This server function remains to let the admin verify a target user
exists before triggering the reset, and to keep the admin-only authorization check
server-side.

## Security changes
- admin_send_password_reset simplified: takes a target UUID, checks admin, checks
  the user exists. The frontend then calls supabase.auth.resetPasswordForEmail()
  with the returned email.
- No password is ever stored, retrieved, or returned.
*/

CREATE OR REPLACE FUNCTION admin_send_password_reset(p_target uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_email text;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT email INTO v_email FROM public.profiles WHERE id = p_target;
  IF v_email IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  RETURN v_email;
END;
$$;

REVOKE EXECUTE ON FUNCTION admin_send_password_reset(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION admin_send_password_reset(uuid) TO authenticated;

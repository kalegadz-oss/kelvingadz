/*
# Fix: Revoke EXECUTE on admin functions from anon/public

## Summary
The previous migration used `REVOKE EXECUTE ... FROM anon` but the `anon` role
inherits EXECUTE from `public` (PostgreSQL grants EXECUTE to public by default
when a function is created). This tightens all 5 SECURITY DEFINER functions by
revoking from both `anon` and `public`, then granting only to `authenticated`.

## Security changes
- All 5 admin functions (`is_admin`, `admin_list_users`, `admin_set_user_role`,
  `admin_delete_user`, `admin_send_password_reset`) now only callable by
  `authenticated`, NOT by `anon`.
*/

REVOKE EXECUTE ON FUNCTION is_admin() FROM anon, public;
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

REVOKE EXECUTE ON FUNCTION admin_list_users() FROM anon, public;
GRANT EXECUTE ON FUNCTION admin_list_users() TO authenticated;

REVOKE EXECUTE ON FUNCTION admin_set_user_role(uuid, text) FROM anon, public;
GRANT EXECUTE ON FUNCTION admin_set_user_role(uuid, text) TO authenticated;

REVOKE EXECUTE ON FUNCTION admin_delete_user(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION admin_delete_user(uuid) TO authenticated;

REVOKE EXECUTE ON FUNCTION admin_send_password_reset(text) FROM anon, public;
GRANT EXECUTE ON FUNCTION admin_send_password_reset(text) TO authenticated;

/*
# Lock down handle_new_user trigger function

handle_new_user is a trigger function — it only needs to run as a trigger on
auth.users, not be called directly via RPC. Revoke EXECUTE from anon and public
to close the advisor warning.
*/

REVOKE EXECUTE ON FUNCTION handle_new_user() FROM anon, public;

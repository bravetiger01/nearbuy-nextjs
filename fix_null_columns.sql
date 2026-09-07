-- ============================================================
-- TARGETED NULL FIX (per Supabase Docs)
-- "If you observe 500: Database error querying schema in Auth logs,
--  it indicates NULL values where empty string is expected."
--
-- Run in: Supabase Dashboard → SQL Editor
-- After running: try signing in again.
-- ============================================================

-- Fix every string/boolean column that GoTrue validates.
-- IMPORTANT: phone stays NULL (unique index: two '' would conflict).
--            phone_change has NO unique index → safe to set ''.
UPDATE auth.users
SET
    -- Token columns (must be '' not NULL)
    confirmation_token          = COALESCE(confirmation_token,          ''),
    recovery_token              = COALESCE(recovery_token,              ''),
    email_change                = COALESCE(email_change,                ''),
    email_change_token_new      = COALESCE(email_change_token_new,      ''),
    email_change_token_current  = COALESCE(email_change_token_current,  ''),
    reauthentication_token      = COALESCE(reauthentication_token,      ''),
    phone_change_token          = COALESCE(phone_change_token,          ''),  -- no unique index

    -- phone_change: NOT the unique-indexed phone column, safe to set ''
    phone_change                = COALESCE(phone_change,                ''),

    -- Status / enum columns
    aud                         = COALESCE(aud,                         'authenticated'),
    role                        = COALESCE(role,                        'authenticated'),
    email_change_confirm_status = COALESCE(email_change_confirm_status, 0),

    -- Boolean columns (NULL here causes GoTrue to crash)
    is_sso_user                 = COALESCE(is_sso_user,                 FALSE),
    is_anonymous                = COALESCE(is_anonymous,                FALSE),
    is_super_admin              = COALESCE(is_super_admin,              FALSE),

    -- JSONB (must not be NULL)
    raw_app_meta_data  = COALESCE(raw_app_meta_data,
                             '{"provider":"email","providers":["email"]}'::jsonb),
    raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb),

    -- Ensure email is confirmed (unconfirmed users can't sign in)
    email_confirmed_at = COALESCE(email_confirmed_at, NOW()),

    updated_at = NOW()
WHERE email IN ('admin@gmail.com', 'customer@gmail.com');

-- Verify: check for any remaining NULLs in the critical columns
SELECT
    email,
    CASE WHEN confirmation_token         IS NULL THEN 'NULL!' ELSE 'ok' END AS confirmation_token,
    CASE WHEN recovery_token             IS NULL THEN 'NULL!' ELSE 'ok' END AS recovery_token,
    CASE WHEN email_change               IS NULL THEN 'NULL!' ELSE 'ok' END AS email_change,
    CASE WHEN email_change_token_new     IS NULL THEN 'NULL!' ELSE 'ok' END AS email_change_token_new,
    CASE WHEN email_change_token_current IS NULL THEN 'NULL!' ELSE 'ok' END AS email_change_token_current,
    CASE WHEN reauthentication_token     IS NULL THEN 'NULL!' ELSE 'ok' END AS reauthentication_token,
    CASE WHEN phone_change_token         IS NULL THEN 'NULL!' ELSE 'ok' END AS phone_change_token,
    CASE WHEN phone_change               IS NULL THEN 'NULL!' ELSE 'ok' END AS phone_change,
    CASE WHEN is_super_admin             IS NULL THEN 'NULL!' ELSE 'ok' END AS is_super_admin,
    CASE WHEN email_confirmed_at         IS NULL THEN 'NULL!' ELSE 'ok' END AS email_confirmed,
    phone  -- should be NULL (unique index)
FROM auth.users
WHERE email IN ('admin@gmail.com', 'customer@gmail.com');

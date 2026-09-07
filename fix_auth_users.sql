-- ============================================================
-- Fix for "Database error querying schema" on sign-in
-- ------------------------------------------------------------
-- Cause: auth.users holds NULLs where the Auth service expects
-- an empty string. This happens when users are inserted directly
-- via SQL instead of through the Auth API.
--
-- This converts every NULL string/token column to '' for the
-- seeded users (admin@gmail.com, customer@gmail.com).
-- Run it in the Supabase SQL Editor, then sign in again.
-- ============================================================

UPDATE auth.users
SET
    confirmation_token     = COALESCE(confirmation_token, ''),
    recovery_token         = COALESCE(recovery_token, ''),
    email_change           = COALESCE(email_change, ''),
    email_change_token_new = COALESCE(email_change_token_new, ''),
    email_change_token_current = COALESCE(email_change_token_current, ''),
    reauthentication_token = COALESCE(reauthentication_token, ''),
    aud                    = COALESCE(aud, ''),
    email                  = COALESCE(email, ''),
    phone                  = NULL,
    phone_change           = NULL,
    phone_change_token     = NULL,
    is_anonymous           = COALESCE(is_anonymous, FALSE),
    is_sso_user            = COALESCE(is_sso_user, FALSE),
    email_change_confirm_status = COALESCE(email_change_confirm_status, 0)
WHERE email IN ('admin@gmail.com', 'customer@gmail.com');

-- Make sure a matching auth.identities row exists for email login
-- (GoTrue links password sign-in through identities since v2).
INSERT INTO auth.identities (
    provider_id, id, user_id, identity_data, provider, last_sign_in_at,
    created_at, updated_at
)
SELECT
    u.id::text, u.id, u.id, jsonb_build_object('sub', u.id::text, 'email', u.email),
    'email', NOW(), NOW(), NOW()
FROM auth.users u
WHERE u.email IN ('admin@gmail.com', 'customer@gmail.com')
  AND NOT EXISTS (
      SELECT 1 FROM auth.identities i
      WHERE i.user_id = u.id AND i.provider = 'email'
  )
ON CONFLICT DO NOTHING;

-- After this, verify the passwords match by resetting them.
-- The previously stored hashes may reference a missing salt; to be
-- safe we recreate the password hashes:
UPDATE auth.users
SET encrypted_password = crypt('admin123', gen_salt('bf')),
    updated_at = NOW(),
    email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email = 'admin@gmail.com';

UPDATE auth.users
SET encrypted_password = crypt('customer123', gen_salt('bf')),
    updated_at = NOW(),
    email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email = 'customer@gmail.com';

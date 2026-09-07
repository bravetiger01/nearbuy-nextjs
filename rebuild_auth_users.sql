-- ============================================================
-- COMPLETE AUTH USER REBUILD
-- Run this in the Supabase SQL Editor (as postgres / service role).
-- It fully deletes and re-creates the demo auth users so GoTrue
-- has no residual NULL / missing-identity problems.
--
-- After running, sign in with:
--   Shop Owner : admin@gmail.com    / admin123
--   Customer   : customer@gmail.com / customer123
-- ============================================================

-- Step 0: Wipe dependent identities first
DELETE FROM auth.identities
WHERE user_id IN (
    'a0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000002'
);

-- Step 1: Delete the bad auth.users rows
DELETE FROM auth.users
WHERE id IN (
    'a0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000002'
);

-- Step 2: Re-insert auth.users with EVERY column explicit
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    confirmation_token, confirmation_sent_at,
    recovery_token, recovery_sent_at,
    email_change, email_change_sent_at,
    email_change_token_new, email_change_token_current,
    email_change_confirm_status,
    phone, phone_confirmed_at,
    phone_change, phone_change_token, phone_change_sent_at,
    reauthentication_token, reauthentication_sent_at,
    is_sso_user, is_anonymous,
    last_sign_in_at, created_at, updated_at
)
VALUES
(
    '00000000-0000-0000-0000-000000000000',
    'a0000000-0000-0000-0000-000000000001',
    'authenticated', 'authenticated', 'admin@gmail.com',
    crypt('admin123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}', '{}',
    '', NULL, '', NULL, '', NULL, '', '', 0,
    NULL, NULL, NULL, '', NULL, '', NULL,
    FALSE, FALSE, NOW(), NOW(), NOW()
),
(
    '00000000-0000-0000-0000-000000000000',
    'a0000000-0000-0000-0000-000000000002',
    'authenticated', 'authenticated', 'customer@gmail.com',
    crypt('customer123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}', '{}',
    '', NULL, '', NULL, '', NULL, '', '', 0,
    NULL, NULL, NULL, '', NULL, '', NULL,
    FALSE, FALSE, NOW(), NOW(), NOW()
);

-- Step 3: Create auth.identities (GoTrue v2 requirement)
INSERT INTO auth.identities (
    provider_id, id, user_id, identity_data,
    provider, last_sign_in_at, created_at, updated_at
)
VALUES
(
    'a0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    '{"sub":"a0000000-0000-0000-0000-000000000001","email":"admin@gmail.com","email_verified":true,"phone_verified":false}',
    'email', NOW(), NOW(), NOW()
),
(
    'a0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000002',
    '{"sub":"a0000000-0000-0000-0000-000000000002","email":"customer@gmail.com","email_verified":true,"phone_verified":false}',
    'email', NOW(), NOW(), NOW()
)
ON CONFLICT DO NOTHING;

-- Step 4: Upsert profiles
INSERT INTO profiles (id, full_name, email, role, is_active, created_at, updated_at)
VALUES
(
    'a0000000-0000-0000-0000-000000000001',
    'Shop Owner Admin', 'admin@gmail.com', 'shop_owner',
    TRUE, NOW(), NOW()
),
(
    'a0000000-0000-0000-0000-000000000002',
    'Demo Customer', 'customer@gmail.com', 'customer',
    TRUE, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role, is_active = EXCLUDED.is_active, updated_at = NOW();

-- Verify - this should show 2 rows with all TRUE / 'email' / correct role
SELECT
    u.email,
    u.email_confirmed_at IS NOT NULL AS "email_confirmed",
    u.encrypted_password IS NOT NULL AS "has_password",
    i.provider                        AS "identity_provider",
    p.role                            AS "profile_role"
FROM auth.users u
LEFT JOIN auth.identities i ON i.user_id = u.id AND i.provider = 'email'
LEFT JOIN profiles         p ON p.id = u.id
WHERE u.email IN ('admin@gmail.com', 'customer@gmail.com');

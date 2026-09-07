-- ============================================================
-- NearBuy — Proper Multi-Owner Seed
-- Each shop has its own shop_owner auth user + profile.
-- Run in: Supabase Dashboard → SQL Editor (as postgres)
--
-- Demo Logins:
--   Mahi Stationery   : admin@gmail.com      / admin123
--   Shrinathji Xerox  : shop2@nearbuy.com    / shop123
--   Jay Jalaram Med.  : shop3@nearbuy.com    / shop123
--   Shree Raam Med.   : shop4@nearbuy.com    / shop123
--   Mahalaxmi Med.    : shop5@nearbuy.com    / shop123
--   Customer          : customer@gmail.com   / customer123
-- ============================================================

-- ──────────────────────────────────────────────────────────
-- CLEANUP (order matters due to FKs)
-- ──────────────────────────────────────────────────────────
DELETE FROM auth.identities WHERE user_id::text LIKE 'a0000000-0000-0000-0000-%';
DELETE FROM auth.users       WHERE id::text     LIKE 'a0000000-0000-0000-0000-%';

-- ──────────────────────────────────────────────────────────
-- 1. AUTH USERS
--    All string token columns = '' (not NULL).
--    phone / phone_confirmed_at / phone_change_sent_at = NULL (OK: NULL is
--    distinct in the unique index so multiple rows can coexist).
--    phone_change = '' (no unique index, must not be NULL).
--    is_super_admin = FALSE (boolean, must not be NULL).
-- ──────────────────────────────────────────────────────────
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    confirmation_token, confirmation_sent_at,
    recovery_token,     recovery_sent_at,
    email_change,       email_change_sent_at,
    email_change_token_new, email_change_token_current,
    email_change_confirm_status,
    phone, phone_confirmed_at,
    phone_change, phone_change_token, phone_change_sent_at,
    reauthentication_token, reauthentication_sent_at,
    is_sso_user, is_anonymous, is_super_admin,
    last_sign_in_at, created_at, updated_at
) VALUES
-- Mahi Stationery owner (main demo account)
('00000000-0000-0000-0000-000000000000','a0000000-0000-0000-0000-000000000001',
 'authenticated','authenticated','admin@gmail.com',
 crypt('admin123', gen_salt('bf')),
 NOW(),'{"provider":"email","providers":["email"]}','{}',
 '',NULL,'',NULL,'',NULL,'','',0,
 NULL,NULL,'','',NULL,'',NULL,FALSE,FALSE,FALSE,NOW(),NOW(),NOW()),
-- Shrinathji Xerox owner
('00000000-0000-0000-0000-000000000000','a0000000-0000-0000-0000-000000000002',
 'authenticated','authenticated','shop2@nearbuy.com',
 crypt('shop123', gen_salt('bf')),
 NOW(),'{"provider":"email","providers":["email"]}','{}',
 '',NULL,'',NULL,'',NULL,'','',0,
 NULL,NULL,'','',NULL,'',NULL,FALSE,FALSE,FALSE,NOW(),NOW(),NOW()),
-- Jay Jalaram Medical owner
('00000000-0000-0000-0000-000000000000','a0000000-0000-0000-0000-000000000003',
 'authenticated','authenticated','shop3@nearbuy.com',
 crypt('shop123', gen_salt('bf')),
 NOW(),'{"provider":"email","providers":["email"]}','{}',
 '',NULL,'',NULL,'',NULL,'','',0,
 NULL,NULL,'','',NULL,'',NULL,FALSE,FALSE,FALSE,NOW(),NOW(),NOW()),
-- Shree Raam Medical owner
('00000000-0000-0000-0000-000000000000','a0000000-0000-0000-0000-000000000004',
 'authenticated','authenticated','shop4@nearbuy.com',
 crypt('shop123', gen_salt('bf')),
 NOW(),'{"provider":"email","providers":["email"]}','{}',
 '',NULL,'',NULL,'',NULL,'','',0,
 NULL,NULL,'','',NULL,'',NULL,FALSE,FALSE,FALSE,NOW(),NOW(),NOW()),
-- Mahalaxmi Medical owner
('00000000-0000-0000-0000-000000000000','a0000000-0000-0000-0000-000000000005',
 'authenticated','authenticated','shop5@nearbuy.com',
 crypt('shop123', gen_salt('bf')),
 NOW(),'{"provider":"email","providers":["email"]}','{}',
 '',NULL,'',NULL,'',NULL,'','',0,
 NULL,NULL,'','',NULL,'',NULL,FALSE,FALSE,FALSE,NOW(),NOW(),NOW()),
-- Customer
('00000000-0000-0000-0000-000000000000','a0000000-0000-0000-0000-000000000010',
 'authenticated','authenticated','customer@gmail.com',
 crypt('customer123', gen_salt('bf')),
 NOW(),'{"provider":"email","providers":["email"]}','{}',
 '',NULL,'',NULL,'',NULL,'','',0,
 NULL,NULL,'','',NULL,'',NULL,FALSE,FALSE,FALSE,NOW(),NOW(),NOW())
ON CONFLICT (id) DO UPDATE SET
    encrypted_password = EXCLUDED.encrypted_password,
    phone_change       = '',
    is_super_admin     = FALSE,
    email_confirmed_at = COALESCE(auth.users.email_confirmed_at, NOW()),
    updated_at         = NOW();

-- ──────────────────────────────────────────────────────────
-- 2. AUTH IDENTITIES (required for GoTrue v2 email login)
-- ──────────────────────────────────────────────────────────
INSERT INTO auth.identities (provider_id, id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
SELECT
    u.id::text, u.id, u.id,
    jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true, 'phone_verified', false),
    'email', NOW(), NOW(), NOW()
FROM auth.users u
WHERE u.email IN ('admin@gmail.com','shop2@nearbuy.com','shop3@nearbuy.com',
                  'shop4@nearbuy.com','shop5@nearbuy.com','customer@gmail.com')
  AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.user_id = u.id AND i.provider = 'email'
  )
ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────────────────
-- 3. PROFILES (one per auth user)
-- ──────────────────────────────────────────────────────────
INSERT INTO profiles (id, full_name, email, role, is_active, created_at, updated_at)
VALUES
('a0000000-0000-0000-0000-000000000001', 'Mahi Stationery Owner',   'admin@gmail.com',    'shop_owner', TRUE, NOW(), NOW()),
('a0000000-0000-0000-0000-000000000002', 'Shrinathji Xerox Owner',  'shop2@nearbuy.com',  'shop_owner', TRUE, NOW(), NOW()),
('a0000000-0000-0000-0000-000000000003', 'Jay Jalaram Med. Owner',  'shop3@nearbuy.com',  'shop_owner', TRUE, NOW(), NOW()),
('a0000000-0000-0000-0000-000000000004', 'Shree Raam Med. Owner',   'shop4@nearbuy.com',  'shop_owner', TRUE, NOW(), NOW()),
('a0000000-0000-0000-0000-000000000005', 'Mahalaxmi Med. Owner',    'shop5@nearbuy.com',  'shop_owner', TRUE, NOW(), NOW()),
('a0000000-0000-0000-0000-000000000010', 'Demo Customer',           'customer@gmail.com', 'customer',   TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    full_name  = EXCLUDED.full_name,
    role       = EXCLUDED.role,
    is_active  = EXCLUDED.is_active,
    updated_at = NOW();

-- ──────────────────────────────────────────────────────────
-- 4. SHOPS (each linked to its own owner)
-- ──────────────────────────────────────────────────────────
INSERT INTO shops (
    id, owner_id, name, description, phone, email,
    address_line_1, address_line_2, city, state, pincode,
    latitude, longitude, location, logo_url, cover_image_url,
    rating, total_reviews, is_open, is_verified, status, created_at, updated_at
) VALUES
('10000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',
 'Mahi Stationery','Stationery store and school/office supplies.','07777987143',NULL,
 'Opp. Shajanand Shopping Centre, Main Bazar','Nandesari','Vadodara','Gujarat','391340',
 NULL,NULL,NULL,NULL,NULL,4.7,44,TRUE,FALSE,'active',NOW(),NOW()),
('10000000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000002',
 'Shrinathji Xerox','Xerox, photocopy and store services.',NULL,NULL,
 'SVIT Campus','Vasad','Vasad','Gujarat','388306',
 NULL,NULL,NULL,NULL,NULL,4.1,21,TRUE,FALSE,'active',NOW(),NOW()),
('10000000-0000-0000-0000-000000000003','a0000000-0000-0000-0000-000000000003',
 'JAY JALARAM MEDICAL AGENCY','Pharmacy and medical supplies.','07383940854',NULL,
 'Platinum Plaza, Umreth, F-11 Road',NULL,'Vasad','Gujarat','388306',
 NULL,NULL,NULL,NULL,NULL,5.0,1,TRUE,FALSE,'active',NOW(),NOW()),
('10000000-0000-0000-0000-000000000004','a0000000-0000-0000-0000-000000000004',
 'Shree raam Medical Store','Pharmacy and medical supplies.','09428658292',NULL,
 'Parbdi',NULL,'Vasad','Gujarat','388306',
 NULL,NULL,NULL,NULL,NULL,5.0,1,TRUE,FALSE,'active',NOW(),NOW()),
('10000000-0000-0000-0000-000000000005','a0000000-0000-0000-0000-000000000005',
 'Mahalaxmi Medical Store','Pharmacy and medical supplies.',NULL,NULL,
 'F357+XP, GJ SH 8','Vaherakhadi','Vasad','Gujarat','388306',
 NULL,NULL,NULL,NULL,NULL,5.0,1,TRUE,FALSE,'active',NOW(),NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name, description = EXCLUDED.description,
    owner_id = EXCLUDED.owner_id,
    phone = EXCLUDED.phone, address_line_1 = EXCLUDED.address_line_1,
    city = EXCLUDED.city, state = EXCLUDED.state, pincode = EXCLUDED.pincode,
    rating = EXCLUDED.rating, total_reviews = EXCLUDED.total_reviews,
    is_open = EXCLUDED.is_open, updated_at = NOW();

-- ──────────────────────────────────────────────────────────
-- 5. SHOP HOURS
-- ──────────────────────────────────────────────────────────
INSERT INTO shop_hours (id, shop_id, day_of_week, open_time, close_time, is_closed) VALUES
('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001',0,NULL,'19:00',FALSE),
('20000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000002',0,NULL,'16:45',FALSE),
('20000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000003',0,NULL,'20:00',FALSE)
ON CONFLICT (shop_id, day_of_week) DO UPDATE SET
    close_time = EXCLUDED.close_time, is_closed = EXCLUDED.is_closed;

-- ──────────────────────────────────────────────────────────
-- 6. PRODUCTS (global catalog, same as before)
-- ──────────────────────────────────────────────────────────
INSERT INTO products (id, name, description, brand, category_id, sku, barcode, unit, image_url, created_at, updated_at)
SELECT p.id::uuid, p.name, p.product_desc, p.brand, c.id, p.sku, p.barcode, p.unit, NULL, NOW(), NOW()
FROM (VALUES
    ('30000000-0000-0000-0000-000000000001','Classmate Notebook A4 (200 pages)','Hard cover ruled notebook, 200 pages','Classmate','NB-A4-200','8900001','piece'),
    ('30000000-0000-0000-0000-000000000002','Spiral Notebook A5','Spiral bound A5 notebook','Navneet','NB-A5-SP','8900002','piece'),
    ('30000000-0000-0000-0000-000000000003','Reynolds Pen Blue (Pack of 10)','Blue ballpoint pens, pack of 10','Reynolds','PN-REY-10','8900003','pack'),
    ('30000000-0000-0000-0000-000000000004','Cello Ballpen Blue (Pack of 20)','Blue ballpoint pens, pack of 20','Cello','PN-CELLO-20','8900004','pack'),
    ('30000000-0000-0000-0000-000000000005','Highlighter Set (5 colours)','Set of 5 bright highlighters','Camlin','PN-HL-5','8900005','set'),
    ('30000000-0000-0000-0000-000000000006','Apsara Pencil HB (Box of 10)','Box of 10 HB pencils','Apsara','PN-APS-10','8900006','box'),
    ('30000000-0000-0000-0000-000000000007','Geometry Box Camlin','9-piece geometry set','Camlin','MT-GEO-C','8900007','set'),
    ('30000000-0000-0000-0000-000000000008','Plastic Scale 30 cm','Transparent plastic scale 30 cm','Camlin','MT-SCALE-30','8900008','piece'),
    ('30000000-0000-0000-0000-000000000009','Scientific Calculator Casio fx-82MS','12-digit scientific calculator','Casio','EL-CAL-FX82','8900009','piece'),
    ('30000000-0000-0000-0000-000000000010','HP 802 Ink Cartridge (Black)','Original HP 802 black ink cartridge','HP','EL-HP802-B','8900010','piece'),
    ('30000000-0000-0000-0000-000000000011','A4 Paper Ream (500 sheets)','JK copier paper A4, 75 GSM, 500 sheets','JK','PA-A4-REAM','8900011','ream'),
    ('30000000-0000-0000-0000-000000000012','Graph Paper Book','Graph notebook for maths/drawing','Navneet','PA-GRAPH','8900012','piece'),
    ('30000000-0000-0000-0000-000000000013','Stapler + Pins Set','Heavy duty stapler with pins','Kangaro','OF-STAPLER','8900013','set'),
    ('30000000-0000-0000-0000-000000000014','File Folder A4 (Pack of 10)','A4 paper file folders, pack of 10','Kangaro','OF-FOLDER-10','8900014','pack'),
    ('30000000-0000-0000-0000-000000000015','Fevicol 250 g','White adhesive glue 250 g','Fevicol','OF-FEV-250','8900015','piece')
) AS p(id, name, product_desc, brand, sku, barcode, unit)
JOIN categories c ON c.name = (CASE
    WHEN p.sku LIKE 'EL-%' THEN 'Electronics'
    WHEN p.sku LIKE 'PA-%' THEN 'Paper'
    WHEN p.sku LIKE 'OF-%' THEN 'Office'
    WHEN p.sku LIKE 'MT-%' THEN 'Math'
    WHEN p.sku LIKE 'PN-%' THEN 'Pens'
    ELSE 'Notebooks'
END)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name, description = EXCLUDED.description,
    brand = EXCLUDED.brand, category_id = EXCLUDED.category_id,
    unit = EXCLUDED.unit, updated_at = NOW();

-- ──────────────────────────────────────────────────────────
-- 7. SHOP PRODUCTS (shop-specific price + stock)
-- ──────────────────────────────────────────────────────────
INSERT INTO shop_products (id, shop_id, product_id, price, mrp, quantity, low_stock_threshold, discount_percentage, is_available, created_at, updated_at) VALUES
-- Mahi Stationery (shop 1)
('40000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001',120,130,45,10,7.69,TRUE,NOW(),NOW()),
('40000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000003',85,100,30,8,15.00,TRUE,NOW(),NOW()),
('40000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000007',180,200,12,5,10.00,TRUE,NOW(),NOW()),
('40000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000009',850,925,5,3,8.11,TRUE,NOW(),NOW()),
('40000000-0000-0000-0000-000000000005','10000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000011',350,400,20,8,12.50,TRUE,NOW(),NOW()),
('40000000-0000-0000-0000-000000000006','10000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000013',145,170,8,4,14.71,TRUE,NOW(),NOW()),
('40000000-0000-0000-0000-000000000007','10000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000005',95,110,18,5,13.64,TRUE,NOW(),NOW()),
('40000000-0000-0000-0000-000000000008','10000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000012',40,45,22,8,11.11,TRUE,NOW(),NOW()),
-- Shrinathji Xerox (shop 2)
('40000000-0000-0000-0000-000000000009','10000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000011',340,400,60,10,15.00,TRUE,NOW(),NOW()),
('40000000-0000-0000-0000-000000000010','10000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000013',150,170,6,3,11.76,TRUE,NOW(),NOW()),
('40000000-0000-0000-0000-000000000011','10000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000014',150,170,12,5,11.76,TRUE,NOW(),NOW()),
-- Jay Jalaram Medical (shop 3)
('40000000-0000-0000-0000-000000000012','10000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000009',840,925,10,4,9.19,TRUE,NOW(),NOW()),
('40000000-0000-0000-0000-000000000013','10000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000010',420,475,3,2,11.58,TRUE,NOW(),NOW()),
-- Shree Raam Medical (shop 4)
('40000000-0000-0000-0000-000000000014','10000000-0000-0000-0000-000000000004','30000000-0000-0000-0000-000000000002',65,75,40,10,13.33,TRUE,NOW(),NOW()),
('40000000-0000-0000-0000-000000000015','10000000-0000-0000-0000-000000000004','30000000-0000-0000-0000-000000000006',35,45,80,15,22.22,TRUE,NOW(),NOW()),
-- Mahalaxmi Medical (shop 5)
('40000000-0000-0000-0000-000000000016','10000000-0000-0000-0000-000000000005','30000000-0000-0000-0000-000000000009',860,925,7,3,7.03,TRUE,NOW(),NOW()),
('40000000-0000-0000-0000-000000000017','10000000-0000-0000-0000-000000000005','30000000-0000-0000-0000-000000000015',85,95,20,6,10.53,TRUE,NOW(),NOW())
ON CONFLICT (shop_id, product_id) DO UPDATE SET
    price = EXCLUDED.price, mrp = EXCLUDED.mrp,
    quantity = EXCLUDED.quantity, updated_at = NOW();

-- ──────────────────────────────────────────────────────────
-- 8. NOTIFICATIONS
-- ──────────────────────────────────────────────────────────
INSERT INTO notifications (user_id, type, title, message, data, is_read, created_at)
VALUES
('a0000000-0000-0000-0000-000000000001','order','New order received','Customer placed an order for Classmate Notebook A4.',   '{"source":"demo"}',FALSE,NOW()),
('a0000000-0000-0000-0000-000000000010','reservation','Reservation confirmed','Your Geometry Box reservation at Mahi Stationery is ready.','{"source":"demo"}',FALSE,NOW())
ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────────────────
-- VERIFY
-- ──────────────────────────────────────────────────────────
SELECT s.name AS shop, p.email AS owner_email, p.role
FROM shops s
JOIN profiles p ON p.id = s.owner_id
ORDER BY s.name;

-- NearBuy Hackathon: Supabase/PostgreSQL seed data
-- Source basis: Google Maps screenshots supplied by the user.
-- Mahi Stationery address additionally cross-checked against public web listings.
-- Fields not reliably available are left NULL instead of guessed.

INSERT INTO shops (
    id, owner_id, name, description, phone, email,
    address_line_1, address_line_2, city, state, pincode,
    latitude, longitude, location, logo_url, cover_image_url,
    rating, total_reviews, is_open, is_verified, status,
    created_at, updated_at
) VALUES
(
    '10000000-0000-0000-0000-000000000001', NULL,
    'Mahi Stationery', 'Stationery store and school/office supplies.', '07777987143', NULL,
    'Opp. Shajanand Shopping Centre, Main Bazar', 'Nandesari', 'Vadodara', 'Gujarat', '391340',
    NULL, NULL, NULL, NULL, NULL, 4.7, 44, TRUE, FALSE, 'active', NOW(), NOW()
),
(
    '10000000-0000-0000-0000-000000000002', NULL,
    'Shrinathji Xerox', 'Xerox, photocopy and store services.', NULL, NULL,
    'SVIT Campus', 'Vasad', 'Vasad', 'Gujarat', '388306',
    NULL, NULL, NULL, NULL, NULL, 4.1, 21, TRUE, FALSE, 'active', NOW(), NOW()
),
(
    '10000000-0000-0000-0000-000000000003', NULL,
    'JAY JALARAM MEDICAL AGENCY', 'Pharmacy and medical supplies.', '07383940854', NULL,
    'Platinum Plaza, Umreth, F-11 Road', NULL, 'Vasad', 'Gujarat', '388306',
    NULL, NULL, NULL, NULL, NULL, 5.0, 1, TRUE, FALSE, 'active', NOW(), NOW()
),
(
    '10000000-0000-0000-0000-000000000004', NULL,
    'Shree raam Medical Store', 'Pharmacy and medical supplies.', '09428658292', NULL,
    'Parbdi', NULL, 'Vasad', 'Gujarat', '388306',
    NULL, NULL, NULL, NULL, NULL, 5.0, 1, NULL, FALSE, 'active', NOW(), NOW()
),
(
    '10000000-0000-0000-0000-000000000005', NULL,
    'Mahalaxmi Medical Store', 'Pharmacy and medical supplies.', NULL, NULL,
    'F357+XP, GJ SH 8', 'Vaherakhadi', 'Vasad', 'Gujarat', '388306',
    NULL, NULL, NULL, NULL, NULL, 5.0, 1, NULL, FALSE, 'active', NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    phone = EXCLUDED.phone,
    address_line_1 = EXCLUDED.address_line_1,
    address_line_2 = EXCLUDED.address_line_2,
    city = EXCLUDED.city,
    state = EXCLUDED.state,
    pincode = EXCLUDED.pincode,
    rating = EXCLUDED.rating,
    total_reviews = EXCLUDED.total_reviews,
    is_open = EXCLUDED.is_open,
    updated_at = NOW();

-- Partial hours captured from Google Maps screenshots.
-- day_of_week: 0 = Sunday. Full weekly hours were not available.
INSERT INTO shop_hours (id, shop_id, day_of_week, open_time, close_time, is_closed)
VALUES
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 0, NULL, '19:00', FALSE),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 0, NULL, '16:45', FALSE),
('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 0, NULL, '20:00', FALSE)
ON CONFLICT (shop_id, day_of_week) DO UPDATE SET
    close_time = EXCLUDED.close_time,
    is_closed = EXCLUDED.is_closed;

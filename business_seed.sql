-- ============================================================
-- NearBuy — Demo business data for Mahi Stationery
-- ------------------------------------------------------------
-- Seeds orders, order_items, payments, transactions, expenses,
-- reservations, reservation_items and shop_views so the
-- dashboard / analytics / P&L show real numbers.
-- Sections 1-8 seed one demo shop's recent activity; Section 9
-- generates ~6 months of additional orders/expenses so charts
-- and the P&L report have a proper trend.
--
-- Uses relative dates (NOW() - INTERVAL ...) so the data is
-- always "fresh" no matter when it is run.
-- Uses the same user/shop/product UUIDs from supabase_seed.sql.
-- Safe to re-run via ON CONFLICT DO NOTHING.
-- ============================================================

-- ─── 0. Customer profile (if not already in profiles) ───────────────────────
INSERT INTO public.profiles (id, full_name, phone, avatar_url, role, is_active, created_at, updated_at)
SELECT 'a0000000-0000-0000-0000-000000000002', 'Demo Customer', NULL, NULL, 'customer', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = 'a0000000-0000-0000-0000-000000000002');

-- ─── 1. ORDERS ──────────────────────────────────────────────────────────────
-- All orders for Mahi Stationery (10000000-...0001), placed by customer
-- a0000000-0000-0000-0000-000000000002, spread across the last ~4 months.

INSERT INTO public.orders
  (id, customer_id, shop_id, status, subtotal, delivery_fee, platform_fee, discount, total_amount, payment_status, notes, created_at, updated_at)
VALUES
-- ~4 months ago
('50000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','delivered',  325, 0, 5, 0,  320, 'paid', NULL, NOW() - INTERVAL '120 days', NOW() - INTERVAL '120 days'),
('50000000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','delivered',  180, 0, 5, 0,  175, 'paid', NULL, NOW() - INTERVAL '106 days', NOW() - INTERVAL '106 days'),
-- ~3 months ago
('50000000-0000-0000-0000-000000000003','a0000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','delivered',  945, 0,10, 0,  935, 'paid', NULL, NOW() - INTERVAL '92 days',  NOW() - INTERVAL '92 days'),
('50000000-0000-0000-0000-000000000004','a0000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','delivered',  590, 0, 5, 0,  585, 'paid', NULL, NOW() - INTERVAL '75 days',  NOW() - INTERVAL '75 days'),
-- ~2 months ago
('50000000-0000-0000-0000-000000000005','a0000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','delivered',  445, 0, 5, 0,  440, 'paid', NULL, NOW() - INTERVAL '60 days',  NOW() - INTERVAL '60 days'),
('50000000-0000-0000-0000-000000000006','a0000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','delivered',  180, 0, 5, 0,  175, 'paid', NULL, NOW() - INTERVAL '44 days',  NOW() - INTERVAL '44 days'),
-- ~1 month ago
('50000000-0000-0000-0000-000000000007','a0000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','delivered',  520, 0, 5, 0,  515, 'paid', NULL, NOW() - INTERVAL '30 days',  NOW() - INTERVAL '30 days'),
-- ~3 weeks ago
('50000000-0000-0000-0000-000000000008','a0000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','delivered',  350, 0, 5, 0,  345, 'paid', NULL, NOW() - INTERVAL '19 days',  NOW() - INTERVAL '19 days'),
-- ~1.5 weeks ago
('50000000-0000-0000-0000-000000000009','a0000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','delivered',  85, 0, 5, 0,   80, 'paid', NULL, NOW() - INTERVAL '10 days',  NOW() - INTERVAL '10 days'),
-- recent (this month)
('50000000-0000-0000-0000-000000000010','a0000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','confirmed',  470, 0, 5, 0,  465, 'paid', NULL, NOW() - INTERVAL '4 days',   NOW() - INTERVAL '4 days'),
('50000000-0000-0000-0000-000000000011','a0000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','pending',    265, 0, 5, 0,  260, 'pending', NULL, NOW() - INTERVAL '1 day',    NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- ─── 2. ORDER ITEMS ─────────────────────────────────────────────────────────
-- shop_product IDs for Mahi Stationery:
--   40000000-...0001 = Classmate Notebook A4  @ ₹120
--   40000000-...0002 = Reynolds Pen Blue      @ ₹ 85
--   40000000-...0003 = Geometry Box Camlin    @ ₹180
--   40000000-...0004 = Scientific Calculator   @ ₹850
--   40000000-...0005 = A4 Paper Ream          @ ₹350
--   40000000-...0006 = Stapler + Pins Set     @ ₹145
--   40000000-...0007 = Highlighter Set        @ ₹ 95
--   40000000-...0008 = Graph Paper Book       @ ₹ 40

INSERT INTO public.order_items
  (id, order_id, shop_product_id, product_name, quantity, unit_price, subtotal, created_at)
VALUES
-- Order 1: Notebook x2 (240) + Pen x1 (85) = 325
('60000000-0000-0000-0000-000000001001','50000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001','Classmate Notebook A4 (200 pages)',2,120,240,NOW() - INTERVAL '120 days'),
('60000000-0000-0000-0000-000000001002','50000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000002','Reynolds Pen Blue (Pack of 10)',1,85,85,NOW() - INTERVAL '120 days'),
-- Order 2: Geometry Box x1 = 180
('60000000-0000-0000-0000-000000002001','50000000-0000-0000-0000-000000000002','40000000-0000-0000-0000-000000000003','Geometry Box Camlin',1,180,180,NOW() - INTERVAL '106 days'),
-- Order 3: Calculator x1 (850) + Highlighter x1 (95) = 945
('60000000-0000-0000-0000-000000003001','50000000-0000-0000-0000-000000000003','40000000-0000-0000-0000-000000000004','Scientific Calculator Casio fx-82MS',1,850,850,NOW() - INTERVAL '92 days'),
('60000000-0000-0000-0000-000000003002','50000000-0000-0000-0000-000000000003','40000000-0000-0000-0000-000000000007','Highlighter Set (5 colours)',1,95,95,NOW() - INTERVAL '92 days'),
-- Order 4: A4 Paper x1 (350) + Stapler x1 (145) + Highlighter x1 (95) = 590
('60000000-0000-0000-0000-000000004001','50000000-0000-0000-0000-000000000004','40000000-0000-0000-0000-000000000005','A4 Paper Ream (500 sheets)',1,350,350,NOW() - INTERVAL '75 days'),
('60000000-0000-0000-0000-000000004002','50000000-0000-0000-0000-000000000004','40000000-0000-0000-0000-000000000006','Stapler + Pins Set',1,145,145,NOW() - INTERVAL '75 days'),
('60000000-0000-0000-0000-000000004003','50000000-0000-0000-0000-000000000004','40000000-0000-0000-0000-000000000007','Highlighter Set (5 colours)',1,95,95,NOW() - INTERVAL '75 days'),
-- Order 5: Notebook x3 (360) + Pen x1 (85) = 445
('60000000-0000-0000-0000-000000005001','50000000-0000-0000-0000-000000000005','40000000-0000-0000-0000-000000000001','Classmate Notebook A4 (200 pages)',3,120,360,NOW() - INTERVAL '60 days'),
('60000000-0000-0000-0000-000000005002','50000000-0000-0000-0000-000000000005','40000000-0000-0000-0000-000000000002','Reynolds Pen Blue (Pack of 10)',1,85,85,NOW() - INTERVAL '60 days'),
-- Order 6: Geometry Box x1 = 180
('60000000-0000-0000-0000-000000006001','50000000-0000-0000-0000-000000000006','40000000-0000-0000-0000-000000000003','Geometry Box Camlin',1,180,180,NOW() - INTERVAL '44 days'),
-- Order 7: A4 Paper x1 (350) + Pen x2 (170) = 520
('60000000-0000-0000-0000-000000007001','50000000-0000-0000-0000-000000000007','40000000-0000-0000-0000-000000000005','A4 Paper Ream (500 sheets)',1,350,350,NOW() - INTERVAL '30 days'),
('60000000-0000-0000-0000-000000007002','50000000-0000-0000-0000-000000000007','40000000-0000-0000-0000-000000000002','Reynolds Pen Blue (Pack of 10)',2,85,170,NOW() - INTERVAL '30 days'),
-- Order 8: Pen x2 (170) + Geometry Box x1 (180) = 350
('60000000-0000-0000-0000-000000008001','50000000-0000-0000-0000-000000000008','40000000-0000-0000-0000-000000000002','Reynolds Pen Blue (Pack of 10)',2,85,170,NOW() - INTERVAL '19 days'),
('60000000-0000-0000-0000-000000008002','50000000-0000-0000-0000-000000000008','40000000-0000-0000-0000-000000000003','Geometry Box Camlin',1,180,180,NOW() - INTERVAL '19 days'),
-- Order 9: Pen x1 = 85
('60000000-0000-0000-0000-000000009001','50000000-0000-0000-0000-000000000009','40000000-0000-0000-0000-000000000002','Reynolds Pen Blue (Pack of 10)',1,85,85,NOW() - INTERVAL '10 days'),
-- Order 10: A4 Paper x1 (350) + Notebook x1 (120) = 470
('60000000-0000-0000-0000-00000000A001','50000000-0000-0000-0000-000000000010','40000000-0000-0000-0000-000000000005','A4 Paper Ream (500 sheets)',1,350,350,NOW() - INTERVAL '4 days'),
('60000000-0000-0000-0000-00000000A002','50000000-0000-0000-0000-000000000010','40000000-0000-0000-0000-000000000001','Classmate Notebook A4 (200 pages)',1,120,120,NOW() - INTERVAL '4 days'),
-- Order 11: Pen x1 (85) + Geometry Box x1 (180) = 265
('60000000-0000-0000-0000-00000000B001','50000000-0000-0000-0000-000000000011','40000000-0000-0000-0000-000000000002','Reynolds Pen Blue (Pack of 10)',1,85,85,NOW() - INTERVAL '1 day'),
('60000000-0000-0000-0000-00000000B002','50000000-0000-0000-0000-000000000011','40000000-0000-0000-0000-000000000003','Geometry Box Camlin',1,180,180,NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- ─── 3. PAYMENTS ────────────────────────────────────────────────────────────

INSERT INTO public.payments
  (id, order_id, customer_id, amount, payment_method, payment_gateway, transaction_id, status, paid_at, created_at)
VALUES
('70000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000002',320,'cash',NULL,'CASH-0001','paid',NOW() - INTERVAL '120 days',NOW() - INTERVAL '120 days'),
('70000000-0000-0000-0000-000000000002','50000000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000002',175,'upi',NULL,'UPI-0002','paid',NOW() - INTERVAL '106 days',NOW() - INTERVAL '106 days'),
('70000000-0000-0000-0000-000000000003','50000000-0000-0000-0000-000000000003','a0000000-0000-0000-0000-000000000002',935,'upi',NULL,'UPI-0003','paid',NOW() - INTERVAL '92 days',NOW() - INTERVAL '92 days'),
('70000000-0000-0000-0000-000000000004','50000000-0000-0000-0000-000000000004','a0000000-0000-0000-0000-000000000002',585,'cash',NULL,'CASH-0004','paid',NOW() - INTERVAL '75 days',NOW() - INTERVAL '75 days'),
('70000000-0000-0000-0000-000000000005','50000000-0000-0000-0000-000000000005','a0000000-0000-0000-0000-000000000002',440,'upi',NULL,'UPI-0005','paid',NOW() - INTERVAL '60 days',NOW() - INTERVAL '60 days'),
('70000000-0000-0000-0000-000000000006','50000000-0000-0000-0000-000000000006','a0000000-0000-0000-0000-000000000002',175,'cash',NULL,'CASH-0006','paid',NOW() - INTERVAL '44 days',NOW() - INTERVAL '44 days'),
('70000000-0000-0000-0000-000000000007','50000000-0000-0000-0000-000000000007','a0000000-0000-0000-0000-000000000002',515,'upi',NULL,'UPI-0007','paid',NOW() - INTERVAL '30 days',NOW() - INTERVAL '30 days'),
('70000000-0000-0000-0000-000000000008','50000000-0000-0000-0000-000000000008','a0000000-0000-0000-0000-000000000002',345,'cash',NULL,'CASH-0008','paid',NOW() - INTERVAL '19 days',NOW() - INTERVAL '19 days'),
('70000000-0000-0000-0000-000000000009','50000000-0000-0000-0000-000000000009','a0000000-0000-0000-0000-000000000002',80,'upi',NULL,'UPI-0009','paid',NOW() - INTERVAL '10 days',NOW() - INTERVAL '10 days'),
('70000000-0000-0000-0000-000000000010','50000000-0000-0000-0000-000000000010','a0000000-0000-0000-0000-000000000002',465,'upi',NULL,'UPI-0010','paid',NOW() - INTERVAL '4 days',NOW() - INTERVAL '4 days'),
-- Order 11: pending payment
('70000000-0000-0000-0000-000000000011','50000000-0000-0000-0000-000000000011','a0000000-0000-0000-0000-000000000002',260,'cash',NULL,NULL,'pending',NULL,NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- ─── 4. TRANSACTIONS (Bank Ledger) ─────────────────────────────────────────

INSERT INTO public.transactions
  (id, shop_id, order_id, transaction_type, amount, payment_method, reference_id, description, transaction_date, created_at)
VALUES
-- Sales credits (one per paid order)
('80000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000001','sale',320,'cash',NULL,'Order — Notebook + Pen',NOW() - INTERVAL '120 days',NOW() - INTERVAL '120 days'),
('80000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000002','sale',175,'upi',NULL,'Order — Geometry Box',NOW() - INTERVAL '106 days',NOW() - INTERVAL '106 days'),
('80000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000003','sale',935,'upi',NULL,'Order — Calculator + Highlighter',NOW() - INTERVAL '92 days',NOW() - INTERVAL '92 days'),
('80000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000004','sale',585,'cash',NULL,'Order — A4 Paper + Stapler + Highlighter',NOW() - INTERVAL '75 days',NOW() - INTERVAL '75 days'),
('80000000-0000-0000-0000-000000000005','10000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000005','sale',440,'upi',NULL,'Order — Notebook + Pen',NOW() - INTERVAL '60 days',NOW() - INTERVAL '60 days'),
('80000000-0000-0000-0000-000000000006','10000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000006','sale',175,'cash',NULL,'Order — Geometry Box',NOW() - INTERVAL '44 days',NOW() - INTERVAL '44 days'),
('80000000-0000-0000-0000-000000000007','10000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000007','sale',515,'upi',NULL,'Order — A4 Paper + Pen',NOW() - INTERVAL '30 days',NOW() - INTERVAL '30 days'),
('80000000-0000-0000-0000-000000000008','10000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000008','sale',345,'cash',NULL,'Order — Pen + Geometry Box',NOW() - INTERVAL '19 days',NOW() - INTERVAL '19 days'),
('80000000-0000-0000-0000-000000000009','10000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000009','sale',80,'upi',NULL,'Order — Pen',NOW() - INTERVAL '10 days',NOW() - INTERVAL '10 days'),
('80000000-0000-0000-0000-000000000010','10000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000010','sale',465,'upi',NULL,'Order — A4 Paper + Notebook',NOW() - INTERVAL '4 days',NOW() - INTERVAL '4 days'),
-- Platform fee + deposit
('80000000-0000-0000-0000-000000000101','10000000-0000-0000-0000-000000000001',NULL,'platform_fee',50,'upi',NULL,'Platform fees',NOW() - INTERVAL '30 days',NOW() - INTERVAL '30 days'),
('80000000-0000-0000-0000-000000000102','10000000-0000-0000-0000-000000000001',NULL,'platform_fee',50,'upi',NULL,'Platform fees',NOW() - INTERVAL '60 days',NOW() - INTERVAL '60 days'),
('80000000-0000-0000-0000-000000000103','10000000-0000-0000-0000-000000000001',NULL,'platform_fee',45,'upi',NULL,'Platform fees',NOW() - INTERVAL '90 days',NOW() - INTERVAL '90 days'),
('80000000-0000-0000-0000-000000000201','10000000-0000-0000-0000-000000000001',NULL,'deposit',50000,'cash',NULL,'Initial cash deposit',NOW() - INTERVAL '120 days',NOW() - INTERVAL '120 days')
ON CONFLICT (id) DO NOTHING;

-- ─── 5. EXPENSES ────────────────────────────────────────────────────────────

INSERT INTO public.expenses
  (id, shop_id, category, description, amount, expense_date, payment_method, receipt_url, created_at)
VALUES
-- ~4 months back
('90000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Rent','Shop rent',20000,(NOW() - INTERVAL '120 days')::date,'cash',NULL,NOW() - INTERVAL '120 days'),
('90000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','Electricity','Electricity bill',4300,(NOW() - INTERVAL '118 days')::date,'upi',NULL,NOW() - INTERVAL '118 days'),
('90000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000001','Staff Salary','Helper salary',8000,(NOW() - INTERVAL '115 days')::date,'cash',NULL,NOW() - INTERVAL '115 days'),
('90000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000001','Packaging','Wrapping material + bags',1800,(NOW() - INTERVAL '112 days')::date,'cash',NULL,NOW() - INTERVAL '112 days'),
-- ~3 months back
('90000000-0000-0000-0000-000000000005','10000000-0000-0000-0000-000000000001','Rent','Shop rent',20000,(NOW() - INTERVAL '90 days')::date,'cash',NULL,NOW() - INTERVAL '90 days'),
('90000000-0000-0000-0000-000000000006','10000000-0000-0000-0000-000000000001','Electricity','Electricity bill',4700,(NOW() - INTERVAL '88 days')::date,'upi',NULL,NOW() - INTERVAL '88 days'),
('90000000-0000-0000-0000-000000000007','10000000-0000-0000-0000-000000000001','Staff Salary','Helper salary',8000,(NOW() - INTERVAL '85 days')::date,'cash',NULL,NOW() - INTERVAL '85 days'),
('90000000-0000-0000-0000-000000000008','10000000-0000-0000-0000-000000000001','Internet','Broadband',1000,(NOW() - INTERVAL '80 days')::date,'upi',NULL,NOW() - INTERVAL '80 days'),
-- ~2 months back
('90000000-0000-0000-0000-000000000009','10000000-0000-0000-0000-000000000001','Rent','Shop rent',20000,(NOW() - INTERVAL '60 days')::date,'cash',NULL,NOW() - INTERVAL '60 days'),
('90000000-0000-0000-0000-000000000010','10000000-0000-0000-0000-000000000001','Electricity','Electricity bill',5200,(NOW() - INTERVAL '58 days')::date,'upi',NULL,NOW() - INTERVAL '58 days'),
('90000000-0000-0000-0000-000000000011','10000000-0000-0000-0000-000000000001','Staff Salary','Helper salary',8000,(NOW() - INTERVAL '55 days')::date,'cash',NULL,NOW() - INTERVAL '55 days'),
('90000000-0000-0000-0000-000000000012','10000000-0000-0000-0000-000000000001','Transport','Delivery bike fuel',2200,(NOW() - INTERVAL '52 days')::date,'cash',NULL,NOW() - INTERVAL '52 days'),
-- ~1 month back
('90000000-0000-0000-0000-000000000013','10000000-0000-0000-0000-000000000001','Rent','Shop rent',20000,(NOW() - INTERVAL '30 days')::date,'cash',NULL,NOW() - INTERVAL '30 days'),
('90000000-0000-0000-0000-000000000014','10000000-0000-0000-0000-000000000001','Electricity','Electricity bill',5900,(NOW() - INTERVAL '28 days')::date,'upi',NULL,NOW() - INTERVAL '28 days'),
('90000000-0000-0000-0000-000000000015','10000000-0000-0000-0000-000000000001','Staff Salary','Helper salary',8000,(NOW() - INTERVAL '25 days')::date,'cash',NULL,NOW() - INTERVAL '25 days'),
('90000000-0000-0000-0000-000000000016','10000000-0000-0000-0000-000000000001','Packaging','Wrapping material',2400,(NOW() - INTERVAL '20 days')::date,'cash',NULL,NOW() - INTERVAL '20 days'),
-- this month
('90000000-0000-0000-0000-000000000017','10000000-0000-0000-0000-000000000001','Rent','Shop rent',20000,(NOW() - INTERVAL '7 days')::date,'cash',NULL,NOW() - INTERVAL '7 days'),
('90000000-0000-0000-0000-000000000018','10000000-0000-0000-0000-000000000001','Electricity','Electricity bill',6300,(NOW() - INTERVAL '6 days')::date,'upi',NULL,NOW() - INTERVAL '6 days'),
('90000000-0000-0000-0000-000000000019','10000000-0000-0000-0000-000000000001','Internet','Broadband',1000,(NOW() - INTERVAL '5 days')::date,'upi',NULL,NOW() - INTERVAL '5 days'),
('90000000-0000-0000-0000-000000000020','10000000-0000-0000-0000-000000000001','Miscellaneous','Shop cleaning supplies',650,(NOW() - INTERVAL '2 days')::date,'cash',NULL,NOW() - INTERVAL '2 days')
ON CONFLICT (id) DO NOTHING;

-- ─── 6. RESERVATIONS ────────────────────────────────────────────────────────

INSERT INTO public.reservations
  (id, customer_id, shop_id, status, notes, expires_at, created_at, updated_at)
VALUES
('A0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','confirmed','Need urgently',NOW() + INTERVAL '2 days',NOW() - INTERVAL '1 day',NOW() - INTERVAL '1 day'),
('A0000000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','pending',NULL,NOW() + INTERVAL '3 days',NOW() - INTERVAL '18 hours',NOW() - INTERVAL '18 hours'),
('A0000000-0000-0000-0000-000000000003','a0000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','confirmed','Pack of 2 please',NOW() + INTERVAL '1 day',NOW() - INTERVAL '2 days',NOW() - INTERVAL '2 days'),
('A0000000-0000-0000-0000-000000000004','a0000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','pending',NULL,NOW() + INTERVAL '4 days',NOW() - INTERVAL '6 hours',NOW() - INTERVAL '6 hours')
ON CONFLICT (id) DO NOTHING;

-- ─── 7. RESERVATION ITEMS ───────────────────────────────────────────────────

INSERT INTO public.reservation_items
  (id, reservation_id, shop_product_id, quantity, unit_price)
VALUES
-- Reservation 1: Geometry Box x1
('B0000000-0000-0000-0000-000000000001','A0000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000003',1,180),
-- Reservation 2: Calculator x1
('B0000000-0000-0000-0000-000000000002','A0000000-0000-0000-0000-000000000002','40000000-0000-0000-0000-000000000004',1,850),
-- Reservation 3: A4 Paper x2
('B0000000-0000-0000-0000-000000000003','A0000000-0000-0000-0000-000000000003','40000000-0000-0000-0000-000000000005',2,350),
-- Reservation 4: Notebook x1 + Pen x1
('B0000000-0000-0000-0000-000000000004','A0000000-0000-0000-0000-000000000004','40000000-0000-0000-0000-000000000001',1,120),
('B0000000-0000-0000-0000-000000000005','A0000000-0000-0000-0000-000000000004','40000000-0000-0000-0000-000000000002',1,85)
ON CONFLICT (id) DO NOTHING;

-- ─── 8. SHOP VIEWS (randomised, ~300 rows over 90 days) ────────────────────

INSERT INTO public.shop_views (shop_id, customer_id, source, created_at)
SELECT
  '10000000-0000-0000-0000-000000000001'::uuid,
  CASE WHEN random() < 0.6 THEN 'a0000000-0000-0000-0000-000000000002'::uuid ELSE NULL END,
  (ARRAY['search','direct','promotion'])[1 + floor(random()*3)::int]::text,
  NOW() - (random() * 90 || ' days')::interval
FROM generate_series(1, 300)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 9. EXTENDED ORDER / EXPENSE DATA (for charts & P&L)
-- ------------------------------------------------------------
-- Generates 44 more orders (50000000-...000012 .. 000055) spread
-- over the last ~5 months, with matching order_items, payments,
-- ledger transactions, plus 45 more expenses across 6 months.
-- 100% idempotent: ids are deterministic, ON CONFLICT skips rows
-- already inserted. The 11 original orders remain untouched.
-- ============================================================

-- ─── 9a. Generate order items into a temp table (single source of truth) ────
-- order_items references orders (FK), so orders must be inserted first.
-- Generating into a temp table lets the orders INSERT compute totals from
-- the very same item rows that are later inserted as order_items.
DROP TABLE IF EXISTS _gen_items;
CREATE TEMP TABLE _gen_items AS
SELECT
  gs AS n,
  ('60000000-0000-0000-0000-' || lpad((gs * 10 + item_idx)::text, 12, '0'))::uuid AS item_id,
  ('50000000-0000-0000-0000-' || lpad(gs::text, 12, '0'))::uuid AS order_id,
  NOW() - (GREATEST(0.3, (55 - gs) * 3.5 + random() * 2.0) || ' days')::interval AS created_at,
  p.shop_product_id,
  p.product_name,
  p.unit_price,
  1 + floor(random() * 3)::int AS qty
FROM generate_series(12, 55) AS gs
CROSS JOIN LATERAL generate_series(1, 1 + floor(random() * 3)::int) AS item_idx
CROSS JOIN LATERAL (
  SELECT v.pid AS shop_product_id, v.pname AS product_name, v.pprice AS unit_price
  FROM (VALUES
    ('40000000-0000-0000-0000-000000000001'::uuid, 'Classmate Notebook A4 (200 pages)', 120),
    ('40000000-0000-0000-0000-000000000002'::uuid, 'Reynolds Pen Blue (Pack of 10)', 85),
    ('40000000-0000-0000-0000-000000000003'::uuid, 'Geometry Box Camlin', 180),
    ('40000000-0000-0000-0000-000000000004'::uuid, 'Scientific Calculator Casio fx-82MS', 850),
    ('40000000-0000-0000-0000-000000000005'::uuid, 'A4 Paper Ream (500 sheets)', 350),
    ('40000000-0000-0000-0000-000000000006'::uuid, 'Stapler + Pins Set', 145),
    ('40000000-0000-0000-0000-000000000007'::uuid, 'Highlighter Set (5 colours)', 95),
    ('40000000-0000-0000-0000-000000000008'::uuid, 'Graph Paper Book', 40)
  ) AS v(pid, pname, pprice)
  ORDER BY random()
  LIMIT 1
) p;

-- ─── 9b. ORDERS first (totals computed from _gen_items) ──────────────────────
WITH totals AS (
  SELECT n, order_id, MAX(created_at) AS created_at, SUM(qty * unit_price) AS subtotal
  FROM _gen_items
  GROUP BY n, order_id
),
meta AS (
  SELECT
    gs AS n,
    (ARRAY['delivered','delivered','delivered','delivered','delivered','delivered',
           'confirmed','confirmed','preparing','ready_for_pickup','pending','picked_up'])[1 + floor(random() * 12)::int] AS status
  FROM generate_series(12, 55) AS gs
)
INSERT INTO public.orders
  (id, customer_id, shop_id, status, subtotal, delivery_fee, platform_fee, discount, total_amount, payment_status, notes, created_at, updated_at)
SELECT
  t.order_id,
  'a0000000-0000-0000-0000-000000000002',
  '10000000-0000-0000-0000-000000000001',
  m.status::order_status,
  t.subtotal,
  0, 0, 0,
  t.subtotal,
  CASE WHEN m.status = 'pending' THEN 'pending'::payment_status ELSE 'paid'::payment_status END,
  NULL,
  t.created_at,
  t.created_at
FROM totals t
JOIN meta m ON m.n = t.n
ON CONFLICT (id) DO NOTHING;

-- ─── 9b2. ORDER ITEMS (now that the parent orders exist) ─────────────────────
INSERT INTO public.order_items (id, order_id, shop_product_id, product_name, quantity, unit_price, subtotal, created_at)
SELECT
  item_id, order_id, shop_product_id, product_name, qty, unit_price, (qty * unit_price)::numeric, created_at
FROM _gen_items
ON CONFLICT (id) DO NOTHING;

-- ─── 9c. PAYMENTS (one per new order; pending for pending orders) ────────────
INSERT INTO public.payments (id, order_id, customer_id, amount, payment_method, payment_gateway, transaction_id, status, paid_at, created_at)
SELECT
  ('70000000-0000-0000-0000-' || right(o.id::text, 12))::uuid,
  o.id,
  'a0000000-0000-0000-0000-000000000002',
  o.total_amount,
  ((ARRAY['upi','cash','upi','cash','upi','card','online'])[1 + floor(random() * 7)::int])::payment_method,
  NULL,
  CASE WHEN o.payment_status = 'paid' THEN 'ORD-' || right(o.id::text, 6) ELSE NULL END,
  o.payment_status,
  CASE WHEN o.payment_status = 'paid' THEN o.created_at ELSE NULL END,
  o.created_at
FROM public.orders o
WHERE o.id > '50000000-0000-0000-0000-000000000011'::uuid
  AND o.id::text LIKE '50000000-0000-0000-0000-%'
ON CONFLICT (id) DO NOTHING;

-- ─── 9d. LEDGER TRANSACTIONS (sale credit for every paid order) ─────────────
INSERT INTO public.transactions (id, shop_id, order_id, transaction_type, amount, payment_method, reference_id, description, transaction_date, created_at)
SELECT
  ('80000000-0000-0000-0000-' || right(o.id::text, 12))::uuid,
  '10000000-0000-0000-0000-000000000001',
  o.id,
  'sale',
  o.total_amount,
  p.payment_method,
  NULL,
  COALESCE('Sale — ' || (SELECT product_name FROM public.order_items oi WHERE oi.order_id = o.id ORDER BY oi.created_at LIMIT 1), 'Order sale'),
  o.created_at,
  o.created_at
FROM public.orders o
JOIN public.payments p ON p.order_id = o.id
WHERE o.payment_status = 'paid'
  AND o.id > '50000000-0000-0000-0000-000000000011'::uuid
ON CONFLICT (id) DO NOTHING;

-- ─── 9e. EXTRA EXPENSES (45 more rows, ~6 months of history) ─────────────────
WITH exp AS (
  SELECT
    gs AS n,
    (ARRAY['Rent','Electricity','Staff Salary','Transport','Packaging','Internet','Miscellaneous'])[1 + floor(random() * 7)::int] AS category,
    (ARRAY['Shop rent','Electricity bill','Helper salary','Delivery bike fuel','Wrapping material','Broadband','Shop supplies'])[1 + floor(random() * 7)::int] AS description,
    (ARRAY[20000,4300,8000,2200,1800,1000,650])[1 + floor(random() * 7)::int] AS amount,
    (ARRAY['cash','upi'])[1 + floor(random() * 2)::int]::payment_method AS payment_method,
    NOW() - ((gs * 3.4) || ' days')::interval AS created_at
  FROM generate_series(1, 45) AS gs
)
INSERT INTO public.expenses (id, shop_id, category, description, amount, expense_date, payment_method, receipt_url, created_at)
SELECT
  ('90000000-0000-0000-0000-' || lpad((50 + n)::text, 12, '0'))::uuid,
  '10000000-0000-0000-0000-000000000001',
  category, description, amount, created_at::date, payment_method, NULL, created_at
FROM exp
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 10. RIDER / LOCATION DATA
-- ------------------------------------------------------------
-- The 5 seeded shops have NULL latitude/longitude, which makes
-- the rider side (and store distance calculations) useless.
-- This section fills real GPS coordinates per shop, registers a
-- demo rider profile + riders row, and links active orders to
-- real customer addresses so delivery jobs are fully location-
-- aware. Idempotent: UPDATEs only fill missing values.
-- ============================================================

-- ─── 10a. Shop GPS coordinates (Vasad / Vadodara area) ──────────────────────
UPDATE public.shops SET latitude = 22.3166, longitude = 73.1290 -- Nandesari, Vadodara
WHERE id = '10000000-0000-0000-0000-000000000001' AND (latitude IS NULL OR longitude IS NULL);

UPDATE public.shops SET latitude = 22.4674, longitude = 73.0763 -- SVIT Campus, Vasad
WHERE id = '10000000-0000-0000-0000-000000000002' AND (latitude IS NULL OR longitude IS NULL);

UPDATE public.shops SET latitude = 22.4562, longitude = 73.0817 -- Platinum Plaza, Umreth Rd
WHERE id = '10000000-0000-0000-0000-000000000003' AND (latitude IS NULL OR longitude IS NULL);

UPDATE public.shops SET latitude = 22.4783, longitude = 73.0602 -- Parbdi, Vasad
WHERE id = '10000000-0000-0000-0000-000000000004' AND (latitude IS NULL OR longitude IS NULL);

UPDATE public.shops SET latitude = 22.4421, longitude = 73.0936 -- Vaherakhadi, SH8
WHERE id = '10000000-0000-0000-0000-000000000005' AND (latitude IS NULL OR longitude IS NULL);

-- ─── 10b. Customer addresses (drop-off points near SVIT, Vasad) ──────────────
WITH addr(id, label, line1, city, pincode, lat, lng) AS (
  VALUES
    ('30000000-0000-0000-0000-000000000001','Hostel Block A','SVIT Campus, Hostel Block A','Vasad','388306',22.4700,73.0790),
    ('30000000-0000-0000-0000-000000000002','Hostel Block C','SVIT Campus, Hostel Block C','Vasad','388306',22.4738,73.0731),
    ('30000000-0000-0000-0000-000000000003','Gandhi Chowk','Gandhi Chowk, Vasad','Vasad','388306',22.4521,73.0782),
    ('30000000-0000-0000-0000-000000000004','Shreenath Residency','Shreenath Residency, Umreth Road','Vasad','388306',22.4609,73.0854)
)
INSERT INTO public.addresses
  (id, user_id, label, address_line_1, city, state, pincode, latitude, longitude, is_default, created_at)
SELECT
  id::uuid,
  'a0000000-0000-0000-0000-000000000002',
  label, line1, city, 'Gujarat', pincode, lat, lng,
  (label = 'Hostel Block A'), NOW()
FROM addr
ON CONFLICT (id) DO NOTHING;

-- ─── 10c. Point active (non-delivered) orders at a nearby drop-off address ──
WITH tagged AS (
  SELECT o.id AS order_id,
         (ARRAY[
           '30000000-0000-0000-0000-000000000001',
           '30000000-0000-0000-0000-000000000002',
           '30000000-0000-0000-0000-000000000003',
           '30000000-0000-0000-0000-000000000004'
         ])[1 + ((row_number() OVER (ORDER BY o.created_at)) % 4)] AS addr_id
  FROM public.orders o
  WHERE o.delivery_address_id IS NULL
    AND o.status IN ('pending', 'confirmed', 'preparing', 'ready_for_pickup', 'picked_up')
)
UPDATE public.orders o
SET delivery_address_id = t.addr_id::uuid
FROM tagged t
WHERE o.id = t.order_id;

-- ─── 10d. Demo rider ─────────────────────────────────────────────────────────
INSERT INTO public.profiles (id, full_name, phone, avatar_url, role, is_active, created_at, updated_at)
SELECT 'a0000000-0000-0000-0000-000000000003', 'Demo Rider', '9876500003', NULL, 'rider', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = 'a0000000-0000-0000-0000-000000000003');

INSERT INTO public.riders
  (id, user_id, vehicle_type, vehicle_number, license_number, is_available, is_online, rating, total_deliveries, current_latitude, current_longitude, created_at, updated_at)
SELECT 'b0000000-0000-0000-0000-000000000001',
       'a0000000-0000-0000-0000-000000000003',
       'bike', 'GJ 06 AB 4321', 'MH20190012345',
       true, true, 4.9, 126, 22.4680, 73.0750, NOW(), NOW()
ON CONFLICT (id) DO NOTHING;
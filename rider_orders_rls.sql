-- ============================================================
-- NearBuy — RLS Policies for Orders & Deliveries
-- ------------------------------------------------------------
-- Fixes: "new row violates row-level security policy for table 'orders'"
-- Run this in: Supabase Dashboard → SQL Editor (as postgres)
-- ============================================================

-- ─── 1. Enable RLS (if not already enabled) ─────────────────
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;

-- ─── 2. ORDERS: Allow Customers & Anonymous Visitors to Place Orders ──
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='orders' AND policyname='orders_anon_authenticated_insert') THEN
    CREATE POLICY orders_anon_authenticated_insert ON public.orders
      FOR INSERT TO anon, authenticated
      WITH CHECK (true);
  END IF;
END $$;

-- ─── 3. ORDERS: Allow Selecting Orders (for Shop Owner, Riders & Customers) ──
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='orders' AND policyname='orders_anon_authenticated_select') THEN
    CREATE POLICY orders_anon_authenticated_select ON public.orders
      FOR SELECT TO anon, authenticated
      USING (true);
  END IF;
END $$;

-- ─── 4. ORDERS: Allow Updating Orders (for Riders marking delivered/picked up) ──
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='orders' AND policyname='orders_anon_authenticated_update') THEN
    CREATE POLICY orders_anon_authenticated_update ON public.orders
      FOR UPDATE TO anon, authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- ─── 5. DELIVERIES: Allow Insert, Select, and Update ─────────
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='deliveries' AND policyname='deliveries_anon_authenticated_insert') THEN
    CREATE POLICY deliveries_anon_authenticated_insert ON public.deliveries
      FOR INSERT TO anon, authenticated
      WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='deliveries' AND policyname='deliveries_anon_authenticated_select') THEN
    CREATE POLICY deliveries_anon_authenticated_select ON public.deliveries
      FOR SELECT TO anon, authenticated
      USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='deliveries' AND policyname='deliveries_anon_authenticated_update') THEN
    CREATE POLICY deliveries_anon_authenticated_update ON public.deliveries
      FOR UPDATE TO anon, authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- ============================================================
-- NearBuy — RLS policies for the Shop Owner Dashboard
-- ------------------------------------------------------------
-- Enables a logged-in shop owner to:
--   • Create products in the global `products` catalog
--   • Add / update / delete their own `shop_products`
--   • Update their own `shops` row (Store Settings)
--
-- Safe to re-run: each policy is only created when missing.
-- Run once in the Supabase SQL Editor (postgres role), which
-- bypasses RLS.
-- ============================================================

-- ─── 1. Security-definer helpers (avoid recursive RLS) ────────────────────────

CREATE OR REPLACE FUNCTION public.is_shop_owner()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role = 'shop_owner' AND p.is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.is_owner_of_shop(_shop_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM shops s
    WHERE s.id = _shop_id AND s.owner_id = auth.uid()
  );
$$;

-- ─── 2. products — shop owners may create/update/delete catalog entries ────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='products' AND policyname='products_owner_insert') THEN
    CREATE POLICY products_owner_insert ON public.products
      FOR INSERT TO authenticated WITH CHECK (public.is_shop_owner());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='products' AND policyname='products_owner_update') THEN
    CREATE POLICY products_owner_update ON public.products
      FOR UPDATE TO authenticated
      USING (public.is_shop_owner())
      WITH CHECK (public.is_shop_owner());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='products' AND policyname='products_owner_delete') THEN
    CREATE POLICY products_owner_delete ON public.products
      FOR DELETE TO authenticated USING (public.is_shop_owner());
  END IF;
END $$;

-- ─── 3. shop_products — owners manage their own shop listings ─────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='shop_products' AND policyname='shop_products_owner_insert') THEN
    CREATE POLICY shop_products_owner_insert ON public.shop_products
      FOR INSERT TO authenticated
      WITH CHECK (public.is_owner_of_shop(shop_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='shop_products' AND policyname='shop_products_owner_update') THEN
    CREATE POLICY shop_products_owner_update ON public.shop_products
      FOR UPDATE TO authenticated
      USING (public.is_owner_of_shop(shop_id))
      WITH CHECK (public.is_owner_of_shop(shop_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='shop_products' AND policyname='shop_products_owner_delete') THEN
    CREATE POLICY shop_products_owner_delete ON public.shop_products
      FOR DELETE TO authenticated USING (public.is_owner_of_shop(shop_id));
  END IF;
END $$;

-- ─── 4. shops — owners may insert/update their own shops (Store Settings) ─────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='shops' AND policyname='shops_owner_insert') THEN
    CREATE POLICY shops_owner_insert ON public.shops
      FOR INSERT TO authenticated
      WITH CHECK (public.is_shop_owner() AND owner_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='shops' AND policyname='shops_owner_update') THEN
    CREATE POLICY shops_owner_update ON public.shops
      FOR UPDATE TO authenticated
      USING (owner_id = auth.uid())
      WITH CHECK (owner_id = auth.uid());
  END IF;
END $$;
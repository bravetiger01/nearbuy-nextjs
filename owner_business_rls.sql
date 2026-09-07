-- ============================================================
-- NearBuy — RLS policies for Shop Owner Business Data
-- ------------------------------------------------------------
-- Extends owner_rls_policies.sql to let shop owners read
-- (and write where noted) orders, payments, transactions,
-- expenses, reservations, shop_views, documents, and
-- customer profiles.
--
-- Safe to re-run: each policy is only created when missing.
-- Run once in Supabase SQL Editor (postgres role).
-- ============================================================

-- ─── 0. Profiles — allow authenticated read (for customer names) ─────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='profiles_authenticated_select') THEN
    CREATE POLICY profiles_authenticated_select ON public.profiles
      FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

-- ─── 1. Security-definer helpers for cross-table ownership checks ────────────

CREATE OR REPLACE FUNCTION public.is_owner_of_order(_order_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.orders o
    JOIN public.shops s ON s.id = o.shop_id
    WHERE o.id = _order_id AND s.owner_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.is_owner_of_reservation(_reservation_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.reservations r
    JOIN public.shops s ON s.id = r.shop_id
    WHERE r.id = _reservation_id AND s.owner_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.is_owner_of_document(_document_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.documents d
    JOIN public.shops s ON s.id = d.shop_id
    WHERE d.id = _document_id AND s.owner_id = auth.uid()
  );
$$;

-- ─── 2. orders — owners read/update their own orders ─────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='orders' AND policyname='orders_owner_select') THEN
    CREATE POLICY orders_owner_select ON public.orders
      FOR SELECT TO authenticated USING (public.is_owner_of_shop(shop_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='orders' AND policyname='orders_owner_update') THEN
    CREATE POLICY orders_owner_update ON public.orders
      FOR UPDATE TO authenticated
      USING (public.is_owner_of_shop(shop_id))
      WITH CHECK (public.is_owner_of_shop(shop_id));
  END IF;
END $$;

-- ─── 3. order_items — owners read/write via order ownership ──────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='order_items' AND policyname='order_items_owner_select') THEN
    CREATE POLICY order_items_owner_select ON public.order_items
      FOR SELECT TO authenticated USING (public.is_owner_of_order(order_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='order_items' AND policyname='order_items_owner_insert') THEN
    CREATE POLICY order_items_owner_insert ON public.order_items
      FOR INSERT TO authenticated WITH CHECK (public.is_owner_of_order(order_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='order_items' AND policyname='order_items_owner_update') THEN
    CREATE POLICY order_items_owner_update ON public.order_items
      FOR UPDATE TO authenticated
      USING (public.is_owner_of_order(order_id))
      WITH CHECK (public.is_owner_of_order(order_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='order_items' AND policyname='order_items_owner_delete') THEN
    CREATE POLICY order_items_owner_delete ON public.order_items
      FOR DELETE TO authenticated USING (public.is_owner_of_order(order_id));
  END IF;
END $$;

-- ─── 4. payments — owners read their own payments via order ownership ─────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='payments' AND policyname='payments_owner_select') THEN
    CREATE POLICY payments_owner_select ON public.payments
      FOR SELECT TO authenticated USING (public.is_owner_of_order(order_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='payments' AND policyname='payments_owner_insert') THEN
    CREATE POLICY payments_owner_insert ON public.payments
      FOR INSERT TO authenticated WITH CHECK (public.is_owner_of_order(order_id));
  END IF;
END $$;

-- ─── 5. transactions — owners CRUD their own shop ledger entries ─────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='transactions' AND policyname='transactions_owner_select') THEN
    CREATE POLICY transactions_owner_select ON public.transactions
      FOR SELECT TO authenticated USING (public.is_owner_of_shop(shop_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='transactions' AND policyname='transactions_owner_insert') THEN
    CREATE POLICY transactions_owner_insert ON public.transactions
      FOR INSERT TO authenticated WITH CHECK (public.is_owner_of_shop(shop_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='transactions' AND policyname='transactions_owner_update') THEN
    CREATE POLICY transactions_owner_update ON public.transactions
      FOR UPDATE TO authenticated
      USING (public.is_owner_of_shop(shop_id))
      WITH CHECK (public.is_owner_of_shop(shop_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='transactions' AND policyname='transactions_owner_delete') THEN
    CREATE POLICY transactions_owner_delete ON public.transactions
      FOR DELETE TO authenticated USING (public.is_owner_of_shop(shop_id));
  END IF;
END $$;

-- ─── 6. expenses — owners CRUD their own shop expenses ───────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='expenses' AND policyname='expenses_owner_select') THEN
    CREATE POLICY expenses_owner_select ON public.expenses
      FOR SELECT TO authenticated USING (public.is_owner_of_shop(shop_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='expenses' AND policyname='expenses_owner_insert') THEN
    CREATE POLICY expenses_owner_insert ON public.expenses
      FOR INSERT TO authenticated WITH CHECK (public.is_owner_of_shop(shop_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='expenses' AND policyname='expenses_owner_update') THEN
    CREATE POLICY expenses_owner_update ON public.expenses
      FOR UPDATE TO authenticated
      USING (public.is_owner_of_shop(shop_id))
      WITH CHECK (public.is_owner_of_shop(shop_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='expenses' AND policyname='expenses_owner_delete') THEN
    CREATE POLICY expenses_owner_delete ON public.expenses
      FOR DELETE TO authenticated USING (public.is_owner_of_shop(shop_id));
  END IF;
END $$;

-- ─── 7. reservations — owners read/update their own reservations ─────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='reservations' AND policyname='reservations_owner_select') THEN
    CREATE POLICY reservations_owner_select ON public.reservations
      FOR SELECT TO authenticated USING (public.is_owner_of_shop(shop_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='reservations' AND policyname='reservations_owner_insert') THEN
    CREATE POLICY reservations_owner_insert ON public.reservations
      FOR INSERT TO authenticated WITH CHECK (public.is_owner_of_shop(shop_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='reservations' AND policyname='reservations_owner_update') THEN
    CREATE POLICY reservations_owner_update ON public.reservations
      FOR UPDATE TO authenticated
      USING (public.is_owner_of_shop(shop_id))
      WITH CHECK (public.is_owner_of_shop(shop_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='reservations' AND policyname='reservations_owner_delete') THEN
    CREATE POLICY reservations_owner_delete ON public.reservations
      FOR DELETE TO authenticated USING (public.is_owner_of_shop(shop_id));
  END IF;
END $$;

-- ─── 8. reservation_items — owners read/write via reservation ownership ──────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='reservation_items' AND policyname='reservation_items_owner_select') THEN
    CREATE POLICY reservation_items_owner_select ON public.reservation_items
      FOR SELECT TO authenticated USING (public.is_owner_of_reservation(reservation_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='reservation_items' AND policyname='reservation_items_owner_insert') THEN
    CREATE POLICY reservation_items_owner_insert ON public.reservation_items
      FOR INSERT TO authenticated WITH CHECK (public.is_owner_of_reservation(reservation_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='reservation_items' AND policyname='reservation_items_owner_update') THEN
    CREATE POLICY reservation_items_owner_update ON public.reservation_items
      FOR UPDATE TO authenticated
      USING (public.is_owner_of_reservation(reservation_id))
      WITH CHECK (public.is_owner_of_reservation(reservation_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='reservation_items' AND policyname='reservation_items_owner_delete') THEN
    CREATE POLICY reservation_items_owner_delete ON public.reservation_items
      FOR DELETE TO authenticated USING (public.is_owner_of_reservation(reservation_id));
  END IF;
END $$;

-- ─── 9. shop_views — owners may read views for their shop ───────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='shop_views' AND policyname='shop_views_owner_select') THEN
    CREATE POLICY shop_views_owner_select ON public.shop_views
      FOR SELECT TO authenticated USING (public.is_owner_of_shop(shop_id));
  END IF;
END $$;

-- ─── 10. documents + document_items — owners CRUD their shop documents ───────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='documents' AND policyname='documents_owner_select') THEN
    CREATE POLICY documents_owner_select ON public.documents
      FOR SELECT TO authenticated USING (public.is_owner_of_shop(shop_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='documents' AND policyname='documents_owner_insert') THEN
    CREATE POLICY documents_owner_insert ON public.documents
      FOR INSERT TO authenticated WITH CHECK (public.is_owner_of_shop(shop_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='documents' AND policyname='documents_owner_update') THEN
    CREATE POLICY documents_owner_update ON public.documents
      FOR UPDATE TO authenticated
      USING (public.is_owner_of_shop(shop_id))
      WITH CHECK (public.is_owner_of_shop(shop_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='documents' AND policyname='documents_owner_delete') THEN
    CREATE POLICY documents_owner_delete ON public.documents
      FOR DELETE TO authenticated USING (public.is_owner_of_shop(shop_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='document_items' AND policyname='document_items_owner_select') THEN
    CREATE POLICY document_items_owner_select ON public.document_items
      FOR SELECT TO authenticated USING (public.is_owner_of_document(document_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='document_items' AND policyname='document_items_owner_insert') THEN
    CREATE POLICY document_items_owner_insert ON public.document_items
      FOR INSERT TO authenticated WITH CHECK (public.is_owner_of_document(document_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='document_items' AND policyname='document_items_owner_update') THEN
    CREATE POLICY document_items_owner_update ON public.document_items
      FOR UPDATE TO authenticated
      USING (public.is_owner_of_document(document_id))
      WITH CHECK (public.is_owner_of_document(document_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='document_items' AND policyname='document_items_owner_delete') THEN
    CREATE POLICY document_items_owner_delete ON public.document_items
      FOR DELETE TO authenticated USING (public.is_owner_of_document(document_id));
  END IF;
END $$;

-- ─── 11. Promotions — owners CRUD their shop promotions ──────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='promotions' AND policyname='promotions_owner_select') THEN
    CREATE POLICY promotions_owner_select ON public.promotions
      FOR SELECT TO authenticated USING (public.is_owner_of_shop(shop_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='promotions' AND policyname='promotions_owner_insert') THEN
    CREATE POLICY promotions_owner_insert ON public.promotions
      FOR INSERT TO authenticated WITH CHECK (public.is_owner_of_shop(shop_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='promotions' AND policyname='promotions_owner_update') THEN
    CREATE POLICY promotions_owner_update ON public.promotions
      FOR UPDATE TO authenticated
      USING (public.is_owner_of_shop(shop_id))
      WITH CHECK (public.is_owner_of_shop(shop_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='promotions' AND policyname='promotions_owner_delete') THEN
    CREATE POLICY promotions_owner_delete ON public.promotions
      FOR DELETE TO authenticated USING (public.is_owner_of_shop(shop_id));
  END IF;
END $$;

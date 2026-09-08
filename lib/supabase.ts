import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Types matching Supabase tables ───────────────────────────────────────────

export interface SupabaseShop {
  id: string;
  name: string;
  description: string | null;
  phone: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  latitude: number | null;
  longitude: number | null;
  rating: number | null;
  total_reviews: number | null;
  is_open: boolean | null;
  status: string;
}

export interface SupabaseProduct {
  id: string;
  name: string;
  description: string | null;
  brand: string | null;
  sku: string | null;
  image_url: string | null;
  category_id: string | null;
}

export interface SupabaseShopProduct {
  id: string;
  shop_id: string;
  product_id: string;
  price: number;
  mrp: number | null;
  quantity: number;
  low_stock_threshold: number | null;
  discount_percentage: number | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  // joined
  products?: SupabaseProduct | null;
  shops?: SupabaseShop | null;
}

// ─── Fetch all active shops ────────────────────────────────────────────────────
export async function fetchShops(): Promise<SupabaseShop[]> {
  const { data, error } = await supabase
    .from('shops')
    .select('id, name, description, phone, address_line_1, address_line_2, city, state, pincode, latitude, longitude, rating, total_reviews, is_open, status')
    .eq('status', 'active');

  if (error) {
    console.error('fetchShops error:', error.message);
    return [];
  }
  return data ?? [];
}

// ─── Fetch shop_products for a specific shop, joined with products ────────────
export async function fetchShopProducts(shopId: string): Promise<SupabaseShopProduct[]> {
  const { data, error } = await supabase
    .from('shop_products')
    .select(`
      id,
      shop_id,
      product_id,
      price,
      mrp,
      quantity,
      low_stock_threshold,
      discount_percentage,
      is_available,
      created_at,
      updated_at,
      products ( id, name, description, brand, sku, image_url, category_id )
    `)
    .eq('shop_id', shopId)
    .eq('is_available', true);

  if (error) {
    console.error('fetchShopProducts error:', error.message);
    return [];
  }
  return (data as unknown as SupabaseShopProduct[]) ?? [];
}

// ─── Fetch ALL shop_products (for customer search) ────────────────────────────
export async function fetchAllShopProducts(): Promise<SupabaseShopProduct[]> {
  const { data, error } = await supabase
    .from('shop_products')
    .select(`
      id,
      shop_id,
      product_id,
      price,
      mrp,
      quantity,
      low_stock_threshold,
      discount_percentage,
      is_available,
      created_at,
      updated_at,
      products ( id, name, description, brand, sku, image_url, category_id ),
      shops ( id, name, description, phone, address_line_1, address_line_2, city, state, pincode, latitude, longitude, rating, total_reviews, is_open, status )
    `)
    .eq('is_available', true);

  if (error) {
    console.error('fetchAllShopProducts error:', error.message);
    return [];
  }
  return (data as unknown as SupabaseShopProduct[]) ?? [];
}

// ─── Upsert a product + shop_product (owner adds/edits product) ───────────────
export interface UpsertProductPayload {
  shopId: string;
  productId?: string; // if editing existing
  name: string;
  description: string;
  brand: string;
  sku: string;
  imageUrl: string;
  category: string;
  price: number;
  mrp: number;
  quantity: number;
  lowStockThreshold: number;
  isAvailable: boolean;
}

export async function upsertShopProduct(payload: UpsertProductPayload): Promise<{ shopProductId: string | null; error: string | null }> {
  try {
    // 1. Upsert into products table (match by name+brand or use existing id)
    let productId = payload.productId;

    if (!productId) {
      // Try to find existing product by name
      const { data: existing } = await supabase
        .from('products')
        .select('id')
        .ilike('name', payload.name.trim())
        .limit(1)
        .single();

      if (existing?.id) {
        productId = existing.id;
      } else {
        // Create new product in global catalog
        const { data: newProd, error: prodErr } = await supabase
          .from('products')
          .insert({
            name: payload.name.trim(),
            description: payload.description || null,
            brand: payload.brand || null,
            sku: payload.sku || null,
            image_url: payload.imageUrl || null,
          })
          .select('id')
          .single();

        if (prodErr || !newProd) {
          return { shopProductId: null, error: prodErr?.message ?? 'Failed to create product' };
        }
        productId = newProd.id;
      }
    }

    // 2. Upsert shop_product
    const { data: sp, error: spErr } = await supabase
      .from('shop_products')
      .upsert({
        shop_id: payload.shopId,
        product_id: productId,
        price: payload.price,
        mrp: payload.mrp || payload.price,
        quantity: payload.quantity,
        low_stock_threshold: payload.lowStockThreshold,
        is_available: payload.isAvailable,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'shop_id,product_id' })
      .select('id')
      .single();

    if (spErr || !sp) {
      return { shopProductId: null, error: spErr?.message ?? 'Failed to upsert shop_product' };
    }

    return { shopProductId: sp.id, error: null };
  } catch (e: unknown) {
    return { shopProductId: null, error: e instanceof Error ? e.message : 'Unknown error' };
  }
}

// ─── Update stock for a shop_product ─────────────────────────────────────────
export async function updateShopProductStock(shopProductId: string, newQty: number): Promise<string | null> {
  const { error } = await supabase
    .from('shop_products')
    .update({ quantity: newQty, updated_at: new Date().toISOString() })
    .eq('id', shopProductId);
  return error?.message ?? null;
}

// ─── Toggle availability for a shop_product ───────────────────────────────────
export async function toggleShopProductAvailability(shopProductId: string, isAvailable: boolean): Promise<string | null> {
  const { error } = await supabase
    .from('shop_products')
    .update({ is_available: isAvailable, updated_at: new Date().toISOString() })
    .eq('id', shopProductId);
  return error?.message ?? null;
}

// ─── Delete a shop_product ────────────────────────────────────────────────────
export async function deleteShopProduct(shopProductId: string): Promise<string | null> {
  const { error } = await supabase
    .from('shop_products')
    .delete()
    .eq('id', shopProductId);
  return error?.message ?? null;
}

// ─── Subscribe to realtime changes on shop_products ───────────────────────────
export function subscribeToShopProducts(shopId: string, onChange: () => void) {
  const channel = supabase
    .channel(`shop_products:${shopId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'shop_products',
        filter: `shop_id=eq.${shopId}`,
      },
      onChange
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

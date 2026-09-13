import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type CartLine = {
  id: string;
  productSlug: string;
  productName: string;
  variantTitle: string;
  pricePaise: number;
  quantity: number;
};

export async function getActiveCart(userId: string) {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  if (error) throw error;
  if (data) return data;

  const { data: created, error: createError } = await admin
    .from("carts")
    .insert({ user_id: userId, status: "active" })
    .select("id")
    .single();
  if (createError) throw createError;
  return created;
}

export async function getCartLines(userId: string): Promise<{ cartId: string; lines: CartLine[] }> {
  const cart = await getActiveCart(userId);
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("cart_items")
    .select("id, quantity, product:products(slug, name), variant:product_variants(title, price_paise)")
    .eq("cart_id", cart.id)
    .order("created_at", { ascending: true });

  if (error) throw error;
  const lines = (data ?? []).flatMap((item): CartLine[] => {
    const relation = item as unknown as { id: string; quantity: number; product: { slug: string; name: string } | { slug: string; name: string }[] | null; variant: { title: string; price_paise: number } | { title: string; price_paise: number }[] | null };
    const product = Array.isArray(relation.product) ? relation.product[0] : relation.product;
    const variant = Array.isArray(relation.variant) ? relation.variant[0] : relation.variant;
    if (!product || !variant) return [];
    return [{
      id: relation.id,
      productSlug: product.slug,
      productName: product.name,
      variantTitle: variant.title,
      pricePaise: variant.price_paise,
      quantity: relation.quantity,
    }];
  });

  return { cartId: cart.id, lines };
}

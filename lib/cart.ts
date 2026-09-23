import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type CartLine = {
  id: string;
  productSlug: string;
  productName: string;
  imageUrl: string | null;
  variantTitle: string;
  configuration: Record<string, string> | null;
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
    .select("id, quantity, configuration, product:products(slug, name, product_images(storage_path, sort_order)), variant:product_variants(title, price_paise)")
    .eq("cart_id", cart.id)
    .order("created_at", { ascending: true });

  if (error) throw error;
  const lines = (data ?? []).flatMap((item): CartLine[] => {
    const relation = item as unknown as { id: string; quantity: number; configuration: Record<string, string> | null; product: { slug: string; name: string; product_images: Array<{ storage_path: string; sort_order: number }> | null } | Array<{ slug: string; name: string; product_images: Array<{ storage_path: string; sort_order: number }> | null }> | null; variant: { title: string; price_paise: number } | { title: string; price_paise: number }[] | null };
    const product = Array.isArray(relation.product) ? relation.product[0] : relation.product;
    const variant = Array.isArray(relation.variant) ? relation.variant[0] : relation.variant;
    if (!product || !variant) return [];
    const hero = [...(product.product_images ?? [])].sort((left, right) => left.sort_order - right.sort_order)[0];
    return [{
      id: relation.id,
      productSlug: product.slug,
      productName: product.name,
      imageUrl: hero ? admin.storage.from("product-images").getPublicUrl(hero.storage_path).data.publicUrl : null,
      variantTitle: variant.title,
      pricePaise: variant.price_paise,
      quantity: relation.quantity,
      configuration: relation.configuration,
    }];
  });

  return { cartId: cart.id, lines };
}

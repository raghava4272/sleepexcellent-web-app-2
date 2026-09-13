import { NextResponse } from "next/server";
import { getActiveCart, getCartLines } from "@/lib/cart";
import { requireAuthenticatedUser } from "@/lib/auth/user";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function responseForError(error: unknown) {
  if (error instanceof Error && error.message === "AUTH_REQUIRED") {
    return NextResponse.json({ error: "Sign in to manage your cart." }, { status: 401 });
  }
  console.error("Cart request failed", error);
  return NextResponse.json({ error: "Unable to update the cart." }, { status: 500 });
}

export async function GET(request: Request) {
  try {
    const user = await requireAuthenticatedUser(request);
    const { lines } = await getCartLines(user.id);
    return NextResponse.json({ lines });
  } catch (error) {
    return responseForError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuthenticatedUser(request);
    const { productSlug, quantity = 1 } = await request.json();
    if (typeof productSlug !== "string" || !productSlug || !Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
      return NextResponse.json({ error: "Choose a valid product and quantity." }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();
    const { data: product, error: productError } = await admin
      .from("products")
      .select("id")
      .eq("slug", productSlug)
      .eq("status", "active")
      .single();
    if (productError || !product) return NextResponse.json({ error: "This product is unavailable." }, { status: 404 });

    const { data: variant, error: variantError } = await admin
      .from("product_variants")
      .select("id")
      .eq("product_id", product.id)
      .eq("is_active", true)
      .order("created_at", { ascending: true })
      .limit(1)
      .single();
    if (variantError || !variant) return NextResponse.json({ error: "This product has no purchasable configuration yet." }, { status: 409 });

    const cart = await getActiveCart(user.id);
    const { data: existing } = await admin
      .from("cart_items")
      .select("id, quantity")
      .eq("cart_id", cart.id)
      .eq("variant_id", variant.id)
      .maybeSingle();
    const write = existing
      ? admin.from("cart_items").update({ quantity: Math.min(existing.quantity + quantity, 10) }).eq("id", existing.id)
      : admin.from("cart_items").insert({ cart_id: cart.id, product_id: product.id, variant_id: variant.id, quantity });
    const { error: writeError } = await write;
    if (writeError) throw writeError;

    const { lines } = await getCartLines(user.id);
    return NextResponse.json({ lines }, { status: 201 });
  } catch (error) {
    return responseForError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireAuthenticatedUser(request);
    const { itemId, quantity } = await request.json();
    if (typeof itemId !== "string" || !Number.isInteger(quantity) || quantity < 0 || quantity > 10) {
      return NextResponse.json({ error: "Choose a valid quantity." }, { status: 400 });
    }
    const cart = await getActiveCart(user.id);
    const admin = createSupabaseAdminClient();
    const write = quantity === 0
      ? admin.from("cart_items").delete().eq("id", itemId).eq("cart_id", cart.id)
      : admin.from("cart_items").update({ quantity }).eq("id", itemId).eq("cart_id", cart.id);
    const { error } = await write;
    if (error) throw error;
    const { lines } = await getCartLines(user.id);
    return NextResponse.json({ lines });
  } catch (error) {
    return responseForError(error);
  }
}

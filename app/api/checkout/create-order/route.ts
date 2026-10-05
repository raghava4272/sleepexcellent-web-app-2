import { NextResponse } from "next/server";
import { getCartLines } from "@/lib/cart";
import { requireAuthenticatedUser } from "@/lib/auth/user";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type Address = { recipientName: string; phone: string; line1: string; city: string; state: string; postalCode: string };

function validAddress(value: unknown): value is Address {
  if (!value || typeof value !== "object") return false;
  const address = value as Record<string, unknown>;
  return ["recipientName", "phone", "line1", "city", "state", "postalCode"].every((key) => typeof address[key] === "string" && address[key].trim().length > 0)
    && /^\d{6}$/.test(address.postalCode as string);
}

export async function POST(request: Request) {
  try {
    const user = await requireAuthenticatedUser(request);
    const { address } = await request.json();
    if (!validAddress(address)) return NextResponse.json({ error: "Enter a complete Indian delivery address." }, { status: 400 });
    const { lines } = await getCartLines(user.id);
    if (lines.length === 0) return NextResponse.json({ error: "Your cart is empty." }, { status: 409 });
    const subtotalPaise = lines.reduce((total, line) => total + line.pricePaise * line.quantity, 0);
    const orderNumber = `SE${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;

    const admin = createSupabaseAdminClient();
    const { data: order, error: orderError } = await admin.from("orders").insert({
      order_number: orderNumber,
      user_id: user.id,
      payment_status: "pending",
      order_status: "pending_payment",
      delivery_status: "not_ready",
      subtotal_paise: subtotalPaise,
      total_paise: subtotalPaise,
      delivery_address: {
        recipient_name: address.recipientName.trim(), phone: address.phone.trim(), line1: address.line1.trim(), city: address.city.trim(), state: address.state.trim(), postal_code: address.postalCode,
      },
    }).select("id").single();
    if (orderError || !order) throw orderError ?? new Error("Order record was not created.");

    const { error: itemsError } = await admin.from("order_items").insert(lines.map((line) => ({
      order_id: order.id, product_name: line.productName, unit_price_paise: line.pricePaise, quantity: line.quantity, line_total_paise: line.pricePaise * line.quantity,
      variant_snapshot: { title: line.variantTitle }, configuration_snapshot: line.configuration, sku: line.productSlug,
    })));
    if (itemsError) throw itemsError;
    const { error: paymentError } = await admin.from("payments").insert({
      order_id: order.id, provider: "manual_qr", provider_order_id: `manual_${orderNumber}`, status: "pending", amount_paise: subtotalPaise, currency: "INR", provider_payload: { receipt: orderNumber, verification: "admin_required" },
    });
    if (paymentError) throw paymentError;

    return NextResponse.json({ orderNumber, amount: subtotalPaise, currency: "INR" });
  } catch (error) {
    if (error instanceof Error && error.message === "AUTH_REQUIRED") return NextResponse.json({ error: "Sign in to continue." }, { status: 401 });
    console.error("Checkout order creation failed", error);
    return NextResponse.json({ error: "Unable to create the order." }, { status: 500 });
  }
}

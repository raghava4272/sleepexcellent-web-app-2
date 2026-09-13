import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/auth/user";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const user = await requireAuthenticatedUser();
    const { razorpay_order_id: providerOrderId, razorpay_payment_id: providerPaymentId, razorpay_signature: signature, orderNumber } = await request.json();
    if (![providerOrderId, providerPaymentId, signature, orderNumber].every((value) => typeof value === "string" && value.length > 0)) {
      return NextResponse.json({ error: "Payment confirmation is incomplete." }, { status: 400 });
    }
    const secret = process.env.RAZORPAY_KEY_SECRET?.trim();
    if (!secret) return NextResponse.json({ error: "Razorpay verification is not configured." }, { status: 503 });
    const expected = createHmac("sha256", secret).update(`${providerOrderId}|${providerPaymentId}`).digest("hex");
    if (expected.length !== signature.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) {
      return NextResponse.json({ error: "Payment signature could not be verified." }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();
    const { data: payment, error: paymentError } = await admin
      .from("payments")
      .select("id, order_id, order:orders!inner(id, order_number, user_id)")
      .eq("provider_order_id", providerOrderId)
      .maybeSingle();
    const orderRelation = payment?.order as unknown as { id: string; order_number: string; user_id: string } | { id: string; order_number: string; user_id: string }[] | null;
    const order = Array.isArray(orderRelation) ? orderRelation[0] : orderRelation;
    if (paymentError || !payment || !order || order.user_id !== user.id || order.order_number !== orderNumber) {
      return NextResponse.json({ error: "This payment does not belong to your order." }, { status: 404 });
    }
    const now = new Date().toISOString();
    const { error: paymentUpdateError } = await admin.from("payments").update({ status: "paid", provider_payment_id: providerPaymentId, signature_verified_at: now, paid_at: now, provider_payload: { razorpay_order_id: providerOrderId, razorpay_payment_id: providerPaymentId } }).eq("id", payment.id);
    if (paymentUpdateError) throw paymentUpdateError;
    const { error: orderUpdateError } = await admin.from("orders").update({ payment_status: "paid", order_status: "confirmed" }).eq("id", payment.order_id);
    if (orderUpdateError) throw orderUpdateError;
    const { error: eventError } = await admin.from("order_status_events").insert({ order_id: payment.order_id, event_type: "payment_verified", from_status: "pending_payment", to_status: "confirmed", note: "Razorpay payment signature verified.", visible_to_customer: true, actor_user_id: user.id });
    if (eventError) throw eventError;
    const cart = await getActiveCartForConversion(user.id);
    if (cart) await admin.from("carts").update({ status: "converted" }).eq("id", cart.id);
    return NextResponse.json({ ok: true, orderNumber });
  } catch (error) {
    if (error instanceof Error && error.message === "AUTH_REQUIRED") return NextResponse.json({ error: "Sign in to continue." }, { status: 401 });
    console.error("Payment verification failed", error);
    return NextResponse.json({ error: "Unable to verify payment." }, { status: 500 });
  }
}

async function getActiveCartForConversion(userId: string) {
  const admin = createSupabaseAdminClient();
  const { data } = await admin.from("carts").select("id").eq("user_id", userId).eq("status", "active").maybeSingle();
  return data;
}

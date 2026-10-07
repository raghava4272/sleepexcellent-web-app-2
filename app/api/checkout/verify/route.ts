import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/auth/user";
import { sendPaidOrderEmails } from "@/lib/email/order-emails";
import { verifyRazorpayPaymentSignature } from "@/lib/razorpay";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type VerificationPayload = {
  razorpay_payment_id?: unknown;
  razorpay_order_id?: unknown;
  razorpay_signature?: unknown;
};

export async function POST(request: Request) {
  try {
    const user = await requireAuthenticatedUser(request);
    const body = await request.json() as VerificationPayload;
    const paymentId = typeof body.razorpay_payment_id === "string" ? body.razorpay_payment_id.trim() : "";
    const providerOrderId = typeof body.razorpay_order_id === "string" ? body.razorpay_order_id.trim() : "";
    const signature = typeof body.razorpay_signature === "string" ? body.razorpay_signature.trim() : "";
    if (!paymentId || !providerOrderId || !signature) return NextResponse.json({ error: "Missing Razorpay payment details." }, { status: 400 });
    if (!verifyRazorpayPaymentSignature(providerOrderId, paymentId, signature)) return NextResponse.json({ error: "Payment signature verification failed." }, { status: 400 });

    const admin = createSupabaseAdminClient();
    const { data: payment, error: paymentError } = await admin.from("payments").select("id, order_id, provider_payment_id, status, amount_paise, currency").eq("provider", "razorpay").eq("provider_order_id", providerOrderId).maybeSingle();
    if (paymentError) throw paymentError;
    if (!payment) return NextResponse.json({ error: "Payment order was not found." }, { status: 404 });
    const { data: order, error: orderError } = await admin.from("orders").select("id, order_number, user_id, payment_status, order_status, total_paise, currency, delivery_address").eq("id", payment.order_id).eq("user_id", user.id).maybeSingle();
    if (orderError) throw orderError;
    if (!order) return NextResponse.json({ error: "Payment order was not found." }, { status: 404 });
    if (payment.amount_paise !== order.total_paise || payment.currency !== order.currency) return NextResponse.json({ error: "Payment amount does not match this order." }, { status: 400 });
    if (order.payment_status === "paid") {
      if (payment.provider_payment_id !== paymentId) return NextResponse.json({ error: "This order has already been paid." }, { status: 409 });
      return NextResponse.json({ success: true, orderNumber: order.order_number });
    }

    const now = new Date().toISOString();
    const { data: updatedPayment, error: paidPaymentError } = await admin.from("payments").update({
      provider_payment_id: paymentId,
      status: "paid",
      method: "razorpay_checkout",
      signature_verified_at: now,
      paid_at: now,
      provider_payload: { razorpay_order_id: providerOrderId, razorpay_payment_id: paymentId },
    }).eq("id", payment.id).eq("status", "pending").select("id").maybeSingle();
    if (paidPaymentError) throw paidPaymentError;
    if (!updatedPayment) return NextResponse.json({ error: "This payment is no longer pending." }, { status: 409 });
    const { data: updatedOrder, error: paidOrderError } = await admin.from("orders").update({ payment_status: "paid", order_status: "confirmed" }).eq("id", order.id).eq("payment_status", "pending").select("id").maybeSingle();
    if (paidOrderError) {
      await admin.from("payments").update({ status: "pending", provider_payment_id: null, signature_verified_at: null, paid_at: null }).eq("id", payment.id);
      throw paidOrderError;
    }
    if (!updatedOrder) return NextResponse.json({ success: true, orderNumber: order.order_number });

    await admin.from("order_status_events").insert({
      order_id: order.id,
      event_type: "razorpay_payment_verified",
      from_status: order.order_status,
      to_status: "confirmed",
      note: "Payment verified securely through Razorpay.",
      visible_to_customer: true,
      actor_user_id: user.id,
    });
    const { data: cart } = await admin.from("carts").select("id").eq("user_id", user.id).eq("status", "active").maybeSingle();
    if (cart) await admin.from("carts").update({ status: "converted" }).eq("id", cart.id);

    const [{ data: profile }, { data: items, error: itemsError }] = await Promise.all([
      admin.from("profiles").select("email").eq("id", user.id).maybeSingle(),
      admin.from("order_items").select("product_name, quantity, unit_price_paise, line_total_paise, variant_snapshot").eq("order_id", order.id).order("product_name"),
    ]);
    if (itemsError || !profile?.email) {
      console.error("Paid order email data could not be loaded", { orderId: order.id, itemsError, hasCustomerEmail: Boolean(profile?.email) });
    } else {
      try {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || new URL(request.url).origin;
        await sendPaidOrderEmails({
          orderNumber: order.order_number,
          customerEmail: profile.email,
          totalPaise: order.total_paise,
          currency: order.currency,
          deliveryAddress: order.delivery_address as Record<string, string>,
          items: items ?? [],
          orderUrl: new URL(`/account/orders/${order.order_number}`, siteUrl).toString(),
        });
      } catch (emailError) {
        console.error("Razorpay payment was verified, but its notification email failed", { orderId: order.id, emailError });
      }
    }

    return NextResponse.json({ success: true, orderNumber: order.order_number });
  } catch (error) {
    if (error instanceof Error && error.message === "AUTH_REQUIRED") return NextResponse.json({ error: "Sign in to continue." }, { status: 401 });
    console.error("Razorpay payment verification failed", error);
    return NextResponse.json({ error: "Unable to verify payment." }, { status: 500 });
  }
}

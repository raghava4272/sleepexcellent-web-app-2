import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/auth/user";
import { sendDeliveredOrderEmails, sendPaidOrderEmails } from "@/lib/email/order-emails";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const orderStatuses = ["draft", "pending_payment", "confirmed", "in_production", "dispatched", "delivered", "cancelled"];
const deliveryStatuses = ["not_ready", "scheduled", "dispatched", "delivered", "failed"];
const paymentStatuses = ["pending", "paid", "failed", "cancelled"];

async function canManageOrders(userId: string) {
  const admin = createSupabaseAdminClient();
  const { data: profile } = await admin.from("profiles").select("email, role").eq("id", userId).maybeSingle();
  return profile?.role === "admin" || profile?.role === "staff" || profile?.email?.toLowerCase() === process.env.INITIAL_ADMIN_EMAIL?.toLowerCase();
}

export async function PATCH(request: Request, ctx: { params: Promise<{ orderId: string }> }) {
  try {
    const user = await requireAuthenticatedUser(request);
    if (!(await canManageOrders(user.id))) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    const { orderId } = await ctx.params;
    const payload = await request.json() as { paymentStatus?: string; orderStatus?: string; deliveryStatus?: string; estimatedDeliveryDate?: string | null };
    if (
      (payload.paymentStatus && !paymentStatuses.includes(payload.paymentStatus)) ||
      (payload.orderStatus && !orderStatuses.includes(payload.orderStatus)) ||
      (payload.deliveryStatus && !deliveryStatuses.includes(payload.deliveryStatus))
    ) {
      return NextResponse.json({ error: "INVALID_STATUS" }, { status: 400 });
    }
    if (payload.estimatedDeliveryDate && !/^\d{4}-\d{2}-\d{2}$/.test(payload.estimatedDeliveryDate)) return NextResponse.json({ error: "INVALID_DATE" }, { status: 400 });

    const admin = createSupabaseAdminClient();
    const { data: existing } = await admin
      .from("orders")
      .select("id, order_number, user_id, payment_status, order_status, delivery_status, total_paise, currency, delivery_address")
      .eq("id", orderId)
      .maybeSingle();
    if (!existing) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    const paymentStatus = payload.paymentStatus ?? existing.payment_status;
    const paymentJustVerified = existing.payment_status !== "paid" && paymentStatus === "paid";
    const requestedOrderStatus = payload.orderStatus ?? existing.order_status;
    const orderStatus = paymentJustVerified && requestedOrderStatus === "pending_payment" ? "confirmed" : requestedOrderStatus;
    const deliveryStatus = payload.deliveryStatus ?? existing.delivery_status;
    const update = {
      payment_status: paymentStatus,
      order_status: orderStatus,
      delivery_status: deliveryStatus,
      ...(payload.estimatedDeliveryDate !== undefined ? { estimated_delivery_date: payload.estimatedDeliveryDate || null } : {}),
    };
    const { data: order, error } = await admin.from("orders").update(update).eq("id", orderId).select("id, payment_status, order_status, delivery_status, estimated_delivery_date").single();
    if (error) throw error;

    if (existing.payment_status !== paymentStatus) {
      const now = new Date().toISOString();
      const { error: paymentError } = await admin
        .from("payments")
        .update({
          status: paymentStatus,
          method: paymentStatus === "paid" ? "manual_qr" : null,
          signature_verified_at: paymentStatus === "paid" ? now : null,
          paid_at: paymentStatus === "paid" ? now : null,
        })
        .eq("order_id", orderId);
      if (paymentError) throw paymentError;
    }

    if (paymentJustVerified) {
      await admin.from("order_status_events").insert({
        order_id: orderId,
        event_type: "manual_payment_verified",
        from_status: existing.order_status,
        to_status: orderStatus,
        note: "QR payment verified by the SleepExcellent team.",
        visible_to_customer: true,
        actor_user_id: user.id,
      });
      const { data: cart } = await admin.from("carts").select("id").eq("user_id", existing.user_id).eq("status", "active").maybeSingle();
      if (cart) await admin.from("carts").update({ status: "converted" }).eq("id", cart.id);

      const [{ data: profile }, { data: items, error: itemsError }, { data: paymentDetails }] = await Promise.all([
        admin.from("profiles").select("email").eq("id", existing.user_id).maybeSingle(),
        admin.from("order_items").select("product_name, sku, quantity, unit_price_paise, line_total_paise, variant_snapshot, configuration_snapshot").eq("order_id", orderId).order("product_name"),
        admin.from("payments").select("provider, provider_order_id, provider_payment_id, method, paid_at").eq("order_id", orderId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      ]);
      if (itemsError || !profile?.email) {
        console.error("Paid order email data could not be loaded", { orderId, itemsError, hasCustomerEmail: Boolean(profile?.email) });
      } else {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || new URL(request.url).origin;
        try {
          await sendPaidOrderEmails({
            orderNumber: existing.order_number,
            customerEmail: profile.email,
            totalPaise: existing.total_paise,
            currency: existing.currency,
            deliveryAddress: existing.delivery_address as Record<string, string>,
            items: items ?? [],
            orderUrl: new URL(`/account/orders/${existing.order_number}`, siteUrl).toString(),
            paymentStatus,
            orderStatus,
            deliveryStatus,
            transaction: {
              provider: paymentDetails?.provider || "Manual verification",
              method: paymentDetails?.method || "manual_qr",
              providerOrderId: paymentDetails?.provider_order_id,
              providerPaymentId: paymentDetails?.provider_payment_id,
              paidAt: paymentDetails?.paid_at,
            },
          });
        } catch (emailError) {
          console.error("Manual payment was confirmed, but its notification email failed", { orderId, emailError });
        }
      }
    } else if (existing.order_status !== orderStatus || existing.delivery_status !== deliveryStatus) {
      const note = existing.delivery_status !== deliveryStatus ? `Delivery status updated to ${deliveryStatus.replaceAll("_", " ")}.` : `Order status updated to ${orderStatus.replaceAll("_", " ")}.`;
      await admin.from("order_status_events").insert({ order_id: orderId, event_type: "admin_status_update", from_status: existing.order_status, to_status: orderStatus, note, visible_to_customer: true, actor_user_id: user.id });

      const newlyDelivered = existing.delivery_status !== "delivered" && deliveryStatus === "delivered";
      if (newlyDelivered) {
        const [{ data: profile }, { data: items, error: itemsError }, { data: paymentDetails }] = await Promise.all([
          admin.from("profiles").select("email").eq("id", existing.user_id).maybeSingle(),
          admin.from("order_items").select("product_name, sku, quantity, unit_price_paise, line_total_paise, variant_snapshot, configuration_snapshot").eq("order_id", orderId).order("product_name"),
          admin.from("payments").select("provider, provider_order_id, provider_payment_id, method, paid_at").eq("order_id", orderId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
        ]);
        if (itemsError || !profile?.email) {
          console.error("Delivered order email data could not be loaded", { orderId, itemsError, hasCustomerEmail: Boolean(profile?.email) });
        } else {
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || new URL(request.url).origin;
          try {
            await sendDeliveredOrderEmails({
              orderNumber: existing.order_number,
              customerEmail: profile.email,
              totalPaise: existing.total_paise,
              currency: existing.currency,
              deliveryAddress: existing.delivery_address as Record<string, string>,
              items: items ?? [],
              orderUrl: new URL(`/account/orders/${existing.order_number}`, siteUrl).toString(),
              paymentStatus,
              orderStatus,
              deliveryStatus,
              transaction: {
                provider: paymentDetails?.provider || "Manual verification",
                method: paymentDetails?.method,
                providerOrderId: paymentDetails?.provider_order_id,
                providerPaymentId: paymentDetails?.provider_payment_id,
                paidAt: paymentDetails?.paid_at,
              },
            });
          } catch (emailError) {
            console.error("Order was marked delivered, but its notification email failed", { orderId, emailError });
          }
        }
      }
    }
    return NextResponse.json({ order });
  } catch (error) {
    if (error instanceof Error && error.message === "AUTH_REQUIRED") return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
    console.error("Admin order update failed", error);
    return NextResponse.json({ error: "UPDATE_FAILED" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/auth/user";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const orderStatuses = ["draft", "pending_payment", "confirmed", "in_production", "dispatched", "delivered", "cancelled"];
const deliveryStatuses = ["not_ready", "scheduled", "dispatched", "delivered", "failed"];

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
    const payload = await request.json() as { orderStatus?: string; deliveryStatus?: string; estimatedDeliveryDate?: string | null };
    if ((payload.orderStatus && !orderStatuses.includes(payload.orderStatus)) || (payload.deliveryStatus && !deliveryStatuses.includes(payload.deliveryStatus))) {
      return NextResponse.json({ error: "INVALID_STATUS" }, { status: 400 });
    }
    if (payload.estimatedDeliveryDate && !/^\d{4}-\d{2}-\d{2}$/.test(payload.estimatedDeliveryDate)) return NextResponse.json({ error: "INVALID_DATE" }, { status: 400 });

    const admin = createSupabaseAdminClient();
    const { data: existing } = await admin.from("orders").select("id, order_status, delivery_status").eq("id", orderId).maybeSingle();
    if (!existing) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    const orderStatus = payload.orderStatus ?? existing.order_status;
    const deliveryStatus = payload.deliveryStatus ?? existing.delivery_status;
    const update = {
      order_status: orderStatus,
      delivery_status: deliveryStatus,
      ...(payload.estimatedDeliveryDate !== undefined ? { estimated_delivery_date: payload.estimatedDeliveryDate || null } : {}),
    };
    const { data: order, error } = await admin.from("orders").update(update).eq("id", orderId).select("id, order_status, delivery_status, estimated_delivery_date").single();
    if (error) throw error;
    if (existing.order_status !== orderStatus || existing.delivery_status !== deliveryStatus) {
      const note = existing.delivery_status !== deliveryStatus ? `Delivery status updated to ${deliveryStatus.replaceAll("_", " ")}.` : `Order status updated to ${orderStatus.replaceAll("_", " ")}.`;
      await admin.from("order_status_events").insert({ order_id: orderId, event_type: "admin_status_update", from_status: existing.order_status, to_status: orderStatus, note, visible_to_customer: true, actor_user_id: user.id });
    }
    return NextResponse.json({ order });
  } catch (error) {
    if (error instanceof Error && error.message === "AUTH_REQUIRED") return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
    return NextResponse.json({ error: "UPDATE_FAILED" }, { status: 500 });
  }
}

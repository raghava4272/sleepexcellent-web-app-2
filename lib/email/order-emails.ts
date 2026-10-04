import "server-only";

type OrderItem = {
  product_name: string;
  quantity: number;
  unit_price_paise: number;
  line_total_paise: number;
  variant_snapshot: { title?: string } | null;
};

type DeliveryAddress = {
  recipient_name?: string;
  phone?: string;
  line1?: string;
  city?: string;
  state?: string;
  postal_code?: string;
};

type PaidOrderEmail = {
  orderNumber: string;
  customerEmail: string;
  totalPaise: number;
  currency: string;
  deliveryAddress: DeliveryAddress;
  items: OrderItem[];
  orderUrl: string;
};

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function itemRows(items: OrderItem[]) {
  return items.map((item) => {
    const variant = item.variant_snapshot?.title ? `<br><span style="color:#666;font-size:13px">${escapeHtml(item.variant_snapshot.title)}</span>` : "";
    return `<tr><td style="padding:12px 0;border-bottom:1px solid #e8dfd2">${escapeHtml(item.product_name)}${variant}</td><td style="padding:12px 8px;border-bottom:1px solid #e8dfd2;text-align:center">${item.quantity}</td><td style="padding:12px 0;border-bottom:1px solid #e8dfd2;text-align:right">${money.format(item.line_total_paise / 100)}</td></tr>`;
  }).join("");
}

function addressText(address: DeliveryAddress) {
  return [address.recipient_name, address.line1, [address.city, address.state, address.postal_code].filter(Boolean).join(" "), address.phone]
    .filter(Boolean)
    .map(escapeHtml)
    .join("<br>");
}

function emailShell(content: string) {
  return `<!doctype html><html><body style="margin:0;background:#f8f4ec;color:#171717;font-family:Arial,sans-serif"><div style="max-width:640px;margin:0 auto;padding:32px 20px"><div style="background:#fff;border:1px solid #d6c8b5;padding:32px"><p style="margin:0 0 24px;color:#9d6b36;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase">SleepExcellent</p>${content}</div><p style="color:#666;font-size:12px;line-height:20px;text-align:center">Sleep better. Live better.<br>Questions? Call +91 90442 57999 or email sleepexcellent999@gmail.com</p></div></body></html>`;
}

async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.ORDER_EMAIL_FROM?.trim();
  if (!apiKey || !from) {
    console.warn("Order email skipped because RESEND_API_KEY or ORDER_EMAIL_FROM is not configured.");
    return { sent: false, reason: "not_configured" } as const;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, html }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Resend rejected an order email (${response.status}): ${await response.text()}`);
  return { sent: true } as const;
}

export async function sendPaidOrderEmails(order: PaidOrderEmail) {
  const adminEmail = process.env.ADMIN_ORDER_EMAIL?.trim() || "sleepexcellent999@gmail.com";
  const rows = itemRows(order.items);
  const total = money.format(order.totalPaise / 100);
  const address = addressText(order.deliveryAddress);

  const customerHtml = emailShell(`
    <h1 style="font-family:Georgia,serif;font-size:30px;margin:0 0 12px">Your order is confirmed</h1>
    <p style="color:#555;line-height:26px">Thank you for your payment. We have received order <strong>${escapeHtml(order.orderNumber)}</strong> and our team will begin processing it.</p>
    <table style="width:100%;border-collapse:collapse;margin:24px 0"><thead><tr><th style="text-align:left;padding-bottom:8px">Product</th><th style="text-align:center;padding-bottom:8px">Qty</th><th style="text-align:right;padding-bottom:8px">Amount</th></tr></thead><tbody>${rows}</tbody></table>
    <p style="font-size:20px;text-align:right"><strong>Total: ${total}</strong></p>
    <p style="line-height:24px"><strong>Delivery address</strong><br>${address}</p>
    <p style="margin-top:28px"><a href="${escapeHtml(order.orderUrl)}" style="display:inline-block;background:#171717;color:#fff;padding:13px 20px;text-decoration:none;font-weight:700">View your order</a></p>
  `);

  const adminHtml = emailShell(`
    <h1 style="font-family:Georgia,serif;font-size:30px;margin:0 0 12px">New paid order</h1>
    <p style="color:#555;line-height:26px">Order <strong>${escapeHtml(order.orderNumber)}</strong> has been successfully paid by ${escapeHtml(order.customerEmail)}.</p>
    <table style="width:100%;border-collapse:collapse;margin:24px 0"><thead><tr><th style="text-align:left;padding-bottom:8px">Product</th><th style="text-align:center;padding-bottom:8px">Qty</th><th style="text-align:right;padding-bottom:8px">Amount</th></tr></thead><tbody>${rows}</tbody></table>
    <p style="font-size:20px;text-align:right"><strong>Total: ${total}</strong></p>
    <p style="line-height:24px"><strong>Customer</strong><br>${escapeHtml(order.customerEmail)}<br><br><strong>Delivery address</strong><br>${address}</p>
  `);

  return Promise.all([
    sendEmail({ to: order.customerEmail, subject: `Order ${order.orderNumber} confirmed`, html: customerHtml }),
    sendEmail({ to: adminEmail, subject: `New paid order ${order.orderNumber} · ${total}`, html: adminHtml }),
  ]);
}

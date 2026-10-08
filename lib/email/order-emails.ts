import "server-only";

type OrderItem = {
  product_name: string;
  sku: string | null;
  quantity: number;
  unit_price_paise: number;
  line_total_paise: number;
  variant_snapshot: { title?: string } | null;
  configuration_snapshot: Record<string, unknown> | null;
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
  paymentStatus: string;
  orderStatus: string;
  deliveryStatus: string;
  transaction: {
    provider: string;
    method?: string | null;
    providerOrderId?: string | null;
    providerPaymentId?: string | null;
    paidAt?: string | null;
  };
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

function humanize(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatDate(value?: string | null) {
  if (!value) return "Not recorded";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(date);
}

function configurationLines(configuration: Record<string, unknown> | null) {
  if (!configuration) return "";
  const hiddenKeys = new Set(["price", "price_paise", "unit_price_paise", "line_total_paise"]);
  const lines = Object.entries(configuration)
    .filter(([key, value]) => !hiddenKeys.has(key) && value !== null && value !== undefined && String(value).trim())
    .map(([key, value]) => `${escapeHtml(humanize(key))}: ${escapeHtml(Array.isArray(value) ? value.join(", ") : value)}`);
  return lines.length ? `<br><span style="color:#666;font-size:13px;line-height:20px">${lines.join("<br>")}</span>` : "";
}

function itemRows(items: OrderItem[]) {
  return items.map((item) => {
    const variant = item.variant_snapshot?.title ? `<br><span style="color:#666;font-size:13px">${escapeHtml(item.variant_snapshot.title)}</span>` : "";
    const sku = item.sku ? `<br><span style="color:#666;font-size:12px">SKU: ${escapeHtml(item.sku)}</span>` : "";
    return `<tr><td style="padding:12px 0;border-bottom:1px solid #e8dfd2">${escapeHtml(item.product_name)}${variant}${sku}${configurationLines(item.configuration_snapshot)}</td><td style="padding:12px 8px;border-bottom:1px solid #e8dfd2;text-align:center">${item.quantity}</td><td style="padding:12px 8px;border-bottom:1px solid #e8dfd2;text-align:right;white-space:nowrap">${money.format(item.unit_price_paise / 100)}</td><td style="padding:12px 0;border-bottom:1px solid #e8dfd2;text-align:right;white-space:nowrap">${money.format(item.line_total_paise / 100)}</td></tr>`;
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

function detailRow(label: string, value: unknown) {
  return `<tr><td style="padding:7px 12px 7px 0;color:#666;vertical-align:top">${escapeHtml(label)}</td><td style="padding:7px 0;font-weight:600;word-break:break-word">${escapeHtml(value || "Not recorded")}</td></tr>`;
}

function orderAndTransactionDetails(order: PaidOrderEmail) {
  return `<table style="width:100%;border-collapse:collapse;margin:20px 0;background:#faf7f2;padding:12px">
    ${detailRow("Order number", order.orderNumber)}
    ${detailRow("Payment status", humanize(order.paymentStatus))}
    ${detailRow("Order status", humanize(order.orderStatus))}
    ${detailRow("Delivery status", humanize(order.deliveryStatus))}
    ${detailRow("Payment provider", order.transaction.provider)}
    ${detailRow("Payment method", order.transaction.method ? humanize(order.transaction.method) : "Not recorded")}
    ${detailRow("Transaction / payment ID", order.transaction.providerPaymentId)}
    ${detailRow("Gateway order ID", order.transaction.providerOrderId)}
    ${detailRow("Paid on", formatDate(order.transaction.paidAt))}
    ${detailRow("Currency", order.currency)}
  </table>`;
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
  const details = orderAndTransactionDetails(order);

  const customerHtml = emailShell(`
    <h1 style="font-family:Georgia,serif;font-size:30px;margin:0 0 12px">Your order is confirmed</h1>
    <p style="color:#555;line-height:26px">Thank you for your payment. We have received order <strong>${escapeHtml(order.orderNumber)}</strong> and our team will begin processing it.</p>
    <h2 style="font-size:18px;margin:24px 0 8px">Order and transaction details</h2>${details}
    <table style="width:100%;border-collapse:collapse;margin:24px 0"><thead><tr><th style="text-align:left;padding-bottom:8px">Product details</th><th style="text-align:center;padding-bottom:8px">Qty</th><th style="text-align:right;padding-bottom:8px">Unit price</th><th style="text-align:right;padding-bottom:8px">Line total</th></tr></thead><tbody>${rows}</tbody></table>
    <p style="font-size:20px;text-align:right"><strong>Total: ${total}</strong></p>
    <p style="line-height:24px"><strong>Delivery address</strong><br>${address}</p>
    <p style="margin-top:28px"><a href="${escapeHtml(order.orderUrl)}" style="display:inline-block;background:#171717;color:#fff;padding:13px 20px;text-decoration:none;font-weight:700">View your order</a></p>
  `);

  const adminHtml = emailShell(`
    <h1 style="font-family:Georgia,serif;font-size:30px;margin:0 0 12px">New paid order</h1>
    <p style="color:#555;line-height:26px">Order <strong>${escapeHtml(order.orderNumber)}</strong> has been successfully paid by ${escapeHtml(order.customerEmail)}.</p>
    <h2 style="font-size:18px;margin:24px 0 8px">Order and transaction details</h2>${details}
    <table style="width:100%;border-collapse:collapse;margin:24px 0"><thead><tr><th style="text-align:left;padding-bottom:8px">Product details</th><th style="text-align:center;padding-bottom:8px">Qty</th><th style="text-align:right;padding-bottom:8px">Unit price</th><th style="text-align:right;padding-bottom:8px">Line total</th></tr></thead><tbody>${rows}</tbody></table>
    <p style="font-size:20px;text-align:right"><strong>Total: ${total}</strong></p>
    <p style="line-height:24px"><strong>Customer</strong><br>${escapeHtml(order.customerEmail)}<br><br><strong>Delivery address</strong><br>${address}</p>
  `);

  return Promise.all([
    sendEmail({ to: order.customerEmail, subject: `Order ${order.orderNumber} confirmed`, html: customerHtml }),
    sendEmail({ to: adminEmail, subject: `New paid order ${order.orderNumber} · ${total}`, html: adminHtml }),
  ]);
}

export async function sendDeliveredOrderEmails(order: PaidOrderEmail) {
  const adminEmail = process.env.ADMIN_ORDER_EMAIL?.trim() || "sleepexcellent999@gmail.com";
  const rows = itemRows(order.items);
  const total = money.format(order.totalPaise / 100);
  const address = addressText(order.deliveryAddress);
  const details = orderAndTransactionDetails(order);

  const sharedContent = `
    <h2 style="font-size:18px;margin:24px 0 8px">Order and transaction details</h2>${details}
    <table style="width:100%;border-collapse:collapse;margin:24px 0"><thead><tr><th style="text-align:left;padding-bottom:8px">Product details</th><th style="text-align:center;padding-bottom:8px">Qty</th><th style="text-align:right;padding-bottom:8px">Unit price</th><th style="text-align:right;padding-bottom:8px">Line total</th></tr></thead><tbody>${rows}</tbody></table>
    <p style="font-size:20px;text-align:right"><strong>Total: ${total}</strong></p>
    <p style="line-height:24px"><strong>Delivered to</strong><br>${address}</p>`;

  const customerHtml = emailShell(`
    <h1 style="font-family:Georgia,serif;font-size:30px;margin:0 0 12px">Your order has been delivered</h1>
    <p style="color:#555;line-height:26px">Order <strong>${escapeHtml(order.orderNumber)}</strong> is marked as delivered. We hope you enjoy your SleepExcellent purchase.</p>
    ${sharedContent}
    <p style="margin-top:28px"><a href="${escapeHtml(order.orderUrl)}" style="display:inline-block;background:#171717;color:#fff;padding:13px 20px;text-decoration:none;font-weight:700">View your order</a></p>
  `);
  const adminHtml = emailShell(`
    <h1 style="font-family:Georgia,serif;font-size:30px;margin:0 0 12px">Order delivered</h1>
    <p style="color:#555;line-height:26px">Order <strong>${escapeHtml(order.orderNumber)}</strong> for ${escapeHtml(order.customerEmail)} has been marked as delivered.</p>
    ${sharedContent}
  `);

  return Promise.all([
    sendEmail({ to: order.customerEmail, subject: `Order ${order.orderNumber} delivered`, html: customerHtml }),
    sendEmail({ to: adminEmail, subject: `Order delivered ${order.orderNumber}`, html: adminHtml }),
  ]);
}

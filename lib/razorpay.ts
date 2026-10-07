import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import Razorpay from "razorpay";

function requiredEnvironmentValue(name: "RAZORPAY_KEY_ID" | "RAZORPAY_KEY_SECRET") {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name}_MISSING`);
  return value;
}

export function getRazorpayKeyId() {
  return requiredEnvironmentValue("RAZORPAY_KEY_ID");
}

export function createRazorpayClient() {
  return new Razorpay({
    key_id: getRazorpayKeyId(),
    key_secret: requiredEnvironmentValue("RAZORPAY_KEY_SECRET"),
  });
}

export function verifyRazorpayPaymentSignature(orderId: string, paymentId: string, signature: string) {
  const expected = createHmac("sha256", requiredEnvironmentValue("RAZORPAY_KEY_SECRET"))
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  const expectedBuffer = Buffer.from(expected, "utf8");
  const receivedBuffer = Buffer.from(signature, "utf8");
  return expectedBuffer.length === receivedBuffer.length && timingSafeEqual(expectedBuffer, receivedBuffer);
}

export function razorpayErrorStatus(error: unknown) {
  if (!error || typeof error !== "object") return null;
  const candidate = error as { statusCode?: unknown; status?: unknown };
  const status = candidate.statusCode ?? candidate.status;
  return typeof status === "number" ? status : null;
}

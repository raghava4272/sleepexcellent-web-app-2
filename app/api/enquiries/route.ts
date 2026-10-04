import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const enquirySchema = z.object({
  company: z.string().max(0).optional(),
  email: z.email().max(254),
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(/^\+?[0-9 ]{10,15}$/),
  pincode: z.string().trim().regex(/^\d{6}$/),
});

export async function POST(request: Request) {
  const parsed = enquirySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || parsed.data.company) return NextResponse.json({ error: "INVALID_ENQUIRY" }, { status: 400 });
  const enquiry = { email: parsed.data.email, name: parsed.data.name, phone: parsed.data.phone, pincode: parsed.data.pincode };
  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("enquiries").insert({ ...enquiry, source: "homepage" });
  if (error && ["42P01", "PGRST205"].includes(error.code)) {
    const key = "website_enquiries";
    const { data: setting } = await admin.from("site_settings").select("value").eq("key", key).maybeSingle();
    const entries = Array.isArray(setting?.value) ? setting.value : [];
    const { error: fallbackError } = await admin.from("site_settings").upsert({ key, value: [...entries.slice(-499), { ...enquiry, created_at: new Date().toISOString(), source: "homepage", status: "new" }] });
    if (fallbackError) return NextResponse.json({ error: "ENQUIRY_NOT_SAVED" }, { status: 500 });
  } else if (error) return NextResponse.json({ error: "ENQUIRY_NOT_SAVED" }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}

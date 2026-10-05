import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/auth/user";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  try {
    const user = await requireAuthenticatedUser(request);
    const { data, error } = await createSupabaseAdminClient().from("profiles").select("pincode").eq("id", user.id).single();
    if (error) throw error;
    return NextResponse.json({ pincode: data.pincode ?? "" });
  } catch (error) {
    if (error instanceof Error && error.message === "AUTH_REQUIRED") return NextResponse.json({ error: "Sign in to view your profile." }, { status: 401 });
    return NextResponse.json({ error: "Unable to load your profile." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuthenticatedUser(request);
    const { fullName, phone, pincode } = await request.json();
    if (typeof fullName !== "string" || typeof phone !== "string" || typeof pincode !== "string" || !fullName.trim() || !/^[0-9+ ]{10,15}$/.test(phone.trim()) || !/^\d{6}$/.test(pincode.trim())) return NextResponse.json({ error: "Enter a valid name, phone number, and 6-digit pincode." }, { status: 400 });
    const { error } = await createSupabaseAdminClient().from("profiles").update({ full_name: fullName.trim(), phone: phone.trim(), pincode: pincode.trim() }).eq("id", user.id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "AUTH_REQUIRED") return NextResponse.json({ error: "Sign in to update your profile." }, { status: 401 });
    console.error("Profile update failed", error);
    return NextResponse.json({ error: "Unable to save your profile." }, { status: 500 });
  }
}

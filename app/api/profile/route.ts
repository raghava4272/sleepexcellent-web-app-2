import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/auth/user";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const user = await requireAuthenticatedUser();
    const { fullName, phone } = await request.json();
    if ((fullName !== undefined && typeof fullName !== "string") || (phone !== undefined && typeof phone !== "string")) return NextResponse.json({ error: "Invalid profile details." }, { status: 400 });
    const { error } = await createSupabaseAdminClient().from("profiles").update({ full_name: fullName?.trim() || null, phone: phone?.trim() || null }).eq("id", user.id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "AUTH_REQUIRED") return NextResponse.json({ error: "Sign in to update your profile." }, { status: 401 });
    console.error("Profile update failed", error);
    return NextResponse.json({ error: "Unable to save your profile." }, { status: 500 });
  }
}

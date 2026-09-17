import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/auth/user";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

async function canManageCatalog(userId: string) {
  const admin = createSupabaseAdminClient();
  const { data: profile } = await admin.from("profiles").select("email, role").eq("id", userId).maybeSingle();
  return profile?.role === "admin" || profile?.role === "staff" || profile?.email?.toLowerCase() === process.env.INITIAL_ADMIN_EMAIL?.trim().toLowerCase();
}

export async function PATCH(request: Request, ctx: { params: Promise<{ categoryId: string }> }) {
  try {
    const user = await requireAuthenticatedUser(request);
    if (!(await canManageCatalog(user.id))) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    const { categoryId } = await ctx.params;
    const payload = await request.json() as { name?: unknown; description?: unknown; isActive?: unknown; sortOrder?: unknown };
    const update: Record<string, string | boolean | number | null> = {};
    if (payload.name !== undefined) { if (typeof payload.name !== "string" || !payload.name.trim() || payload.name.trim().length > 100) return NextResponse.json({ error: "INVALID_NAME" }, { status: 400 }); update.name = payload.name.trim(); }
    if (payload.description !== undefined) { if (payload.description !== null && (typeof payload.description !== "string" || payload.description.length > 1000)) return NextResponse.json({ error: "INVALID_DESCRIPTION" }, { status: 400 }); update.description = payload.description?.trim() || null; }
    if (payload.isActive !== undefined) { if (typeof payload.isActive !== "boolean") return NextResponse.json({ error: "INVALID_VISIBILITY" }, { status: 400 }); update.is_active = payload.isActive; }
    if (payload.sortOrder !== undefined) { if (!Number.isInteger(payload.sortOrder) || Number(payload.sortOrder) < 0 || Number(payload.sortOrder) > 999) return NextResponse.json({ error: "INVALID_SORT_ORDER" }, { status: 400 }); update.sort_order = Number(payload.sortOrder); }
    if (!Object.keys(update).length) return NextResponse.json({ error: "NO_CHANGES" }, { status: 400 });
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin.from("categories").update(update).eq("id", categoryId).select("id, name, description, is_active, sort_order").maybeSingle();
    if (error) throw error;
    if (!data) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    return NextResponse.json({ category: data });
  } catch (error) {
    if (error instanceof Error && error.message === "AUTH_REQUIRED") return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
    return NextResponse.json({ error: "UPDATE_FAILED" }, { status: 500 });
  }
}

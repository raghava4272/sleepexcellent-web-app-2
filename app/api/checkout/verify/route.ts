import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Online payment verification is disabled. Use the QR payment instructions shown at checkout." },
    { status: 410 },
  );
}

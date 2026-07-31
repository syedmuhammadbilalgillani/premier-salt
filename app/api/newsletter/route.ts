import { NextRequest, NextResponse } from "next/server";

import { subscribeNewsletter } from "@/lib/newsletter";

// Public — footer newsletter signup. Not covered by any middleware matcher.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as { email?: unknown } | null;
    const email = typeof body?.email === "string" ? body.email.trim() : "";

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ success: false, error: "Enter a valid email address." }, { status: 400 });
    }

    const result = await subscribeNewsletter(email);
    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error }, { status: 409 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error subscribing to newsletter", error);
    return NextResponse.json({ success: false, error: "Failed to subscribe." }, { status: 500 });
  }
}

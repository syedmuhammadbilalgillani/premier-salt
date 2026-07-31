import { NextRequest, NextResponse } from "next/server";

import { createEnquiry } from "@/lib/enquiry";
import { ENQUIRY_TYPES, type EnquiryType } from "@/lib/enquiryStatus";
import { isValidSpec } from "@/lib/validators";

// Public — Request a Quote / Contact / Private Label all post here with a
// different `type`. Not covered by any middleware matcher (see proxy.ts);
// admin viewing lives under the separate, protected /api/admin/enquiries/*.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface EnquiryPayload {
  type?: unknown;
  fullName?: unknown;
  companyName?: unknown;
  email?: unknown;
  phone?: unknown;
  country?: unknown;
  subject?: unknown;
  message?: unknown;
  details?: unknown;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as EnquiryPayload | null;
    if (!body) {
      return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
    }

    const { type, fullName, companyName, email, phone, country, subject, message, details } = body;

    if (typeof type !== "string" || !ENQUIRY_TYPES.includes(type as EnquiryType)) {
      return NextResponse.json({ success: false, error: "Invalid enquiry type." }, { status: 400 });
    }
    if (typeof fullName !== "string" || !fullName.trim()) {
      return NextResponse.json({ success: false, error: "Name is required." }, { status: 400 });
    }
    if (typeof email !== "string" || !EMAIL_RE.test(email)) {
      return NextResponse.json({ success: false, error: "Enter a valid email." }, { status: 400 });
    }
    if (details !== undefined && details !== null && !isValidSpec(details)) {
      return NextResponse.json({ success: false, error: "Invalid enquiry details." }, { status: 400 });
    }

    const enquiry = await createEnquiry({
      type: type as EnquiryType,
      fullName: fullName.trim(),
      companyName: typeof companyName === "string" ? companyName.trim() : null,
      email: email.trim(),
      phone: typeof phone === "string" ? phone.trim() : null,
      country: typeof country === "string" ? country.trim() : null,
      subject: typeof subject === "string" ? subject.trim() : null,
      message: typeof message === "string" ? message.trim() : null,
      details: (details as Record<string, string> | undefined) ?? null,
    });

    return NextResponse.json({ success: true, data: enquiry }, { status: 201 });
  } catch (error) {
    console.error("Error creating enquiry", error);
    return NextResponse.json({ success: false, error: "Failed to submit enquiry." }, { status: 500 });
  }
}

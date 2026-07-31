import { NextRequest, NextResponse } from "next/server";

import { ENQUIRY_STATUSES, getCachedEnquiry, updateEnquiryStatus } from "@/lib/enquiry";
import { isValidUuid } from "@/lib/validators";

// Auth is enforced by proxy.ts for /api/admin/*.

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ success: false, error: "Invalid enquiry id." }, { status: 400 });
  }

  try {
    const enquiry = await getCachedEnquiry(id);
    if (!enquiry) {
      return NextResponse.json({ success: false, error: "Enquiry not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: enquiry });
  } catch (error) {
    console.error("Error fetching enquiry", error);
    return NextResponse.json({ success: false, error: "Failed to fetch enquiry." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ success: false, error: "Invalid enquiry id." }, { status: 400 });
  }

  try {
    const body = (await request.json().catch(() => null)) as { status?: unknown } | null;
    if (!body || typeof body.status !== "string" || !ENQUIRY_STATUSES.includes(body.status as never)) {
      return NextResponse.json({ success: false, error: "Invalid status." }, { status: 400 });
    }

    const updated = await updateEnquiryStatus(id, body.status as (typeof ENQUIRY_STATUSES)[number]);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Enquiry not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating enquiry status", error);
    return NextResponse.json({ success: false, error: "Failed to update enquiry." }, { status: 500 });
  }
}

import { desc, eq } from "drizzle-orm";
import { unstable_cache, revalidateTag } from "next/cache";

import { db } from "@/lib/db";
import { enquiries } from "@/lib/db/schema";
import { ENQUIRY_TYPE_PREFIX, type EnquiryStatus, type EnquiryType } from "@/lib/enquiryStatus";

export {
  ENQUIRY_TYPES,
  ENQUIRY_TYPE_LABELS,
  ENQUIRY_STATUSES,
  ENQUIRY_STATUS_LABELS,
  type EnquiryType,
  type EnquiryStatus,
} from "@/lib/enquiryStatus";

export interface CreateEnquiryInput {
  type: EnquiryType;
  fullName: string;
  companyName?: string | null;
  email: string;
  phone?: string | null;
  country?: string | null;
  subject?: string | null;
  message?: string | null;
  /** Fields specific to the enquiry type — e.g. buyerType/productCategory/quantity. */
  details?: Record<string, string> | null;
}

/** The only way an enquiry gets created — used by all three lead-capture forms. */
export async function createEnquiry(input: CreateEnquiryInput) {
  const created = await db.transaction(async (tx) => {
    const [inserted] = await tx
      .insert(enquiries)
      .values({
        // Short unique placeholder, replaced below once we know enquirySeq —
        // same two-phase approach as orders.orderNumber/orderSeq.
        reference: crypto.randomUUID().replace(/-/g, "").slice(0, 20),
        type: input.type,
        fullName: input.fullName,
        companyName: input.companyName || null,
        email: input.email,
        phone: input.phone || null,
        country: input.country || null,
        subject: input.subject || null,
        message: input.message || null,
        details:
          input.details && Object.keys(input.details).length ? input.details : null,
      })
      .returning();

    const reference = `${ENQUIRY_TYPE_PREFIX[input.type]}-${inserted.createdAt.getFullYear()}-${String(inserted.enquirySeq).padStart(4, "0")}`;
    const [updated] = await tx
      .update(enquiries)
      .set({ reference })
      .where(eq(enquiries.id, inserted.id))
      .returning({ id: enquiries.id, reference: enquiries.reference });

    return updated;
  });

  revalidateTag("enquiries", "max");
  return created;
}

function normalizeEnquiry(row: typeof enquiries.$inferSelect) {
  return {
    ...row,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

async function getEnquiriesListData() {
  const rows = await db.select().from(enquiries).orderBy(desc(enquiries.createdAt));
  return rows.map(normalizeEnquiry);
}

export const getCachedEnquiries = unstable_cache(getEnquiriesListData, ["enquiries-list"], {
  tags: ["enquiries"],
});

async function getEnquiryData(id: string) {
  const [row] = await db.select().from(enquiries).where(eq(enquiries.id, id)).limit(1);
  return row ? normalizeEnquiry(row) : null;
}

export function getCachedEnquiry(id: string) {
  return unstable_cache(() => getEnquiryData(id), ["enquiry", id], {
    tags: ["enquiries", `enquiry:${id}`],
  })();
}

export async function updateEnquiryStatus(id: string, status: EnquiryStatus) {
  const [updated] = await db
    .update(enquiries)
    .set({ status, updatedAt: new Date() })
    .where(eq(enquiries.id, id))
    .returning();

  if (updated) {
    revalidateTag("enquiries", "max");
    revalidateTag(`enquiry:${id}`, "max");
  }
  return updated ?? null;
}

export type EnquiryDetail = NonNullable<Awaited<ReturnType<typeof getEnquiryData>>>;
export type EnquiryListItem = Awaited<ReturnType<typeof getCachedEnquiries>>[number];

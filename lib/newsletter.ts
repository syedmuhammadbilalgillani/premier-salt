import { desc, eq } from "drizzle-orm";
import { unstable_cache, revalidateTag } from "next/cache";

import { db } from "@/lib/db";
import { newsletterSubscribers } from "@/lib/db/schema";

export async function subscribeNewsletter(
  email: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const normalized = email.trim().toLowerCase();

  const [existing] = await db
    .select({ id: newsletterSubscribers.id })
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.email, normalized))
    .limit(1);
  if (existing) {
    return { ok: false, error: "This email is already subscribed." };
  }

  await db.insert(newsletterSubscribers).values({ email: normalized });
  revalidateTag("newsletter", "max");
  return { ok: true };
}

async function getSubscribersData() {
  const rows = await db
    .select()
    .from(newsletterSubscribers)
    .orderBy(desc(newsletterSubscribers.subscribedAt));
  return rows.map((row) => ({
    ...row,
    subscribedAt: row.subscribedAt.toISOString(),
  }));
}

export const getCachedSubscribers = unstable_cache(getSubscribersData, ["newsletter-list"], {
  tags: ["newsletter"],
});

export type NewsletterSubscriber = Awaited<ReturnType<typeof getCachedSubscribers>>[number];

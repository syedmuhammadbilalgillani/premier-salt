import { getAnalyticsSummary, type AnalyticsRange } from "@/lib/analytics";
import { AnalyticsDashboard } from "./_components/AnalyticsDashboard";

export const dynamic = "force-dynamic";

const VALID_RANGES: AnalyticsRange[] = ["7d", "30d", "90d"];

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const params = await searchParams;
  const range = VALID_RANGES.includes(params.range as AnalyticsRange)
    ? (params.range as AnalyticsRange)
    : "30d";

  const summary = await getAnalyticsSummary(range);

  return (
    <div className="px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Website traffic, clicks and conversions tracked by the built-in pixel.
        </p>
      </div>

      <AnalyticsDashboard summary={summary} range={range} />
    </div>
  );
}

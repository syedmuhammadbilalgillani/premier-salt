"use client";

import { useRouter } from "next/navigation";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AnalyticsRange, AnalyticsSummary } from "@/lib/analytics";

function formatPKR(value: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "PKR" }).format(value);
}

const RANGE_LABELS: Record<AnalyticsRange, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
};

export function AnalyticsDashboard({
  summary,
  range,
}: {
  summary: AnalyticsSummary;
  range: AnalyticsRange;
}) {
  const router = useRouter();
  const { totals, timeseries, topPages, topProducts } = summary;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select
          value={range}
          onValueChange={(value) => router.push(`/admin/analytics?range=${value}`)}
        >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {(Object.keys(RANGE_LABELS) as AnalyticsRange[]).map((key) => (
              <SelectItem key={key} value={key}>
                {RANGE_LABELS[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <StatCard label="Impressions" value={totals.views.toLocaleString()} />
        <StatCard label="Clicks" value={totals.clicks.toLocaleString()} />
        <StatCard label="Unique Visitors" value={totals.visitors.toLocaleString()} />
        <StatCard label="Purchases" value={totals.purchases.toLocaleString()} />
        <StatCard label="Revenue" value={formatPKR(Number(totals.revenue))} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Traffic over time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeseries}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="views" name="Impressions" stroke="#2563eb" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="clicks" name="Clicks" stroke="#16a34a" strokeWidth={2} dot={false} />
                <Line
                  type="monotone"
                  dataKey="purchases"
                  name="Purchases"
                  stroke="#d97706"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Top pages</CardTitle>
          </CardHeader>
          <CardContent>
            {topPages.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="pb-2">Page</th>
                    <th className="pb-2 text-right">Views</th>
                    <th className="pb-2 text-right">Clicks</th>
                  </tr>
                </thead>
                <tbody>
                  {topPages.map((page) => (
                    <tr key={page.pageUrl} className="border-t border-border">
                      <td className="max-w-64 truncate py-2">{page.pageUrl}</td>
                      <td className="py-2 text-right">{page.views}</td>
                      <td className="py-2 text-right">{page.clicks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Top products</CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data yet.</p>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProducts} layout="vertical" margin={{ left: 24 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                    <YAxis
                      type="category"
                      dataKey="title"
                      width={140}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <Bar dataKey="views" name="Impressions" fill="#2563eb" />
                    <Bar dataKey="clicks" name="Clicks" fill="#16a34a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card size="sm">
      <CardContent>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";

function ChartShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="gap-3">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

const DONUT_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "#94a3b8",
];

export function LineChartCard({
  title,
  description,
  data,
  xKey,
  series,
}: {
  title: string;
  description?: string;
  data: Record<string, unknown>[];
  xKey: string;
  series: { key: string; label: string; color?: string }[];
}) {
  const config: ChartConfig = Object.fromEntries(
    series.map((s, i) => [s.key, { label: s.label, color: s.color ?? `var(--chart-${(i % 5) + 1})` }]),
  );
  return (
    <ChartShell title={title} description={description}>
      <ChartContainer config={config} className="aspect-auto h-64 w-full">
        <LineChart data={data} margin={{ left: 4, right: 4 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} />
          <ChartTooltip content={<ChartTooltipContent />} />
          {series.length > 1 && <ChartLegend content={<ChartLegendContent />} />}
          {series.map((s) => (
            <Line
              key={s.key}
              dataKey={s.key}
              type="monotone"
              stroke={`var(--color-${s.key})`}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ChartContainer>
    </ChartShell>
  );
}

export function BarChartCard({
  title,
  description,
  data,
  xKey,
  series,
  stacked,
}: {
  title: string;
  description?: string;
  data: Record<string, unknown>[];
  xKey: string;
  series: { key: string; label: string; color?: string }[];
  stacked?: boolean;
}) {
  const config: ChartConfig = Object.fromEntries(
    series.map((s, i) => [s.key, { label: s.label, color: s.color ?? `var(--chart-${(i % 5) + 1})` }]),
  );
  return (
    <ChartShell title={title} description={description}>
      <ChartContainer config={config} className="aspect-auto h-64 w-full">
        <BarChart data={data} margin={{ left: 4, right: 4 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} />
          <ChartTooltip content={<ChartTooltipContent />} />
          {series.length > 1 && <ChartLegend content={<ChartLegendContent />} />}
          {series.map((s) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              fill={`var(--color-${s.key})`}
              radius={4}
              stackId={stacked ? "stack" : undefined}
            />
          ))}
        </BarChart>
      </ChartContainer>
    </ChartShell>
  );
}

export function AreaChartCard({
  title,
  description,
  data,
  xKey,
  series,
}: {
  title: string;
  description?: string;
  data: Record<string, unknown>[];
  xKey: string;
  series: { key: string; label: string; color?: string }[];
}) {
  const config: ChartConfig = Object.fromEntries(
    series.map((s, i) => [s.key, { label: s.label, color: s.color ?? `var(--chart-${(i % 5) + 1})` }]),
  );
  return (
    <ChartShell title={title} description={description}>
      <ChartContainer config={config} className="aspect-auto h-64 w-full">
        <AreaChart data={data} margin={{ left: 4, right: 4 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} />
          <ChartTooltip content={<ChartTooltipContent />} />
          {series.length > 1 && <ChartLegend content={<ChartLegendContent />} />}
          {series.map((s) => (
            <Area
              key={s.key}
              dataKey={s.key}
              type="monotone"
              fill={`var(--color-${s.key})`}
              fillOpacity={0.2}
              stroke={`var(--color-${s.key})`}
              strokeWidth={2}
            />
          ))}
        </AreaChart>
      </ChartContainer>
    </ChartShell>
  );
}

export function DonutChartCard({
  title,
  description,
  data,
}: {
  title: string;
  description?: string;
  data: { name: string; value: number }[];
}) {
  const config: ChartConfig = Object.fromEntries(
    data.map((d, i) => [d.name, { label: d.name, color: DONUT_COLORS[i % DONUT_COLORS.length] }]),
  );
  return (
    <ChartShell title={title} description={description}>
      <ChartContainer config={config} className="mx-auto aspect-square h-64">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} strokeWidth={2}>
            {data.map((entry, i) => (
              <Cell key={entry.name} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
            ))}
          </Pie>
          <ChartLegend content={<ChartLegendContent nameKey="name" />} />
        </PieChart>
      </ChartContainer>
    </ChartShell>
  );
}

export function ProgressStatCard({
  title,
  description,
  items,
}: {
  title: string;
  description?: string;
  items: { label: string; value: number; caption?: string }[];
}) {
  return (
    <ChartShell title={title} description={description}>
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.label} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{item.label}</span>
              <span className="text-muted-foreground tabular-nums">{item.value}%</span>
            </div>
            <Progress value={item.value} />
            {item.caption && <p className="text-muted-foreground text-xs">{item.caption}</p>}
          </div>
        ))}
      </div>
    </ChartShell>
  );
}

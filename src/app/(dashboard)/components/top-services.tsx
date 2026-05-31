"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { TopService } from "@/types/dashboard";

const chartConfig = {
  count: {
    label: "Atendimentos",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface TopServicesChartProps {
  data: TopService[];
}

export function TopServicesChart({ data }: TopServicesChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Serviços mais realizados</CardTitle>
        <CardDescription>Top 5 serviços</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              left: -20,
            }}
          >
            <XAxis type="number" dataKey="count" hide />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" fill="var(--color-count)" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Baseado em agendamentos concluídos
        </div>
      </CardFooter>
    </Card>
  );
}
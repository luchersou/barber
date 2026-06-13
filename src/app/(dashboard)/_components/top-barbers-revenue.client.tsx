"use client";

import { LabelList, Pie, PieChart } from "recharts";
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
import { TopBarberRevenue } from "@/types/dashboard";

interface TopBarbersRevenueChartProps {
  data: TopBarberRevenue[];
}

export function TopBarbersRevenueChart({ data }: TopBarbersRevenueChartProps) {
  const chartData = data.map((item, index) => ({
    barber: item.barber.toLowerCase().replace(/\s+/g, "-"),
    barberName: item.barber,
    revenue: item.revenue,
    fill: `var(--color-${item.barber.toLowerCase().replace(/\s+/g, "-")})`,
  }));

  const chartConfig: ChartConfig = {
    revenue: { label: "Receita" },
    ...Object.fromEntries(
      data.map((item, index) => [
        item.barber.toLowerCase().replace(/\s+/g, "-"),
        {
          label: item.barber,
          color: `var(--chart-${(index % 5) + 1})`,
        },
      ])
    ),
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Receita por Barbeiro</CardTitle>
        <CardDescription>Agendamentos concluídos</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="revenue" hideLabel />}
            />
            <Pie data={chartData} dataKey="revenue">
              <LabelList
                dataKey="barber"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value) =>
                  String(chartConfig[value as string]?.label ?? value)
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Baseado em agendamentos concluídos
        </div>
      </CardFooter>
    </Card>
  );
}
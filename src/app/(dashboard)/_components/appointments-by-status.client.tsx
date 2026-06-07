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
import { AppointmentsByStatus } from "@/types/dashboard";
import { AppointmentStatus } from "@/generated/prisma/client";

const statusConfig: Record<AppointmentStatus, { label: string; color: string }> = {
  SCHEDULED: { label: "Agendado", color: "var(--chart-1)" },
  COMPLETED: { label: "Concluído", color: "var(--chart-2)" },
  CANCELLED: { label: "Cancelado", color: "var(--chart-3)" },
  NO_SHOW: { label: "Não compareceu", color: "var(--chart-4)" },
};

const chartConfig = {
  value: { label: "Atendimentos" },
  SCHEDULED: { label: "Agendado", color: "var(--chart-1)" },
  COMPLETED: { label: "Concluído", color: "var(--chart-2)" },
  CANCELLED: { label: "Cancelado", color: "var(--chart-3)" },
  NO_SHOW: { label: "Não compareceu", color: "var(--chart-4)" },
} satisfies ChartConfig;

interface AppointmentsByStatusProps {
  data: AppointmentsByStatus[];
}

export function AppointmentsByStatusChart({ data }: AppointmentsByStatusProps) {
  const chartData = data.map((item) => ({
    status: item.status,
    value: item.value,
    fill: statusConfig[item.status].color,
  }));

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Atendimentos por Status</CardTitle>
        <CardDescription>Mês atual</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="value" hideLabel />}
            />
            <Pie data={chartData} dataKey="value">
              <LabelList
                dataKey="status"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value) =>
                  statusConfig[value as AppointmentStatus]?.label ?? String(value)
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Total de atendimentos agrupados por status
        </div>
      </CardFooter>
    </Card>
  );
}
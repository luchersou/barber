"use client";

import { DollarSign, TrendingUp, Receipt, CheckCircle } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BillingStats } from "@/types/billing";

interface BillingStatsCardsProps {
  data: BillingStats;
}

function calcVariation(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

function VariationBadge({ value, hasData }: { value: number; hasData: boolean }) {
  if (!hasData) {
    return <span className="text-muted-foreground">Sem dados no período</span>;
  }

  const isPositive = value >= 0;
  return (
    <span className={isPositive ? "text-green-600" : "text-red-600"}>
      {isPositive ? "+" : ""}{value}% em relação ao mês anterior
    </span>
  );
}

export function BillingStatsCards({ data }: BillingStatsCardsProps) {
  const variations = {
    monthRevenue: calcVariation(data.monthRevenue, data.lastMonth.monthRevenue),
    completionRate: calcVariation(data.completionRate, data.lastMonth.completionRate),
  };

  return (
    <div className="*:data-[slot=card]:from-primary/10 grid gap-4 *:data-[slot=card]:bg-gradient-to-t md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Receita Total</CardTitle>
          <CardDescription>Todos os tempos</CardDescription>
          <CardAction>
            <DollarSign className="text-muted-foreground/50 size-4 lg:size-6" />
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl lg:text-3xl">
            {data.totalRevenue.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Receita do Mês</CardTitle>
          <CardDescription>
            <VariationBadge
              value={variations.monthRevenue}
              hasData={data.monthRevenue > 0 || data.lastMonth.monthRevenue > 0}
            />
          </CardDescription>
          <CardAction>
            <TrendingUp className="text-muted-foreground/50 size-4 lg:size-6" />
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl lg:text-3xl">
            {data.monthRevenue.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Ticket Médio</CardTitle>
          <CardDescription>Por atendimento concluído</CardDescription>
          <CardAction>
            <Receipt className="text-muted-foreground/50 size-4 lg:size-6" />
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl lg:text-3xl">
            {data.averageTicket.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Taxa de Conclusão</CardTitle>
          <CardDescription>
            <VariationBadge
              value={variations.completionRate}
              hasData={data.completionRate > 0 || data.lastMonth.completionRate > 0}
            />
          </CardDescription>
          <CardAction>
            <CheckCircle className="text-muted-foreground/50 size-4 lg:size-6" />
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl lg:text-3xl">
            {data.completionRate}%
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
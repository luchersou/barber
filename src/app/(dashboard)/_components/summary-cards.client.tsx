"use client";

import { CheckCircle, Calendar, DollarSign, Users } from "lucide-react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardStats } from "@/types/dashboard";

interface SummaryCardsProps {
  data: DashboardStats;
}

function calcVariation(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

function VariationBadge({ value }: { value: number }) {
  const isPositive = value >= 0;
  return (
    <span className={isPositive ? "text-green-600" : "text-red-600"}>
      {isPositive ? "+" : ""}{value}% em relação ao mês anterior
    </span>
  );
}

export function SummaryCards({ data }: SummaryCardsProps) {
  const variations = {
    monthRevenue: calcVariation(data.monthRevenue, data.lastMonth.monthRevenue),
    monthAppointments: calcVariation(data.monthAppointments, data.lastMonth.monthAppointments),
    completedThisMonth: calcVariation(data.completedThisMonth, data.lastMonth.completedThisMonth),
  };

  return (
    <div className="*:data-[slot=card]:from-primary/10 grid gap-4 *:data-[slot=card]:bg-gradient-to-t md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Receita do Mês</CardTitle>
          <CardDescription>
            <VariationBadge value={variations.monthRevenue} />
          </CardDescription>
          <CardAction>
            <DollarSign className="text-muted-foreground/50 size-4 lg:size-6" />
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
          <CardTitle>Agendamentos do Mês</CardTitle>
          <CardDescription>
            <VariationBadge value={variations.monthAppointments} />
          </CardDescription>
          <CardAction>
            <Calendar className="text-muted-foreground/50 size-4 lg:size-6" />
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl lg:text-3xl">
            {data.monthAppointments}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Clientes</CardTitle>
          <CardDescription>Total cadastrado</CardDescription>
          <CardAction>
            <Users className="text-muted-foreground/50 size-4 lg:size-6" />
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl lg:text-3xl">
            {data.totalClients}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Concluídos</CardTitle>
          <CardDescription>
            <VariationBadge value={variations.completedThisMonth} />
          </CardDescription>
          <CardAction>
            <CheckCircle className="text-muted-foreground/50 size-4 lg:size-6" />
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl lg:text-3xl">
            {data.completedThisMonth}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
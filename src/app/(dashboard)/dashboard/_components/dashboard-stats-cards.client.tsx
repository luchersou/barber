"use client";

import { Calendar, CheckCircle, DollarSign, Users } from "lucide-react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VariationBadge } from "@/components/ui/variation-badge";
import { calcVariation } from "@/lib/utils";
import { DashboardStats } from "@/types/dashboard";

interface DashboardStatsCardsProps {
  data: DashboardStats;
}

export function DashboardStatsCards({ data }: DashboardStatsCardsProps) {
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
            <VariationBadge 
              value={variations.monthRevenue} 
              hasData={data.monthRevenue > 0 || data.lastMonth.monthRevenue > 0} 
            />
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
            <VariationBadge value={variations.monthAppointments} hasData={data.monthAppointments > 0 || data.lastMonth.monthAppointments > 0} />
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
            <VariationBadge 
              value={variations.completedThisMonth} 
              hasData={data.completedThisMonth > 0 || data.lastMonth.completedThisMonth > 0} 
            />
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
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BarberSelect } from "@/types/barbers";
import { ClientSelect } from "@/types/clients";

interface AppointmentsFiltersProps {
  barbers: BarberSelect[];
  clients: ClientSelect[];
}

export function AppointmentsFilters({
  barbers,
  clients,
}: AppointmentsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");

  const [date, setDate] = useState<DateRange | undefined>({
    from: startDateParam ? new Date(startDateParam) : undefined,
    to: endDateParam ? new Date(endDateParam) : undefined,
  });

  function handleFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page");
    router.push(`?${params.toString()}`);
  }

  function handleDateRange(range: DateRange | undefined) {
    setDate(range);
    const params = new URLSearchParams(searchParams.toString());

    if (range?.from) {
      params.set("startDate", range.from.toISOString());
    } else {
      params.delete("startDate");
    }

    if (range?.to) {
      params.set("endDate", range.to.toISOString());
    } else {
      params.delete("endDate");
    }

    params.delete("page");
    router.push(`?${params.toString()}`);
  }

  function handleClear() {
    setDate(undefined);
    router.push("?");
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Select
        value={searchParams.get("barberId") ?? "all"}
        onValueChange={(value) => handleFilter("barberId", value)}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Barbeiro" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os barbeiros</SelectItem>
          {barbers.map((barber) => (
            <SelectItem key={barber.id} value={barber.id}>
              {barber.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("clientId") ?? "all"}
        onValueChange={(value) => handleFilter("clientId", value)}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Cliente" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os clientes</SelectItem>
          {clients.map((client) => (
            <SelectItem key={client.id} value={client.id}>
              {client.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-64">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd/MM/yyyy", { locale: ptBR })} →{" "}
                  {format(date.to, "dd/MM/yyyy", { locale: ptBR })}
                </>
              ) : (
                format(date.from, "dd/MM/yyyy", { locale: ptBR })
              )
            ) : (
              "Selecionar período"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            locale={ptBR}
            selected={date}
            onSelect={handleDateRange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      <Button variant="outline" onClick={handleClear}>
        Limpar filtros
      </Button>
    </div>
  );
}
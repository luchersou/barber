"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function BillingTransactionsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");

  const [date, setDate] = useState<DateRange | undefined>({
    from: startDateParam ? new Date(startDateParam) : undefined,
    to: endDateParam ? new Date(endDateParam) : undefined,
  });

  function handleDateRange(range: DateRange | undefined) {
    setDate(range);
    const params = new URLSearchParams(searchParams.toString());
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (range?.from) {
      const from = range.from;
      const dateStr = `${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, "0")}-${String(from.getDate()).padStart(2, "0")}`;
      params.set("startDate", dateStr);
    } else {
      params.delete("startDate");
    }

    if (range?.to) {
      const to = range.to;
      const dateStr = `${to.getFullYear()}-${String(to.getMonth() + 1).padStart(2, "0")}-${String(to.getDate()).padStart(2, "0")}`;
      params.set("endDate", dateStr);
    } else {
      params.delete("endDate");
    }

    params.set("timezone", timezone);
    params.delete("page");
    router.push(`?${params.toString()}`);
  }

  function handleClear() {
    setDate(undefined);
    router.push("?");
  }

  return (
    <div className="flex flex-wrap gap-3">
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
        Limpar
      </Button>
    </div>
  );
}
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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

  function handleClear() {
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

      <Button variant="outline" onClick={handleClear}>
        Limpar filtros
      </Button>
    </div>
  );
}
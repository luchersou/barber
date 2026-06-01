"use client";

import { MoreHorizontal } from "lucide-react";
import { Appointment } from "@/types/appointments";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface AppointmentsActionsProps {
  appointment: Appointment;
}

export function AppointmentsActions({ appointment }: AppointmentsActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => console.log("editar", appointment.id)}
        >
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => console.log("cancelar", appointment.id)}
        >
          Cancelar
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => console.log("deletar", appointment.id)}
        >
          Deletar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
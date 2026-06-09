"use client";

import { MoreHorizontal } from "lucide-react";
import { BarberTable } from "@/types/barbers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface BarbersActionsProps {
  barber: BarberTable;
}

export function BarbersActions({ barber }: BarbersActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => console.log("editar", barber.id)}>
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => console.log("cancelar", barber.id)}
        >
          Cancelar
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => console.log("deletar", barber.id)}
        >
          Deletar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
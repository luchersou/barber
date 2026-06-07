"use client";

import { MoreHorizontal } from "lucide-react";
import { ServiceTable } from "@/types/services";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ServicesActionsProps {
  service: ServiceTable;
}

export function ServicesActions({ service }: ServicesActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => console.log("editar", service.id)}>
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => console.log("cancelar", service.id)}
        >
          Cancelar
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => console.log("deletar", service.id)}
        >
          Deletar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
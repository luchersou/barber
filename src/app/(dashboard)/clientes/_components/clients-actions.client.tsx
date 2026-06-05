"use client";

import { MoreHorizontal } from "lucide-react";
import { Client } from "@/types/clients";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ClientsActionsProps {
  client: Client;
}

export function ClientsActions({ client }: ClientsActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => console.log("editar", client.id)}>
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => console.log("cancelar", client.id)}
        >
          Cancelar
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => console.log("deletar", client.id)}
        >
          Deletar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
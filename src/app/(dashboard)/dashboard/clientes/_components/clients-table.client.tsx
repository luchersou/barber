"use client";

import { SearchX,Users } from "lucide-react";

import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { ClientsResponse } from "@/types/clients";

import { clientsColumns } from "./clients-columns";
import { ClientsFilters } from "./clients-filters.client";

interface ClientsTableClientProps {
  data: ClientsResponse;
  hasFilters: boolean;
}

export function ClientsTableClient({ data, hasFilters }: ClientsTableClientProps) {
  const isEmpty = data.clients.length === 0;

  return (
    <div className="space-y-4">
      <ClientsFilters />

      {isEmpty ? (
        hasFilters ? (
          <EmptyState
            icon={SearchX}
            title="Nenhum cliente encontrado"
            description="Tente ajustar os filtros para encontrar o que procura."
          />
        ) : (
          <EmptyState
            icon={Users}
            title="Nenhum cliente cadastrado"
            description="Adicione seu primeiro cliente para começar a gerenciar os atendimentos."
          />
        )
      ) : (
        <DataTable
          data={data.clients}
          columns={clientsColumns}
          totalPages={data.totalPages}
          currentPage={data.currentPage}
        />
      )}
    </div>
  );
}
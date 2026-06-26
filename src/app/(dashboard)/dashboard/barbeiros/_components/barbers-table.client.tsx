"use client";

import { Scissors, SearchX } from "lucide-react";

import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { BarbersResponse } from "@/types/barbers";

import { barbersColumns } from "./barbers-columns";
import { BarbersFilters } from "./barbers-filters.client";

interface BarbersTableClientProps {
  data: BarbersResponse;
  hasFilters: boolean;
}

export function BarbersTableClient({ data, hasFilters }: BarbersTableClientProps) {
  const isEmpty = data.barbers.length === 0;

  return (
    <div className="space-y-4">
      <BarbersFilters />

      {isEmpty ? (
        hasFilters ? (
          <EmptyState
            icon={SearchX}
            title="Nenhum barbeiro encontrado"
            description="Tente ajustar os filtros para encontrar o que procura."
          />
        ) : (
          <EmptyState
            icon={Scissors}
            title="Nenhum barbeiro cadastrado"
            description="Adicione seu primeiro barbeiro para começar a montar a equipe."
          />
        )
      ) : (
        <DataTable
          data={data.barbers}
          columns={barbersColumns}
          totalPages={data.totalPages}
          currentPage={data.currentPage}
        />
      )}
    </div>
  );
}
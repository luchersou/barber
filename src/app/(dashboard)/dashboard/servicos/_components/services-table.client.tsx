"use client";

import { ServicesResponse } from "@/types/services";
import { servicesColumns } from "./services-columns";
import { ServicesFilters } from "./services-filters.client";
import { EmptyState } from "@/components/shared/empty-state";
import { Sparkles, SearchX } from "lucide-react";
import { DataTable } from "@/components/shared/data-table";

interface ServicesTableClientProps {
  data: ServicesResponse;
  hasFilters: boolean;
}

export function ServicesTableClient({ data, hasFilters }: ServicesTableClientProps) {
  const isEmpty = data.services.length === 0;

  return (
    <div className="space-y-4">
      <ServicesFilters />

      {isEmpty ? (
        hasFilters ? (
          <EmptyState
            icon={SearchX}
            title="Nenhum serviço encontrado"
            description="Tente ajustar os filtros para encontrar o que procura."
          />
        ) : (
          <EmptyState
            icon={Sparkles}
            title="Nenhum serviço cadastrado"
            description="Adicione seu primeiro serviço para começar a montar o catálogo da barbearia."
          />
        )
      ) : (
        <DataTable
          data={data.services}
          columns={servicesColumns}
          totalPages={data.totalPages}
          currentPage={data.currentPage}
        />
      )}
    </div>
  );
}
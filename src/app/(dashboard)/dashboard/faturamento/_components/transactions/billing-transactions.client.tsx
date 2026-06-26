"use client";

import { Receipt, SearchX } from "lucide-react";

import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { BillingTransactionsResponse } from "@/types/billing";

import { billingTransactionsColumns } from "./billing-transactions-columns";
import { BillingTransactionsFilters } from "./billing-transactions-filters.client";

interface BillingTransactionsClientProps {
  data: BillingTransactionsResponse;
  hasFilters: boolean;
}

export function BillingTransactionsClient({ data, hasFilters }: BillingTransactionsClientProps) {
  const isEmpty = data.transactions.length === 0;

  return (
    <div className="space-y-4">
      <BillingTransactionsFilters />

      {isEmpty ? (
        hasFilters ? (
          <EmptyState
            icon={SearchX}
            title="Nenhuma transação encontrada"
            description="Tente ajustar os filtros para encontrar o que procura."
          />
        ) : (
          <EmptyState
            icon={Receipt}
            title="Nenhuma transação registrada"
            description="As transações aparecerão aqui conforme os atendimentos forem concluídos."
          />
        )
      ) : (
        <DataTable
          data={data.transactions}
          columns={billingTransactionsColumns}
          totalPages={data.totalPages}
          currentPage={data.currentPage}
        />
      )}
    </div>
  );
}
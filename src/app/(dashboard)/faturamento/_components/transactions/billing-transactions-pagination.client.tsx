"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

interface BillingTransactionsPaginationProps {
  totalPages: number;
  currentPage: number;
}

export function BillingTransactionsPagination({
  totalPages,
  currentPage,
}: BillingTransactionsPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handlePage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Anterior
      </Button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => handlePage(page)}
        >
          {page}
        </Button>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Próximo
      </Button>
    </div>
  );
}
"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface TablePaginationProps {
  totalPages: number;
  currentPage: number;
}

function getPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];

  return [1, "...", current - 1, current, current + 1, "...", total];
}

export function TablePagination({ totalPages, currentPage }: TablePaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handlePage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  }

  const pages = getPageRange(currentPage, totalPages);

  return (
    <Pagination>
      <PaginationContent className="gap-0 divide-x overflow-hidden rounded-lg border">
        <PaginationItem>
          <PaginationPrevious
            href="#"
            className="rounded-none"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) handlePage(currentPage - 1);
            }}
            aria-disabled={currentPage === 1}
          />
        </PaginationItem>

        {pages.map((page, i) =>
          page === "..." ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis className="rounded-none border-none" />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                className={cn(
                  "rounded-none border-none",
                  page === currentPage &&
                    buttonVariants({
                      variant: "default",
                      className:
                        "hover:text-primary-foreground! dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 dark:hover:text-primary-foreground dark:border-transparent",
                    })
                )}
                isActive={page === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  handlePage(page);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            className="rounded-none"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) handlePage(currentPage + 1);
            }}
            aria-disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
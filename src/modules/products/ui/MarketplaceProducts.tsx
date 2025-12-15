"use client";

import { ProductCard } from "@/modules/products/ui/ProductCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import type { AppRouter } from "@/server/api/routers/rootRouter";
import type { inferProcedureOutput } from "@trpc/server";
import { loadMoreProducts } from "@/app/(app)/(home)/MarketPlace/actions";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Infer type từ tRPC procedure output (type-safe 100%)
type MarketplaceOutput = inferProcedureOutput<
  AppRouter["product"]["getAllForMarketplace"]
>;
type Product = MarketplaceOutput["products"][number];

interface MarketplaceProductsProps {
  initialProducts: Product[];
  initialCursor?: string;
  totalCount: number; // Tổng số sản phẩm trong DB
  wishlistProductIds: Set<string>;
  isLoggedIn: boolean;
}

const PRODUCTS_PER_PAGE = 24;
const PREFETCH_PAGES = 3; // Prefetch 3 trang (72 sản phẩm)

export const MarketplaceProducts = ({
  initialProducts,
  initialCursor,
  totalCount,
  wishlistProductIds,
  isLoggedIn,
}: MarketplaceProductsProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  // Calculate pagination
  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);
  const batchNumber = Math.floor((currentPage - 1) / PREFETCH_PAGES);

  // Query key dựa trên batch (mỗi batch = 3 trang = 72 sản phẩm)
  const { data, isLoading } = useQuery({
    queryKey: ["marketplace-products", batchNumber],
    queryFn: async () => {
      // Lấy cursor từ batch trước
      const prevBatch = queryClient.getQueryData<{
        products: Product[];
        nextCursor?: string;
      }>(["marketplace-products", batchNumber - 1]);

      if (!prevBatch?.nextCursor) {
        return { products: [], nextCursor: undefined };
      }

      // Fetch 72 sản phẩm cho batch mới
      return await loadMoreProducts(prevBatch.nextCursor, 72);
    },
    staleTime: 5 * 60 * 1000, // Cache 5 phút
    gcTime: 10 * 60 * 1000, // Garbage collect sau 10 phút
    initialData:
      batchNumber === 0
        ? { products: initialProducts, nextCursor: initialCursor }
        : undefined, // Chỉ hydrate batch 0 từ Server Component
  });

  // Auto prefetch batch tiếp theo khi ở trang 2 của batch (trang 2, 5, 8, ...)
  useEffect(() => {
    const pageInBatch = (currentPage - 1) % PREFETCH_PAGES;

    // Chỉ prefetch khi ở trang 2 của batch và không đang loading
    if (pageInBatch === 1 && !isLoading && data?.nextCursor) {
      const nextBatch = batchNumber + 1;
      const nextBatchStartPage = nextBatch * PREFETCH_PAGES + 1;

      // Chỉ prefetch nếu còn trang
      if (nextBatchStartPage <= totalPages) {
        queryClient.prefetchQuery({
          queryKey: ["marketplace-products", nextBatch],
          queryFn: async () => {
            return await loadMoreProducts(data.nextCursor!, 72);
          },
          staleTime: 5 * 60 * 1000,
        });
      }
    }
  }, [
    currentPage,
    batchNumber,
    totalPages,
    data?.nextCursor,
    isLoading,
    queryClient,
  ]);

  // Calculate products cho trang hiện tại
  const pageInBatch = (currentPage - 1) % PREFETCH_PAGES;
  const allProducts = data?.products || [];
  const startIndexInBatch = pageInBatch * PRODUCTS_PER_PAGE;
  const endIndexInBatch = startIndexInBatch + PRODUCTS_PER_PAGE;
  const currentProducts = allProducts.slice(startIndexInBatch, endIndexInBatch);

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;

  // Scroll to top khi chuyển trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  return (
    <>
      {/* Products Grid */}
      {allProducts.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center rounded-lg border bg-muted/30">
          <div className="text-center">
            <p className="text-muted-foreground text-lg">
              Chưa có sản phẩm nào trong marketplace
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isInWishlist={wishlistProductIds.has(product.id)}
                isLoggedIn={isLoggedIn}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      currentPage > 1 && handlePageChange(currentPage - 1)
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {getPageNumbers().map((page, idx) =>
                  page === "..." ? (
                    <PaginationItem key={`ellipsis-${idx}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page as number)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      currentPage < totalPages &&
                      handlePageChange(currentPage + 1)
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            {/* Info text */}
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Trang {currentPage} / {totalPages} • Hiển thị {startIndex + 1}-
              {Math.min(endIndex, totalCount)} trong {totalCount} sản phẩm
              {isLoading && " • Đang tải thêm..."}
            </div>
          </div>
        </>
      )}
    </>
  );
};

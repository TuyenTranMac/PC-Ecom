"use client";

import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Props {
  activeCategory: string | null; // slug
  activeSubcategory: string | null; // slug
  subcategoryName: string | null; // tên hiển thị
  categoryName?: string | null; // OPTIONAL: nếu bạn muốn hiển thị tên category
}

export function CategoryBreadcrumb({
  activeCategory,
  activeSubcategory,
  subcategoryName,
  categoryName = null, // fallback
}: Props) {
  const hasCategory = Boolean(activeCategory);
  const hasSub = Boolean(activeSubcategory);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* CATEGORY */}
        <BreadcrumbItem>
          {hasCategory ? (
            <BreadcrumbLink asChild className="text-black underline">
              <Link href={`/${activeCategory}`}>{categoryName}</Link>
            </BreadcrumbLink>
          ) : (
            ""
          )}
        </BreadcrumbItem>

        {/* SUBCATEGORY */}
        {hasCategory && hasSub && (
          <>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>{subcategoryName}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

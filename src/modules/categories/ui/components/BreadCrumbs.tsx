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
  activeChildren: string | null; // slug
  childrenName: string | null; // tên hiển thị
  categoryName?: string | null; // OPTIONAL: nếu bạn muốn hiển thị tên category
}

export function CategoryBreadcrumb({
  activeCategory,
  activeChildren,
  childrenName,
  categoryName = null, // fallback
}: Props) {
  const hasCategory = Boolean(activeCategory);
  const hasSub = Boolean(activeChildren);

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

        {/* Children */}
        {hasCategory && hasSub && (
          <>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>{childrenName}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

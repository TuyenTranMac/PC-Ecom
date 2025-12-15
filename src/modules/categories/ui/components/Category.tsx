"use client";
import CategoryDropdown from "./CategoryDropdown";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";
import { ListFilterIcon, UndoIcon } from "lucide-react";
import CategorySidebar from "./CategorySidebar";
import { UseCategory } from "@/app/(app)/trpcHelper/useTRPC";
import Link from "next/link";
import { useParams } from "next/navigation";

import SearchInput from "./SearchInput";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { CategoryBreadcrumb } from "./BreadCrumbs";

const Category = () => {
  const params = useParams();
  const categoryParam = (params.category as String) || null;
  const childrenParam = params.subcategory as string | null;
  const { data } = UseCategory();
  const categories = data ?? [];
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const viewAllRef = useRef<HTMLDivElement>(null);

  const [visibleCount, setVisibleCount] = useState(categories.length);
  const [isAnyHovered, setIsAnyHovered] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const activeCategory = (categoryParam as string) || null;
  const activeSubcategory = (childrenParam as string) || null;
  const activeCategoryIndex = categories.findIndex(
    (cat) => cat.slug === activeCategory
  );
  //danh mục đang được chọn và được lấy từ data
  const isActiveCategoryHidden =
    activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1;
  const activeCategoryData = categories.find(
    (category) => category.slug === activeCategory
  );

  const activeCategoryName = activeCategoryData?.name || null;
  const activeCategoryColor = activeCategoryData?.color || "#F5F5F5";

  const activeSubcategoryName =
    activeCategoryData?.other_Category?.find(
      (children) => children.slug === activeSubcategory
    )?.name || null;

  useEffect(() => {
    const calVisible = () => {
      if (!containerRef.current || !measureRef.current || !viewAllRef.current) {
        return;
      }
      const container_W = containerRef.current.offsetWidth;
      const viewAll_W = viewAllRef.current.offsetWidth;
      const avilable_W = container_W - viewAll_W;

      const items = Array.from(measureRef.current.children);
      let totalWidth = 0;
      let visible = 0;

      for (const item of items) {
        const width = item.getBoundingClientRect().width;
        if (totalWidth + width > avilable_W) break;

        totalWidth += width;
        visible++;
      }
      setVisibleCount(visible);
    };
    const resizeObsever = new ResizeObserver(calVisible);
    resizeObsever.observe(containerRef.current!);
    return () => resizeObsever.disconnect();
  }, [categories.length]);

  return (
    <div
      className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full"
      style={{ backgroundColor: activeCategoryColor }}
    >
      <SearchInput disable={false} />
      <div className="relative w-full">
        {/*Hidden div để tính diện tích cho các item hiển thị */}
        <div
          className="flex absolute opacity-0 pointer-events-none "
          style={{ position: "fixed", top: -9999, left: -9999 }}
          ref={measureRef}
        >
          {categories.map((categories) => (
            <div key={categories.id}>
              <CategoryDropdown
                category={categories}
                isActive={activeCategory === categories.slug}
                isNavigatedHover={false}
              />
            </div>
          ))}
        </div>
        <div
          className="flex flex-nowrap items-center"
          ref={containerRef}
          onMouseEnter={() => setIsAnyHovered(true)}
          onMouseLeave={() => setIsAnyHovered(false)}
        >
          {categories.slice(0, visibleCount).map((categories) => (
            <div key={categories.id}>
              <CategoryDropdown
                category={categories}
                isActive={activeCategory === categories.slug}
                isNavigatedHover={isAnyHovered}
              />
            </div>
          ))}
          <div ref={viewAllRef}>
            <Button
              className={cn(
                "h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black ",
                isActiveCategoryHidden &&
                  !isAnyHovered &&
                  "bg-white border-primary",
                "bg-white border-primary"
              )}
              onClick={() => setIsSidebarOpen(true)}
            >
              View All
              <ListFilterIcon className="ml-2" />
            </Button>
          </div>
        </div>

        {/*Category Sidebar*/}
        <CategorySidebar
          isOpen={isSidebarOpen}
          onOpenChange={setIsSidebarOpen}
          data={categories}
        />
      </div>
      <CategoryBreadcrumb
        activeCategory={activeCategory}
        activeChildren={activeSubcategory}
        childrenName={activeSubcategoryName}
        categoryName={activeCategoryName}
      />
    </div>
  );
};

export default Category;

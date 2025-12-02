import { Category } from "@prisma/client";
import Link from "next/link";
import { CategoryAllOutput } from "@/modules/categories/type";

interface SubDropdownProps {
  category: CategoryAllOutput[number];
  isOpen: boolean;
  position: { top: number; left: number };
}

export const SubcategoryMenu = ({
  category,
  isOpen,
  position,
}: SubDropdownProps) => {
  if (!isOpen || !category.children || category.children.length === 0) {
    return null;
  }
  const backgroundColor = category.color || "#F5F5F5";
  return (
    <div
      className="fixed z-100"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <div className="h-3 w-60" />
      <div className="h-3 w-60" />
      <div
        style={{ backgroundColor }}
        className="w-60 text-black rounded-md overflow-hidden border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-0.5 -translate-0-y[2px] "
      >
        <div>
          {category.children?.map((children) => (
            <Link
              key={children.slug}
              href={`/${category.slug}/${children.slug}`}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center underline font-medium "
            >
              {children.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { useDropDownPosition } from "./use-dropdown-position";
import { SubcategoryMenu } from "./SubCategoryMenu";
import { CategoryAllOutput } from "@/modules/categories/type";

interface catDropProps {
  category: CategoryAllOutput[1];
  isActive?: boolean;
  isNavigatedHover?: boolean;
}

const CateoryDropdown = ({
  category,
  isActive,
  isNavigatedHover,
}: catDropProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { getDropdownPosition } = useDropDownPosition(dropdownRef);
  const dropdownPosition = getDropdownPosition();
  const onMouseEnter = () => {
    if (category.subcategories) {
      setIsOpen(true);
    }
  };
  const onMouseLeave = () => setIsOpen(false);

  return (
    <div
      className="relative inline-block"
      ref={dropdownRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative  ">
        <Button
          className={cn(
            "h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black ",
            isActive && !isNavigatedHover && "bg-white border-primary",
            isOpen &&
              "bg-white border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-1 -translate-y-1 transition-all"
          )}
          variant={"elevated"}
        >
          {category.name}
        </Button>
        {category.subcategories?.length > 0 && (
          <div
            className={cn(
              "opacity-0 absolute -bottom-4 w-0 h-0  border-l-10 border-r-10 border-b-10 border-l-transparent border-r-transparent border-b-black left-1/2 -translate-x-1/2",
              isOpen && "opacity-100"
            )}
          />
        )}
      </div>
      <SubcategoryMenu
        category={category}
        isOpen={isOpen}
        position={dropdownPosition}
      />
    </div>
  );
};
export default CateoryDropdown;

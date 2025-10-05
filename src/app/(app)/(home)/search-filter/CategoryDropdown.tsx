'use client'
import { Button } from "@/components/ui/button"
import { Category } from "@/payload-types"
import { cn } from "@/lib/utils"
import { useRef, useState } from "react"
import { useDropDownPosition } from "./use-dropdown-position"
import {SubcategoryMenu} from "./SubCategoryMenu"
import { CategoryUI } from "@/lib/formatters/categoryFormatter"
interface catDropProps{
    category: CategoryUI,
    isActive?: boolean,
    isNavigatedHover?: boolean,
}

const CateoryDropdown = ({category,isActive,isNavigatedHover}:catDropProps) => {
    const [isOpen,setIsOpen]= useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const {getDropdownPosition} = useDropDownPosition(dropdownRef)
    const dropdownPosition = getDropdownPosition();
    const onMouseEnter = () =>
    {
        if(category.subcategories){
            setIsOpen(true)
        } 
    }
    const onMouseLeave = () => setIsOpen(false)

    return (
        <div 
        className="relative"
        ref={dropdownRef}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}

        >
        <div>
            <Button
                className={cn(
                "h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black ",
                isActive && !isNavigatedHover && "bg-white border-primary"
                )}
            
                variant={"elevated"}>
                    {category.name}
            </Button>
            { category.subcategories?.length > 0 &&(
                <div className={cn(
                    "opacity-0 absolute -bottom-3 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[10px] border-l-transparent border-r-transparent border-b-black left-1/2 -translate-x-1/2",
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
  )
}

export default CateoryDropdown
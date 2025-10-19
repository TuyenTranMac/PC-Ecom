import { CategoryUI } from '@/lib/formatters/categoryFormatter'
import React from 'react'
import { useState } from 'react'
import{
  Sheet,SheetContent,SheetHeader,SheetTitle
} from "@/components/ui/sheet"
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon, ChevronRightIcon, Database } from 'lucide-react'
import categories from './Categories'
import { useRouter } from 'next/navigation'

interface Props{
  isOpen: boolean,
  onOpenChange: (isOpen: boolean) => void,
  data: CategoryUI[]
}



const CategorySidebar = ({
  isOpen,
  onOpenChange,
  data

}:Props) => {
  const router = useRouter()
  const [parentCategory,setParentCategory] = useState<CategoryUI[] | null>(null)
  const [selectedCategory,setSelectedCategory] = useState<CategoryUI | null>(null)

  const currentCategory = parentCategory ?? data ?? [];
  const handleClickSubcategories = (category: CategoryUI) => {
    if(category.subcategories && category.subcategories.length >0){
      setParentCategory(category.subcategories)
      setSelectedCategory(category)
    }
    else {
      if(parentCategory && selectedCategory){
        router.push(`/${selectedCategory.slug}/${category.slug}`)
      }
      else{
        if(category.slug === 'all'){
          router.push("/src")
        }
        else{
          router.push(`${category.slug}`)
        }
      }
    }
  }

   const handleOpenChange = (open:boolean) => {
      setSelectedCategory(null)
      setParentCategory(null)
      onOpenChange(open)
    }
  const handleBackToParent = () => {
    setParentCategory(null)
    setSelectedCategory(null)
  }


  return (
    <Sheet open= {isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side='left'
        className="p-0 transition-none"
        style={{backgroundColor:"white"}}
      >
        <SheetHeader
          className="p-4 border-b"
        >
          <SheetTitle>
            Category
          </SheetTitle>

        </SheetHeader>
        <ScrollArea className='flex flex-col overflow-y-auto h-full pb-2'>
          {
            parentCategory && (
              <button
                onClick={() => {handleBackToParent()}}
                className='w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium'
              >
                Back
                <ChevronLeftIcon 
                  className='size-4 mr-2'
                />
              </button>
            )
          }

          {currentCategory.map((cat) => (
            <button
              className='w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center text-base font-medium'
              key={cat.slug}
              onClick={() => handleClickSubcategories(cat)}
            >
              {cat.name}
              {cat.subcategories && cat.subcategories.length >0 && (
                <ChevronRightIcon className='size-4'/>
              )}

            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

export default CategorySidebar
import { Category } from "@/payload-types"
import CategoryDropdown from "./CategoryDropdown"
import { CategoryUI } from "@/lib/formatters/categoryFormatter"
interface CategoriesProps{
    categoriesData:any
}



const categories = ({categoriesData}:CategoriesProps) => {
  return (
    <div>
    
        {categoriesData.map((categories:CategoryUI) => (
            <div key={categories.id}>
                <CategoryDropdown
                    category={categories}
                    isActive={false}
                    isNavigatedHover={false}
                />
            </div>
        ))}
    </div>
    
  )
}

export default categories
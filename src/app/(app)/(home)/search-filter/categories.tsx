import { Category } from "@/payload-types"
import CategoryDropdown from "./CategoryDropdown"
interface CategoriesProps{
    categoriesData:any
}



const categories = ({categoriesData}:CategoriesProps) => {
  return (
    <div>
        {categoriesData.map((categories:Category) => (
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
import Categories from "./categories";
import SearchInput from "./SearchInput";
import { CustomCategory } from "./types";



interface Props{
    data: CustomCategory[];
}


const  SearchFilter = ( {data}: Props) => {
      console.log("🚀 SearchFilter nhận props data:", data);
    return(
        <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full">
            <SearchInput
                disable = {false}
            />
            <Categories
                categoriesData={data}    
            />
        </div>
    )
}
export default SearchFilter


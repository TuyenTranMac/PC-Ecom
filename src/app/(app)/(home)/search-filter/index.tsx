import Categories from "./categories";
import SearchInput from "./SearchInput";



interface Props{
    data: any;
}

const  SearchFilter = ( {data}: Props) => {
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


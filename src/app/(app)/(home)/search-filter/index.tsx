'use client'

import SearchInput from "./SearchInput";
import Categories from "./categories";
// import { CustomCategory } from "./types";


const  SearchFilter = () => {
    return(
        <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full">
            <SearchInput
                disable = {false}
            />
            <Categories
            />
        </div>
    )
}
export default SearchFilter


import Footer from "./Footer";
import Navbar from "./navbar";
import SearchFilter from "./search-filter";
import { getPayload } from "payload";
import configPromise from '@payload-config'
import { Category } from "@/payload-types";
import { format } from "path";
import { CategoryUI } from "@/lib/formatters/categoryFormatter";



interface Props{
    children: React.ReactNode;
}




const layout = async ({children} : Props) => {
  const payLoad = await getPayload({
    config:configPromise,
  })
  const data = await payLoad.find({
    collection: 'categories',
    depth:1,
    pagination:false,
    where:{
      parent:{
        exists:false
      }
    }
  })
  
  const formattedData = CategoryUI(data.docs);
  // const formatedData = data.docs.map((doc) => ({
  //   ...doc,
  //   subcategories: (doc.subcategories?.docs ?? [].map((doc) => ({
  //   ...(doc as Category), //Category type from payload
  //       subcategories:undefined
  // })))
  // }))
      console.log(  formattedData)
      console.log('default date:',data)
  return (

    <div className="flex flex-col min-h-screen">
      <Navbar/>
      <SearchFilter
        data={formattedData}
      />
      <div className="flex-1">
        {children}
      </div>
      <Footer/>
    </div>
  )
}

export default layout
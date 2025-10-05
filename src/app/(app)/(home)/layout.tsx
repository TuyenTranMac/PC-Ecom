import Footer from "./Footer";
import Navbar from "./navbar";
import SearchFilter from "./search-filter";
import { getPayload } from "payload";
import configPromise from '@payload-config'
import { Category } from "@/payload-types";
import { format } from "path";



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

  const formatedData = data.docs.map((doc) => ({
    ...doc,
    subcategories: (doc.subcategories?.docs ?? [].map((doc) => ({
    ...(doc as Category), //Category type from payload
        subcategories:undefined
  })))
  }))
 
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar/>
      <SearchFilter
        data={formatedData}
      />
      <div className="flex-1">
        {children}
      </div>
      <Footer/>
    </div>
  )
}

export default layout
import Footer from "./Footer";
import Navbar from "./navbar";
import SearchFilter from "./search-filter";
import { getPayload } from "payload";
import configPromise from '@payload-config'
import { Category } from "@/payload-types";
import { format } from "path";
import { CategoryUI } from "@/lib/formatters/categoryFormatter";
import { HydrateClient, prefetch,trpc } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { UseCategory } from "../trpcHelper/useTRPC";
// import { CustomCategory } from "./search-filter/types";



interface Props{
    children: React.ReactNode;
}
const layout = async ({children} : Props) => {

  return (
    <HydrateClient>
        <div className="flex flex-col min-h-screen">
          <Navbar/>
            <Suspense fallback={<div>Loading...</div>} >
              <SearchFilter

              />
            </Suspense>
          <div className="flex-1">
            {children}
          </div>
          <Footer/>
        </div>
    </HydrateClient>

  )
}

export default layout
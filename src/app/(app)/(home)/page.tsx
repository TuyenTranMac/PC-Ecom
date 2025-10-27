'use client'

import { useAuth } from '../trpcHelper/useTRPC';



export default function Home() {
  
  // prefetch(
  //   trpc.hello.queryOptions({
  //     text:'Tuyen'
  //   })
  // )
    const {data} = useAuth()
    return(
      <div>
      <div className=" flex flex-col gap-y-4"> Home
        <p>{JSON.stringify(data.user?.email)}</p>
      </div>
    </div>
    );
  
  
}

// import { getQueryClient ,trpc } from "~/trpc/server";


// export default  async function Home() {
  
//     const queryClient = getQueryClient();
//     const dataCat  = await queryClient.fetchQuery(trpc.categories.getMany.queryOptions())
//     return(
//       <div>
//       <div className=" flex flex-col gap-y-4">
//       <p>is Loading:{JSON.stringify(`${dataCat}`)}</p>

//         {JSON.stringify(dataCat)}
//       </div>
//     </div>
//     );
  
  
// }

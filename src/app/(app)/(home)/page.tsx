'use client'

import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '~/trpc/client';



export default function Home() {
  
  // prefetch(
  //   trpc.hello.queryOptions({
  //     text:'Tuyen'
  //   })
  // )

    return(
      <div>
      <div className=" flex flex-col gap-y-4"> Home
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

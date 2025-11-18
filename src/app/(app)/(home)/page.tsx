"use client";

import { useAuth } from "../trpcHelper/useTRPC";

export default function Home() {
  // prefetch(
  //   trpc.hello.queryOptions({
  //     text:'Tuyen'
  //   })
  // )
  const { data } = useAuth();
  return (
    <div className=" flex flex-col gap-y-4">
      Home
      <p>aaa{JSON.stringify(data.user?.email)}</p>
    </div>
  );
}

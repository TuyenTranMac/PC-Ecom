import Footer from "../../../modules/home/ui/components/Footer";
import Navbar from "../../../modules/home/ui/components/navbar";
import SearchFilter from "@/modules/home/ui/components/search-filter";
import { caller, HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Suspense } from "react";

interface Props {
  children: React.ReactNode;
}
const layout = async ({ children }: Props) => {
  const callMe = await caller;
  const session = callMe.auth.getMe();

  return (
    <HydrateClient>
      <div className="flex flex-col min-h-screen">
        <Navbar session={session} />
        <Suspense fallback={<div>Loading...</div>}>
          <SearchFilter />
        </Suspense>
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </HydrateClient>
  );
};

export default layout;

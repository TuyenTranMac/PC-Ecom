import { getUserInfoSeverSide } from "@/lib/auth/UserSeverSideHelper";
import Footer from "../../../modules/home/ui/components/Footer";
import Navbar from "../../../modules/home/ui/components/navbar";
import { caller, HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { SessionProvider } from "@/modules/auth/ui/sign-in/views/providers/SessionProvider";
import Category from "@/modules/home/ui/components/search-filter/Category";

interface Props {
  children: React.ReactNode;
}
const layout = async ({ children }: Props) => {
  const user = await getUserInfoSeverSide();
  return (
    <HydrateClient>
      <SessionProvider session={user}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <Suspense fallback={<div>Loading...</div>}>
            <Category />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </SessionProvider>
    </HydrateClient>
  );
};

export default layout;

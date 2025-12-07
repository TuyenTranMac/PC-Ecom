import Footer from "../../../modules/home/ui/components/Footer";
import Navbar from "../../../modules/home/ui/components/navbar";
import { api, HydrateClient, prefetch, trpc } from "@/server/server";
import { Suspense } from "react";
import { SessionProvider } from "@/modules/auth/ui/sign-in/views/providers/SessionProvider";
import Category from "@/modules/categories/ui/components/Category";
import { getSession } from "@/lib/auth/session";
import { Toaster } from "@/components/ui/toaster";

interface Props {
  children: React.ReactNode;
}
const layout = async ({ children }: Props) => {
  const caller = await api();
  const catData = await caller.categories.getAll();
  const user = await getSession();
  return (
    <HydrateClient>
      <SessionProvider session={user}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <Suspense fallback={<div>Loading...</div>}>
            <Category data={catData} />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
        </div>
      </SessionProvider>
    </HydrateClient>
  );
};

export default layout;

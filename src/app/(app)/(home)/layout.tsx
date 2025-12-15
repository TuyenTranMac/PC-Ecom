import Footer from "../../../modules/home/ui/components/Footer";
import Navbar from "../../../modules/home/ui/components/navbar";
import { api, HydrateClient } from "@/server/server";
import { Suspense } from "react";
import { SessionProvider } from "@/modules/auth/ui/sign-in/views/providers/SessionProvider";
import Category from "@/modules/categories/ui/components/Category";
import { getSession } from "@/lib/auth/session";
import { Toaster } from "@/components/ui/toaster";
import { unstable_cache } from "next/cache";

// Cache category data với Next.js unstable_cache (cache 5 phút)
const getCachedCategories = unstable_cache(
  async () => {
    const caller = await api();
    return caller.categories.getAll();
  },
  ["categories-all"], // Cache key
  {
    revalidate: 300, // Cache 5 phút (300 giây)
    tags: ["categories"], // Tag để có thể revalidate on-demand
  }
);

interface Props {
  children: React.ReactNode;
}

const layout = async ({ children }: Props) => {
  const catData = await getCachedCategories();
  const user = await getSession();
  return (
    <HydrateClient>
      <SessionProvider session={user}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <Suspense fallback={<div>Loading...</div>}>
            {/* @ts-expect-error - Category component needs proper typing */}
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

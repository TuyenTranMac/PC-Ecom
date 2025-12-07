import { api } from "@/server/server";
import { redirect } from "next/navigation";
import { DashboardContent } from "@/modules/tenant/ui/dashboard-content";

/**
 * Dashboard Page - Vendor quản lý store
 * Route: /vendor/{username}/dashboard
 * Auth & Permission đã được xử lý ở layout
 */

interface Props {
  params: Promise<{
    storeSlug: string;
  }>;
}

const VendorDashboardPage = async ({ params }: Props) => {
  const { storeSlug } = await params;
  const caller = await api();

  try {
    const [store, stats, subscription] = await Promise.all([
      caller.store.getMyStore(),
      caller.store.getStoreStats(),
      caller.subscription.getCurrentSubscription(),
    ]);

    // Verify username khớp với store slug (đã được check ở layout rồi)
    if (storeSlug.toLowerCase() !== store.slug.toLowerCase()) {
      redirect(`/vendor/${store.slug}/dashboard`);
    }

    return (
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:mt-2 sm:text-base">
            Quản lý cửa hàng và sản phẩm của bạn
          </p>
        </div>

        <DashboardContent
          store={store}
          stats={stats}
          subscription={subscription}
        />
      </div>
    );
  } catch (error: any) {
    // Nếu chưa có store, redirect về trang subscription
    if (error.message?.includes("Không tìm thấy cửa hàng")) {
      redirect("/subscription");
    }

    throw error;
  }
};

export default VendorDashboardPage;

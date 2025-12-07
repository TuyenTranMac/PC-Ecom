import { api } from "@/server/server";
import { SubscriptionPlans } from "@/modules/tenant/ui/subscription-plans";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

const SubscriptionPage = async () => {
  // Lấy session để kiểm tra đăng nhập
  const session = await auth();

  // Phải đăng nhập mới vào được
  if (!session) {
    redirect("/auth");
  }

  // Kiểm tra xem có đang ở subdomain không
  const headersList = await headers();
  const subdomain = headersList.get("x-subdomain");

  // Nếu đang ở subdomain → redirect về main domain (localhost:3000 hoặc gear.org)
  if (subdomain) {
    const isLocalhost = headersList.get("host")?.includes("localhost");
    const protocol = isLocalhost ? "http" : "https";
    const baseDomain = isLocalhost ? "localhost:3000" : "gear.org";

    return redirect(`${protocol}://${baseDomain}/subscription`);
  }

  // Fetch data từ Server (tRPC Caller pattern)
  const caller = await api();
  const plans = await caller.subscription.getPlans();

  // Chỉ fetch currentSubscription nếu đã là VENDOR
  const currentSubscription =
    session.user.role === "VENDOR"
      ? await caller.subscription.getCurrentSubscription()
      : null;

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 text-center sm:mb-8">
          <h1 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl md:text-4xl">
            {currentSubscription
              ? "Quản lý gói đăng ký"
              : "Trở thành người bán"}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
            {currentSubscription
              ? `Bạn đang sử dụng gói ${currentSubscription.plan}. Nâng cấp để mở khóa thêm tính năng`
              : "Chọn gói đăng ký để bắt đầu bán hàng trên Gear"}
          </p>
        </div>

        {/* Pass initialData xuống Client Component */}
        <SubscriptionPlans
          plans={plans.plans}
          currentSubscription={currentSubscription}
          isVendor={session.user.role === "VENDOR"}
        />
      </div>
    </div>
  );
};

export default SubscriptionPage;

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { MyOrders } from "@/modules/orders/ui/MyOrders";

const OrdersPage = async () => {
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth");
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Đơn hàng của tôi</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý và theo dõi đơn hàng của bạn
        </p>
      </div>

      <MyOrders />
    </div>
  );
};

export default OrdersPage;

import { api } from "@/server/server";
import { OrderManagement } from "@/modules/vendor/orders/ui/OrderManagement";

const VendorOrdersPage = async () => {
  const caller = await api();

  // Fetch initial data ở server
  const [ordersData, stats] = await Promise.all([
    caller.order.getVendorOrders({ limit: 20 }),
    caller.order.getVendorOrderStats(),
  ]);

  console.log("=== VENDOR ORDERS DEBUG ===");
  console.log("Total orders:", ordersData?.orders?.length);
  console.log("Stats:", stats);

  // Convert Decimal to number để serialize cho client
  const serializedOrders = {
    ...ordersData,
    orders: ordersData.orders.map((order: any) => ({
      ...order,
      subtotal: order.subtotal?.toNumber() ?? 0,
      discountTotal: order.discountTotal?.toNumber() ?? 0,
      shippingFee: order.shippingFee?.toNumber() ?? 0,
      taxTotal: order.taxTotal?.toNumber() ?? 0,
      total: order.total?.toNumber() ?? 0,
      couponValue: order.couponValue?.toNumber() ?? 0,
      OrderItem: order.OrderItem.map((item: any) => ({
        ...item,
        price: item.price?.toNumber() ?? 0,
        comparePrice: item.comparePrice?.toNumber() ?? 0,
        lineTotal: item.lineTotal?.toNumber() ?? 0,
      })),
    })),
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Quản lý đơn hàng</h1>
      <OrderManagement initialData={serializedOrders} initialStats={stats} />
    </div>
  );
};

export default VendorOrdersPage;

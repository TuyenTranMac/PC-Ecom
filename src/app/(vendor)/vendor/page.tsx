import { api } from "@/server/server";
import { StatsCard } from "@/modules/admin/dashboard/ui/StatsCard";
import { RevenueChart } from "@/modules/vendor/dashboard/ui/RevenueChart";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const VendorDashboardPage = async () => {
  const caller = await api();
  const products = await caller.product.getMyProducts();
  const revenueData = await caller.order.getVendorRevenueByMonth();

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => !p.isArchived).length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockProducts = products.filter((p) => p.stock < 10).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Tổng quan cửa hàng của bạn</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Tổng sản phẩm"
          value={totalProducts}
          iconName="Package"
          description="Tất cả sản phẩm"
        />
        <StatsCard
          title="Đang bán"
          value={activeProducts}
          iconName="CheckCircle"
          description="Sản phẩm đang hiển thị"
        />
        <StatsCard
          title="Tổng kho"
          value={totalStock}
          iconName="Archive"
          description="Tổng số lượng tồn kho"
        />
        <StatsCard
          title="Sắp hết hàng"
          value={lowStockProducts}
          iconName="AlertCircle"
          description="Sản phẩm < 10"
        />
      </div>

      <RevenueChart data={revenueData} />

      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Thao tác nhanh</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Button asChild variant="outline" className="h-24 flex-col">
            <Link href="/vendor/products/new">
              <span className="text-lg font-semibold mb-2">
                Thêm sản phẩm mới
              </span>
              <span className="text-sm text-muted-foreground">
                Tạo sản phẩm để bán
              </span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-24 flex-col">
            <Link href="/vendor/products">
              <span className="text-lg font-semibold mb-2">
                Quản lý sản phẩm
              </span>
              <span className="text-sm text-muted-foreground">
                Xem, sửa, xóa sản phẩm
              </span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-24 flex-col">
            <Link href="/vendor/store">
              <span className="text-lg font-semibold mb-2">
                Cài đặt cửa hàng
              </span>
              <span className="text-sm text-muted-foreground">
                Thông tin & branding
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboardPage;

import { api } from "@/server/server";
import { StatsCard } from "@/modules/admin/dashboard/ui/StatsCard";
import {
  UsersIcon,
  StoreIcon,
  CrownIcon,
  TagIcon,
  PackageIcon,
} from "lucide-react";

const AdminDashboardPage = async () => {
  const caller = await api();
  const stats = await caller.admin.getStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Tổng quan hệ thống e-commerce</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Tổng người dùng"
          value={stats.totalUsers}
          iconName="Users"
          description="Tất cả users trong hệ thống"
        />
        <StatsCard
          title="Tổng Vendors"
          value={stats.totalVendors}
          iconName="Store"
          description="Vendors đang hoạt động"
        />
        <StatsCard
          title="Vendors dùng gói PRO"
          value={stats.proVendors}
          iconName="Crown"
          description="Subscription PRO active"
        />
        <StatsCard
          title="Danh mục"
          value={stats.totalCategories}
          iconName="Tag"
          description="Tổng số categories"
        />
        <StatsCard
          title="Sản phẩm"
          value={stats.totalProducts}
          iconName="Package"
          description="Tổng số sản phẩm"
        />
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Quản lý nhanh</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <a
            href="/admin/categories"
            className="rounded-lg border p-4 hover:bg-muted transition-colors"
          >
            <TagIcon className="h-8 w-8 mb-2 text-primary" />
            <h3 className="font-semibold">Quản lý danh mục</h3>
            <p className="text-sm text-muted-foreground">
              CRUD categories & subcategories
            </p>
          </a>
          <a
            href="/admin/users"
            className="rounded-lg border p-4 hover:bg-muted transition-colors"
          >
            <UsersIcon className="h-8 w-8 mb-2 text-primary" />
            <h3 className="font-semibold">Quản lý Users</h3>
            <p className="text-sm text-muted-foreground">
              Xem & chỉnh sửa thông tin users
            </p>
          </a>
          <a
            href="/admin/vendors"
            className="rounded-lg border p-4 hover:bg-muted transition-colors"
          >
            <StoreIcon className="h-8 w-8 mb-2 text-primary" />
            <h3 className="font-semibold">Quản lý Vendors</h3>
            <p className="text-sm text-muted-foreground">
              Xem vendors & subscription plans
            </p>
          </a>
          <a
            href="/admin/products"
            className="rounded-lg border p-4 hover:bg-muted transition-colors"
          >
            <PackageIcon className="h-8 w-8 mb-2 text-primary" />
            <h3 className="font-semibold">Quản lý Products</h3>
            <p className="text-sm text-muted-foreground">
              Xem & moderate sản phẩm
            </p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Store,
  Package,
  BarChart3,
  Settings,
  ExternalLink,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";

interface Store {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  banner: string | null;
  isActive: boolean;
  _count: {
    products: number;
  };
}

interface Stats {
  totalProducts: number;
  activeProducts: number;
  archivedProducts: number;
  featuredProducts: number;
  storeSlug: string;
  storeName: string;
}

interface Subscription {
  plan: string;
  status: string;
  maxProducts: number;
  maxImages: number;
}

interface DashboardContentProps {
  store: Store;
  stats: Stats;
  subscription: Subscription | null;
}

export const DashboardContent = ({
  store,
  stats,
  subscription,
}: DashboardContentProps) => {
  // Default values nếu subscription null
  const maxProducts = subscription?.maxProducts ?? 10;
  const maxImages = subscription?.maxImages ?? 3;
  const plan = subscription?.plan ?? "FREE";

  const isUnlimited = maxProducts === -1;
  const productUsagePercent = isUnlimited
    ? 0
    : (stats.totalProducts / maxProducts) * 100;

  return (
    <div className="space-y-8">
      {/* Store Info Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3 sm:items-center">
              <Store className="h-8 w-8 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <CardTitle className="truncate">{store.name}</CardTitle>
                <CardDescription className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm break-all">
                    {store.slug}.gear.org
                  </span>
                  <Badge variant={store.isActive ? "default" : "secondary"}>
                    {store.isActive ? "Hoạt động" : "Tạm ngưng"}
                  </Badge>
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="flex-1 sm:flex-none"
              >
                <Link href={`/dashboard/settings`}>
                  <Settings className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Cài đặt</span>
                </Link>
              </Button>
              <Button size="sm" asChild className="flex-1 sm:flex-none">
                <a
                  href={`/vendor/${store.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Xem cửa hàng</span>
                </a>
              </Button>
            </div>
          </div>
        </CardHeader>
        {store.description && (
          <CardContent>
            <p className="text-sm text-muted-foreground">{store.description}</p>
          </CardContent>
        )}
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {isUnlimited
                ? "Không giới hạn"
                : `${maxProducts - stats.totalProducts} còn lại`}
            </p>
            {!isUnlimited && (
              <div className="mt-3 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${Math.min(productUsagePercent, 100)}%` }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang bán</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Sản phẩm đang hoạt động
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nổi bật</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.featuredProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Sản phẩm được đánh dấu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gói hiện tại</CardTitle>
            <Badge variant={plan === "PRO" ? "default" : "secondary"}>
              {plan}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maxImages} ảnh</div>
            <p className="text-xs text-muted-foreground mt-1">Mỗi sản phẩm</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Hành động nhanh</CardTitle>
          <CardDescription>Các tác vụ thường dùng</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Button asChild className="h-auto flex-col py-6">
            <Link href={`/vendor/${store.slug}/dashboard/orders`}>
              <ShoppingCart className="mb-2 h-8 w-8" />
              <span className="text-base">Quản lý đơn hàng</span>
            </Link>
          </Button>
          <Button asChild className="h-auto flex-col py-6" variant="outline">
            <Link href="/vendor/products/new">
              <Package className="mb-2 h-8 w-8" />
              <span className="text-base">Thêm sản phẩm mới</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto flex-col py-6">
            <Link href="/vendor/products">
              <BarChart3 className="mb-2 h-8 w-8" />
              <span className="text-base">Quản lý sản phẩm</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-auto flex-col py-6 sm:col-span-2 lg:col-span-1"
          >
            <Link href="/vendor/settings">
              <Settings className="mb-2 h-8 w-8" />
              <span className="text-base">Cài đặt cửa hàng</span>
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Upgrade Notice if FREE plan */}
      {plan === "FREE" && productUsagePercent > 70 && (
        <Card className="border-orange-500 bg-orange-50 dark:bg-orange-950/10">
          <CardHeader>
            <CardTitle className="text-orange-700 dark:text-orange-400">
              Gần đạt giới hạn!
            </CardTitle>
            <CardDescription>
              Bạn đã sử dụng {stats.totalProducts}/{maxProducts} sản phẩm. sản
              phẩm. Nâng cấp lên gói PRO để thêm sản phẩm không giới hạn.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/subscription">Nâng cấp ngay</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

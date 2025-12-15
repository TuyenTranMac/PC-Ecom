"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/utils";
import {
  LayoutDashboardIcon,
  PackageIcon,
  UsersIcon,
  StoreIcon,
  TagIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    href: "/admin/categories",
    label: "Danh mục",
    icon: TagIcon,
  },
  {
    href: "/admin/users",
    label: "Người dùng",
    icon: UsersIcon,
  },
  {
    href: "/admin/vendors",
    label: "Vendors",
    icon: StoreIcon,
  },
  {
    href: "/admin/products",
    label: "Sản phẩm",
    icon: PackageIcon,
  },
];

export const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-card">
      <div className="p-6">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <p className="text-sm text-muted-foreground">Quản trị hệ thống</p>
      </div>

      <nav className="space-y-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Button
              key={item.href}
              asChild
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive && "bg-secondary font-semibold"
              )}
            >
              <Link href={item.href}>
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          );
        })}
      </nav>

      <div className="absolute bottom-0 w-64 border-t p-4">
        <Button variant="outline" className="w-full" asChild>
          <Link href="/">Về trang chủ</Link>
        </Button>
      </div>
    </aside>
  );
};


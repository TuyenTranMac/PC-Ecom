"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/server/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const MyOrders = () => {
  const trpc = useTRPC();

  const { data: orders, isLoading } = useQuery(
    trpc.order.getMyOrders.queryOptions()
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <Package className="text-muted-foreground h-16 w-16" />
        <h2 className="mt-4 text-xl font-semibold">Chưa có đơn hàng</h2>
        <p className="text-muted-foreground mt-2">Bạn chưa có đơn hàng nào</p>
        <Button className="mt-4" asChild>
          <Link href="/">Bắt đầu mua sắm</Link>
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      PENDING: "secondary",
      PROCESSING: "default",
      SHIPPING: "default",
      COMPLETED: "outline",
      CANCELLED: "destructive",
    };

    const labels: Record<string, string> = {
      PENDING: "Chờ xác nhận",
      PROCESSING: "Đang xử lý",
      SHIPPING: "Đang giao",
      COMPLETED: "Hoàn thành",
      CANCELLED: "Đã hủy",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getPaymentBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      PENDING: "secondary",
      PAID: "outline",
      FAILED: "destructive",
      REFUNDED: "secondary",
    };

    const labels: Record<string, string> = {
      PENDING: "Chưa thanh toán",
      PAID: "Đã thanh toán",
      FAILED: "Thất bại",
      REFUNDED: "Đã hoàn tiền",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {labels[status] || status}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4 text-muted-foreground" />
                    <p className="font-semibold">{order.Store.name}</p>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Mã đơn: {order.code}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {new Date(order.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {getStatusBadge(order.status)}
                {getPaymentBadge(order.paymentStatus)}
              </div>

              <div className="space-y-2">
                {order.OrderItem?.slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 text-sm"
                  >
                    <div className="bg-muted h-12 w-12 shrink-0 rounded">
                      {item.Product?.images &&
                        Array.isArray(item.Product.images) &&
                        item.Product.images[0] && (
                          <img
                            src={item.Product.images[0] as string}
                            alt={item.productName}
                            className="h-full w-full rounded object-cover"
                          />
                        )}
                    </div>
                    <div className="flex-1">
                      <p className="line-clamp-1">{item.productName}</p>
                      <p className="text-muted-foreground text-xs">
                        x{item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      {Number(item.lineTotal).toLocaleString("vi-VN")}₫
                    </p>
                  </div>
                ))}
                {order.OrderItem && order.OrderItem.length > 2 && (
                  <p className="text-muted-foreground text-sm">
                    và {order.OrderItem.length - 2} sản phẩm khác...
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-3 sm:text-right">
              <div>
                <p className="text-muted-foreground text-sm">Tổng tiền</p>
                <p className="text-xl font-bold text-primary">
                  {Number(order.total).toLocaleString("vi-VN")}₫
                </p>
              </div>

              <Button variant="outline" size="sm" asChild>
                <Link href={`/orders/${order.id}`}>Xem chi tiết</Link>
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

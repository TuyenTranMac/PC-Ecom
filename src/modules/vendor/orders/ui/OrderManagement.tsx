"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/app/(app)/trpcHelper/useTRPC";
import { useMutation } from "@tanstack/react-query";

type OrderStatus =
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

interface OrderManagementProps {
  initialData: any;
  initialStats: any;
}

export function OrderManagement({
  initialData,
  initialStats,
}: OrderManagementProps) {
  const router = useRouter();
  const trpc = useTRPC();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "ALL">(
    "ALL"
  );
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionStatus, setActionStatus] = useState<OrderStatus | null>(null);

  // Mutation để update order status
  const updateStatusMutation = useMutation(
    trpc.order.updateOrderStatus.mutationOptions({
      onSuccess: (data) => {
        toast.success(data.message);
        setIsDialogOpen(false);
        setSelectedOrder(null);
        router.refresh();
      },
      onError: (error: any) => {
        console.error("Update status error:", error);
        toast.error(error.message || "Không thể cập nhật trạng thái");
      },
    })
  );

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    const order = initialData?.orders.find((o: any) => o.id === orderId);
    setSelectedOrder(order);
    setActionStatus(newStatus);
    setIsDialogOpen(true);
  };

  const confirmUpdateStatus = () => {
    if (!selectedOrder || !actionStatus) return;

    console.log("Updating order:", {
      orderId: selectedOrder.id,
      status: actionStatus,
    });

    updateStatusMutation.mutate({
      orderId: selectedOrder.id,
      status: actionStatus,
    });
  };

  // Tính tổng tiền của order items thuộc shop
  const calculateOrderTotal = (orderItems: any[]) => {
    return orderItems.reduce((sum, item) => sum + item.lineTotal, 0);
  };

  // Filter orders by status
  const filteredOrders =
    selectedStatus === "ALL"
      ? initialData?.orders || []
      : initialData?.orders?.filter((o: any) => o.status === selectedStatus) ||
        [];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Chờ xác nhận
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {initialStats?.pending ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đang xử lý
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(initialStats?.confirmed ?? 0) + (initialStats?.processing ?? 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đang giao
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {initialStats?.shipped ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Doanh thu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(initialStats?.revenue ?? 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách đơn hàng</CardTitle>
            <Select
              value={selectedStatus}
              onValueChange={(value) =>
                setSelectedStatus(value as OrderStatus | "ALL")
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả</SelectItem>
                <SelectItem value="PENDING">Chờ xác nhận</SelectItem>
                <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>
                <SelectItem value="PROCESSING">Đang xử lý</SelectItem>
                <SelectItem value="SHIPPED">Đang giao</SelectItem>
                <SelectItem value="DELIVERED">Đã giao</SelectItem>
                <SelectItem value="CANCELLED">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order: any) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">
                    #{order.id.slice(0, 8)}
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-muted-foreground">
                      {order.User.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {order.OrderItem[0]?.Product?.images?.[0] && (
                        <Image
                          src={order.OrderItem[0].Product.images[0]}
                          alt="Product"
                          width={40}
                          height={40}
                          className="rounded object-cover"
                        />
                      )}
                      <div>
                        <div className="text-sm">
                          {order.OrderItem[0]?.Product?.name || "N/A"}
                        </div>
                        {order.OrderItem.length > 1 && (
                          <div className="text-xs text-muted-foreground">
                            +{order.OrderItem.length - 1} sản phẩm khác
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(calculateOrderTotal(order.OrderItem))}
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(order.createdAt), {
                      addSuffix: true,
                      locale: vi,
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {order.status === "PENDING" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() =>
                              handleUpdateStatus(order.id, "CONFIRMED")
                            }
                          >
                            Xác nhận
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleUpdateStatus(order.id, "CANCELLED")
                            }
                          >
                            Hủy
                          </Button>
                        </>
                      )}
                      {order.status === "CONFIRMED" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            handleUpdateStatus(order.id, "PROCESSING")
                          }
                        >
                          Xử lý
                        </Button>
                      )}
                      {order.status === "PROCESSING" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            handleUpdateStatus(order.id, "SHIPPED")
                          }
                        >
                          Giao hàng
                        </Button>
                      )}
                      {order.status === "SHIPPED" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            handleUpdateStatus(order.id, "DELIVERED")
                          }
                        >
                          Đã giao
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Không có đơn hàng nào
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận cập nhật trạng thái</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn cập nhật trạng thái đơn hàng #
              {selectedOrder?.id.slice(0, 8)} sang{" "}
              <strong>{actionStatus}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={confirmUpdateStatus}
              disabled={updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

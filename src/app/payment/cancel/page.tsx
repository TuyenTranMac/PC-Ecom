"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Payment Cancel Page
 * Callback URL từ SePay khi người dùng hủy thanh toán
 * URL: /payment/cancel?order={orderCode}
 */
export default function PaymentCancelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("order");

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex flex-col items-center space-y-4">
            <div className="rounded-full bg-yellow-100 p-3">
              <AlertCircle className="h-12 w-12 text-yellow-600" />
            </div>
            <CardTitle className="text-center text-2xl">
              Đã hủy thanh toán
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <p className="text-sm text-gray-600">Mã đơn hàng</p>
            <p className="text-lg font-bold">{orderCode || "N/A"}</p>
          </div>

          <p className="text-center text-sm text-gray-600">
            Bạn đã hủy thanh toán. Đơn hàng vẫn được giữ và bạn có thể tiếp tục
            thanh toán bất cứ lúc nào.
          </p>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              💡 <strong>Lưu ý:</strong> Đơn hàng sẽ tự động hủy sau 24 giờ nếu
              không được thanh toán.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={() => router.push(`/checkout?retry=${orderCode}`)}
              className="w-full"
            >
              Tiếp tục thanh toán
            </Button>
            <Button
              onClick={() => router.push("/orders")}
              variant="outline"
              className="w-full"
            >
              Xem đơn hàng
            </Button>
            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              className="w-full"
            >
              Về trang chủ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

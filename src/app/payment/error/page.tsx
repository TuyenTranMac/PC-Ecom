"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Payment Error Page
 * Callback URL từ SePay khi thanh toán thất bại
 * URL: /payment/error?order={orderCode}
 */
export default function PaymentErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("order");

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex flex-col items-center space-y-4">
            <div className="rounded-full bg-red-100 p-3">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
            <CardTitle className="text-center text-2xl">
              Thanh toán thất bại
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <p className="text-sm text-gray-600">Mã đơn hàng</p>
            <p className="text-lg font-bold">{orderCode || "N/A"}</p>
          </div>

          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">
              Giao dịch thanh toán không thành công. Vui lòng thử lại hoặc liên
              hệ hỗ trợ nếu vấn đề vẫn tiếp diễn.
            </p>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <p className="font-semibold">Nguyên nhân có thể:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>Số dư tài khoản không đủ</li>
              <li>Thông tin thanh toán không hợp lệ</li>
              <li>Hết thời gian giao dịch</li>
              <li>Lỗi hệ thống ngân hàng</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={() => router.push(`/checkout?retry=${orderCode}`)}
              className="w-full"
            >
              Thử lại thanh toán
            </Button>
            <Button
              onClick={() => router.push("/orders")}
              variant="outline"
              className="w-full"
            >
              Xem đơn hàng
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

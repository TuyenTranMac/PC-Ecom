"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Payment Success Page
 * Callback URL từ SePay khi thanh toán thành công
 * URL: /payment/success?order={orderCode}
 */
export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("order");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Clear cart
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cart-updated"));

    // Auto redirect sau 5s
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/orders");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex flex-col items-center space-y-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-center text-2xl">
              Thanh toán thành công!
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <p className="text-sm text-gray-600">Mã đơn hàng</p>
            <p className="text-lg font-bold">{orderCode || "N/A"}</p>
          </div>

          <p className="text-center text-sm text-gray-600">
            Đơn hàng của bạn đã được xác nhận thanh toán. Chúng tôi sẽ xử lý và
            giao hàng trong thời gian sớm nhất.
          </p>

          <div className="flex flex-col gap-2">
            <Button onClick={() => router.push("/orders")} className="w-full">
              Xem đơn hàng
            </Button>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="w-full"
            >
              Tiếp tục mua sắm
            </Button>
          </div>

          <p className="text-center text-xs text-gray-500">
            Tự động chuyển hướng sau {countdown}s...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

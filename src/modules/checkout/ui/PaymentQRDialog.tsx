"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Copy, Clock, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import type { PaymentQRData } from "@/lib/payment/sepay-webhooks.service";

interface PaymentQRDialogProps {
  open: boolean;
  onClose: () => void;
  paymentData: PaymentQRData;
  orderCode: string;
  onPaymentSuccess: () => void;
}

export const PaymentQRDialog = ({
  open,
  onClose,
  paymentData,
  orderCode,
  onPaymentSuccess,
}: PaymentQRDialogProps) => {
  const [countdown, setCountdown] = useState(600); // 10 minutes
  const [checking, setChecking] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (!open) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error("Hết thời gian thanh toán");
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open, onClose]);

  // Auto-check payment status every 3 seconds
  useEffect(() => {
    if (!open) return;

    const checkPayment = async () => {
      if (checking) return;

      try {
        setChecking(true);
        const response = await fetch(
          `/api/orders/check-payment?code=${orderCode}`
        );

        if (response.ok) {
          const data = await response.json();

          if (data.paid) {
            toast.success("Thanh toán thành công!");
            onPaymentSuccess();
            onClose();
          }
        }
      } catch (error) {
        console.error("Check payment error:", error);
      } finally {
        setChecking(false);
      }
    };

    // Check immediately
    checkPayment();

    // Then check every 3 seconds
    const interval = setInterval(checkPayment, 3000);

    return () => clearInterval(interval);
  }, [open, orderCode, checking, onPaymentSuccess, onClose]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã copy ${label}`);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Quét mã QR để thanh toán
          </DialogTitle>
          <DialogDescription>
            Thời gian còn lại:{" "}
            <span className="font-semibold text-primary">
              {formatTime(countdown)}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* QR Code */}
          <div className="flex justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6">
            <img
              src={paymentData.qrCodeUrl}
              alt="Payment QR Code"
              className="h-64 w-64"
            />
          </div>

          {/* Bank Info */}
          <div className="space-y-3 rounded-lg border bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Ngân hàng</span>
              <span className="font-semibold">{paymentData.bankName}</span>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Số tài khoản</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold">
                  {paymentData.accountNumber}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() =>
                    copyToClipboard(paymentData.accountNumber, "số tài khoản")
                  }
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Chủ tài khoản</span>
              <span className="font-semibold">{paymentData.accountName}</span>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Số tiền</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary">
                  {formatAmount(paymentData.amount)}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() =>
                    copyToClipboard(paymentData.amount.toString(), "số tiền")
                  }
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Nội dung CK</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-red-600">
                  {paymentData.content}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() =>
                    copyToClipboard(
                      paymentData.content,
                      "nội dung chuyển khoản"
                    )
                  }
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
            <div className="flex items-start gap-2 text-sm text-blue-800">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <div>
                <p className="font-semibold">Hướng dẫn:</p>
                <ol className="mt-1 list-inside list-decimal space-y-1 text-xs">
                  <li>Mở app ngân hàng của bạn</li>
                  <li>Quét mã QR hoặc nhập thông tin thủ công</li>
                  <li>
                    <strong>Không thay đổi</strong> nội dung chuyển khoản
                  </li>
                  <li>Xác nhận thanh toán</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Auto-checking indicator */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <RefreshCw
              className={`h-4 w-4 ${checking ? "animate-spin" : ""}`}
            />
            <span>Đang kiểm tra thanh toán tự động...</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Hủy
            </Button>
            <Button className="flex-1" onClick={() => window.location.reload()}>
              Tôi đã thanh toán
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

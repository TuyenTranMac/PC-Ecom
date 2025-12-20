import { NextRequest, NextResponse } from "next/server";
import { generatePaymentQR } from "@/lib/payment/sepay-webhooks.service";

/**
 * POST /api/sepay/generate-qr
 * Tạo QR code data cho thanh toán SePay Webhooks
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderCode, amount } = body;

    // Validate input
    if (!orderCode || !amount) {
      return NextResponse.json(
        { error: "Missing orderCode or amount" },
        { status: 400 }
      );
    }

    // Generate QR data
    const qrData = generatePaymentQR(orderCode, Math.round(amount));

    return NextResponse.json(qrData);
  } catch (error: any) {
    console.error("Generate QR error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import {
  generateCheckoutForm,
  createCheckoutData,
} from "@/lib/payment/sepay-gateway.service";

/**
 * POST /api/sepay/create-checkout
 * Tạo HTML form checkout SePay (server-side vì cần env variables)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderCode, orderTotal, baseUrl } = body;

    // Validate input
    if (!orderCode || !orderTotal || !baseUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!process.env.SEPAY_MERCHANT_ID || !process.env.SEPAY_SECRET_KEY) {
      console.error("Missing SePay credentials");
      return NextResponse.json(
        { error: "SePay not configured" },
        { status: 500 }
      );
    }

    // Create checkout data
    const checkoutData = createCheckoutData(
      {
        code: orderCode,
        total: parseFloat(orderTotal.toString()),
        description: `Thanh toán đơn hàng ${orderCode}`,
      },
      baseUrl
    );

    // Generate form HTML
    const environment =
      process.env.SEPAY_ENVIRONMENT === "production" ? "production" : "sandbox";
    const formHtml = generateCheckoutForm(checkoutData, environment);

    return NextResponse.json({
      success: true,
      formHtml,
    });
  } catch (error: any) {
    console.error("Create checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

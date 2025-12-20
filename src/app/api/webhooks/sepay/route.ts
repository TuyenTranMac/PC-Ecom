import { NextRequest, NextResponse } from "next/server";
import { prisma as db } from "@/server/db";
import {
  extractOrderCode,
  validatePayment,
  type WebhookPayload,
} from "@/lib/payment/sepay-webhooks.service";

/**
 * POST /api/webhooks/sepay
 * Webhook endpoint nhận thông báo từ SePay khi có giao dịch
 *
 * Docs: https://developer.sepay.vn/sepay-webhooks/tich-hop-webhook
 */
export const POST = async (req: NextRequest) => {
  try {
    console.log("🔔 SePay Webhook received");

    const payload: WebhookPayload = await req.json();
    console.log("📦 Webhook payload:", JSON.stringify(payload, null, 2));

    // 1. Extract order code from transfer content
    const orderCode = extractOrderCode(payload.content);
    if (!orderCode) {
      console.error("❌ No order code found in content:", payload.content);
      return NextResponse.json(
        { error: "Order code not found in transfer content" },
        { status: 400 }
      );
    }

    console.log("📝 Order code:", orderCode);

    // 2. Find order in database
    const order = await db.order.findFirst({
      where: { code: orderCode },
    });

    if (!order) {
      console.error("❌ Order not found:", orderCode);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    console.log("✅ Order found:", order.id);

    // 3. Check if already paid
    if (order.paymentStatus === "PAID") {
      console.log("⚠️ Order already paid, skipping");
      return NextResponse.json({
        success: true,
        message: "Order already paid",
      });
    }

    // 4. Validate payment
    const validation = validatePayment(
      payload,
      orderCode,
      parseFloat(order.total.toString())
    );

    if (!validation.valid) {
      console.error("❌ Payment validation failed:", validation.reason);
      return NextResponse.json({ error: validation.reason }, { status: 400 });
    }

    console.log("✅ Payment validated");

    // 5. Update order status
    await db.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "PAID",
        status: "CONFIRMED",
      },
    });

    console.log("✅ Order updated to PAID & CONFIRMED");

    // 6. Create payment record
    await db.payment.create({
      data: {
        orderId: order.id,
        amount: order.total,
        method: "BANK_TRANSFER",
        status: "PAID",
        transactionId: payload.referenceCode,
        payload: payload as any,
      },
    });

    console.log("✅ Payment record created");

    return NextResponse.json({
      success: true,
      message: "Payment processed successfully",
    });
  } catch (error: any) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
};

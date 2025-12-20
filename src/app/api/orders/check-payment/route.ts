import { NextRequest, NextResponse } from "next/server";
import { prisma as db } from "@/server/db";

/**
 * GET /api/orders/check-payment?code=ORD-xxx
 * Kiểm tra trạng thái thanh toán của đơn hàng
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const orderCode = searchParams.get("code");

    if (!orderCode) {
      return NextResponse.json(
        { error: "Missing order code" },
        { status: 400 }
      );
    }

    // Find order by code
    const order = await db.order.findFirst({
      where: { code: orderCode },
      select: {
        id: true,
        code: true,
        paymentStatus: true,
        status: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      paid: order.paymentStatus === "PAID",
      paymentStatus: order.paymentStatus,
      orderStatus: order.status,
    });
  } catch (error: any) {
    console.error("Check payment error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

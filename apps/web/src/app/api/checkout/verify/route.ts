import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus } from "@bites/db";
import { Cashfree, CFEnvironment } from "cashfree-pg";

Cashfree.XClientId = process.env.NEXT_PUBLIC_CASHFREE_APP_ID as string;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY as string;
Cashfree.XEnvironment = 
  process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT === "PRODUCTION" 
    ? CFEnvironment.PRODUCTION 
    : CFEnvironment.SANDBOX;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_id, cf_order_id } = body;

    if (!order_id || !cf_order_id) {
      return NextResponse.json({ success: false, error: "Missing order IDs" }, { status: 400 });
    }

    // Call Cashfree API to verify the order status
    const response = await Cashfree.PGOrderFetchPayments("2023-08-01", cf_order_id);
    const payments = response.data;

    if (!payments || payments.length === 0) {
      return NextResponse.json({ success: false, error: "No payments found for this order" }, { status: 404 });
    }

    // Check if any payment was successful
    const isPaid = payments.some(
      (payment: any) => payment.payment_status === "SUCCESS"
    );

    if (isPaid) {
      // Update our database status from 'pending' to 'preparing'
      await updateOrderStatus(Number(order_id), "preparing");
      return NextResponse.json({ success: true, status: "SUCCESS" });
    } else {
      return NextResponse.json({ success: true, status: "PENDING" });
    }
  } catch (error: any) {
    console.error("[POST /api/checkout/verify]", error?.response?.data || error);
    return NextResponse.json(
      { success: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@bites/db";
import { createOrderSchema } from "@bites/validators";
import { auth } from "@clerk/nextjs/server";
import { Cashfree, CFEnvironment } from "cashfree-pg";

Cashfree.XClientId = process.env.NEXT_PUBLIC_CASHFREE_APP_ID as string;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY as string;
Cashfree.XEnvironment = 
  process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT === "PRODUCTION" 
    ? CFEnvironment.PRODUCTION 
    : CFEnvironment.SANDBOX;

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // 1. Create a pending order in our database
    const order = await createOrder({
      ...parsed.data,
      clerk_user_id: userId,
    });

    // 2. Prepare the Cashfree order payload
    // Cashfree expects total amounts in numbers but depending on SDK sometimes string.
    // Ensure total is at least 1 for Cashfree, we assume total > 0.
    const requestPayload = {
      order_amount: parsed.data.total,
      order_currency: "INR",
      order_id: `ORDER_${order.id}_${Date.now()}`,
      customer_details: {
        customer_id: userId,
        customer_phone: "9999999999", // Usually collect this, hardcoding for demo
        customer_name: parsed.data.customer_name,
        customer_email: "customer@example.com"
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/verify?order_id=${order.id}&cf_order_id={order_id}`,
      },
    };

    // 3. Create the order in Cashfree
    const response = await Cashfree.PGCreateOrder("2023-08-01", requestPayload);
    
    // The response contains the payment_session_id required by the JS SDK
    if (response.data && response.data.payment_session_id) {
        return NextResponse.json({
          success: true,
          payment_session_id: response.data.payment_session_id,
          order_id: order.id, // Internal database order ID
        });
    } else {
        return NextResponse.json(
            { success: false, error: "Failed to generate payment session" },
            { status: 500 }
        );
    }
  } catch (error: any) {
    console.error("[POST /api/checkout/cashfree]", error?.response?.data || error);
    return NextResponse.json(
      { success: false, error: error?.response?.data?.message || error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

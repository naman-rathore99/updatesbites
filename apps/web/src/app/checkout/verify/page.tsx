"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useCartStore } from "@bites/store";

export default function VerifyPayment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const cfOrderId = searchParams.get("cf_order_id");

  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const clearCart = useCartStore((state: any) => state.clearCart);

  useEffect(() => {
    if (!orderId || !cfOrderId) {
      setStatus("failed");
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch("/api/checkout/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_id: orderId, cf_order_id: cfOrderId }),
        });
        
        const data = await res.json();
        
        if (data.success && data.status === "SUCCESS") {
          setStatus("success");
          clearCart();
          // Redirect to the order tracking page after a short delay
          setTimeout(() => {
            router.push(`/order/${orderId}`);
          }, 2000);
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.error("Verification failed:", error);
        setStatus("failed");
      }
    };

    verifyPayment();
  }, [orderId, cfOrderId, router, clearCart]);

  return (
    <main className="flex-1 flex flex-col items-center justify-center container mx-auto px-6 py-32 text-center">
      {status === "loading" && (
        <>
          <div className="w-24 h-24 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mb-8">
            <Loader2 className="w-12 h-12 animate-spin" />
          </div>
          <h1 className="font-display font-extrabold text-4xl text-neutral-900 mb-4">
            Verifying Payment...
          </h1>
          <p className="text-neutral-500 font-medium">
            Please don't close or refresh this page. We are confirming your order with the bank.
          </p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-8 animate-in zoom-in">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="font-display font-extrabold text-4xl text-neutral-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-neutral-500 font-medium">
            Your order has been sent to the kitchen. Redirecting to live tracking...
          </p>
        </>
      )}

      {status === "failed" && (
        <>
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-8">
            <XCircle className="w-12 h-12" />
          </div>
          <h1 className="font-display font-extrabold text-4xl text-neutral-900 mb-4">
            Payment Failed
          </h1>
          <p className="text-neutral-500 font-medium mb-8">
            We couldn't verify your payment. Please try again or contact support.
          </p>
          <button 
            onClick={() => router.push("/checkout")}
            className="px-8 py-4 bg-neutral-900 text-white text-xs font-bold tracking-widest rounded-full uppercase hover:bg-neutral-800 transition-colors"
          >
            Return to Checkout
          </button>
        </>
      )}
    </main>
  );
}

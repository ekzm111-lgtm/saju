type RefundPayload = {
  orderId: string;
  paymentId?: string;
  amount?: number;
  reason?: string;
};

export function isPortOneRefundConfigured() {
  return Boolean(
    process.env.PORTONE_API_SECRET &&
      process.env.NEXT_PUBLIC_PORTONE_STORE_ID
  );
}

export async function requestPortOneRefund({
  orderId,
  paymentId,
  amount,
  reason
}: RefundPayload) {
  if (!isPortOneRefundConfigured()) {
    return {
      ok: true,
      mode: "mock" as const,
      orderId,
      reason: reason ?? "관리자 환불"
    };
  }

  const { PaymentClient } = await import("@portone/server-sdk/payment");
  const paymentClient = PaymentClient({
    secret: process.env.PORTONE_API_SECRET as string
  });

  const targetPaymentId = paymentId ?? orderId;

  const cancelResponse = await paymentClient.cancelPayment({
    paymentId: targetPaymentId,
    reason: reason ?? "관리자 환불",
    amount
  });

  return {
    ok: true,
    mode: "live" as const,
    orderId,
    paymentId: targetPaymentId,
    reason: reason ?? "관리자 환불",
    cancelResponse
  };
}

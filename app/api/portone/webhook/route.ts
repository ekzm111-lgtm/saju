import { NextResponse } from "next/server";

import { updatePaymentFromWebhook } from "@/lib/orders";

export async function POST(request: Request) {
  const payload = await request.json();

  console.info("PortOne webhook payload received", payload);

  const data = payload as {
    type?: string;
    data?: {
      paymentId?: string;
      orderId?: string;
      txId?: string;
      status?: string;
      paidAt?: string;
      cancelledAt?: string;
      cancellation?: {
        reason?: string;
      };
    };
  };

  await updatePaymentFromWebhook({
    orderId: data.data?.orderId,
    paymentId: data.data?.paymentId,
    transactionId: data.data?.txId,
    status: data.data?.status,
    approvedAt: data.data?.paidAt,
    refundedAt: data.data?.cancelledAt,
    refundReason: data.data?.cancellation?.reason,
    payload
  });

  return NextResponse.json({ ok: true });
}

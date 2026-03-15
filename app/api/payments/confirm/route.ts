import { NextResponse } from "next/server";

import { markOrderPaid } from "@/lib/orders";

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.orderId) {
    return NextResponse.json(
      { ok: false, message: "orderId is required" },
      { status: 400 }
    );
  }

  await markOrderPaid({
    orderId: body.orderId,
    paymentId: body.paymentId,
    transactionId: body.transactionId,
    gatewayResponse: body.gatewayResponse
  });

  return NextResponse.json({ ok: true });
}

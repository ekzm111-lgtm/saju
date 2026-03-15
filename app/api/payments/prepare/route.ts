import { NextResponse } from "next/server";

import { createOrder } from "@/lib/orders";
import { createMockPaymentRequest } from "@/lib/payment";

export async function POST(request: Request) {
  const form = await request.json();
  const order = await createOrder(form);

  return NextResponse.json({
    ok: true,
    order,
    paymentRequest: createMockPaymentRequest({
      ...form,
      serviceSlug: order.serviceSlug
    })
  });
}


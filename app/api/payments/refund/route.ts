import { NextResponse } from "next/server";

import { requestPortOneRefund } from "@/lib/portone-server";

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.orderId) {
    return NextResponse.json(
      { ok: false, message: "orderId is required" },
      { status: 400 }
    );
  }

  const result = await requestPortOneRefund({
    orderId: body.orderId,
    reason: body.reason
  });

  return NextResponse.json({
    ok: result.ok,
    result
  });
}


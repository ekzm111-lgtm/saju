import { NextResponse } from "next/server";
import { performAIAnalysis } from "@/lib/analysis";

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ ok: false, message: "orderId is required" }, { status: 400 });
    }

    const result = await performAIAnalysis(orderId);
    return NextResponse.json({ ok: true, result });

  } catch (error: any) {
    console.error("[Analysis API Error]", error);
    return NextResponse.json({ 
      ok: false, 
      message: error.message || "AI 분석 중 오류가 발생했습니다." 
    }, { status: 500 });
  }
}

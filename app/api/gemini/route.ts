export const runtime = "nodejs";
import { rotatingCall } from "@/lib/ai-engine";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      prompt?: string;
      healthcheck?: boolean;
    };

    const isHealthcheck = !!body?.healthcheck;
    const prompt = body?.prompt?.trim() || "";

    if (!prompt && !isHealthcheck) {
      return json({ error: "prompt is required" }, 400);
    }

    const result = await rotatingCall(prompt, isHealthcheck);

    if (result.ok) {
      if (isHealthcheck) {
        return json({ ok: true, healthcheck: true, usedApi: result.usedApi });
      }
      return json({
        ok: true,
        result: result.result,
        raw: result.raw,
        usedApi: result.usedApi,
        triedApis: (result as any).triedApis,
      });
    }

    return json({
      ok: false,
      error: result.error,
      triedApis: (result as any).triedApis,
    }, result.status >= 400 && result.status < 600 ? result.status : 502);

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return json({ error: `Route error: ${message}` }, 500);
  }
}

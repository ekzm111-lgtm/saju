// ─────────────────────────────────────────
//  AI Engine (Rotation & Call Logic)
// ─────────────────────────────────────────

export type ApiName = "groq" | "gemini" | "gpt";
export type ApiResult =
  | { ok: true; result: any; raw: any; usedApi: ApiName }
  | { ok: false; status: number; error: string };

function parseAIJSON(text: string) {
  const cleaned = String(text || "").trim();
  try {
    // 1. 순수하게 JSON 부분만 정규식으로 추출 (Markdown 코드 블록 등 제거)
    // 맨 처음 '{' 부터 맨 마지막 '}' 까지 추출하여 JSON 파싱 시도
    const firstOpen = cleaned.indexOf("{");
    const lastClose = cleaned.lastIndexOf("}");
    
    if (firstOpen === -1 || lastClose === -1 || lastClose < firstOpen) {
      throw new Error("JSON 형식을 찾을 수 없음");
    }

    const jsonString = cleaned.substring(firstOpen, lastClose + 1);
    const parsed = JSON.parse(jsonString);

    // 2. 필수 필드가 있는지 검사 (예: 분석 결과 내용이 비었는지)
    if (!parsed || Object.keys(parsed).length === 0) {
      throw new Error("결과 데이터가 너무 짧거나 비어있음");
    }

    return parsed;
  } catch (e) {
    console.error("❌ 파싱 실패 원본:", text);
    throw e;
  }
}

async function callGroq(prompt: string, isHealthcheck: boolean): Promise<ApiResult> {
  const key = process.env.GROQ_API_KEY || "";
  if (!key) return { ok: false, status: 503, error: "Groq 키 없음" };

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: isHealthcheck
              ? "health-check"
              : "당신은 사주명리학 전문가입니다. 반드시 JSON 형식으로만 응답하세요.",
          },
          { role: "user", content: isHealthcheck ? "ping" : prompt },
        ],
        ...(isHealthcheck ? { max_tokens: 5 } : { response_format: { type: "json_object" } }),
      }),
    });

    const raw = await res.json();
    if (res.ok) {
      if (isHealthcheck) return { ok: true, result: null, raw, usedApi: "groq" };
      const text = raw?.choices?.[0]?.message?.content || "";
      if (!text) return { ok: false, status: 502, error: "Groq 응답 비어있음" };
      return { ok: true, result: parseAIJSON(text), raw, usedApi: "groq" };
    }
    return { ok: false, status: res.status, error: raw?.error?.message || "Groq 실패" };
  } catch (err: any) {
    return { ok: false, status: 500, error: err.message };
  }
}

async function callGemini(prompt: string, isHealthcheck: boolean, retryCount = 0): Promise<ApiResult> {
  const key = process.env.GEMINI_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
  const model = process.env.GEMINI_MODEL || process.env.GOOGLE_MODEL || "gemini-2.0-flash";
  if (!key) return { ok: false, status: 503, error: "Gemini 키 없음" };

  try {
    // URL을 v1에서 v1beta로 변경하여 모델 인식 문제 해결
    // gemini-2.0-flash-exp(실험적) 대신 안정적인 gemini-1.5-flash 사용
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: isHealthcheck ? "health-check" : prompt }] }],
          generationConfig: {
            // JSON 응답을 강제하여 파싱 에러(502) 방지
            response_mime_type: "application/json",
            maxOutputTokens: isHealthcheck ? 5 : 2048,
          },
        }),
      }
    );

    const raw = await res.json();

    if (res.ok) {
      if (isHealthcheck) return { ok: true, result: null, raw, usedApi: "gemini" };

      const text = raw?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        // Safety Filter 등에 의해 차단된 경우 대응
        return { ok: false, status: 502, error: "Gemini 응답이 비어있거나 차단되었습니다." };
      }
      return { ok: true, result: parseAIJSON(text), raw, usedApi: "gemini" };
    }

    // 할당량 초과(429) 시 재시도 로직
    if (res.status === 429 && retryCount < 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return callGemini(prompt, isHealthcheck, retryCount + 1);
    }

    return { ok: false, status: res.status, error: raw?.error?.message || "Gemini 실패" };
  } catch (err: any) {
    return { ok: false, status: 500, error: err.message };
  }
}

async function callGPT(prompt: string, isHealthcheck: boolean): Promise<ApiResult> {
  const key = process.env.chat_Gpt_KEY || process.env.OPENAI_API_KEY || "";
  if (!key) return { ok: false, status: 503, error: "GPT 키 없음" };

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: isHealthcheck ? "health-check" : prompt }],
        ...(isHealthcheck ? { max_tokens: 5 } : { response_format: { type: "json_object" } }),
      }),
    });

    const raw = await res.json();
    if (res.ok) {
      if (isHealthcheck) return { ok: true, result: null, raw, usedApi: "gpt" };
      const text = raw?.choices?.[0]?.message?.content || "";
      if (!text) return { ok: false, status: 502, error: "GPT 응답 비어있음" };
      return { ok: true, result: parseAIJSON(text), raw, usedApi: "gpt" };
    }
    return { ok: false, status: res.status, error: raw?.error?.message || "GPT 실패" };
  } catch (err: any) {
    return { ok: false, status: 500, error: err.message };
  }
}

let currentIndex = 0;

export async function rotatingCall(prompt: string, isHealthcheck = false): Promise<ApiResult & { triedApis?: ApiName[] }> {
  const apis: ApiName[] = [];
  if (process.env.GROQ_API_KEY) apis.push("groq");
  if (process.env.GEMINI_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) apis.push("gemini");
  if (process.env.chat_Gpt_KEY || process.env.OPENAI_API_KEY) apis.push("gpt");

  if (apis.length === 0) return { ok: false, status: 503, error: "AI API 키 없음" };

  const callers = { groq: callGroq, gemini: callGemini, gpt: callGPT };
  const triedApis: ApiName[] = [];
  const errors: string[] = [];

  for (let i = 0; i < apis.length; i++) {
    const idx = (currentIndex + i) % apis.length;
    const apiName = apis[idx];
    triedApis.push(apiName);

    const result = await callers[apiName](prompt, isHealthcheck);
    if (result.ok) {
      console.log(`✅ AI Rotation Success: [${apiName}] used.`);
      currentIndex = (idx + 1) % apis.length;
      return { ...result, triedApis };
    }
    // Rotate on ANY error to ensure maximum availability
    console.warn(`❌ AI Rotation Fail: [${apiName}] - ${result.status} ${result.error}`);
    errors.push(`${apiName}: ${result.error}`);
  }
  return { ok: false, status: 502, error: `모든 API 실패: ${errors.join(", ")}`, triedApis };
}

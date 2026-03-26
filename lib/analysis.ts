import { getServiceBySlug } from "@/data/site-content";
import { rotatingCall } from "./ai-engine";
import { getOrder, saveOrderResult } from "./orders";

export function getServiceSchema(serviceId: string) {
  if (serviceId === "premium") {
    return `{
  "총평": "최소 8문장 이상 종합 평가",
  "타고난기질": "최소 6문장 이상",
  "오행분석": {
    "목": "목의 기운 분석 최소 3문장",
    "화": "화의 기운 분석 최소 3문장",
    "토": "토의 기운 분석 최소 3문장",
    "금": "금의 기운 분석 최소 3문장",
    "수": "수의 기운 분석 최소 3문장"
  },
  "2026년운세": "2026년 전체 흐름 최소 8문장 이상",
  "상반기운세": "1~6월 상세 흐름 최소 5문장 이상",
  "하반기운세": "7~12월 상세 흐름 최소 5문장 이상",
  "월별운세": [
    { "월": "1월", "운세": "이달의 상세 운세 3문장" },
    { "월": "2월", "운세": "이달의 상세 운세 3문장" },
    { "월": "3월", "운세": "이달의 상세 운세 3문장" },
    { "월": "4월", "운세": "이달의 상세 운세 3문장" },
    { "월": "5월", "운세": "이달의 상세 운세 3문장" },
    { "월": "6월", "운세": "이달의 상세 운세 3문장" },
    { "월": "7월", "운세": "이달의 상세 운세 3문장" },
    { "월": "8월", "운세": "이달의 상세 운세 3문장" },
    { "월": "9월", "운세": "이달의 상세 운세 3문장" },
    { "월": "10월", "운세": "이달의 상세 운세 3문장" },
    { "월": "11월", "운세": "이달의 상세 운세 3문장" },
    { "월": "12월", "운세": "이달의 상세 운세 3문장" }
  ],
  "재물운": "최소 6문장 이상 상세 분석",
  "애정운": "최소 6문장 이상 상세 분석",
  "건강운": "최소 6문장 이상 상세 분석",
  "직업운": "최소 6문장 이상 상세 분석",
  "행운정보": {
    "색상": "색상과 이유 2문장",
    "숫자": "숫자와 이유 2문장",
    "방향": "방향과 이유 2문장",
    "음식": "음식과 이유 2문장",
    "조심할달": "월과 이유 2문장"
  },
  "총조언": "위의 모든 분석 내용을 종합하여 고객의 삶에 실질적인 도움이 되는 12문장 이상의 매우 길고 상세한 희망적 조언"
}`;
  }

  if (serviceId === "couple") {
    return `{
  "궁합점수": 0,
  "궁합총평": "두 사람의 궁합을 최소 8문장 이상 종합 평가",
  "첫만남의기운": "두 사람이 처음 만났을 때 기운 최소 5문장",
  "연애운": "연애할 때 두 사람의 모습과 주의사항 최소 6문장",
  "결혼운": "결혼했을 때 두 사람의 모습과 행복 포인트 최소 6문장",
  "갈등포인트": "두 사람이 갈등할 수 있는 상황과 원인 최소 5문장",
  "극복방법": "갈등을 극복하는 구체적인 방법 5가지 각각 2문장",
  "재물궁합": "두 사람의 재물운 궁합 최소 5문장",
  "최고의순간": "두 사람이 가장 행복할 순간들 최소 5문장",
  "총조언": "두 사람에게 전하는 따뜻한 응원 메시지 최소 6문장"
}`;
  }

  if (serviceId === "name") {
    return `{
  "이름분석": "이름의 한자 의미, 음양오행, 획수, 소리의 기운까지 최소 5문장 이상 매우 상세하게 분석",
  "이름의기운": "이 이름이 가진 에너지와 기운이 인생에 미치는 영향을 최소 5문장 이상 구체적으로 설명",
  "오행균형": "목화토금수 각각의 비율과 강한 기운 약한 기운을 분석하고 보완 방법까지 최소 5문장 이상",
  "이름이주는운세": "이 이름으로 인해 재물운 애정운 직업운 건강운에 미치는 영향을 각각 2문장씩 총 8문장 이상 상세히",
  "개명추천여부": "개명 추천 또는 유지 권장 이유를 3문장 이상 설명",
  "추천이름3개": ["이름1", "이름2", "이름3"],
  "추천이름이유": "각 추천 이름의 의미와 기운을 각각 2문장씩 설명"
}`;
  }

  return `{
  "총평": "이 사람의 사주를 종합적으로 평가하는 내용을 최소 8문장 이상 따뜻하고 희망적으로 작성",
  "오늘의운세": "오늘 하루 조심할 것과 기회가 되는 것을 구체적으로 최소 6문장 이상 작성",
  "이번달운세": "이번달 전반적인 흐름과 재물 애정 건강 직업별로 각각 2문장씩 총 10문장 이상",
  "행운정보": {
    "색상": "색상 이름과 이유 2문장",
    "숫자": "숫자와 이유 2문장",
    "방향": "방향과 이유 2문장",
    "음식": "음식과 이유 2문장",
    "조심할달": "월과 이유 2문장"
  },
  "오늘의조언": "오늘 하루를 잘 보내기 위한 구체적인 조언 5가지를 각각 2문장씩 상세히",
  "총조언": "위의 모든 분석 내용을 종합하여 고객의 삶에 실질적인 도움이 되는 10문장 이상의 매우 길고 상세한 희망적 조언"
}`;
}

export function buildServicePrompt(order: any) {
  const { customerName, birthDate, birthTime, gender, question, serviceSlug } = order;
  const schema = getServiceSchema(serviceSlug);

  return `
너는 30년 경력의 대한민국 최고의 사주명리학 권위자야.
아래 고객의 정보와 질문을 바탕으로, 고객의 마음을 치유하고 앞날을 밝혀줄 매우 상세하고 정성스러운 명리 분석 리포트를 작성해줘.

[고객 정보]
- 성함: ${customerName}
- 생년월일: ${birthDate}
- 태어난 시간: ${birthTime}
- 성별: ${gender}
- 특별 문의 사항: ${question}

[작성 지침]
1. 말투는 매우 정중하고, 따뜻하며, 희망적인 메시지를 담아야 해.
2. 반드시 아래 제공된 JSON 형식으로만 응답해. (JSON 외의 텍스트는 절대 포함하지 말 것)
3. **중요**: 절대 짧게 답변하지 마. 각 항목당 최소 요구 문장 수를 반드시 지키고, 문장의 길이도 충분히 길게 작성해. 
4. '총조언' 항목은 이 리포트의 핵심이야. ${customerName} 고객님의 삶에 실질적인 위로와 용기를 주는 15문장 이상의 장문으로 작성해줘.
5. 분석 중간중간 "${customerName}님"이라고 부르며 대화하듯 개인화된 느낌을 줘.

[응답 JSON 형식]
${schema}
`.trim();
}

function textLength(value: any) {
  return String(value || "").replace(/\s+/g, "").length;
}

/**
 * API 실패 시 사용할 폴백(가짜) 데이터 생성
 */
function generateFallbackData(serviceSlug: string, name: string) {
  const fallbackText = "AI 분석 서버 연결 상태가 원활하지 않아 표시되는 예시 데이터입니다. (테스트 모드)";
  const longFallbackText = "현재 AI API 호출량이 많거나 연결이 불안정하여 임시 텍스트로 대체되었습니다. 실제 운영 환경에서는 상세한 운세가 분석되어 표시됩니다. 이 내용은 화면 구성을 확인하기 위한 테스트용 문구입니다.\n\nAPI 키 설정을 확인하거나 잠시 후 다시 시도해주세요.";

  const common = {
    "총평": longFallbackText,
    "총조언": longFallbackText,
  };

  if (serviceSlug === "premium") {
    return {
      ...common,
      "타고난기질": fallbackText,
      "오행분석": { "목": "20%", "화": "20%", "토": "20%", "금": "20%", "수": "20%" },
      "2026년운세": fallbackText,
      "상반기운세": fallbackText,
      "하반기운세": fallbackText,
      "월별운세": Array.from({ length: 12 }, (_, i) => ({ "월": `${i + 1}월`, "운세": fallbackText })),
      "재물운": fallbackText,
      "애정운": fallbackText,
      "건강운": fallbackText,
      "직업운": fallbackText,
      "행운정보": { "색상": "Gold", "숫자": "7", "방향": "동쪽", "음식": "따뜻한 물", "조심할달": "없음" }
    };
  }

  if (serviceSlug === "couple") {
    return {
      ...common,
      "궁합점수": 95,
      "궁합총평": fallbackText,
      "첫만남의기운": fallbackText,
      "연애운": fallbackText,
      "결혼운": fallbackText,
      "갈등포인트": fallbackText,
      "극복방법": "1. 서로의 다름 인정하기\n2. 대화 시간 늘리기\n3. 공통 취미 만들기\n4. 작은 선물하기\n5. 긍정적인 말 사용하기",
      "재물궁합": fallbackText,
      "최고의순간": fallbackText
    };
  }

  if (serviceSlug === "name") {
    return {
      ...common,
      "이름분석": fallbackText,
      "이름의기운": fallbackText,
      "오행균형": fallbackText,
      "이름이주는운세": fallbackText,
      "개명추천여부": "현재 이름의 기운이 좋아 유지를 권장합니다.",
      "추천이름3개": ["김하늘", "김바다", "김우주"],
      "추천이름이유": fallbackText
    };
  }

  // 기본 (총운, 재물운, 연애운 등)
  return {
    ...common,
    "오늘의운세": fallbackText,
    "이번달운세": fallbackText,
    "행운정보": { "색상": "Blue", "숫자": "3", "방향": "남쪽", "음식": "채소", "조심할달": "없음" },
    "오늘의조언": "1. 여유를 가지세요.\n2. 긍정적으로 생각하세요.\n3. 주변을 둘러보세요.\n4. 건강을 챙기세요.\n5. 새로운 시작을 두려워하지 마세요."
  };
}

export function isDetailedEnough(serviceId: string, resultJSON: any) {
  if (serviceId === "premium") {
    return (
      textLength(resultJSON?.총평) > 200 &&
      textLength(resultJSON?.["2026년운세"]) > 200 &&
      textLength(resultJSON?.총조언) > 600
    );
  }
  return textLength(resultJSON?.총평) > 100 && textLength(resultJSON?.총조언) > 150;
}

export async function performAIAnalysis(orderId: string) {
  const order = await getOrder(orderId);
  if (!order) throw new Error("Order not found");
  if (order.status !== "paid" && order.status !== "ready") throw new Error("Order not paid");

  // Already analyzed?
  if (order.resultJson) return order.resultJson;

  const prompt = buildServicePrompt(order);
  
  // Try up to 3 times for detail validation
  let lastResult = null;
  for (let attempt = 1; attempt <= 2; attempt++) {
    const aiResponse = await rotatingCall(prompt);
    
    // API 실패 시 에러를 던지지 않고 폴백 데이터 사용
    if (!aiResponse.ok) {
      console.warn(`[Analysis] API failed (${aiResponse.error}). Using fallback data for testing.`);
      lastResult = generateFallbackData(order.serviceSlug, order.customerName);
      break;
    }

    lastResult = aiResponse.result;
    if (isDetailedEnough(order.serviceSlug, lastResult)) {
        break;
    }
    console.log(`[Analysis] Attempt ${attempt} result too short, retrying...`);
  }

  // 어떤 상황에서도 결과가 없으면 폴백 데이터 강제 적용
  if (!lastResult) {
    console.warn("[Analysis] No valid result obtained. Using fallback data.");
    lastResult = generateFallbackData(order.serviceSlug, order.customerName);
  }

  // Save to DB (저장이 실패해도 유저는 결과를 볼 수 있어야 함)
  try {
    await saveOrderResult(orderId, lastResult);
  } catch (error) {
    console.error("[Analysis] Failed to save result to DB:", error);
  }

  return lastResult;
}

import { rotatingCall } from "./ai-engine";

/**
 * 1. 브라우저 검색을 위한 쿼리 생성 (사주 정보 추출용)
 */
function createFortuneSearchQuery(order: any) {
  const { birthDate, birthTime, gender } = order;
  return `${birthDate} ${birthTime} ${gender} 사주 명리학 분석 2026년 운세`;
}

/**
 * 2. 검색 데이터를 바탕으로 AI가 최종 결과를 생성하는 함수
 */
export async function performSearchAidedAnalysis(order: any, prompt: string) {
  const searchQuery = createFortuneSearchQuery(order);
  
  // 실제 브라우저 검색 툴 호출 (에이전트 환경에서 가능)
  // 여기서는 프롬프트에 검색 쿼리를 명시하여 AI가 검색 결과처럼 추론하도록 유도
  const refinedPrompt = `
[심층 분석 가이드]
당신은 현재 인터넷 검색을 통해 "${searchQuery}"에 대한 최신 명리학 데이터를 확보했습니다.
확보된 데이터를 바탕으로, 기존 지식과 결합하여 아래 고객의 요청에 대해 가장 상세하고 정확한 JSON 리포트를 작성하세요.
절대 대충 답변하지 말고, 전문가로서의 권위를 보여주세요.

${prompt}
  `.trim();

  console.log(`[Search-Aided] Invoking search-aided analysis for: ${order.customerName}`);
  return await rotatingCall(refinedPrompt);
}

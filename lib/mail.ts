export type MailType = "payment" | "vip" | "contact";

export async function sendAdminNotificationMail(type: MailType, data: any) {
  // 실제 호스팅 환경 판별 기준 (Next.js 권장 VERCEL 환경 변수나 NODE_ENV 활용)
  const isTestMode = process.env.NODE_ENV !== "production" && !process.env.VERCEL_ENV;
  
  let subject = "";
  let body = "";

  if (type === "payment" || type === "vip") {
    const isVip = String(data.serviceTitle || data.serviceSlug || "").toUpperCase().includes("VIP") 
               || String(data.serviceSlug || "").toLowerCase() === "premium";
    const titleType = isVip ? "VIP신청" : "결제완료";
    subject = `[${titleType}] ${data.customerName || '고객'}님의 ${data.serviceTitle || '일반'} 신청 접수`;
    body = `
관리자님, 새로운 신청이 접수되었습니다.

- 고객명: ${data.customerName || '미상'}
- 연락처: ${data.customerPhone || '입력안함'}
- 이메일: ${data.customerEmail || '입력안함'}
- 서비스: ${data.serviceTitle || '미상'}
- 결제금액: ${Number(data.amount || 0).toLocaleString()}원
- 문의사항: ${data.question || "없음"}

관리자 대시보드에서 상세 내용을 확인 후 분석/진행해주세요.
    `.trim();
  } else if (type === "contact") {
    subject = `[고객문의] ${data.customerName || '고객'}님으로부터 새로운 문의 접수`;
    body = `
관리자님, 새로운 고객 문의가 접수되었습니다.

- 고객명: ${data.customerName || '미상'}
- 연락처: ${data.customerPhone || '입력안함'}
- 이메일: ${data.customerEmail || '입력안함'}
- 문의내용:
${data.question || "내용 없음"}

관리자 대시보드의 '문의/기타 관리' 탭에서 확인해주시고 답변을 진행해주세요.
    `.trim();
  }

  // 테스트 모드에서는 실제 메일서버를 태우지 않고 콘솔에만 기록
  if (isTestMode) {
    console.log("\n======================================");
    console.log("[TEST MODE] 이메일 발송 시뮬레이션 작동중");
    console.log(`수신자: admin@memoryfortune.com`);
    console.log(`제목: ${subject}`);
    console.log(`내용:\n${body}`);
    console.log("======================================\n");
    return;
  }

  // 실제 운영 배포 환경용 실제 발송 로직 스텁 (Nodemailer, Resend 등 연동 예정부)
  try {
    // 실제 결제 및 프로덕션 환경의 메일 전송이 시작될 때 적용됩니다.
    // [예시]
    // const transporter = nodemailer.createTransport({ ... });
    // await transporter.sendMail({ from, to: 'admin@memoryfortune.com', subject, text: body });
    
    // 현재는 프로덕션에서도 임시 로그 출력으로 대체해 둡니다.
    // 향후 메일 서비스를 결제하시면 이곳의 주석을 풀고 연동하시면 됩니다.
    console.log(`[MAIL] 실제 운영 환경 확인 - ${subject} 이메일 발송 요청됨`);
  } catch (err) {
    console.error(`[MAIL ERROR] 메일 전송 실패:`, err);
  }
}

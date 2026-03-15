import Image from "next/image";
import Link from "next/link";

import resultCardImage from "@/img/result-card.png";
import { SajuIcon } from "@/components/saju-icons";
import { StarBackground } from "@/components/star-background";
import { getServiceBySlug } from "@/data/site-content";
import { paymentMethodLabels, type PaymentMethod } from "@/lib/payment";
import type { OrderRecord } from "@/lib/orders";

type ResultPageProps = {
  serviceSlug?: string;
  customerName?: string;
  customerPhone?: string;
  question?: string;
  payMethod?: string;
  birthDate?: string;
  birthTime?: string;
  calendarType?: string;
  gender?: string;
  order?: OrderRecord | null;
};

function getCalendarLabel(type?: string) {
  if (type === "solar") return "양력";
  if (type === "lunar") return "음력";
  if (type === "lunar_leap") return "음력(윤달)";
  return "양력";
}

function getGenderLabel(gender?: string) {
  if (gender === "male") return "남성";
  if (gender === "female") return "여성";
  if (gender === "other") return "기타";
  return "미입력";
}

function getStatusLabel(status?: OrderRecord["status"]) {
  if (status === "paid") return "분석 완료";
  if (status === "ready") return "결제 대기";
  if (status === "failed") return "확인 필요";
  return "미리보기";
}

export function ResultPage({
  serviceSlug,
  customerName,
  customerPhone,
  question,
  payMethod,
  birthDate,
  birthTime,
  calendarType,
  gender,
  order
}: ResultPageProps) {
  const service = getServiceBySlug(serviceSlug ?? order?.serviceSlug);
  const name = customerName || order?.customerName || "고객님";
  const phone = customerPhone ?? order?.customerPhone ?? "";
  const resultBirthDate = birthDate ?? order?.birthDate ?? "";
  const resultBirthTime = birthTime ?? order?.birthTime ?? "";
  const resultCalendarType = calendarType ?? order?.calendarType ?? "solar";
  const resultGender = gender ?? order?.gender ?? "";
  const resultQuestion = question || order?.question || service.sampleQuestion;
  const payMethodLabel =
    paymentMethodLabels[
      ((payMethod as PaymentMethod) ?? order?.payMethod ?? "CARD") as PaymentMethod
    ] ?? paymentMethodLabels.CARD;

  return (
    <main className="subpage-shell cosmic-theme">
      <StarBackground />
      
      <header className="subpage-header">
        <Link href="/" className="brand">
          MEMORY <span className="text-grad">FORTUNE</span> AI
        </Link>
        <Link href={`/payment?service=${service.slug}`} className="cosmic-btn">
          다른 리포트 신청
        </Link>
      </header>

      <section className="result-hero section grid-2">
        <div className="result-visual">
          <div className="visual-container">
            <Image src={resultCardImage} alt="Analysis Result" className="result-img" priority />
            <div className="visual-glow" />
          </div>
        </div>
        <div className="result-copy">
          <span className="cosmic-badge">Personal Analysis Report</span>
          <h1 className="text-grad title-lg">{service.result.headline}</h1>
          <p className="hero-text">{service.result.summary}</p>
          
          <div className="meta-info-row">
            <div className="meta-item"><span className="m-label">대상</span><strong>{name}</strong></div>
            <div className="meta-item"><span className="m-label">리포트</span><strong>{service.shortTitle}</strong></div>
            <div className="meta-item"><span className="m-label">상태</span><strong className="text-secondary">{getStatusLabel(order?.status)}</strong></div>
          </div>

          <div className="hero-actions">
            <button className="prime-btn" onClick={() => window.print()}>
              리포트 저장하기
              <SajuIcon name="shield" className="btn-icon" />
            </button>
            <Link href="/" className="ghost-btn">홈으로 돌아가기</Link>
          </div>
        </div>
      </section>

      <section className="section highlight-section">
        <div className="content-grid bento-grid-mini">
          <div className="glass-card bento-card">
            <SajuIcon name={service.icon} className="bento-icon text-primary" />
            <h3>{service.title} 분석</h3>
            <p>{service.description}</p>
          </div>
          <div className="glass-card bento-card">
            <SajuIcon name="spark" className="bento-icon text-accent" />
            <h3>질문 기반 맞춤 해설</h3>
            <p>"{resultQuestion}"</p>
          </div>
        </div>
      </section>

      <section className="section details-section">
        <div className="content-grid detail-layout">
          <div className="glass-card detail-side">
            <h3 className="sub-title">입력 정보 요약</h3>
            <div className="summary-list-new">
              <div className="s-row"><span>이름</span><strong>{name}</strong></div>
              <div className="s-row"><span>생년월일</span><strong>{resultBirthDate} ({getCalendarLabel(resultCalendarType)})</strong></div>
              <div className="s-row"><span>성별</span><strong>{getGenderLabel(resultGender)}</strong></div>
              <div className="s-row"><span>태어난 시간</span><strong>{resultBirthTime}</strong></div>
            </div>
          </div>
          <div className="glass-card detail-main">
            <h3 className="sub-title">정밀 분석 타임라인</h3>
            <div className="insight-stack">
              {service.result.highlights.map((item, idx) => (
                <div className="insight-item-v2" key={idx}>
                  <div className="i-icon"><SajuIcon name={item.icon} /></div>
                  <div className="i-content">
                    <h4>{item.title}</h4>
                    <p>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section action-section">
        <div className="content-grid">
          <div className="glass-card cta-accent-box">
            <h2 className="title-md">전문가 제안 솔루션</h2>
            <ul className="action-list-new">
              {service.result.actions.map((act, i) => (
                <li key={i}>{act}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer className="site-footer-v2">
        <div className="content-grid">
          <p>© 2026 AI Saju Myeongin. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

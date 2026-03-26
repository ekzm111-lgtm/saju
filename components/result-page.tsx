"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resultData, setResultData] = useState<any>(null);

  const service = getServiceBySlug(serviceSlug ?? order?.serviceSlug);
  const name = customerName || order?.customerName || "고객님";
  const resultQuestion = question || order?.question || service.sampleQuestion;

  useEffect(() => {
    async function fetchAnalysis() {
      // If we already have a result in the order (cached), use it
      if (order?.resultJson) {
        setResultData(order.resultJson);
        setLoading(false);
        saveToLocalStorage(order.orderId, service.shortTitle);
        return;
      }

      // If no orderId, we can't do anything (unless we allow preview mode)
      if (!order?.orderId) {
        setError("주문 정보를 찾을 수 없습니다. 결제를 먼저 진행해 주세요.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: order.orderId })
        });
        const data = await response.json();

        if (data.ok) {
          setResultData(data.result);
          saveToLocalStorage(order.orderId, service.shortTitle);
        } else {
          setError(data.message || "분석 결과를 생성하는 중 오류가 발생했습니다.");
        }
      } catch (err) {
        setError("서버와의 통신에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      } finally {
        setLoading(false);
      }
    }

    fetchAnalysis();
  }, [order, service]);

  function saveToLocalStorage(orderId: string, title: string) {
    if (typeof window === "undefined") return;
    const history = JSON.parse(localStorage.getItem("fortune_history") || "[]");
    if (!history.find((item: any) => item.id === orderId)) {
      history.unshift({ id: orderId, title, date: new Date().toISOString() });
      localStorage.setItem("fortune_history", JSON.stringify(history.slice(0, 10)));
    }
  }

  if (loading) {
    return (
      <main className="subpage-shell cosmic-theme">
        <StarBackground />
        <div className="loading-full">
          <div className="loading-content">
            <div className="spinner-premium"></div>
            <h2 className="text-grad">운명의 지도를 그리는 중입니다...</h2>
            <div className="loading-steps">
                <p className="active">우주의 기운을 읽는 중...</p>
                <p>생년월시 데이터를 분석 중...</p>
                <p>당신만을 위한 조언을 작성 중...</p>
            </div>
            <p className="loading-sub">잠시만 기다려 주세요. 별의 목소리를 듣고 있습니다.</p>
          </div>
        </div>
        <style jsx>{`
          .loading-full {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
          }
          .spinner-premium {
            width: 80px;
            height: 80px;
            border: 3px solid rgba(212, 175, 55, 0.1);
            border-top: 3px solid var(--gold);
            border-radius: 50%;
            animation: spin 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
            margin: 0 auto 30px;
            box-shadow: 0 0 20px rgba(212, 175, 55, 0.2);
          }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          .loading-steps p { opacity: 0.3; margin: 10px 0; font-size: 1.1rem; }
          .loading-steps p.active { opacity: 1; animation: pulse 2s infinite; color: var(--gold); }
          @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
          .loading-sub { margin-top: 40px; font-size: 0.9rem; opacity: 0.6; letter-spacing: 0.1em; }
        `}</style>
      </main>
    );
  }

  if (error) {
    return (
      <main className="subpage-shell cosmic-theme">
        <StarBackground />
        <div className="error-container">
          <div className="error-card glass-card">
            <div className="error-icon">⚠️</div>
            <h2 className="text-grad">분석에 실패했습니다</h2>
            <p className="error-msg">{error}</p>
            <div className="refund-guide">
              <p>죄송합니다. AI 엔진의 일시적인 오류로 분석을 완료하지 못했습니다.</p>
              <div className="alert-box">
                <strong>고객님, 걱정 마세요!</strong>
                <p>분석 실패 시 결제 금액은 100% 환불 처리됩니다. 영업일 기준 1~3일 내에 환불이 완료되며, 문의사항은 아래 고객센터로 연락 주시기 바랍니다.</p>
              </div>
            </div>
            <div className="error-actions">
              <Link href="/" className="btn-gold-fill">홈으로 돌아가기</Link>
              <a href="mailto:support@memory-fortune.ai" className="ghost-btn">문의하기</a>
            </div>
          </div>
        </div>
        <style jsx>{`
          .error-container { height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
          .error-card { max-width: 500px; padding: 40px; text-align: center; border: 1px solid rgba(255, 0, 0, 0.2); }
          .error-icon { font-size: 3rem; margin-bottom: 20px; }
          .error-msg { color: #ff6b6b; margin-bottom: 30px; }
          .refund-guide { text-align: left; background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 12px; margin-bottom: 30px; font-size: 0.95rem; }
          .alert-box { border-top: 1px solid rgba(255, 255, 255, 0.1); margin-top: 15px; padding-top: 15px; color: var(--gold); }
          .error-actions { display: flex; gap: 15px; justify-content: center; }
        `}</style>
      </main>
    );
  }

  const result = resultData || {};
  const highlights = getHighlights(service.slug, result);

  return (
    <main className="subpage-shell cosmic-theme">
      <StarBackground />
      
      <header className="subpage-header">
        <Link href="/" className="brand">
          MEMORY <span className="text-grad">FORTUNE</span> AI
        </Link>
        <div className="header-actions">
          <Link href="/history" className="ghost-btn" style={{ marginRight: '10px' }}>나의 리포트</Link>
          <Link href={`/payment?service=${service.slug}`} className="cosmic-btn">다른 리포트 신청</Link>
        </div>
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
          <p className="hero-text">{result.총평 || service.result.summary}</p>
          
          <div className="meta-info-row">
            <div className="meta-item"><span className="m-label">대상</span><strong>{name}</strong></div>
            <div className="meta-item"><span className="m-label">리포트</span><strong>{service.shortTitle}</strong></div>
            <div className="meta-item"><span className="m-label">상태</span><strong className="text-secondary">분석 완료</strong></div>
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

      <section className="section details-section">
        <div className="content-grid detail-layout">
          <div className="glass-card detail-side">
            <h3 className="sub-title">우주 정렬 정보</h3>
            <div className="summary-list-new">
              <div className="s-row"><span>이름</span><strong>{name}</strong></div>
              <div className="s-row"><span>생년월일</span><strong>{birthDate || order?.birthDate} ({getCalendarLabel(calendarType || order?.calendarType)})</strong></div>
              <div className="s-row"><span>성별</span><strong>{getGenderLabel(gender || order?.gender)}</strong></div>
              <div className="s-row"><span>태어난 시간</span><strong>{birthTime || order?.birthTime}</strong></div>
            </div>
            
            {result.행운정보 && (
              <div className="lucky-box" style={{ marginTop: '30px' }}>
                <h4 style={{ color: 'var(--gold)', marginBottom: '15px' }}>행운의 요인</h4>
                <div className="s-row"><span>행운의 컬러</span><strong>{result.행운정보.색상}</strong></div>
                <div className="s-row"><span>행운의 숫자</span><strong>{result.행운정보.숫자}</strong></div>
                <div className="s-row"><span>행운의 방향</span><strong>{result.행운정보.방향}</strong></div>
              </div>
            )}
          </div>
          
          <div className="glass-card detail-main">
            <h3 className="sub-title">정밀 분석 리포트</h3>
            <div className="insight-stack">
              {highlights.map((item, idx) => (
                <div className="insight-item-v2" key={idx}>
                  <div className="i-icon"><SajuIcon name={item.icon} /></div>
                  <div className="i-content">
                    <h4>{item.title}</h4>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {result.총조언 && (
              <div className="total-advice glass-panel" style={{ marginTop: '40px', padding: '30px' }}>
                <h3 className="text-grad" style={{ marginBottom: '20px' }}>당신을 위한 별의 메세지</h3>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>{result.총조언}</p>
              </div>
            )}
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

function getHighlights(serviceSlug: string, result: any) {
  if (serviceSlug === "premium") {
    return [
      { title: "타고난 기질", body: result.타고난기질, icon: "spark" as const },
      { title: "2026년 운세 총평", body: result["2026년운세"], icon: "time" as const },
      { title: "재물운 분석", body: result.재물운, icon: "coins" as const },
      { title: "애정/인연운", body: result.애정운, icon: "heart" as const },
      { title: "직업/성공운", body: result.직업운, icon: "fire" as const }
    ];
  }
  if (serviceSlug === "couple") {
    return [
      { title: "궁합 총평", body: result.궁합총평, icon: "heart" as const },
      { title: "연애운 흐름", body: result.연애운, icon: "spark" as const },
      { title: "결혼/미래운", body: result.결혼운, icon: "time" as const },
      { title: "갈등과 극복", body: `${result.갈등포인트}\n\n${result.극복방법}`, icon: "shield" as const }
    ];
  }
  if (serviceSlug === "name") {
    return [
      { title: "이름 분석", body: result.이름분석, icon: "spark" as const },
      { title: "이름의 기운", body: result.이름의기운, icon: "dragon" as const },
      { title: "오행 균형", body: result.오행균형, icon: "leaf" as const },
      { title: "추천 이름", body: Array.isArray(result.추천이름3개) ? result.추천이름3개.join(", ") : "", icon: "wand" as const }
    ];
  }
  return [
    { title: "오늘의 운세", body: result.오늘의운세, icon: "sun" as const },
    { title: "이번 달 흐름", body: result.이번달운세, icon: "moon" as const },
    { title: "오늘의 조언", body: result.오늘의조언, icon: "spark" as const }
  ];
}

"use client";

import * as PortOne from "@portone/browser-sdk/v2";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { SajuIcon } from "@/components/saju-icons";
import { StarBackground } from "@/components/star-background";
import { getServiceBySlug, serviceCards } from "@/data/site-content";
import {
  buildResultQuery,
  paymentMethodLabels,
  type PaymentFormState,
  type PaymentMethod
} from "@/lib/payment";

type PaymentPageProps = {
  initialServiceSlug?: string;
};

const paymentMethods = Object.entries(paymentMethodLabels) as Array<
  [PaymentMethod, string]
>;

export function PaymentPage({ initialServiceSlug }: PaymentPageProps) {
  const router = useRouter();
  const defaultService = getServiceBySlug(initialServiceSlug);
  const [form, setForm] = useState<PaymentFormState>({
    serviceSlug: defaultService.slug,
    name: "",
    email: "",
    phone: "",
    birthDate: "",
    birthTime: "모름",
    calendarType: "solar",
    gender: "",
    question: defaultService.sampleQuestion,
    privacyConsent: false,
    marketingConsent: false,
    payMethod: "CARD"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const selectedService = getServiceBySlug(form.serviceSlug);

  function updateForm<Key extends keyof PaymentFormState>(
    key: Key,
    value: PaymentFormState[Key]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length < 4) return digits;
    if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }

  function formatBirthDate(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    if (digits.length < 5) return digits;
    if (digits.length < 7) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
  }

  function formatBirthTime(value: string) {
    const normalized = value.replace(/[^\d오전후: ]/g, "");
    const trimmed = normalized.trim();
    if (trimmed.startsWith("오전 ") || trimmed.startsWith("오후 ")) {
      const prefix = trimmed.startsWith("오전 ") ? "오전 " : "오후 ";
      const digits = trimmed.slice(3).replace(/\D/g, "").slice(0, 4);
      if (digits.length < 3) return `${prefix}${digits}`;
      return `${prefix}${digits.slice(0, 2)}:${digits.slice(2)}`;
    }
    const digits = trimmed.replace(/\D/g, "").slice(0, 4);
    if (digits.length < 3) return digits;
    return `${digits.slice(0, 2)}:${digits.slice(2)}`;
  }

  function handleServiceChange(serviceSlug: string) {
    const nextService = getServiceBySlug(serviceSlug);
    setForm((current) => ({
      ...current,
      serviceSlug: nextService.slug,
      question:
        current.question === "" || current.question === getServiceBySlug(current.serviceSlug).sampleQuestion
          ? nextService.sampleQuestion
          : current.question
    }));
  }

  function validateForm() {
    if (!form.privacyConsent) return "개인정보 수집 및 이용에 동의해주세요.";
    if (!form.name.trim()) return "이름을 입력해주세요.";
    if (!form.email.trim()) return "이메일을 입력해주세요.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return "이메일 형식이 올바르지 않습니다.";
    if (!form.phone.trim()) return "연락처를 입력해주세요.";
    if (!/^01[0-9]-?\d{3,4}-?\d{4}$/.test(form.phone.trim())) return "연락처 형식이 올바르지 않습니다.";
    if (!form.birthDate.trim()) return "생년월일을 입력해주세요.";
    if (!/^\d{8}$/.test(form.birthDate.trim())) return "생년월일 8자리를 숫자로만 입력해주세요. (예: 19900101)";
    if (!form.birthTime.trim()) return "출생 시간을 선택해주세요.";
    if (!form.gender) return "성별을 선택해주세요.";
    return "";
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");
    const validationError = validateForm();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/payments/prepare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const payload = await response.json();
      if (!payload.ok) throw new Error(payload.message ?? "결제 준비에 실패했습니다.");

      const hasPortOneKeys = payload.paymentRequest.storeId !== "store-id-required" && payload.paymentRequest.channelKey !== "channel-key-required";

      if (hasPortOneKeys) {
        const portoneResponse = await PortOne.requestPayment(payload.paymentRequest);
        const responseData = portoneResponse as any;
        if (responseData?.code) throw new Error(responseData.message ?? "결제가 취소되었거나 실패했습니다.");

        await fetch("/api/payments/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: payload.order.orderId,
            paymentId: responseData.paymentId ?? payload.paymentRequest.paymentId,
            transactionId: responseData.txId ?? responseData.transactionId,
            gatewayResponse: responseData
          })
        });
      } else {
        await fetch("/api/payments/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: payload.order.orderId,
            paymentId: payload.paymentRequest.paymentId,
            gatewayResponse: { mode: "mock" }
          })
        });
      }
      setIsSubmitting(false);

      if (hasPortOneKeys) {
        setIsLoadingAnalysis(true);
      }
      
      startTransition(() => {
        router.push(payload.order.resultLink ?? buildResultQuery(form));
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "결제 처리 중 오류가 발생했습니다.";
      setSubmitError(message);
      setIsSubmitting(false);
    }
  }

  return (
    <main className="subpage-shell checkout-theme">
      <StarBackground />
      
      <header className="subpage-header">
        <Link href="/" className="brand">
          MEMORY <span className="text-grad">FORTUNE</span> AI
        </Link>
        <Link href={`/result?service=${selectedService.slug}`} className="ghost-btn">
          샘플 확인하기
        </Link>
      </header>

      <section className="subpage-hero centered">
        <span className="cosmic-badge">Step 1 of 2</span>
        <h1 className="title-lg text-grad">당신의 데이터가 인생의 지도가 됩니다</h1>
        <p className="hero-text">맞춤형 분석을 위해 정확한 생년월일시 정보를 입력해주세요.</p>
      </section>

      <form className="checkout-layout content-grid" onSubmit={handleSubmit}>
        <div className="checkout-main">
          <div className="glass-card checkout-section">
            <h2 className="sub-title">상품 선택</h2>
            <div className="service-select-grid">
              {serviceCards.map((service) => (
                <label className={`service-item-v2 ${form.serviceSlug === service.slug ? 'active' : ''}`} key={service.slug}>
                  <input
                    type="radio"
                    name="service"
                    className="hidden-radio"
                    checked={form.serviceSlug === service.slug}
                    onChange={() => handleServiceChange(service.slug)}
                  />
                  <div className="s-icon-box"><SajuIcon name={service.icon} /></div>
                  <div className="s-meta">
                    <strong>{service.title}</strong>
                    <p>{service.summary}</p>
                  </div>
                  <span className="s-price">{service.priceLabel}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="glass-card checkout-section">
            <h2 className="sub-title">분석 대상 정보</h2>
            <div className="grid-form">
              <div className="form-group">
                <label>이름</label>
                <input type="text" placeholder="홍길동" value={form.name} onChange={(e) => updateForm("name", e.target.value)} />
              </div>
              <div className="form-group">
                <label>이메일</label>
                <input type="email" placeholder="example@email.com" value={form.email} onChange={(e) => updateForm("email", e.target.value)} />
              </div>
              <div className="form-group">
                <label>연락처</label>
                <input type="tel" placeholder="010-0000-0000" value={form.phone} onChange={(e) => updateForm("phone", formatPhone(e.target.value))} />
              </div>
              <div className="form-group">
                <label>생년월일 (8자리)</label>
                <input type="text" placeholder="19900101" value={form.birthDate} onChange={(e) => updateForm("birthDate", e.target.value.replace(/\D/g, "").slice(0, 8))} />
              </div>
              <div className="form-group">
                <label>양력/음력</label>
                <select value={form.calendarType} onChange={(e) => updateForm("calendarType", e.target.value as any)}>
                  <option value="solar">양력</option>
                  <option value="lunar">음력</option>
                  <option value="lunar_leap">음력(윤달)</option>
                </select>
              </div>
              <div className="form-group">
                <label>성별</label>
                <select value={form.gender} onChange={(e) => updateForm("gender", e.target.value as any)}>
                  <option value="">선택해주세요</option>
                  <option value="male">남성</option>
                  <option value="female">여성</option>
                </select>
              </div>
              <div className="form-group">
                <label>태어난 시간</label>
                <select value={form.birthTime} onChange={(e) => updateForm("birthTime", e.target.value)}>
                  <option value="모름">모름</option>
                  <option value="00:30">子 (00:30 ~ 01:30)</option>
                  <option value="02:30">丑 (01:30 ~ 03:30)</option>
                  <option value="04:30">寅 (03:30 ~ 05:30)</option>
                  <option value="06:30">卯 (05:30 ~ 07:30)</option>
                  <option value="08:30">辰 (07:30 ~ 09:30)</option>
                  <option value="10:30">巳 (09:30 ~ 11:30)</option>
                  <option value="12:30">午 (11:30 ~ 13:30)</option>
                  <option value="14:30">未 (13:30 ~ 15:30)</option>
                  <option value="16:30">申 (15:30 ~ 17:30)</option>
                  <option value="18:30">酉 (17:30 ~ 19:30)</option>
                  <option value="20:30">戌 (19:30 ~ 21:30)</option>
                  <option value="22:30">亥 (21:30 ~ 23:30)</option>
                </select>
              </div>
              <div className="form-group full">
                <label>집중 분석 질문</label>
                <textarea rows={3} placeholder="어떤 부분이 가장 궁금하신가요?" value={form.question} onChange={(e) => updateForm("question", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="glass-card checkout-section">
            <h2 className="sub-title">결제 수단</h2>
            <div className="pay-method-grid">
              {paymentMethods.map(([method, label]) => (
                <button
                  type="button"
                  className={`pay-btn ${form.payMethod === method ? "active" : ""}`}
                  key={method}
                  onClick={() => updateForm("payMethod", method)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside className="checkout-sidebar">
          <div className="glass-card summary-box sticky">
            <h3 className="sub-title">결제 요약</h3>
            <div className="summary-list-new">
              <div className="s-row"><span>분석 리포트</span><strong>{selectedService.shortTitle}</strong></div>
              <div className="s-row"><span>결제 수단</span><strong>{paymentMethodLabels[form.payMethod]}</strong></div>
              <div className="s-row total"><span>총 결제 금액</span><strong className="text-secondary">{selectedService.priceLabel}</strong></div>
            </div>
            <div className="consent-area">
              <label className="checkbox-wrap">
                <input type="checkbox" checked={form.privacyConsent} onChange={(e) => updateForm("privacyConsent", e.target.checked)} />
                <span>개인정보 수집 및 서비스 이용 동의 (필수) [약관보기]</span>
              </label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <button type="submit" className="btn-gold-fill" style={{ padding: '20px 60px', borderRadius: '12px' }} disabled={isSubmitting}>
                {isSubmitting ? "처리 중..." : "리포트 활성화 하기"}
              </button>
            </div>
            {submitError && <p className="error-text">{submitError}</p>}
          </div>
        </aside>
      </form>

      {isLoadingAnalysis && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="spinner-premium"></div>
            <h3>AI가 사주를 분석하고 있습니다...</h3>
            <p>잠시만 기다려 주세요. 당신의 운명을 별에게 묻는 중입니다.</p>
          </div>
        </div>
      )}
    </main>
  );
}

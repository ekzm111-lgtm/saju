import { getServiceBySlug } from "@/data/site-content";

export type PaymentMethod = "CARD" | "KAKAOPAY" | "NAVERPAY" | "TOSSPAY";

export type PaymentFormState = {
  serviceSlug: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  birthTime: string;
  calendarType: "solar" | "lunar" | "lunar_leap";
  gender: "male" | "female" | "other" | "";
  question: string;
  privacyConsent: boolean;
  marketingConsent: boolean;
  payMethod: PaymentMethod;
};

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  CARD: "카드",
  KAKAOPAY: "카카오페이",
  NAVERPAY: "네이버페이",
  TOSSPAY: "토스페이"
};

export function buildResultQuery(form: PaymentFormState) {
  const service = getServiceBySlug(form.serviceSlug);
  const params = new URLSearchParams({
    service: service.slug,
    name: form.name || "고객님",
    email: form.email,
    phone: form.phone,
    birthDate: form.birthDate,
    birthTime: form.birthTime,
    calendarType: form.calendarType,
    gender: form.gender,
    question: form.question,
    payMethod: form.payMethod
  });

  return `/result?${params.toString()}`;
}

export function createMockPaymentRequest(form: PaymentFormState) {
  const service = getServiceBySlug(form.serviceSlug);

  return {
    storeId: "channel-key-c60202c2-544c-49a4-8d5e-c15873d0f6a9", // Use provided key for store/channel identification
    channelKey: "channel-key-c60202c2-544c-49a4-8d5e-c15873d0f6a9",
    paymentId: `payment-${service.slug}-${Date.now()}`,
    orderName: service.title,
    totalAmount: service.price,
    currency: "CURRENCY_KRW",
    payMethod: form.payMethod,
    customer: {
      fullName: form.name,
      email: form.email,
      phoneNumber: form.phone
    },
    customData: {
      serviceSlug: service.slug,
      phone: form.phone,
      birthDate: form.birthDate,
      birthTime: form.birthTime,
      calendarType: form.calendarType,
      gender: form.gender,
      privacyConsent: form.privacyConsent,
      marketingConsent: form.marketingConsent,
      question: form.question
    },
    bypass: {
      kakaopay: { useInternalPayment: true },
      naverpay: { useCfmYmdt: "20261231" }
    }
  };
}

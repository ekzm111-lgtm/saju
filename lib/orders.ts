import { randomUUID } from "crypto";

import type { PaymentFormState } from "@/lib/payment";
import { createSupabaseServer, isSupabaseConfigured } from "@/lib/supabase";
import { getServiceBySlug } from "@/data/site-content";

export type OrderRecord = {
  orderId: string;
  paymentId: string;
  serviceSlug: string;
  serviceTitle: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  birthDate: string;
  birthTime: string;
  gender: string;
  question: string;
  calendarType: string;
  privacyConsent: boolean;
  marketingConsent: boolean;
  payMethod: PaymentFormState["payMethod"];
  status: "ready" | "paid" | "failed";
  resultLink: string;
  createdAt: string;
};

type PaymentConfirmationInput = {
  orderId: string;
  paymentId?: string;
  transactionId?: string;
  gatewayResponse?: unknown;
};

const memoryOrders = new Map<string, OrderRecord>();

export async function createOrder(form: PaymentFormState) {
  const service = getServiceBySlug(form.serviceSlug);
  const orderId = `order_${Date.now()}`;
  const paymentId = `payment_${randomUUID()}`;
  const params = new URLSearchParams({
    orderId,
    service: service.slug,
    name: form.name || "고객님",
    phone: form.phone,
    question: form.question,
    calendarType: form.calendarType,
    payMethod: form.payMethod,
    birthDate: form.birthDate,
    birthTime: form.birthTime,
    gender: form.gender
  });
  const resultLink = `/result?${params.toString()}`;

  const record: OrderRecord = {
    orderId,
    paymentId,
    serviceSlug: service.slug,
    serviceTitle: service.title,
    amount: service.price,
    customerName: form.name || "고객님",
    customerEmail: form.email,
    customerPhone: form.phone,
    birthDate: form.birthDate,
    birthTime: form.birthTime,
    gender: form.gender,
    question: form.question,
    calendarType: form.calendarType,
    privacyConsent: form.privacyConsent,
    marketingConsent: form.marketingConsent,
    payMethod: form.payMethod,
    status: "ready",
    resultLink,
    createdAt: new Date().toISOString()
  };

  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServer();
    await supabase.from("payments").insert({
      order_id: record.orderId,
      service_name: record.serviceTitle,
      user_name: record.customerName,
      user_email: record.customerEmail,
      amount: record.amount,
      payment_method: record.payMethod,
      status: record.status,
      payment_id: record.paymentId,
      result_link: record.resultLink,
      raw_payload: {
        paymentId: record.paymentId,
        phone: record.customerPhone,
        birthDate: record.birthDate,
        birthTime: record.birthTime,
        gender: record.gender,
        calendarType: record.calendarType,
        question: record.question,
        serviceSlug: record.serviceSlug
      }
    });
  } else {
    memoryOrders.set(record.orderId, record);
  }

  return record;
}

export async function markOrderPaid({
  orderId,
  paymentId,
  transactionId,
  gatewayResponse
}: PaymentConfirmationInput) {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServer();
    const { data } = await supabase
      .from("payments")
      .select("raw_payload")
      .eq("order_id", orderId)
      .maybeSingle();

    const rawPayload = {
      ...((data?.raw_payload as Record<string, unknown> | null) ?? {}),
      paymentId,
      transactionId,
      gatewayResponse
    };

    await supabase
      .from("payments")
      .update({
        status: "paid",
        payment_id: paymentId,
        paid_at: new Date().toISOString(),
        raw_payload: rawPayload
      })
      .eq("order_id", orderId);
    return;
  }

  const current = memoryOrders.get(orderId);
  if (current) {
    memoryOrders.set(orderId, {
      ...current,
      status: "paid",
      paymentId: paymentId ?? current.paymentId
    });
  }
}

export async function getOrder(orderId?: string | null) {
  if (!orderId) {
    return null;
  }

  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServer();
    const { data } = await supabase
      .from("payments")
      .select("*")
      .eq("order_id", orderId)
      .maybeSingle();
    return data;
  }

  return memoryOrders.get(orderId) ?? null;
}

export async function updatePaymentFromWebhook(input: {
  orderId?: string;
  paymentId?: string;
  transactionId?: string;
  status?: string;
  approvedAt?: string;
  refundedAt?: string;
  refundReason?: string;
  payload?: unknown;
}) {
  if (!isSupabaseConfigured()) {
    if (input.orderId) {
      const current = memoryOrders.get(input.orderId);
      if (current) {
        memoryOrders.set(input.orderId, {
          ...current,
          status:
            input.status === "PAID"
              ? "paid"
              : input.status === "CANCELLED"
                ? "failed"
                : current.status
        });
      }
    }
    return;
  }

  const supabase = await createSupabaseServer();
  let query = supabase.from("payments").update({
    status:
      input.status === "PAID"
        ? "paid"
        : input.status === "CANCELLED"
          ? "refunded"
          : input.status === "FAILED"
            ? "failed"
            : "ready",
    portone_payment_id: input.paymentId,
    portone_transaction_id: input.transactionId,
    approved_at: input.approvedAt,
    refunded_at: input.refundedAt,
    refund_reason: input.refundReason,
    raw_payload: input.payload
  });

  if (input.orderId) {
    query = query.eq("order_id", input.orderId);
  } else if (input.paymentId) {
    query = query.eq("portone_payment_id", input.paymentId);
  } else {
    return;
  }

  await query;
}

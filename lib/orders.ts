import { randomUUID } from "crypto";

import type { PaymentFormState } from "@/lib/payment";
import { createSupabaseServer, isSupabaseConfigured } from "@/lib/supabase";
import { getServiceBySlug } from "@/data/site-content";
import { sendAdminNotificationMail } from "./mail";

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
  status: "ready" | "paid" | "failed" | "refunded";
  resultLink: string;
  resultJson?: any;
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
      service_name_snapshot: record.serviceTitle,
      buyer_name: record.customerName,
      buyer_email: record.customerEmail,
      buyer_phone: record.customerPhone,
      amount: record.amount,
      payment_method: record.payMethod,
      status: record.status,
      portone_payment_id: record.paymentId,
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
        portone_payment_id: paymentId,
        approved_at: new Date().toISOString(),
        raw_payload: rawPayload
      })
      .eq("order_id", orderId);

    const { data: updatedRow } = await supabase.from("payments").select("*").eq("order_id", orderId).maybeSingle();
    if (updatedRow) {
      const p = updatedRow.raw_payload as any || {};
      const t = String(updatedRow.service_name_snapshot || "");
      const mailType = t.includes("문의") ? "contact" : t.includes("VIP") ? "vip" : "payment";
      await sendAdminNotificationMail(mailType, {
        customerName: updatedRow.buyer_name,
        customerPhone: updatedRow.buyer_phone || p.phone,
        customerEmail: updatedRow.buyer_email,
        serviceTitle: updatedRow.service_name_snapshot,
        amount: updatedRow.amount,
        question: p.question
      });
    }
    return;
  }

  const current = memoryOrders.get(orderId);
  if (current) {
    const nextRecord = {
      ...current,
      status: "paid" as const,
      paymentId: paymentId ?? current.paymentId
    };
    memoryOrders.set(orderId, nextRecord);
    
    const t = String(nextRecord.serviceTitle || "");
    const mailType = t.includes("문의") ? "contact" : t.includes("VIP") ? "vip" : "payment";
    await sendAdminNotificationMail(mailType, nextRecord);
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
    
    if (data) {
      const rawPayload = (data.raw_payload as any) || {};
      return {
        orderId: data.order_id,
        paymentId: data.portone_payment_id || rawPayload.paymentId,
        serviceSlug: rawPayload.serviceSlug,
        serviceTitle: data.service_name_snapshot,
        amount: data.amount,
        customerName: data.buyer_name,
        customerEmail: data.buyer_email,
        customerPhone: data.buyer_phone || rawPayload.phone,
        birthDate: rawPayload.birthDate,
        birthTime: rawPayload.birthTime,
        gender: rawPayload.gender,
        question: rawPayload.question,
        calendarType: rawPayload.calendarType,
        privacyConsent: rawPayload.privacyConsent,
        marketingConsent: rawPayload.marketingConsent,
        payMethod: data.payment_method,
        status: data.status,
        resultLink: data.result_link,
        resultJson: data.result_json,
        createdAt: data.created_at
      } as OrderRecord;
    }
    return null;
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

export async function saveOrderResult(orderId: string, resultJson: any) {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServer();
    const { error } = await supabase
      .from("payments")
      .update({
        result_json: resultJson,
        status: "paid"
      })
      .eq("order_id", orderId);
    
    if (error) throw error;
    return;
  }

  const current = memoryOrders.get(orderId);
  if (current) {
    memoryOrders.set(orderId, {
      ...current,
      resultJson
    });
  }
}

"use client";

import type { FormEvent } from "react";

import { refundPayment } from "@/app/admin/actions";

type PaymentActionButtonsProps = {
  orderId: string;
  status: string;
  redirectTo?: string;
};

function confirmAction(event: FormEvent<HTMLFormElement>, message: string) {
  if (!window.confirm(message)) {
    event.preventDefault();
  }
}

export function PaymentActionButtons({
  orderId,
  status,
  redirectTo = "/admin/payments"
}: PaymentActionButtonsProps) {
  const isRefundable = status === "paid";

  return (
    <div className="admin-action-group">
      <button type="button" className="admin-action-button admin-action-muted" disabled>
        상세
      </button>
      <form
        onSubmit={(event) => confirmAction(event, "이 결제를 환불 처리할까요?")}
        action={async () => {
          if (isRefundable) {
            await refundPayment(orderId, redirectTo);
          }
        }}
      >
        <button
          type="submit"
          className="admin-action-button admin-action-danger"
          disabled={!isRefundable}
        >
          환불
        </button>
      </form>
    </div>
  );
}

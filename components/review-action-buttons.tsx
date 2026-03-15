"use client";

import type { FormEvent } from "react";

import { softDeleteReview, toggleReviewVisibility } from "@/app/admin/actions";

type ReviewActionButtonsProps = {
  reviewId: string;
  visible: boolean;
  redirectTo?: string;
};

function confirmAction(event: FormEvent<HTMLFormElement>, message: string) {
  if (!window.confirm(message)) {
    event.preventDefault();
  }
}

export function ReviewActionButtons({
  reviewId,
  visible,
  redirectTo = "/admin/reviews"
}: ReviewActionButtonsProps) {
  return (
    <div className="admin-action-group">
      <form
        onSubmit={(event) =>
          confirmAction(
            event,
            visible ? "이 후기를 랜딩에서 숨길까요?" : "이 후기를 랜딩에 노출할까요?"
          )
        }
        action={async () => {
          await toggleReviewVisibility(reviewId, visible, redirectTo);
        }}
      >
        <button type="submit" className="admin-action-button admin-action-warn">
          {visible ? "숨김" : "노출"}
        </button>
      </form>
      <form
        onSubmit={(event) => confirmAction(event, "이 후기를 삭제할까요?")}
        action={async () => {
          await softDeleteReview(reviewId, redirectTo);
        }}
      >
        <button type="submit" className="admin-action-button admin-action-danger">
          삭제
        </button>
      </form>
    </div>
  );
}

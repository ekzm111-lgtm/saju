"use client";

import type { FormEvent } from "react";
import Link from "next/link";

import { softDeleteService, toggleServiceStatus } from "@/app/admin/actions";

type ServiceActionButtonsProps = {
  serviceId: string;
  slug: string;
  status: string;
  redirectTo?: string;
};

function confirmAction(event: FormEvent<HTMLFormElement>, message: string) {
  if (!window.confirm(message)) {
    event.preventDefault();
  }
}

export function ServiceActionButtons({
  serviceId,
  slug,
  status,
  redirectTo = "/admin/services"
}: ServiceActionButtonsProps) {
  const isActive = status === "active";

  return (
    <div className="admin-action-group">
      <Link href={`/payment?service=${slug}`} className="admin-action-link">
        미리보기
      </Link>
      <Link href={`/admin/services?edit=${slug}`} className="admin-action-link">
        수정
      </Link>
      <form
        onSubmit={(event) =>
          confirmAction(
            event,
            isActive ? "이 서비스를 비활성화할까요?" : "이 서비스를 다시 활성화할까요?"
          )
        }
        action={async () => {
          await toggleServiceStatus(serviceId, status, redirectTo);
        }}
      >
        <button type="submit" className="admin-action-button admin-action-warn">
          {isActive ? "비활성화" : "활성화"}
        </button>
      </form>
      <form
        onSubmit={(event) => confirmAction(event, "이 서비스를 숨김 처리할까요?")}
        action={async () => {
          await softDeleteService(serviceId, redirectTo);
        }}
      >
        <button type="submit" className="admin-action-button admin-action-danger">
          숨김
        </button>
      </form>
    </div>
  );
}

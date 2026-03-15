"use client";

import type { FormEvent } from "react";

import { deleteAdminUser, toggleAdminStatus } from "@/app/admin/actions";

type AdminUserActionButtonsProps = {
  adminId: string;
  status: string;
  redirectTo?: string;
};

function confirmAction(event: FormEvent<HTMLFormElement>, message: string) {
  if (!window.confirm(message)) {
    event.preventDefault();
  }
}

export function AdminUserActionButtons({
  adminId,
  status,
  redirectTo = "/admin/admins"
}: AdminUserActionButtonsProps) {
  const isActive = status === "active";

  return (
    <div className="admin-action-group">
      <form
        onSubmit={(event) =>
          confirmAction(
            event,
            isActive ? "이 관리자 계정을 비활성화할까요?" : "이 관리자 계정을 다시 활성화할까요?"
          )
        }
        action={async () => {
          await toggleAdminStatus(adminId, status, redirectTo);
        }}
      >
        <button type="submit" className="admin-action-button admin-action-warn">
          {isActive ? "비활성화" : "활성화"}
        </button>
      </form>
      <form
        onSubmit={(event) => confirmAction(event, "이 관리자 계정을 비활성 처리할까요?")}
        action={async () => {
          await deleteAdminUser(adminId, redirectTo);
        }}
      >
        <button type="submit" className="admin-action-button admin-action-danger">
          비활성 처리
        </button>
      </form>
    </div>
  );
}

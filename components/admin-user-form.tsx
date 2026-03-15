"use client";

import { useActionState } from "react";

import { saveAdminUserAction } from "@/app/admin/actions";

type AdminUserFormProps = {
  initialValues?: {
    name?: string;
    email?: string;
    role?: string;
    status?: string;
  };
};

export function AdminUserForm({ initialValues }: AdminUserFormProps) {
  const [state, formAction, isPending] = useActionState(saveAdminUserAction, undefined);

  return (
    <form action={formAction} className="admin-inline-form">
      <input name="name" placeholder="이름" defaultValue={initialValues?.name} />
      <input
        name="email"
        type="email"
        placeholder="이메일"
        defaultValue={initialValues?.email}
      />
      <select name="role" defaultValue={initialValues?.role ?? "viewer"}>
        <option value="super_admin">super_admin</option>
        <option value="admin">admin</option>
        <option value="viewer">viewer</option>
      </select>
      <select name="status" defaultValue={initialValues?.status ?? "active"}>
        <option value="active">active</option>
        <option value="inactive">inactive</option>
      </select>
      {state?.error ? <p className="form-error">{state.error}</p> : null}
      {state?.success ? <p className="form-success">{state.success}</p> : null}
      <button type="submit" className="primary-button" disabled={isPending}>
        {isPending ? "저장 중..." : "관리자 저장"}
      </button>
    </form>
  );
}

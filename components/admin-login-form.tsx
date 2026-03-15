"use client";

import { useActionState } from "react";

import { signInAdmin } from "@/app/admin/login/actions";

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(signInAdmin, undefined);

  return (
    <form action={formAction} className="admin-login-form">
      <label>
        이메일
        <input type="email" name="email" placeholder="admin@example.com" />
      </label>
      <label>
        비밀번호
        <input type="password" name="password" placeholder="비밀번호 입력" />
      </label>
      {state?.error ? <p className="form-error">{state.error}</p> : null}
      <button type="submit" className="primary-button full-width" disabled={isPending}>
        {isPending ? "로그인 중..." : "관리자 로그인"}
      </button>
    </form>
  );
}

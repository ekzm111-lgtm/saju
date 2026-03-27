"use client";

import { useActionState } from "react";

import { signInAdmin } from "@/app/admin/login/actions";

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(signInAdmin, undefined);

  return (
    <form action={formAction} className="admin-login-form">
      <label>
        아이디
        <input type="text" name="loginId" placeholder="관리자 아이디 입력" autoComplete="username" />
      </label>
      <label>
        비밀번호
        <input
          type="password"
          name="password"
          placeholder="비밀번호 입력"
          autoComplete="current-password"
        />
      </label>
      {state?.error ? <p className="form-error">{state.error}</p> : null}
      <button type="submit" className="primary-button full-width" disabled={isPending}>
        {isPending ? "로그인 중..." : "관리자 로그인"}
      </button>
    </form>
  );
}

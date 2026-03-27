import { AdminLoginForm } from "@/components/admin-login-form";

export default function AdminLoginPage() {
  return (
    <main className="admin-login-shell">
      <section className="admin-login-card">
        <p className="eyebrow">Admin Access</p>
        <h1>사주명인 관리자 로그인</h1>
        <p className="admin-login-copy">
          관리자 아이디로 로그인하면 서비스, 결제, 후기, 관리자 계정을 관리할 수 있습니다.
        </p>
        <AdminLoginForm />
        <p className="admin-login-hint">현재 등록된 관리자 계정 예시: `1111` / `1111`</p>
      </section>
    </main>
  );
}

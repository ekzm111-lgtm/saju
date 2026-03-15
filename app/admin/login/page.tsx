import { AdminLoginForm } from "@/components/admin-login-form";

export default function AdminLoginPage() {
  return (
    <main className="admin-login-shell">
      <section className="admin-login-card">
        <p className="eyebrow">Admin Access</p>
        <h1>사주명인 관리자 로그인</h1>
        <p className="admin-login-copy">
          운영자 계정으로 로그인하면 서비스, 결제, 후기, 관리자 계정을 관리할 수 있습니다.
        </p>
        <AdminLoginForm />
        <p className="admin-login-hint">
          로컬 테스트용 기본 계정: `admin@sajumyeongin.local` / `admin1234`
        </p>
      </section>
    </main>
  );
}

import Link from "next/link";

import { signOutAdmin } from "@/app/admin/login/actions";
import { requireAdmin } from "@/lib/admin";
import { getAdminRoleLabel } from "@/lib/admin-data";

const adminMenu = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/services", label: "서비스 관리" },
  { href: "/admin/payments", label: "결제 내역" },
  { href: "/admin/reviews", label: "후기 관리" },
  { href: "/admin/admins", label: "관리자 계정" }
];

export default async function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const admin = await requireAdmin();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-brand">
          사주명인 Admin
        </Link>
        <nav className="admin-nav">
          {adminMenu.map((item) => (
            <Link key={item.href} href={item.href} className="admin-nav-link">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <p className="admin-sidebar-copy">
            {admin.name}
            <br />
            {getAdminRoleLabel(admin.role)}
          </p>
          <form action={signOutAdmin}>
            <button type="submit" className="secondary-button compact-button full-width">
              로그아웃
            </button>
          </form>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}

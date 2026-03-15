import { AdminStatusBadge } from "@/components/admin-status-badge";
import { AdminToast } from "@/components/admin-toast";
import { AdminUserActionButtons } from "@/components/admin-user-action-buttons";
import { AdminUserForm } from "@/components/admin-user-form";
import { getAdminRoleLabel, getAdminUsers } from "@/lib/admin-data";
import { requireAdminRole } from "@/lib/admin";

export default async function AdminAdminsPage({
  searchParams
}: {
  searchParams: Promise<{ toast?: string; tone?: string }>;
}) {
  await requireAdminRole(["super_admin"]);
  const params = await searchParams;
  const admins = await getAdminUsers();

  return (
    <section className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="eyebrow">Admin Accounts</p>
          <h1>관리자 계정 관리</h1>
        </div>
      </div>
      <AdminToast message={params.toast} tone={params.tone} />
      <div className="admin-form-wrap">
        <h2>관리자 추가 / 수정</h2>
        <AdminUserForm />
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>이름</th>
              <th>이메일</th>
              <th>권한</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.name}</td>
                <td>{admin.email}</td>
                <td>{getAdminRoleLabel(admin.role)}</td>
                <td>
                  <AdminStatusBadge status={admin.status} />
                </td>
                <td>
                  <AdminUserActionButtons
                    adminId={admin.id}
                    status={admin.status}
                    redirectTo="/admin/admins"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

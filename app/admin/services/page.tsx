import { AdminFilterBar } from "@/components/admin-filter-bar";
import { AdminServiceForm } from "@/components/admin-service-form";
import { AdminStatusBadge } from "@/components/admin-status-badge";
import { AdminToast } from "@/components/admin-toast";
import { ServiceActionButtons } from "@/components/service-action-buttons";
import { getAdminServices } from "@/lib/admin-data";

export default async function AdminServicesPage({
  searchParams
}: {
  searchParams: Promise<{ edit?: string; q?: string; status?: string; toast?: string; tone?: string }>;
}) {
  const params = await searchParams;
  const services = await getAdminServices({
    query: params.q,
    status: params.status
  });
  const editingService = services.find((service) => service.slug === params.edit);

  return (
    <section className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="eyebrow">Service Management</p>
          <h1>서비스 관리</h1>
        </div>
      </div>
      <AdminToast message={params.toast} tone={params.tone} />
      <div className="admin-form-wrap">
        <h2>{editingService ? "서비스 수정" : "서비스 추가 / 수정"}</h2>
        <AdminServiceForm initialValues={editingService} />
      </div>
      <AdminFilterBar
        action="/admin/services"
        queryPlaceholder="서비스명 또는 slug 검색"
        query={params.q}
        statusValue={params.status ?? "all"}
        options={[
          { value: "all", label: "전체" },
          { value: "active", label: "활성" },
          { value: "inactive", label: "비활성" }
        ]}
      />
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Slug</th>
              <th>서비스명</th>
              <th>가격</th>
              <th>배지</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.slug}>
                <td>{service.slug}</td>
                <td>{service.display_name}</td>
                <td>{Number(service.price).toLocaleString("ko-KR")}원</td>
                <td>{service.is_popular ? "인기" : "일반"}</td>
                <td>
                  <AdminStatusBadge status={service.status} />
                </td>
                <td>
                  <ServiceActionButtons
                    serviceId={service.id}
                    slug={service.slug}
                    status={service.status}
                    redirectTo="/admin/services"
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

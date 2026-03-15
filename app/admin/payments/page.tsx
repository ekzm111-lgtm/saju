import { AdminFilterBar } from "@/components/admin-filter-bar";
import { AdminStatusBadge } from "@/components/admin-status-badge";
import { AdminToast } from "@/components/admin-toast";
import { PaymentActionButtons } from "@/components/payment-action-buttons";
import { getAdminPayments } from "@/lib/admin-data";

export default async function AdminPaymentsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; status?: string; toast?: string; tone?: string }>;
}) {
  const params = await searchParams;
  const payments = await getAdminPayments({
    query: params.q,
    status: params.status
  });

  return (
    <section className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="eyebrow">Payments</p>
          <h1>결제 내역</h1>
        </div>
      </div>
      <AdminToast message={params.toast} tone={params.tone} />
      <AdminFilterBar
        action="/admin/payments"
        queryPlaceholder="주문번호, 구매자, 서비스 검색"
        query={params.q}
        statusValue={params.status ?? "all"}
        options={[
          { value: "all", label: "전체" },
          { value: "paid", label: "결제완료" },
          { value: "ready", label: "준비중" },
          { value: "refunded", label: "환불완료" }
        ]}
      />
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>주문번호</th>
              <th>구매자</th>
              <th>서비스</th>
              <th>금액</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.order_id}>
                <td>{payment.order_id}</td>
                <td>{payment.buyer_name ?? "-"}</td>
                <td>{payment.service_name_snapshot}</td>
                <td>{Number(payment.amount ?? 0).toLocaleString("ko-KR")}원</td>
                <td>
                  <AdminStatusBadge status={payment.status} />
                </td>
                <td>
                  <PaymentActionButtons
                    orderId={payment.order_id}
                    status={payment.status}
                    redirectTo="/admin/payments"
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

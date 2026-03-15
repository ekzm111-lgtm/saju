import { AdminFilterBar } from "@/components/admin-filter-bar";
import { AdminStatusBadge } from "@/components/admin-status-badge";
import { AdminToast } from "@/components/admin-toast";
import { ReviewActionButtons } from "@/components/review-action-buttons";
import { getAdminReviews } from "@/lib/admin-data";

export default async function AdminReviewsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; visible?: string; toast?: string; tone?: string }>;
}) {
  const params = await searchParams;
  const reviews = await getAdminReviews({
    query: params.q,
    visible: params.visible
  });

  return (
    <section className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="eyebrow">Reviews</p>
          <h1>후기 관리</h1>
        </div>
      </div>
      <AdminToast message={params.toast} tone={params.tone} />
      <AdminFilterBar
        action="/admin/reviews"
        queryPlaceholder="작성자 또는 서비스 검색"
        query={params.q}
        statusName="visible"
        statusValue={params.visible ?? "all"}
        options={[
          { value: "all", label: "전체" },
          { value: "true", label: "노출" },
          { value: "false", label: "숨김" }
        ]}
      />
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>작성자</th>
              <th>서비스</th>
              <th>노출 여부</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id}>
                <td>{review.author_name}</td>
                <td>{review.service_name_snapshot}</td>
                <td>
                  <AdminStatusBadge status={String(review.is_visible_on_landing)} />
                </td>
                <td>
                  <ReviewActionButtons
                    reviewId={review.id}
                    visible={review.is_visible_on_landing}
                    redirectTo="/admin/reviews"
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

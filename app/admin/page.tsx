import { getAdminDashboardStats } from "@/lib/admin-data";

export default async function AdminPage() {
  const dashboardCards = await getAdminDashboardStats();

  return (
    <section className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="eyebrow">Admin Dashboard</p>
          <h1>운영 현황</h1>
        </div>
      </div>
      <div className="admin-kpi-grid">
        {dashboardCards.map((card) => (
          <article key={card.label} className="admin-card">
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

import { serviceCards } from "@/data/site-content";
import { createSupabaseServer, isSupabaseConfigured } from "@/lib/supabase";

export function getAdminRoleLabel(role: string) {
  if (role === "super_admin") {
    return "슈퍼관리자";
  }
  if (role === "admin") {
    return "일반관리자";
  }
  if (role === "viewer") {
    return "조회전용";
  }
  return role;
}

export function getAdminStatusLabel(status: string) {
  if (status === "true") {
    return "노출";
  }
  if (status === "false") {
    return "숨김";
  }
  if (status === "active") {
    return "활성";
  }
  if (status === "inactive") {
    return "비활성";
  }
  if (status === "paid") {
    return "결제완료";
  }
  if (status === "ready") {
    return "준비중";
  }
  if (status === "refunded") {
    return "환불완료";
  }
  if (status === "refund_requested") {
    return "환불대기";
  }
  return status;
}

export async function getAdminDashboardStats() {
  if (!isSupabaseConfigured()) {
    return [
      { label: "오늘 결제", value: "12건" },
      { label: "오늘 매출", value: "188,800원" },
      { label: "환불 대기", value: "1건" },
      { label: "활성 상품", value: `${serviceCards.length}개` }
    ];
  }

  const supabase = await createSupabaseServer();
  const { data: payments } = await supabase.from("payments").select("amount, status, created_at");

  const today = new Date().toISOString().slice(0, 10);
  const todayPayments = (payments ?? []).filter((payment) =>
    String(payment.created_at ?? "").startsWith(today)
  );
  const paidPayments = todayPayments.filter((payment) => payment.status === "paid");
  const refundPending = (payments ?? []).filter((payment) => payment.status === "refund_requested");
  const todayAmount = paidPayments.reduce((sum, payment) => sum + Number(payment.amount ?? 0), 0);

  return [
    { label: "오늘 결제", value: `${paidPayments.length}건` },
    { label: "오늘 매출", value: `${todayAmount.toLocaleString("ko-KR")}원` },
    { label: "환불 대기", value: `${refundPending.length}건` },
    { label: "활성 상품", value: `${serviceCards.length}개` }
  ];
}

export async function getAdminPayments(filters?: {
  query?: string;
  status?: string;
}) {
  const fallback = [
    {
      order_id: "order_1742020001",
      buyer_name: "김OO",
      service_name_snapshot: "연애운 심층 해석",
      amount: 19900,
      status: "paid"
    },
    {
      order_id: "order_1742020002",
      buyer_name: "박OO",
      service_name_snapshot: "재물운 분석",
      amount: 14900,
      status: "ready"
    },
    {
      order_id: "order_1742020003",
      buyer_name: "최OO",
      service_name_snapshot: "총운 리포트",
      amount: 9900,
      status: "refunded"
    }
  ];

  if (!isSupabaseConfigured()) {
    return fallback.filter((payment) => {
      const matchesQuery = filters?.query
        ? [payment.order_id, payment.buyer_name, payment.service_name_snapshot]
            .join(" ")
            .toLowerCase()
            .includes(filters.query.toLowerCase())
        : true;
      const matchesStatus =
        filters?.status && filters.status !== "all" ? payment.status === filters.status : true;
      return matchesQuery && matchesStatus;
    });
  }

  const supabase = await createSupabaseServer();
  let query = supabase
    .from("payments")
    .select("order_id, buyer_name, service_name_snapshot, amount, status")
    .order("created_at", { ascending: false })
    .limit(50);

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters?.query) {
    query = query.or(
      `order_id.ilike.%${filters.query}%,buyer_name.ilike.%${filters.query}%,service_name_snapshot.ilike.%${filters.query}%`
    );
  }

  const { data } = await query;
  return data ?? [];
}

export async function getAdminUsers() {
  if (!isSupabaseConfigured()) {
    return [
      {
        id: "admin-1",
        name: "슈퍼관리자",
        email: "admin@example.com",
        role: "super_admin",
        status: "active"
      },
      {
        id: "admin-2",
        name: "운영관리자",
        email: "operator@example.com",
        role: "admin",
        status: "active"
      }
    ];
  }

  const supabase = await createSupabaseServer();
  const { data } = await supabase
    .from("admins")
    .select("id, name, email, role, status")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getAdminServices(filters?: {
  query?: string;
  status?: string;
}) {
  const fallback = serviceCards.map((service) => ({
    id: service.slug,
    slug: service.slug,
    name: service.title,
    display_name: service.title,
    description: service.description,
    price: service.price,
    status: "active",
    is_popular: service.popular
  }));

  if (!isSupabaseConfigured()) {
    return fallback.filter((service) => {
      const matchesQuery = filters?.query
        ? [service.slug, service.name, service.display_name]
            .join(" ")
            .toLowerCase()
            .includes(filters.query.toLowerCase())
        : true;
      const matchesStatus =
        filters?.status && filters.status !== "all" ? service.status === filters.status : true;
      return matchesQuery && matchesStatus;
    });
  }

  const supabase = await createSupabaseServer();
  let query = supabase
    .from("services")
    .select("id, slug, name, display_name, description, price, status, is_popular")
    .order("created_at", { ascending: false });

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters?.query) {
    query = query.or(
      `slug.ilike.%${filters.query}%,name.ilike.%${filters.query}%,display_name.ilike.%${filters.query}%`
    );
  }

  const { data } = await query;
  return data ?? [];
}

export async function getAdminReviews(filters?: {
  query?: string;
  visible?: string;
}) {
  const fallback = [
    {
      id: "review-1",
      author_name: "김OO",
      service_name_snapshot: "연애운 심층 해석",
      is_visible_on_landing: true
    },
    {
      id: "review-2",
      author_name: "최OO",
      service_name_snapshot: "총운 리포트",
      is_visible_on_landing: false
    }
  ];

  if (!isSupabaseConfigured()) {
    return fallback.filter((review) => {
      const matchesQuery = filters?.query
        ? [review.author_name, review.service_name_snapshot]
            .join(" ")
            .toLowerCase()
            .includes(filters.query.toLowerCase())
        : true;
      const matchesVisible =
        filters?.visible && filters.visible !== "all"
          ? String(review.is_visible_on_landing) === filters.visible
          : true;
      return matchesQuery && matchesVisible;
    });
  }

  const supabase = await createSupabaseServer();
  let query = supabase
    .from("reviews")
    .select("id, author_name, is_visible_on_landing, service_id, services(display_name)")
    .is("deleted_at", null)
    .limit(50);

  if (filters?.visible && filters.visible !== "all") {
    query = query.eq("is_visible_on_landing", filters.visible === "true");
  }

  if (filters?.query) {
    query = query.ilike("author_name", `%${filters.query}%`);
  }

  const { data } = await query;

  return (data ?? []).map((item) => {
    const services = (
      item as { services?: { display_name?: string } | Array<{ display_name?: string }> }
    ).services;
    const serviceName = Array.isArray(services)
      ? services[0]?.display_name ?? "-"
      : services?.display_name ?? "-";

    return {
      id: (item as { id?: string }).id ?? `${item.author_name}-${serviceName}`,
      author_name: item.author_name,
      service_name_snapshot: serviceName,
      is_visible_on_landing: item.is_visible_on_landing
    };
  });
}

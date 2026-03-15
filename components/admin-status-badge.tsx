import { getAdminStatusLabel } from "@/lib/admin-data";

type AdminStatusBadgeProps = {
  status: string;
};

function getBadgeClassName(status: string) {
  if (status === "active" || status === "paid" || status === "true") {
    return "admin-badge admin-badge-positive";
  }
  if (status === "inactive" || status === "refunded" || status === "false") {
    return "admin-badge admin-badge-muted";
  }
  if (status === "ready" || status === "refund_requested") {
    return "admin-badge admin-badge-warn";
  }

  return "admin-badge";
}

export function AdminStatusBadge({ status }: AdminStatusBadgeProps) {
  return <span className={getBadgeClassName(status)}>{getAdminStatusLabel(status)}</span>;
}

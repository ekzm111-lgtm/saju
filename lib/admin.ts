import { redirect } from "next/navigation";

import { createSupabaseServer, isSupabaseConfigured } from "@/lib/supabase";

export type AdminRole = "super_admin" | "admin" | "viewer";

export type AdminProfile = {
  id: string;
  auth_user_id?: string;
  name: string;
  email: string;
  role: AdminRole;
  status: "active" | "inactive";
};

const fallbackAdmin: AdminProfile = {
  id: "local-admin",
  name: "로컬 관리자",
  email: "admin@sajumyeongin.local",
  role: "super_admin",
  status: "active"
};

export async function getCurrentAdmin() {
  if (!isSupabaseConfigured()) {
    return fallbackAdmin;
  }

  const supabase = await createSupabaseServer();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data } = await supabase
    .from("admins")
    .select("id, auth_user_id, name, email, role, status")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (!data) {
    return null;
  }

  return data as AdminProfile;
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();

  if (!admin || admin.status !== "active") {
    redirect("/admin/login");
  }

  return admin;
}

export async function requireAdminRole(roles: AdminRole[]) {
  const admin = await requireAdmin();

  if (!roles.includes(admin.role)) {
    redirect("/admin/login");
  }

  return admin;
}

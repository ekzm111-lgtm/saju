import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  createSupabaseAdmin,
  createSupabaseServer,
  isSupabaseConfigured
} from "@/lib/supabase";

export type AdminRole = "super_admin" | "admin" | "viewer";

export type AdminProfile = {
  id: string;
  auth_user_id?: string;
  login_id?: string;
  name: string;
  email: string;
  role: AdminRole;
  status: "active" | "inactive";
};

export const ADMIN_SESSION_COOKIE = "mf_admin_session";

const fallbackAdmin: AdminProfile = {
  id: "local-admin",
  login_id: "1111",
  name: "로컬 관리자",
  email: "admin@sajumyeongin.local",
  role: "super_admin",
  status: "active"
};

function mapAdminProfile(data: Record<string, unknown>): AdminProfile {
  const role = String(data.role ?? "viewer");

  return {
    id: String(data.id ?? ""),
    auth_user_id: data.auth_user_id ? String(data.auth_user_id) : undefined,
    login_id: data.login_id ? String(data.login_id) : undefined,
    name: String(data.name ?? "관리자"),
    email: String(data.email ?? ""),
    role:
      role === "super_admin" || role === "admin" || role === "viewer"
        ? role
        : "viewer",
    status: String(data.status ?? "active") === "inactive" ? "inactive" : "active"
  };
}

async function createAdminLookupClient() {
  try {
    return await createSupabaseAdmin();
  } catch {
    return await createSupabaseServer();
  }
}

function matchesAdminPassword(data: Record<string, unknown>, password: string) {
  const candidates = [
    data.password,
    data.passwd,
    data.login_password,
    data.name
  ]
    .filter(Boolean)
    .map((value) => String(value));

  return candidates.includes(password);
}

export async function getAdminByLogin(loginId: string, password: string) {
  if (!isSupabaseConfigured()) {
    if (loginId === "1111" && password === "1111") {
      return fallbackAdmin;
    }

    return null;
  }

  const supabase = await createAdminLookupClient();
  const { data: loginIdData } = await supabase
    .from("admins")
    .select("*")
    .eq("login_id", loginId)
    .maybeSingle();

  if (loginIdData && matchesAdminPassword(loginIdData as Record<string, unknown>, password)) {
    return mapAdminProfile(loginIdData as Record<string, unknown>);
  }

  const { data: authUserData } = await supabase
    .from("admins")
    .select("*")
    .eq("auth_user_id", loginId)
    .maybeSingle();

  if (!authUserData || !matchesAdminPassword(authUserData as Record<string, unknown>, password)) {
    return null;
  }

  return mapAdminProfile(authUserData as Record<string, unknown>);
}

export async function getCurrentAdmin() {
  if (!isSupabaseConfigured()) {
    return fallbackAdmin;
  }

  const cookieStore = await cookies();
  const sessionAdminId = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (sessionAdminId) {
    const supabase = await createAdminLookupClient();
    const { data } = await supabase.from("admins").select("*").eq("id", sessionAdminId).maybeSingle();

    if (data) {
      return mapAdminProfile(data as Record<string, unknown>);
    }
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
    .select("*")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (!data) {
    return null;
  }

  return mapAdminProfile(data as Record<string, unknown>);
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

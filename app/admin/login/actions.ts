"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_SESSION_COOKIE, getAdminByLogin } from "@/lib/admin";
import { createSupabaseServer, isSupabaseConfigured } from "@/lib/supabase";

export async function signInAdmin(_: { error?: string } | undefined, formData: FormData) {
  const loginId = String(formData.get("loginId") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!loginId || !password) {
    return { error: "아이디와 비밀번호를 모두 입력해 주세요." };
  }

  const admin = await getAdminByLogin(loginId, password);

  if (!admin) {
    return { error: "아이디 또는 비밀번호가 일치하지 않습니다." };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, admin.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });

  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServer();
    await supabase.auth.signOut();
  }

  redirect("/admin");
}

export async function signOutAdmin() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });

  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServer();
    await supabase.auth.signOut();
  }

  redirect("/admin/login");
}

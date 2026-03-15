"use server";

import { redirect } from "next/navigation";

import { createSupabaseServer, isSupabaseConfigured } from "@/lib/supabase";

export async function signInAdmin(_: { error?: string } | undefined, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!email || !password) {
    return { error: "이메일과 비밀번호를 모두 입력해주세요." };
  }

  if (!isSupabaseConfigured()) {
    if (email === "admin@sajumyeongin.local" && password === "admin1234") {
      redirect("/admin");
    }

    return { error: "로컬 관리자 계정 정보가 올바르지 않습니다." };
  }

  const supabase = await createSupabaseServer();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return { error: "로그인에 실패했습니다. 계정 정보를 확인해주세요." };
  }

  redirect("/admin");
}

export async function signOutAdmin() {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServer();
    await supabase.auth.signOut();
  }

  redirect("/admin/login");
}


"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminRole } from "@/lib/admin";
import { requestPortOneRefund } from "@/lib/portone-server";
import { createSupabaseServer, isSupabaseConfigured } from "@/lib/supabase";

function toBoolean(value: FormDataEntryValue | null) {
  return value === "true" || value === "on";
}

function buildAdminRedirect(path: string, message: string, tone: "success" | "error" = "success") {
  const params = new URLSearchParams({
    toast: message,
    tone
  });

  return `${path}?${params.toString()}`;
}

export async function saveServiceAction(
  _: { error?: string; success?: string } | undefined,
  formData: FormData
) {
  await requireAdminRole(["super_admin", "admin"]);

  const slug = String(formData.get("slug") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const displayName = String(formData.get("display_name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const status = String(formData.get("status") ?? "active").trim();
  const price = Number(formData.get("price") ?? 0);
  const isPopular = toBoolean(formData.get("is_popular"));

  if (!slug || !name || !displayName || !price) {
    return { error: "슬러그, 이름, 노출명, 가격은 필수입니다." };
  }

  if (!isSupabaseConfigured()) {
    return { success: "로컬 모드에서는 시뮬레이션만 수행했습니다." };
  }

  const supabase = await createSupabaseServer();
  const { error } = await supabase.from("services").upsert({
    id: formData.get("id") ? String(formData.get("id")) : undefined,
    slug,
    name,
    display_name: displayName,
    description,
    price,
    status,
    is_popular: isPopular
  });

  if (error) {
    return { error: "서비스 저장에 실패했습니다." };
  }

  revalidatePath("/admin/services");
  revalidatePath("/");
  revalidatePath("/payment");

  return { success: "서비스를 저장했습니다." };
}

export async function refundPayment(orderId: string, redirectTo = "/admin/payments") {
  await requireAdminRole(["super_admin", "admin"]);

  let paymentId: string | undefined;
  let amount: number | undefined;

  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServer();
    const { data } = await supabase
      .from("payments")
      .select("amount, portone_payment_id, raw_payload")
      .eq("order_id", orderId)
      .maybeSingle();

    amount = Number(data?.amount ?? 0) || undefined;
    paymentId =
      data?.portone_payment_id ??
      (data?.raw_payload as { paymentId?: string } | null)?.paymentId;
  }

  await requestPortOneRefund({
    orderId,
    paymentId,
    amount,
    reason: "관리자 환불"
  });

  if (!isSupabaseConfigured()) {
    revalidatePath("/admin/payments");
    redirect(buildAdminRedirect(redirectTo, "환불 처리가 완료되었습니다."));
  }

  const supabase = await createSupabaseServer();
  await supabase
    .from("payments")
    .update({
      status: "refunded",
      refunded_at: new Date().toISOString(),
      refund_reason: "관리자 환불",
      raw_payload: {
        refundedByAdmin: true,
        refundedAt: new Date().toISOString()
      }
    })
    .eq("order_id", orderId);

  revalidatePath("/admin/payments");
  redirect(buildAdminRedirect(redirectTo, "환불 처리가 완료되었습니다."));
}

export async function toggleServiceStatus(
  serviceId: string,
  currentStatus: string,
  redirectTo = "/admin/services"
) {
  await requireAdminRole(["super_admin", "admin"]);

  if (!isSupabaseConfigured()) {
    revalidatePath("/admin/services");
    revalidatePath("/");
    revalidatePath("/payment");
    redirect(
      buildAdminRedirect(
        redirectTo,
        currentStatus === "active" ? "서비스를 비활성화했습니다." : "서비스를 활성화했습니다."
      )
    );
  }

  const supabase = await createSupabaseServer();
  await supabase
    .from("services")
    .update({
      status: currentStatus === "active" ? "inactive" : "active"
    })
    .eq("id", serviceId);

  revalidatePath("/admin/services");
  revalidatePath("/");
  revalidatePath("/payment");
  redirect(
    buildAdminRedirect(
      redirectTo,
      currentStatus === "active" ? "서비스를 비활성화했습니다." : "서비스를 활성화했습니다."
    )
  );
}

export async function softDeleteService(serviceId: string, redirectTo = "/admin/services") {
  await requireAdminRole(["super_admin", "admin"]);

  if (!isSupabaseConfigured()) {
    revalidatePath("/admin/services");
    redirect(buildAdminRedirect(redirectTo, "서비스를 숨김 처리했습니다."));
  }

  const supabase = await createSupabaseServer();
  await supabase
    .from("services")
    .update({
      status: "inactive"
    })
    .eq("id", serviceId);

  revalidatePath("/admin/services");
  revalidatePath("/");
  revalidatePath("/payment");
  redirect(buildAdminRedirect(redirectTo, "서비스를 숨김 처리했습니다."));
}

export async function toggleAdminStatus(
  adminId: string,
  currentStatus: string,
  redirectTo = "/admin/admins"
) {
  await requireAdminRole(["super_admin"]);

  if (!isSupabaseConfigured()) {
    revalidatePath("/admin/admins");
    redirect(
      buildAdminRedirect(
        redirectTo,
        currentStatus === "active" ? "관리자 계정을 비활성화했습니다." : "관리자 계정을 활성화했습니다."
      )
    );
  }

  const supabase = await createSupabaseServer();
  await supabase
    .from("admins")
    .update({
      status: currentStatus === "active" ? "inactive" : "active"
    })
    .eq("id", adminId);

  revalidatePath("/admin/admins");
  redirect(
    buildAdminRedirect(
      redirectTo,
      currentStatus === "active" ? "관리자 계정을 비활성화했습니다." : "관리자 계정을 활성화했습니다."
    )
  );
}

export async function toggleReviewVisibility(
  reviewId: string,
  visible: boolean,
  redirectTo = "/admin/reviews"
) {
  await requireAdminRole(["super_admin", "admin"]);

  if (!isSupabaseConfigured()) {
    revalidatePath("/admin/reviews");
    revalidatePath("/");
    redirect(buildAdminRedirect(redirectTo, visible ? "후기를 숨김 처리했습니다." : "후기를 노출했습니다."));
  }

  const supabase = await createSupabaseServer();
  await supabase
    .from("reviews")
    .update({
      is_visible_on_landing: !visible
    })
    .eq("id", reviewId);

  revalidatePath("/admin/reviews");
  revalidatePath("/");
  redirect(buildAdminRedirect(redirectTo, visible ? "후기를 숨김 처리했습니다." : "후기를 노출했습니다."));
}

export async function saveAdminUserAction(
  _: { error?: string; success?: string } | undefined,
  formData: FormData
) {
  await requireAdminRole(["super_admin"]);

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const role = String(formData.get("role") ?? "viewer").trim();
  const status = String(formData.get("status") ?? "active").trim();

  if (!name || !email) {
    return { error: "이름과 이메일은 필수입니다." };
  }

  if (!isSupabaseConfigured()) {
    return { success: "로컬 모드에서는 시뮬레이션만 수행했습니다." };
  }

  const supabase = await createSupabaseServer();
  const { error } = await supabase.from("admins").upsert({
    name,
    email,
    role,
    status
  });

  if (error) {
    return { error: "관리자 저장에 실패했습니다." };
  }

  revalidatePath("/admin/admins");
  return { success: "관리자 계정을 저장했습니다." };
}

export async function deleteAdminUser(adminId: string, redirectTo = "/admin/admins") {
  await requireAdminRole(["super_admin"]);

  if (!isSupabaseConfigured()) {
    revalidatePath("/admin/admins");
    redirect(buildAdminRedirect(redirectTo, "관리자 계정을 비활성 처리했습니다."));
  }

  const supabase = await createSupabaseServer();
  await supabase
    .from("admins")
    .update({
      status: "inactive"
    })
    .eq("id", adminId);

  revalidatePath("/admin/admins");
  redirect(buildAdminRedirect(redirectTo, "관리자 계정을 비활성 처리했습니다."));
}

export async function softDeleteReview(reviewId: string, redirectTo = "/admin/reviews") {
  await requireAdminRole(["super_admin", "admin"]);

  if (!isSupabaseConfigured()) {
    revalidatePath("/admin/reviews");
    redirect(buildAdminRedirect(redirectTo, "후기를 삭제했습니다."));
  }

  const supabase = await createSupabaseServer();
  await supabase
    .from("reviews")
    .update({
      deleted_at: new Date().toISOString()
    })
    .eq("id", reviewId);

  revalidatePath("/admin/reviews");
  revalidatePath("/");
  redirect(buildAdminRedirect(redirectTo, "후기를 삭제했습니다."));
}

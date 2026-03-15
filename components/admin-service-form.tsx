"use client";

import { useActionState } from "react";

import { saveServiceAction } from "@/app/admin/actions";

type AdminServiceFormProps = {
  initialValues?: {
    slug?: string;
    name?: string;
    display_name?: string;
    price?: number;
    status?: string;
    is_popular?: boolean;
    description?: string | null;
  };
};

export function AdminServiceForm({ initialValues }: AdminServiceFormProps) {
  const [state, formAction, isPending] = useActionState(saveServiceAction, undefined);
  const isEditMode = Boolean(initialValues?.slug);

  return (
    <form action={formAction} className="admin-inline-form">
      <input
        name="slug"
        placeholder="slug 예: love-deep"
        defaultValue={initialValues?.slug}
        readOnly={isEditMode}
      />
      <input name="name" placeholder="서비스 내부명" defaultValue={initialValues?.name} />
      <input name="display_name" placeholder="노출용 이름" defaultValue={initialValues?.display_name} />
      <input
        name="price"
        type="number"
        min="0"
        placeholder="가격"
        defaultValue={initialValues?.price}
      />
      <select name="status" defaultValue={initialValues?.status ?? "active"}>
        <option value="active">active</option>
        <option value="inactive">inactive</option>
      </select>
      <label className="admin-checkbox">
        <input type="checkbox" name="is_popular" defaultChecked={initialValues?.is_popular} />
        인기 배지
      </label>
      <textarea
        name="description"
        rows={3}
        placeholder="서비스 설명"
        defaultValue={initialValues?.description ?? ""}
      />
      {state?.error ? <p className="form-error">{state.error}</p> : null}
      {state?.success ? <p className="form-success">{state.success}</p> : null}
      <button type="submit" className="primary-button" disabled={isPending}>
        {isPending ? "저장 중..." : isEditMode ? "서비스 수정" : "서비스 저장"}
      </button>
    </form>
  );
}

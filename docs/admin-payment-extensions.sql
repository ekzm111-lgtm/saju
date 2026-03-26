alter table public.payments
  add column if not exists admin_work_status text not null default 'received'
    check (admin_work_status in ('received', 'analyzing', 'pdf_uploaded', 'mailed')),
  add column if not exists mail_status text not null default 'not_sent'
    check (mail_status in ('not_sent', 'ready', 'sent')),
  add column if not exists refund_status text not null default 'none'
    check (refund_status in ('none', 'requested', 'refunded')),
  add column if not exists report_pdf_url text,
  add column if not exists report_pdf_name text,
  add column if not exists report_uploaded_at timestamptz,
  add column if not exists mail_sent_at timestamptz,
  add column if not exists admin_note text,
  add column if not exists inquiry_status text not null default 'pending'
    check (inquiry_status in ('pending', 'replied', 'called')),
  add column if not exists inquiry_reply text,
  add column if not exists inquiry_reply_sent boolean not null default false,
  add column if not exists inquiry_phone_done boolean not null default false,
  add column if not exists inquiry_replied_at timestamptz;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'vip-reports',
  'vip-reports',
  true,
  10485760,
  array['application/pdf']
)
on conflict (id) do nothing;

create policy if not exists "vip_reports_public_read"
on storage.objects
for select
using (bucket_id = 'vip-reports');

create policy if not exists "vip_reports_public_insert"
on storage.objects
for insert
with check (bucket_id = 'vip-reports');

create policy if not exists "vip_reports_public_update"
on storage.objects
for update
using (bucket_id = 'vip-reports')
with check (bucket_id = 'vip-reports');

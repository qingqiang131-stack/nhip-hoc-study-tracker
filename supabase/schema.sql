-- Personal account data for 學習節奏.
-- Replace YOUR_EMAIL_HERE with your verified email address before running this file.

create table if not exists public.study_data (
  user_id uuid primary key references auth.users (id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.study_data enable row level security;
grant usage on schema public to authenticated;
revoke all on table public.study_data from anon;
grant select, insert, update, delete on table public.study_data to authenticated;

drop policy if exists "Only the owner can access study data" on public.study_data;
create policy "Only the owner can access study data"
  on public.study_data
  for all
  to authenticated
  using (
    user_id = (select auth.uid())
    and lower((select auth.jwt() ->> 'email')) = 'your_email_here'
  )
  with check (
    user_id = (select auth.uid())
    and lower((select auth.jwt() ->> 'email')) = 'your_email_here'
  );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'class-notes',
  'class-notes',
  false,
  20971520,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif', 'image/avif']
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Owner reads class note images" on storage.objects;
create policy "Owner reads class note images"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'class-notes'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
    and lower((select auth.jwt() ->> 'email')) = 'your_email_here'
  );

drop policy if exists "Owner uploads class note images" on storage.objects;
create policy "Owner uploads class note images"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'class-notes'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
    and lower((select auth.jwt() ->> 'email')) = 'your_email_here'
  );

drop policy if exists "Owner updates class note images" on storage.objects;
create policy "Owner updates class note images"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'class-notes'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
    and lower((select auth.jwt() ->> 'email')) = 'your_email_here'
  )
  with check (
    bucket_id = 'class-notes'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
    and lower((select auth.jwt() ->> 'email')) = 'your_email_here'
  );

drop policy if exists "Owner deletes class note images" on storage.objects;
create policy "Owner deletes class note images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'class-notes'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
    and lower((select auth.jwt() ->> 'email')) = 'your_email_here'
  );

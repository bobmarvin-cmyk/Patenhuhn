-- Patenhuhn V0.5 – Branding, Kontakt und Bereinigung
-- NUR diese Migration einmal nach 003_full_cycle.sql ausführen.

insert into public.site_settings(key,value,label,sort_order) values
('contact_email','bobs@posteo.de','Kontakt-E-Mail',50),
('bobs_eggs_url','https://bob-eier.jimdoweb.com/','BoBs Eier Link',120)
on conflict (key) do update set value = excluded.value, label = excluded.label, updated_at = now();

-- Nicht mehr benötigte flexible Einstellung entfernen.
delete from public.site_settings where key = 'flexible_min_months';

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null check (char_length(message) <= 3000),
  status text not null default 'new' check (status in ('new','read','answered','archived')),
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

drop policy if exists "public can create contact messages" on public.contact_messages;
create policy "public can create contact messages" on public.contact_messages
for insert to anon, authenticated
with check (true);

drop policy if exists "admins can read contact messages" on public.contact_messages;
create policy "admins can read contact messages" on public.contact_messages
for select to authenticated
using (public.is_admin());

drop policy if exists "admins can update contact messages" on public.contact_messages;
create policy "admins can update contact messages" on public.contact_messages
for update to authenticated
using (public.is_admin()) with check (public.is_admin());

-- Neue Bestellungen sind ab jetzt ausschließlich personalisierte Patenschaften.
-- Bestehende Daten bleiben lesbar; die Anwendung schreibt nur noch 'personalized'.

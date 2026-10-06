-- Patenhuhn V0.4 – vollständiger Kreislauf
-- Diese Migration EINMAL nach 001_core.sql ausführen.
-- Sie ist so gebaut, dass sie auch funktioniert, wenn 002 bereits gelaufen ist.
-- Alte Migrationen NICHT erneut ausführen.

create extension if not exists pgcrypto;

-- Admin-Helfer zuerst anlegen, damit nachfolgende Policies darauf zugreifen können.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Einstellungen / Bestellungen aus V0.3 robust ergänzen.
create table if not exists public.site_settings (
  key text primary key,
  value text not null,
  label text not null default '',
  sort_order integer not null default 100,
  updated_at timestamptz not null default now()
);

insert into public.site_settings(key,value,label,sort_order) values
('eggs_per_week','6','Eier je Huhn und Woche',10),
('price_sm','11.70','Preis S–M pro Huhn / Monat (€)',20),
('price_lxl','13.00','Preis L–XL pro Huhn / Monat (€)',30),
('premium_price','10.00','Premium-Aufpreis / Monat (€)',40),
('contact_email','','Kontakt-E-Mail',50),
('operator_name','Marvin Reipert','Betreibername',60),
('operator_address','Herrenwald 2, 66640 Namborn','Betreiberanschrift',70),
('personalized_min_months','12','Mindestlaufzeit personalisiert (Monate)',80),
('flexible_min_months','3','Mindestlaufzeit flexibel (Monate)',90),
('redemption_valid_days','7','Gültigkeit Abholcode (Tage)',100),
('allow_saving_eggs','true','Eierguthaben darf angespart werden',110)
on conflict (key) do nothing;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'new' check (status in ('new','confirmed','cancelled','fulfilled')),
  variant text not null check (variant in ('personalized','flexible')),
  egg_size text not null check (egg_size in ('SM','LXL')),
  chicken_count integer not null check (chicken_count between 1 and 100),
  premium boolean not null default false,
  donate_eggs boolean not null default false,
  gift boolean not null default false,
  monthly_price_cents integer not null check (monthly_price_cents >= 0),
  contact_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_sponsorships (
  order_id uuid not null references public.orders(id) on delete cascade,
  sponsorship_id uuid not null references public.sponsorships(id) on delete cascade,
  primary key(order_id, sponsorship_id)
);

-- Neue Auth-Nutzer automatisch als Kundenprofil anlegen.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles(id, first_name, last_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name',''),
    coalesce(new.raw_user_meta_data->>'last_name',''),
    'customer'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Bestehende Auth-Konten ergänzen.
insert into public.profiles(id, first_name, last_name, role)
select u.id,
       coalesce(u.raw_user_meta_data->>'first_name',''),
       coalesce(u.raw_user_meta_data->>'last_name',''),
       'customer'::public.user_role
from auth.users u
on conflict (id) do nothing;

-- 001-Funktion absichern: Kunden dürfen nur die eigene Patenschaft gutschreiben,
-- Admins und zugehörige Hofbesitzer ebenfalls.
create or replace function public.credit_weekly_eggs(
  p_sponsorship_id uuid,
  p_week_start date default date_trunc('week', current_date)::date
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_sponsorship public.sponsorships%rowtype;
  v_allowed boolean := false;
begin
  select * into v_sponsorship
  from public.sponsorships
  where id = p_sponsorship_id;

  if not found or v_sponsorship.status <> 'active' then
    return false;
  end if;

  v_allowed := auth.uid() = v_sponsorship.user_id
    or public.is_admin()
    or exists(
      select 1
      from public.chickens c
      join public.farms f on f.id = c.farm_id
      where c.id = v_sponsorship.chicken_id and f.owner_id = auth.uid()
    );

  if auth.uid() is not null and not v_allowed then
    raise exception 'Nicht berechtigt';
  end if;

  if p_week_start < date_trunc('week', v_sponsorship.start_date)::date then
    return false;
  end if;

  if v_sponsorship.end_date is not null and p_week_start > v_sponsorship.end_date then
    return false;
  end if;

  insert into public.egg_transactions(sponsorship_id, amount, type, week_start, note)
  values (p_sponsorship_id, v_sponsorship.eggs_per_week, 'weekly_credit', p_week_start, 'Wöchentliche Eiergutschrift')
  on conflict do nothing;

  return found;
end;
$$;

-- V0.1-Fehler in cancel_redemption korrigieren.
create or replace function public.cancel_redemption(p_redemption_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_redemption public.redemptions%rowtype;
  v_user_id uuid;
begin
  select * into v_redemption
  from public.redemptions
  where id = p_redemption_id
  for update;

  if not found or v_redemption.status <> 'open' then
    return false;
  end if;

  select user_id into v_user_id
  from public.sponsorships
  where id = v_redemption.sponsorship_id;

  if auth.uid() is not null and auth.uid() <> v_user_id and not public.is_admin() then
    raise exception 'Nicht berechtigt';
  end if;

  update public.redemptions set status = 'cancelled' where id = p_redemption_id;

  insert into public.egg_transactions(sponsorship_id, amount, type, reference_id, note)
  values (v_redemption.sponsorship_id, v_redemption.egg_count, 'refund', v_redemption.id,
          'Storno Abholcode ' || v_redemption.code);
  return true;
end;
$$;

-- Bestellung in echte Patenschaften umwandeln. Ein Admin übergibt exakt so viele
-- Hühner-IDs wie bestellt wurden. Alles geschieht in einer DB-Transaktion.
create or replace function public.fulfill_order(
  p_order_id uuid,
  p_chicken_ids uuid[]
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
  v_chicken_id uuid;
  v_sponsorship_id uuid;
  v_eggs_per_week integer := 6;
  v_count integer := 0;
begin
  if not public.is_admin() then
    raise exception 'Nur Administratoren dürfen Bestellungen zuordnen';
  end if;

  select * into v_order from public.orders where id = p_order_id for update;
  if not found then raise exception 'Bestellung nicht gefunden'; end if;
  if v_order.status = 'cancelled' then raise exception 'Bestellung ist storniert'; end if;
  if v_order.status = 'fulfilled' then raise exception 'Bestellung wurde bereits angelegt'; end if;

  if coalesce(array_length(p_chicken_ids,1),0) <> v_order.chicken_count then
    raise exception 'Es müssen genau % Hühner ausgewählt werden', v_order.chicken_count;
  end if;

  select coalesce(nullif(value,''),'6')::integer into v_eggs_per_week
  from public.site_settings where key = 'eggs_per_week';

  foreach v_chicken_id in array p_chicken_ids loop
    if not exists(
      select 1 from public.chickens
      where id = v_chicken_id and active = true and available_for_sponsorship = true
    ) then
      raise exception 'Ein ausgewähltes Huhn ist nicht verfügbar';
    end if;

    insert into public.sponsorships(user_id, chicken_id, status, eggs_per_week, start_date)
    values(v_order.user_id, v_chicken_id, 'active', v_eggs_per_week, current_date)
    returning id into v_sponsorship_id;

    insert into public.order_sponsorships(order_id, sponsorship_id)
    values(p_order_id, v_sponsorship_id);

    update public.chickens set available_for_sponsorship = false where id = v_chicken_id;

    perform public.credit_weekly_eggs(v_sponsorship_id, date_trunc('week', current_date)::date);
    v_count := v_count + 1;
  end loop;

  update public.orders
  set status = 'fulfilled', updated_at = now()
  where id = p_order_id;

  return v_count;
end;
$$;

-- Admin kann Patenschaft beenden und Huhn wieder freigeben.
create or replace function public.end_sponsorship(p_sponsorship_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare v_chicken uuid;
begin
  if not public.is_admin() then raise exception 'Nicht berechtigt'; end if;
  select chicken_id into v_chicken from public.sponsorships where id = p_sponsorship_id;
  if not found then return false; end if;
  update public.sponsorships set status='ended', end_date=current_date where id=p_sponsorship_id;
  update public.chickens set available_for_sponsorship=true where id=v_chicken;
  return true;
end;
$$;

alter table public.site_settings enable row level security;
alter table public.orders enable row level security;
alter table public.order_sponsorships enable row level security;

-- Policies idempotent neu setzen.
drop policy if exists "site_settings_public_read" on public.site_settings;
create policy "site_settings_public_read" on public.site_settings for select using (true);
drop policy if exists "site_settings_admin_update" on public.site_settings;
create policy "site_settings_admin_update" on public.site_settings for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "orders_self_read" on public.orders;
create policy "orders_self_read" on public.orders for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists "orders_self_insert" on public.orders;
create policy "orders_self_insert" on public.orders for insert with check (user_id = auth.uid());
drop policy if exists "orders_admin_update" on public.orders;
create policy "orders_admin_update" on public.orders for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "order_sponsorships_read" on public.order_sponsorships;
create policy "order_sponsorships_read" on public.order_sponsorships for select using (
  public.is_admin() or exists(
    select 1 from public.sponsorships s
    where s.id = sponsorship_id and s.user_id = auth.uid()
  )
);

-- Admin-Rechte für Stammdaten.
drop policy if exists "farm_admin_all" on public.farms;
create policy "farm_admin_all" on public.farms for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "chicken_admin_all" on public.chickens;
create policy "chicken_admin_all" on public.chickens for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "sponsorship_admin_read" on public.sponsorships;
create policy "sponsorship_admin_read" on public.sponsorships for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists "redemption_admin_read" on public.redemptions;
create policy "redemption_admin_read" on public.redemptions for select using (
  public.is_admin()
  or exists(select 1 from public.sponsorships s where s.id = sponsorship_id and s.user_id = auth.uid())
  or exists(select 1 from public.farms f where f.id = farm_id and f.owner_id = auth.uid())
);
drop policy if exists "profile_admin_read" on public.profiles;
create policy "profile_admin_read" on public.profiles for select using (id = auth.uid() or public.is_admin());

-- Grants für RPC-Aufrufe über authentifizierte Nutzer.
grant execute on function public.credit_weekly_eggs(uuid,date) to authenticated;
grant execute on function public.create_redemption(uuid,integer,integer) to authenticated;
grant execute on function public.cancel_redemption(uuid) to authenticated;
grant execute on function public.redeem_code(text) to authenticated;
grant execute on function public.fulfill_order(uuid,uuid[]) to authenticated;
grant execute on function public.end_sponsorship(uuid) to authenticated;

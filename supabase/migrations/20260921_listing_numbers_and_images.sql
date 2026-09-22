-- ------------------------------------------------------------------
--  Listings: real numbers for money and size, plus listing photos.
--
--  Run once in the Supabase dashboard: SQL Editor -> New query ->
--  paste -> Run. Safe to re-run.
--
--  Why: price and size were free text ("₹48.5 L"), so the form accepted
--  anything and the budget filter had to guess at the number. They are
--  numeric columns now, and the site formats them for display.
--
--  Photos live in a public storage bucket; only contributors may write.
-- ------------------------------------------------------------------

-- --------------------------- listings ------------------------------
alter table public.listings
  add column if not exists price_inr   numeric(14, 2),
  add column if not exists area_value  numeric(12, 2),
  add column if not exists area_unit   text,
  add column if not exists rate_inr    numeric(14, 2),
  -- Storage object paths inside the listing-images bucket, cover first.
  add column if not exists images      text[] not null default '{}';

comment on column public.listings.price_inr is 'Asking price in rupees, e.g. 4850000.';
comment on column public.listings.area_value is 'Plot or built-up size, in area_unit.';
comment on column public.listings.area_unit is 'sqft | cents | grounds | acres.';
comment on column public.listings.rate_inr is 'Price per area_unit, in rupees.';
comment on column public.listings.images is 'Storage paths in listing-images, cover image first.';

-- Carry over what is already stored as text. Existing rows quote a rate
-- ("₹1,25,00,000 Per Acre", "₹5209 Per SQFT") with the size in the title
-- ("10.88 Acre Land Kodur"), so the rate and the size are read out of those
-- and the total price is left empty rather than guessed at (rate x size).
with parsed as (
  select
    id,
    -- the number before "per", when the text quotes a rate
    case when price ~* 'per'
      then nullif(regexp_replace(regexp_replace(price, 'per.*$', '', 'i'), '[^0-9.]', '', 'g'), '')::numeric
    end as rate,
    -- the unit named after "per"
    case
      when price ~* 'per\s*acre'                 then 'acres'
      when price ~* 'per\s*(sq\.?\s*ft|sqft)'     then 'sqft'
      when price ~* 'per\s*cent'                 then 'cents'
      when price ~* 'per\s*ground'               then 'grounds'
    end as rate_unit,
    -- a leading size in the title: "10.88 Acre …", "2400 Sqft …"
    nullif(regexp_replace(coalesce(substring(title from '^[0-9][0-9.,]*'), ''), '[^0-9.]', '', 'g'), '')::numeric as title_size,
    case
      when title ~* '^[0-9][0-9.,]*\s*acre'             then 'acres'
      when title ~* '^[0-9][0-9.,]*\s*(sq\.?\s*ft|sqft)' then 'sqft'
      when title ~* '^[0-9][0-9.,]*\s*cent'             then 'cents'
      when title ~* '^[0-9][0-9.,]*\s*ground'           then 'grounds'
    end as title_unit,
    -- a plain total, when the text is not a rate: "₹48.5 L", "₹48,50,000"
    case when price !~* 'per' then
      case
        when price ~* 'cr'             then (regexp_replace(price, '[^0-9.]', '', 'g'))::numeric * 10000000
        when price ~* '\m(l|lakh|lac)' then (regexp_replace(price, '[^0-9.]', '', 'g'))::numeric * 100000
        else nullif(regexp_replace(price, '[^0-9.]', '', 'g'), '')::numeric
      end
    end as total
  from public.listings
  where coalesce(price, '') <> ''
)
update public.listings l
   set rate_inr   = coalesce(l.rate_inr, p.rate),
       price_inr  = coalesce(l.price_inr, p.total),
       area_value = coalesce(l.area_value, case when p.title_unit is not null then p.title_size end),
       area_unit  = coalesce(l.area_unit, p.rate_unit, p.title_unit)
  from parsed p
 where p.id = l.id;

-- Constraints, added only once so this file stays safe to re-run.
do $$
begin
  alter table public.listings
    add constraint listings_area_unit_check
    check (area_unit is null or area_unit in ('sqft', 'cents', 'grounds', 'acres'));
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter table public.listings
    add constraint listings_price_positive
    check (price_inr is null or price_inr > 0);
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter table public.listings
    add constraint listings_rate_positive
    check (rate_inr is null or rate_inr > 0);
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter table public.listings
    add constraint listings_area_positive
    check (area_value is null or area_value > 0);
exception
  when duplicate_object then null;
end $$;

-- The old text columns are no longer written to. Kept for one release so
-- an existing row can still be read; drop them once nothing needs them:
--   alter table public.listings drop column price, drop column unit;
alter table public.listings alter column price drop not null;

-- ------------------------ listing photos ---------------------------
-- Public bucket: listing photos are shown on a public marketplace page.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'listing-images',
  'listing-images',
  true,
  5242880,  -- 5 MB per file
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Anyone may look at listing photos; only the team may add or remove them.
drop policy if exists listing_images_public_read on storage.objects;
create policy listing_images_public_read on storage.objects
  for select
  using (bucket_id = 'listing-images');

drop policy if exists listing_images_team_insert on storage.objects;
create policy listing_images_team_insert on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'listing-images' and public.is_contributor());

drop policy if exists listing_images_team_update on storage.objects;
create policy listing_images_team_update on storage.objects
  for update
  to authenticated
  using (bucket_id = 'listing-images' and public.is_contributor());

drop policy if exists listing_images_team_delete on storage.objects;
create policy listing_images_team_delete on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'listing-images' and public.is_contributor());

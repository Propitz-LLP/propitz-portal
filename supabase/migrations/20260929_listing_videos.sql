-- ------------------------------------------------------------------
--  Listing videos.
--
--  Walkthrough clips shot and uploaded by the PropITZ team. Two per
--  listing, 25 MB each — well under the 50 MB per-file ceiling the
--  Supabase plan enforces, and small enough that a buyer on mobile data
--  is not punished for tapping play.
--
--  A separate bucket from listing-images purely so the size limit and
--  the accepted types can differ: 25 MB and MP4 here, 5 MB and stills
--  there.
--
--  MP4 only, deliberately. Phones record HEVC in a .mov container by
--  default and Chrome on Android cannot play it; the upload panel also
--  decodes the file in the browser before accepting it, so a clip that
--  would be broken for half the audience is refused at upload rather
--  than discovered by a buyer.
--
--  Run once in the Supabase dashboard: SQL Editor -> New query -> paste
--  -> Run. Safe to re-run. Requires 20260921_listing_numbers_and_images.
-- ------------------------------------------------------------------

alter table public.listings
  add column if not exists videos text[] not null default '{}';

comment on column public.listings.videos is
  'Storage paths in listing-videos, in the order they are shown.';

-- ------------------------- video storage ---------------------------
-- Public, like the photos: these are shown on a public marketplace page.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'listing-videos',
  'listing-videos',
  true,
  26214400,  -- 25 MB per file
  array['video/mp4']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Anyone may watch; only the team may add or remove.
drop policy if exists listing_videos_public_read on storage.objects;
create policy listing_videos_public_read on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'listing-videos');

drop policy if exists listing_videos_team_write on storage.objects;
create policy listing_videos_team_write on storage.objects
  for insert to authenticated
  with check (bucket_id = 'listing-videos' and public.is_contributor());

drop policy if exists listing_videos_team_delete on storage.objects;
create policy listing_videos_team_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'listing-videos' and public.is_contributor());

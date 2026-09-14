-- ------------------------------------------------------------------
--  OPTIONAL: the six sample listings, so the marketplace is not empty
--  the moment it starts reading from the database.
--
--  These are placeholder inventory carried over from the design, not
--  real properties. Delete them from /account/listings once real
--  listings are in, or skip this file entirely.
--
--  Safe to re-run: it does nothing if any listing already exists.
-- ------------------------------------------------------------------

insert into public.listings (kind, status, price, unit, title, locality, badges, published)
select *
  from (values
    ('plot',  'verified', '₹48.5 L', '₹2,634 / sq.ft · 1,842 sq.ft',
     'Residential plot, approved layout', 'Sholinganallur, OMR',
     '[{"label":"EC clear","tone":"ok"},{"label":"Patta verified","tone":"ok"},{"label":"CMDA approved","tone":"ok"}]'::jsonb,
     true),

    ('house', 'verified', '₹1.35 Cr', '2,400 sq.ft built · 3 BHK',
     'Independent house, two floors', 'Anna Nagar West, Chennai',
     '[{"label":"EC clear","tone":"ok"},{"label":"Patta verified","tone":"ok"},{"label":"Tax current","tone":"ok"}]'::jsonb,
     true),

    ('apt',   'review',   '₹92 L', '₹8,050 / sq.ft · 1,142 sq.ft',
     '2 BHK apartment, gated', 'Perungudi, OMR',
     '[{"label":"RERA registered","tone":"ok"},{"label":"EC pending","tone":"warn"},{"label":"Patta N/A","tone":"none"}]'::jsonb,
     true),

    ('agri',  'verified', '₹22 L', '₹5.5 L per acre · 4 acres',
     'Agricultural land, wet', 'Near Maraimalai Nagar',
     '[{"label":"Adangal verified","tone":"ok"},{"label":"EC clear","tone":"ok"},{"label":"Conversion pending","tone":"warn"}]'::jsonb,
     true),

    ('plot',  'verified', '₹31 L', '₹2,067 / sq.ft · 1,500 sq.ft',
     'Corner plot, DTCP layout', 'Guduvancheri, GST Road',
     '[{"label":"EC clear","tone":"ok"},{"label":"Patta verified","tone":"ok"},{"label":"DTCP approved","tone":"ok"}]'::jsonb,
     true),

    ('house', 'review',   '₹68 L', '1,250 sq.ft built · 2 BHK',
     'Row house, gated community', 'Tambaram West',
     '[{"label":"EC clear","tone":"ok"},{"label":"Patta transfer pending","tone":"warn"},{"label":"Tax current","tone":"ok"}]'::jsonb,
     true)
  ) as seed (kind, status, price, unit, title, locality, badges, published)
 where not exists (select 1 from public.listings);

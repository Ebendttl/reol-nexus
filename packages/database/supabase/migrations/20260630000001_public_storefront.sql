-- Migration: Add Public Storefront Tables and RLS policies
-- Date: 2026-06-30

-- 1. Public Services Table
CREATE TABLE public.public_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_unit_id uuid REFERENCES public.business_units(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  image_url text,
  price_label text,
  is_featured boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Event Packages Table
CREATE TABLE public.event_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_unit_id uuid NOT NULL REFERENCES public.business_units(id) ON DELETE CASCADE,
  name text NOT NULL,
  hall_name text,
  capacity integer,
  price_from numeric(15,2),
  description text,
  inclusions jsonb DEFAULT '[]'::jsonb,
  image_url text,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Event Terms & Conditions Table
CREATE TABLE public.event_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_unit_id uuid NOT NULL REFERENCES public.business_units(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Extend Menu Items
ALTER TABLE public.menu_items 
  ADD COLUMN description text,
  ADD COLUMN image_url text,
  ADD COLUMN dietary_tags jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN is_featured boolean NOT NULL DEFAULT false,
  ADD COLUMN display_order integer NOT NULL DEFAULT 0;

-- 5. Laundry Services Table
CREATE TABLE public.laundry_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_unit_id uuid NOT NULL REFERENCES public.business_units(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  turnaround_time text,
  price_from numeric(15,2),
  image_url text,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 6. Deals & Promotions Table
CREATE TABLE public.deals_promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_unit_id uuid NOT NULL REFERENCES public.business_units(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  discount_label text,
  valid_from date,
  valid_until date,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 7. Testimonials Table
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_unit_id uuid REFERENCES public.business_units(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  content text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  image_url text,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 8. Gallery Images Table
CREATE TABLE public.gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_unit_id uuid NOT NULL REFERENCES public.business_units(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 9. Coming Soon Units Table
CREATE TABLE public.coming_soon_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text,
  expected_launch_label text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 10. Public Enquiries Table
CREATE TABLE public.public_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_unit_id uuid REFERENCES public.business_units(id) ON DELETE SET NULL,
  type text NOT NULL CHECK (type IN ('event_enquiry', 'laundry_pickup', 'eatery_order', 'contact', 'notify_me')),
  full_name text NOT NULL,
  phone text,
  email text,
  message text,
  metadata jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

--------------------------------------------------------------------------------
-- ENABLE ROW LEVEL SECURITY
--------------------------------------------------------------------------------
ALTER TABLE public.public_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laundry_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals_promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coming_soon_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_enquiries ENABLE ROW LEVEL SECURITY;

--------------------------------------------------------------------------------
-- RLS POLICIES
--------------------------------------------------------------------------------

-- Public Services Policies
CREATE POLICY "Allow public select on active services" ON public.public_services
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow admins/managers to manage public services" ON public.public_services
  FOR ALL USING (
    has_permission('manage_business_units') 
    OR (business_unit_id IS NOT NULL AND has_permission('manage_financial_data', business_unit_id))
  );

-- Event Packages Policies
CREATE POLICY "Allow public select on active event packages" ON public.event_packages
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow admins/managers to manage event packages" ON public.event_packages
  FOR ALL USING (
    has_permission('manage_business_units') 
    OR has_permission('manage_financial_data', business_unit_id)
  );

-- Event Terms Policies
CREATE POLICY "Allow public select on event terms" ON public.event_terms
  FOR SELECT USING (true);

CREATE POLICY "Allow admins/managers to manage event terms" ON public.event_terms
  FOR ALL USING (
    has_permission('manage_business_units') 
    OR has_permission('manage_financial_data', business_unit_id)
  );

-- Laundry Services Policies
CREATE POLICY "Allow public select on active laundry services" ON public.laundry_services
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow admins/managers to manage laundry services" ON public.laundry_services
  FOR ALL USING (
    has_permission('manage_business_units') 
    OR has_permission('manage_financial_data', business_unit_id)
  );

-- Deals Promotions Policies
CREATE POLICY "Allow public select on active deals promotions" ON public.deals_promotions
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow admins/managers to manage deals promotions" ON public.deals_promotions
  FOR ALL USING (
    has_permission('manage_business_units') 
    OR has_permission('manage_financial_data', business_unit_id)
  );

-- Testimonials Policies
CREATE POLICY "Allow public select on testimonials" ON public.testimonials
  FOR SELECT USING (true);

CREATE POLICY "Allow admins/managers to manage testimonials" ON public.testimonials
  FOR ALL USING (
    has_permission('manage_business_units') 
    OR (business_unit_id IS NOT NULL AND has_permission('manage_financial_data', business_unit_id))
  );

-- Gallery Images Policies
CREATE POLICY "Allow public select on gallery images" ON public.gallery_images
  FOR SELECT USING (true);

CREATE POLICY "Allow admins/managers to manage gallery images" ON public.gallery_images
  FOR ALL USING (
    has_permission('manage_business_units') 
    OR has_permission('manage_financial_data', business_unit_id)
  );

-- Coming Soon Units Policies
CREATE POLICY "Allow public select on coming soon units" ON public.coming_soon_units
  FOR SELECT USING (true);

CREATE POLICY "Allow admins to manage coming soon units" ON public.coming_soon_units
  FOR ALL USING (has_permission('manage_business_units'));

-- Public Enquiries Policies
CREATE POLICY "Allow public insert on enquiries" ON public.public_enquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admins/managers to select/update/delete enquiries" ON public.public_enquiries
  FOR ALL USING (
    has_permission('manage_business_units')
    OR (business_unit_id IS NOT NULL AND has_permission('manage_financial_data', business_unit_id))
  );

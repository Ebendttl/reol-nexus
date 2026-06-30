-- Create initial schema for REOL Nexus

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Organizations (REOL GLOBAL SOLUTIONS LIMITED)
CREATE TABLE public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  branding_color text DEFAULT '#0F5132',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Business Units (Event Center, Eatery, Laundry)
CREATE TABLE public.business_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  type text NOT NULL CHECK (type IN ('event_center', 'eatery', 'laundry', 'custom')),
  icon text,
  color text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_org_slug UNIQUE (org_id, slug)
);

-- 3. Profiles (Extends Supabase auth.users)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL,
  full_name text NOT NULL DEFAULT '',
  phone text,
  avatar_url text,
  default_business_unit_id uuid REFERENCES public.business_units(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Roles
CREATE TABLE public.roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  is_system_role boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_org_role UNIQUE (org_id, name)
);

-- 5. Permissions
CREATE TABLE public.permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 6. Role Permissions (Many-to-Many)
CREATE TABLE public.role_permissions (
  role_id uuid NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id uuid NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- 7. User Roles (Many-to-Many, optionally scoped to Business Unit)
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_id uuid NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  business_unit_id uuid REFERENCES public.business_units(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_role_bu UNIQUE (user_id, role_id, business_unit_id)
);

-- 8. Categories
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  business_unit_id uuid REFERENCES public.business_units(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_org_bu_cat UNIQUE (org_id, business_unit_id, name, type)
);

-- 9. Subcategories
CREATE TABLE public.subcategories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_cat_subcat UNIQUE (category_id, name)
);

-- 10. Unified Transaction Ledger
CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  business_unit_id uuid NOT NULL REFERENCES public.business_units(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  subcategory_id uuid REFERENCES public.subcategories(id) ON DELETE SET NULL,
  amount numeric(15,2) NOT NULL CHECK (amount >= 0),
  currency text NOT NULL DEFAULT 'NGN',
  description text,
  transaction_date date NOT NULL DEFAULT CURRENT_DATE,
  recorded_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  source text NOT NULL CHECK (source IN ('manual', 'booking', 'order', 'sale', 'import')),
  source_ref_id uuid,
  attachment_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 11. Budgets
CREATE TABLE public.budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_unit_id uuid NOT NULL REFERENCES public.business_units(id) ON DELETE CASCADE,
  period_start date NOT NULL,
  period_end date NOT NULL,
  total_amount numeric(15,2) NOT NULL CHECK (total_amount >= 0),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 12. Budget Line Items
CREATE TABLE public.budget_line_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id uuid NOT NULL REFERENCES public.budgets(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  allocated_amount numeric(15,2) NOT NULL CHECK (allocated_amount >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_budget_category UNIQUE (budget_id, category_id)
);

-- 13. Event Bookings Module (Event Center)
CREATE TABLE public.event_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_unit_id uuid NOT NULL REFERENCES public.business_units(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  client_contact text,
  event_date date NOT NULL,
  package_type text,
  hall_name text,
  deposit_amount numeric(15,2) NOT NULL DEFAULT 0 CHECK (deposit_amount >= 0),
  total_quoted numeric(15,2) NOT NULL CHECK (total_quoted >= 0),
  status text NOT NULL DEFAULT 'inquiry' CHECK (status IN ('inquiry', 'confirmed', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 14. Menu Items Module (Eatery Menu)
CREATE TABLE public.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_unit_id uuid NOT NULL REFERENCES public.business_units(id) ON DELETE CASCADE,
  name text NOT NULL,
  price numeric(15,2) NOT NULL CHECK (price >= 0),
  category text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 15. Eatery Daily Sales Module (Eatery Sales)
CREATE TABLE public.eatery_daily_sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_unit_id uuid NOT NULL REFERENCES public.business_units(id) ON DELETE CASCADE,
  sale_date date NOT NULL DEFAULT CURRENT_DATE,
  total_covers integer NOT NULL DEFAULT 0 CHECK (total_covers >= 0),
  total_revenue numeric(15,2) NOT NULL CHECK (total_revenue >= 0),
  recorded_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 16. Laundry Orders Module (Laundry Orders)
CREATE TABLE public.laundry_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_unit_id uuid NOT NULL REFERENCES public.business_units(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_contact text,
  items_description text NOT NULL,
  drop_off_date date NOT NULL DEFAULT CURRENT_DATE,
  pickup_date date,
  status text NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'in_progress', 'ready', 'collected')),
  amount_charged numeric(15,2) NOT NULL CHECK (amount_charged >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 17. Materialized Daily Summaries (Real-time caching)
CREATE TABLE public.daily_summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_unit_id uuid NOT NULL REFERENCES public.business_units(id) ON DELETE CASCADE,
  summary_date date NOT NULL,
  total_income numeric(15,2) NOT NULL DEFAULT 0,
  total_expense numeric(15,2) NOT NULL DEFAULT 0,
  net_profit numeric(15,2) NOT NULL DEFAULT 0,
  vs_previous_day_pct numeric(5,2),
  generated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_bu_date UNIQUE (business_unit_id, summary_date)
);

-- 18. Audit Logs
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  metadata jsonb,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 19. Notification Preferences
CREATE TABLE public.notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  channel text NOT NULL CHECK (channel IN ('push', 'email', 'sms')),
  delivery_time time NOT NULL DEFAULT '18:00:00',
  frequency text NOT NULL DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly')),
  is_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_channel UNIQUE (user_id, channel)
);

-- 20. Device Tokens (Ready for Expo Push Notifications)
CREATE TABLE public.device_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  token text NOT NULL,
  platform text NOT NULL CHECK (platform IN ('ios', 'android', 'web')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_token UNIQUE (user_id, token)
);

--------------------------------------------------------------------------------
-- HELPER FUNCTIONS FOR SECURITY AND SCOPING (SECURITY DEFINER)
--------------------------------------------------------------------------------

-- Safe retrieval of active user's organization without RLS circular reference
CREATE OR REPLACE FUNCTION public.get_user_org_id(u_id uuid)
RETURNS uuid AS $$
  SELECT org_id FROM public.profiles WHERE id = u_id;
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

-- Granular permission checking, supporting org-wide (Owner/Admin) and scoped roles (Unit Manager)
CREATE OR REPLACE FUNCTION public.has_permission(perm_code text, bu_id uuid DEFAULT NULL)
RETURNS boolean AS $$
DECLARE
  has_perm boolean;
  current_user_id uuid := auth.uid();
BEGIN
  -- Unauthenticated users have no permissions
  IF current_user_id IS NULL THEN
    RETURN false;
  END IF;

  -- 1. OWNER / ADMIN org-wide check (short circuit for high performance)
  IF EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = current_user_id
      AND r.name = 'Owner/Admin'
      AND ur.business_unit_id IS NULL
  ) THEN
    RETURN true;
  END IF;

  -- 2. Scoped Granular Check
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role_id = rp.role_id
    JOIN public.permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = current_user_id
      AND p.code = perm_code
      AND (
        ur.business_unit_id IS NULL -- Org-wide role
        OR (bu_id IS NOT NULL AND ur.business_unit_id = bu_id) -- Scoped to business unit
      )
  ) INTO has_perm;

  RETURN has_perm;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

--------------------------------------------------------------------------------
-- DATABASE TRIGGERS: LEDGER SYNCHRONIZATION
--------------------------------------------------------------------------------

-- 1. Bookings Sync (Event Center)
CREATE OR REPLACE FUNCTION public.sync_booking_to_ledger()
RETURNS trigger AS $$
DECLARE
  v_org_id uuid;
  v_category_id uuid;
BEGIN
  SELECT org_id INTO v_org_id FROM public.business_units WHERE id = NEW.business_unit_id;
  
  -- Resolve "Event Revenue" category
  SELECT id INTO v_category_id FROM public.categories 
  WHERE org_id = v_org_id AND name = 'Event Revenue' AND type = 'income' LIMIT 1;
  
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (org_id, business_unit_id, name, type)
    VALUES (v_org_id, NEW.business_unit_id, 'Event Revenue', 'income')
    RETURNING id INTO v_category_id;
  END IF;

  -- Delete previous instances to prevent duplication
  DELETE FROM public.transactions 
  WHERE source = 'booking' AND source_ref_id = NEW.id;

  -- Insert transactions depending on status
  IF NEW.status = 'completed' THEN
    INSERT INTO public.transactions (
      org_id, business_unit_id, type, category_id, amount, description, 
      transaction_date, source, source_ref_id
    ) VALUES (
      v_org_id, NEW.business_unit_id, 'income', v_category_id, NEW.total_quoted,
      'Completed Booking: ' || NEW.client_name || ' (' || NEW.package_type || ')',
      NEW.event_date, 'booking', NEW.id
    );
  ELSIF NEW.status = 'confirmed' AND NEW.deposit_amount > 0 THEN
    INSERT INTO public.transactions (
      org_id, business_unit_id, type, category_id, amount, description, 
      transaction_date, source, source_ref_id
    ) VALUES (
      v_org_id, NEW.business_unit_id, 'income', v_category_id, NEW.deposit_amount,
      'Booking Deposit: ' || NEW.client_name || ' (' || NEW.package_type || ')',
      NEW.event_date, 'booking', NEW.id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER trg_sync_booking_to_ledger
AFTER INSERT OR UPDATE OF status, total_quoted, deposit_amount, event_date ON public.event_bookings
FOR EACH ROW EXECUTE FUNCTION public.sync_booking_to_ledger();


-- 2. Laundry Orders Sync
CREATE OR REPLACE FUNCTION public.sync_laundry_to_ledger()
RETURNS trigger AS $$
DECLARE
  v_org_id uuid;
  v_category_id uuid;
BEGIN
  SELECT org_id INTO v_org_id FROM public.business_units WHERE id = NEW.business_unit_id;
  
  -- Resolve "Laundry Revenue" category
  SELECT id INTO v_category_id FROM public.categories 
  WHERE org_id = v_org_id AND name = 'Laundry Revenue' AND type = 'income' LIMIT 1;
  
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (org_id, business_unit_id, name, type)
    VALUES (v_org_id, NEW.business_unit_id, 'Laundry Revenue', 'income')
    RETURNING id INTO v_category_id;
  END IF;

  DELETE FROM public.transactions 
  WHERE source = 'order' AND source_ref_id = NEW.id;

  IF NEW.status = 'collected' THEN
    INSERT INTO public.transactions (
      org_id, business_unit_id, type, category_id, amount, description, 
      transaction_date, source, source_ref_id
    ) VALUES (
      v_org_id, NEW.business_unit_id, 'income', v_category_id, NEW.amount_charged,
      'Laundry Order Collected: ' || NEW.customer_name || ' (' || NEW.items_description || ')',
      COALESCE(NEW.pickup_date, CURRENT_DATE), 'order', NEW.id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER trg_sync_laundry_to_ledger
AFTER INSERT OR UPDATE OF status, amount_charged, pickup_date ON public.laundry_orders
FOR EACH ROW EXECUTE FUNCTION public.sync_laundry_to_ledger();


-- 3. Eatery Daily Sales Sync
CREATE OR REPLACE FUNCTION public.sync_eatery_to_ledger()
RETURNS trigger AS $$
DECLARE
  v_org_id uuid;
  v_category_id uuid;
BEGIN
  SELECT org_id INTO v_org_id FROM public.business_units WHERE id = NEW.business_unit_id;
  
  -- Resolve "Eatery Revenue" category
  SELECT id INTO v_category_id FROM public.categories 
  WHERE org_id = v_org_id AND name = 'Eatery Revenue' AND type = 'income' LIMIT 1;
  
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (org_id, business_unit_id, name, type)
    VALUES (v_org_id, NEW.business_unit_id, 'Eatery Revenue', 'income')
    RETURNING id INTO v_category_id;
  END IF;

  DELETE FROM public.transactions 
  WHERE source = 'sale' AND source_ref_id = NEW.id;

  INSERT INTO public.transactions (
    org_id, business_unit_id, type, category_id, amount, description, 
    transaction_date, recorded_by, source, source_ref_id
  ) VALUES (
    v_org_id, NEW.business_unit_id, 'income', v_category_id, NEW.total_revenue,
    'Eatery Daily Sales: ' || NEW.total_covers || ' covers recorded.',
    NEW.sale_date, NEW.recorded_by, 'sale', NEW.id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER trg_sync_eatery_to_ledger
AFTER INSERT OR UPDATE OF total_revenue, sale_date ON public.eatery_daily_sales
FOR EACH ROW EXECUTE FUNCTION public.sync_eatery_to_ledger();


-- 4. Delete Ledger Entry on Module Item Delete
CREATE OR REPLACE FUNCTION public.delete_from_ledger_on_source_delete()
RETURNS trigger AS $$
BEGIN
  DELETE FROM public.transactions WHERE source_ref_id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER trg_delete_booking_from_ledger
AFTER DELETE ON public.event_bookings
FOR EACH ROW EXECUTE FUNCTION public.delete_from_ledger_on_source_delete();

CREATE OR REPLACE TRIGGER trg_delete_laundry_from_ledger
AFTER DELETE ON public.laundry_orders
FOR EACH ROW EXECUTE FUNCTION public.delete_from_ledger_on_source_delete();

CREATE OR REPLACE TRIGGER trg_delete_eatery_from_ledger
AFTER DELETE ON public.eatery_daily_sales
FOR EACH ROW EXECUTE FUNCTION public.delete_from_ledger_on_source_delete();

--------------------------------------------------------------------------------
-- DATABASE TRIGGERS: CACHING & DAILY SUMMARIES
--------------------------------------------------------------------------------

-- Recalculate daily summary for a given business unit and date
CREATE OR REPLACE FUNCTION public.refresh_daily_summary(p_bu_id uuid, p_date date)
RETURNS void AS $$
DECLARE
  v_income numeric(15,2);
  v_expense numeric(15,2);
  v_net numeric(15,2);
  v_prev_net numeric(15,2);
  v_pct_change numeric(5,2);
BEGIN
  -- Sum income and expense for the business unit and date
  SELECT COALESCE(SUM(amount), 0) INTO v_income
  FROM public.transactions
  WHERE business_unit_id = p_bu_id AND transaction_date = p_date AND type = 'income';

  SELECT COALESCE(SUM(amount), 0) INTO v_expense
  FROM public.transactions
  WHERE business_unit_id = p_bu_id AND transaction_date = p_date AND type = 'expense';

  v_net := v_income - v_expense;

  -- Get previous day's net profit
  SELECT net_profit INTO v_prev_net
  FROM public.daily_summaries
  WHERE business_unit_id = p_bu_id AND summary_date = (p_date - 1);

  -- Calculate percentage change vs previous day
  IF v_prev_net IS NULL OR v_prev_net = 0 THEN
    v_pct_change := NULL;
  ELSE
    v_pct_change := ROUND(((v_net - v_prev_net) / ABS(v_prev_net)) * 100, 2);
  END IF;

  -- Insert or update daily summary
  INSERT INTO public.daily_summaries (
    business_unit_id, summary_date, total_income, total_expense, net_profit, 
    vs_previous_day_pct, generated_at
  ) VALUES (
    p_bu_id, p_date, v_income, v_expense, v_net, v_pct_change, now()
  )
  ON CONFLICT (business_unit_id, summary_date) DO UPDATE SET
    total_income = EXCLUDED.total_income,
    total_expense = EXCLUDED.total_expense,
    net_profit = EXCLUDED.net_profit,
    vs_previous_day_pct = EXCLUDED.vs_previous_day_pct,
    generated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to run refresh_daily_summary on ledger transaction modifications
CREATE OR REPLACE FUNCTION public.trigger_refresh_daily_summary()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    PERFORM public.refresh_daily_summary(NEW.business_unit_id, NEW.transaction_date);
    -- If date or business unit changed, refresh the old one too
    IF TG_OP = 'UPDATE' AND (OLD.transaction_date != NEW.transaction_date OR OLD.business_unit_id != NEW.business_unit_id) THEN
      PERFORM public.refresh_daily_summary(OLD.business_unit_id, OLD.transaction_date);
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.refresh_daily_summary(OLD.business_unit_id, OLD.transaction_date);
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER trg_refresh_daily_summary
AFTER INSERT OR UPDATE OR DELETE ON public.transactions
FOR EACH ROW EXECUTE FUNCTION public.trigger_refresh_daily_summary();

--------------------------------------------------------------------------------
-- DATABASE TRIGGERS: LEDGER AUDIT LOGGING
--------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.log_transaction_mutation()
RETURNS trigger AS $$
DECLARE
  v_action text;
  v_metadata jsonb;
  v_org_id uuid;
  v_user_id uuid := auth.uid();
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_action := 'CREATE';
    v_org_id := NEW.org_id;
    v_metadata := to_jsonb(NEW);
  ELSIF TG_OP = 'UPDATE' THEN
    v_action := 'UPDATE';
    v_org_id := NEW.org_id;
    v_metadata := jsonb_build_object('before', to_jsonb(OLD), 'after', to_jsonb(NEW));
  ELSIF TG_OP = 'DELETE' THEN
    v_action := 'DELETE';
    v_org_id := OLD.org_id;
    v_metadata := to_jsonb(OLD);
  END IF;

  INSERT INTO public.audit_logs (
    org_id, user_id, action, entity_type, entity_id, metadata, created_at
  ) VALUES (
    v_org_id, v_user_id, v_action, 'transaction', COALESCE(NEW.id, OLD.id), v_metadata, now()
  );

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER trg_log_transaction_mutation
AFTER INSERT OR UPDATE OR DELETE ON public.transactions
FOR EACH ROW EXECUTE FUNCTION public.log_transaction_mutation();

--------------------------------------------------------------------------------
-- PROFILE AUTOMATIC LINKING ON AUTH SIGN UP
--------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    NEW.phone
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

--------------------------------------------------------------------------------
-- ATOMIC ORGANIZATION ONBOARDING FLOW
--------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.initialize_new_organization(
  p_org_name text,
  p_owner_id uuid,
  p_owner_name text,
  p_owner_phone text DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  v_org_id uuid;
  v_admin_role_id uuid;
  v_manager_role_id uuid;
  v_viewer_role_id uuid;
  v_reporter_role_id uuid;
  v_staff_role_id uuid;
  v_bu_event_id uuid;
BEGIN
  -- 1. Create Organization
  INSERT INTO public.organizations (name, branding_color)
  VALUES (p_org_name, '#0F5132')
  RETURNING id INTO v_org_id;

  -- 2. Link owner's profile to organization
  UPDATE public.profiles
  SET org_id = v_org_id, full_name = p_owner_name, phone = p_owner_phone
  WHERE id = p_owner_id;

  -- 3. Seed roles for this organization
  INSERT INTO public.roles (org_id, name, is_system_role)
  VALUES 
    (v_org_id, 'Owner/Admin', true),
    (v_org_id, 'Unit Manager', true),
    (v_org_id, 'Finance Viewer', true),
    (v_org_id, 'Report Generator', true),
    (v_org_id, 'Staff', true);

  -- Fetch roles
  SELECT id INTO v_admin_role_id FROM public.roles WHERE org_id = v_org_id AND name = 'Owner/Admin';
  SELECT id INTO v_manager_role_id FROM public.roles WHERE org_id = v_org_id AND name = 'Unit Manager';
  SELECT id INTO v_viewer_role_id FROM public.roles WHERE org_id = v_org_id AND name = 'Finance Viewer';
  SELECT id INTO v_reporter_role_id FROM public.roles WHERE org_id = v_org_id AND name = 'Report Generator';

  -- 4. Map role permissions
  INSERT INTO public.role_permissions (role_id, permission_id)
  SELECT v_admin_role_id, id FROM public.permissions;

  INSERT INTO public.role_permissions (role_id, permission_id)
  SELECT v_manager_role_id, id FROM public.permissions 
  WHERE code IN ('view_financial_data', 'manage_financial_data', 'export_reports', 'set_budgets');

  INSERT INTO public.role_permissions (role_id, permission_id)
  SELECT v_viewer_role_id, id FROM public.permissions 
  WHERE code IN ('view_financial_data', 'view_all_units');

  INSERT INTO public.role_permissions (role_id, permission_id)
  SELECT v_reporter_role_id, id FROM public.permissions 
  WHERE code IN ('view_financial_data', 'export_reports', 'view_all_units');

  -- 5. Set Admin Role as org-wide (NULL business unit) for Owner
  INSERT INTO public.user_roles (user_id, role_id, business_unit_id)
  VALUES (p_owner_id, v_admin_role_id, NULL);

  -- 6. Seed the 3 business units
  INSERT INTO public.business_units (org_id, name, slug, type, icon, color)
  VALUES 
    (v_org_id, 'Event Center', 'event-center', 'event_center', 'calendar', '#D4AF37'),
    (v_org_id, 'Eatery', 'eatery', 'eatery', 'utensils', '#FF5733'),
    (v_org_id, 'Laundry', 'laundry', 'laundry', 'shirt', '#33B5E5');

  SELECT id INTO v_bu_event_id FROM public.business_units WHERE org_id = v_org_id AND type = 'event_center';
  UPDATE public.profiles SET default_business_unit_id = v_bu_event_id WHERE id = p_owner_id;

  -- 7. Seed standard financial categories (org-wide)
  INSERT INTO public.categories (org_id, business_unit_id, name, type)
  VALUES
    (v_org_id, NULL, 'General Income', 'income'),
    (v_org_id, NULL, 'Event Revenue', 'income'),
    (v_org_id, NULL, 'Eatery Revenue', 'income'),
    (v_org_id, NULL, 'Laundry Revenue', 'income'),
    (v_org_id, NULL, 'Diesel & Generator', 'expense'),
    (v_org_id, NULL, 'Utilities & Electricity', 'expense'),
    (v_org_id, NULL, 'Staff Wages', 'expense'),
    (v_org_id, NULL, 'Maintenance & Repairs', 'expense'),
    (v_org_id, NULL, 'Security', 'expense'),
    (v_org_id, NULL, 'Supplies & Materials', 'expense'),
    (v_org_id, NULL, 'Marketing & Ads', 'expense');

  RETURN v_org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

--------------------------------------------------------------------------------
-- ENABLE ROW LEVEL SECURITY
--------------------------------------------------------------------------------
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eatery_daily_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laundry_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_tokens ENABLE ROW LEVEL SECURITY;

--------------------------------------------------------------------------------
-- RLS POLICIES
--------------------------------------------------------------------------------

-- Organizations policies
CREATE POLICY "Users can view their own organization" ON public.organizations
  FOR SELECT USING (id = get_user_org_id(auth.uid()));

CREATE POLICY "Admins can update organization" ON public.organizations
  FOR UPDATE USING (has_permission('manage_business_units'));

-- Business Units policies
CREATE POLICY "Users can view business units in their organization" ON public.business_units
  FOR SELECT USING (org_id = get_user_org_id(auth.uid()));

CREATE POLICY "Admins can manage business units" ON public.business_units
  FOR ALL USING (has_permission('manage_business_units'));

-- Profiles policies
CREATE POLICY "Users can view profiles in their organization" ON public.profiles
  FOR SELECT USING (org_id = get_user_org_id(auth.uid()) OR auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can manage profiles" ON public.profiles
  FOR ALL USING (has_permission('manage_users'));

-- Roles policies
CREATE POLICY "Users can view roles in their organization" ON public.roles
  FOR SELECT USING (org_id = get_user_org_id(auth.uid()));

CREATE POLICY "Admins can manage roles" ON public.roles
  FOR ALL USING (has_permission('manage_users'));

-- Permissions policies
CREATE POLICY "Users can view permissions" ON public.permissions
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Role Permissions policies
CREATE POLICY "Users can view role permissions" ON public.role_permissions
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- User Roles policies
CREATE POLICY "Users can view user roles in their organization" ON public.user_roles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = user_id AND org_id = get_user_org_id(auth.uid())
    )
  );

CREATE POLICY "Admins can manage user roles" ON public.user_roles
  FOR ALL USING (has_permission('manage_users'));

-- Categories policies
CREATE POLICY "Users can view categories in their organization" ON public.categories
  FOR SELECT USING (org_id = get_user_org_id(auth.uid()));

CREATE POLICY "Admins/Managers can manage categories" ON public.categories
  FOR ALL USING (
    org_id = get_user_org_id(auth.uid()) 
    AND (
      has_permission('manage_business_units') 
      OR (business_unit_id IS NOT NULL AND has_permission('manage_financial_data', business_unit_id))
    )
  );

-- Subcategories policies
CREATE POLICY "Users can view subcategories in their organization" ON public.subcategories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.categories 
      WHERE id = category_id AND org_id = get_user_org_id(auth.uid())
    )
  );

CREATE POLICY "Admins/Managers can manage subcategories" ON public.subcategories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.categories 
      WHERE id = category_id 
        AND org_id = get_user_org_id(auth.uid())
        AND (
          has_permission('manage_business_units') 
          OR (business_unit_id IS NOT NULL AND has_permission('manage_financial_data', business_unit_id))
        )
    )
  );

-- Transactions policies
CREATE POLICY "Users can view transactions in permitted business units" ON public.transactions
  FOR SELECT USING (
    org_id = get_user_org_id(auth.uid()) 
    AND has_permission('view_financial_data', business_unit_id)
  );

CREATE POLICY "Managers can manage transactions in their business units" ON public.transactions
  FOR ALL USING (
    org_id = get_user_org_id(auth.uid()) 
    AND has_permission('manage_financial_data', business_unit_id)
  );

-- Budgets policies
CREATE POLICY "Users can view budgets in permitted business units" ON public.budgets
  FOR SELECT USING (has_permission('view_financial_data', business_unit_id));

CREATE POLICY "Managers can manage budgets in their business units" ON public.budgets
  FOR ALL USING (has_permission('set_budgets', business_unit_id));

-- Budget Line Items policies
CREATE POLICY "Users can view budget line items in permitted units" ON public.budget_line_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.budgets 
      WHERE id = budget_id AND has_permission('view_financial_data', business_unit_id)
    )
  );

CREATE POLICY "Managers can manage budget line items in their units" ON public.budget_line_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.budgets 
      WHERE id = budget_id AND has_permission('set_budgets', business_unit_id)
    )
  );

-- Event Bookings policies
CREATE POLICY "Users can view event bookings in permitted units" ON public.event_bookings
  FOR SELECT USING (has_permission('view_financial_data', business_unit_id));

CREATE POLICY "Managers can manage event bookings in their units" ON public.event_bookings
  FOR ALL USING (has_permission('manage_financial_data', business_unit_id));

-- Menu Items policies
CREATE POLICY "Users can view menu items in their organization" ON public.menu_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.business_units 
      WHERE id = business_unit_id AND org_id = get_user_org_id(auth.uid())
    )
  );

CREATE POLICY "Managers can manage menu items in their units" ON public.menu_items
  FOR ALL USING (has_permission('manage_financial_data', business_unit_id));

-- Eatery Daily Sales policies
CREATE POLICY "Users can view eatery sales in permitted units" ON public.eatery_daily_sales
  FOR SELECT USING (has_permission('view_financial_data', business_unit_id));

CREATE POLICY "Managers can manage eatery sales in their units" ON public.eatery_daily_sales
  FOR ALL USING (has_permission('manage_financial_data', business_unit_id));

-- Laundry Orders policies
CREATE POLICY "Users can view laundry orders in permitted units" ON public.laundry_orders
  FOR SELECT USING (has_permission('view_financial_data', business_unit_id));

CREATE POLICY "Managers can manage laundry orders in their units" ON public.laundry_orders
  FOR ALL USING (has_permission('manage_financial_data', business_unit_id));

-- Daily Summaries policies
CREATE POLICY "Users can view daily summaries in permitted units" ON public.daily_summaries
  FOR SELECT USING (has_permission('view_financial_data', business_unit_id));

-- Audit Logs policies
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
  FOR SELECT USING (has_permission('manage_users'));

-- Notification Preferences policies
CREATE POLICY "Users can view/manage their own notification preferences" ON public.notification_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Device Tokens policies
CREATE POLICY "Users can manage their own device tokens" ON public.device_tokens
  FOR ALL USING (auth.uid() = user_id);

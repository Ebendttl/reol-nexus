-- Seed static system permissions
INSERT INTO public.permissions (code, description) VALUES
  ('view_financial_data', 'Allows viewing financial totals, dashboard items, transaction logs, and budgets for scoped business units.'),
  ('manage_financial_data', 'Allows recording and updating transactions, event bookings, laundry orders, and eatery sales for scoped business units.'),
  ('export_reports', 'Allows exporting dashboard views, transaction logs, and financial tables to CSV, PDF, or Excel.'),
  ('manage_users', 'Allows inviting new team members, updating user profiles, assigning roles, and viewing user audit logs.'),
  ('manage_business_units', 'Allows adding, editing, or deleting business units and updating organization-wide branding/settings.'),
  ('set_budgets', 'Allows setting, editing, and closing budgets and budget line-items for scoped business units.'),
  ('approve_expenses', 'Allows reviewing and approving expenses that cross specified budgets or limits.'),
  ('view_all_units', 'Allows viewing financial and operational data across all business units in the organization, bypassing specific manager scoping.')
ON CONFLICT (code) DO UPDATE SET description = EXCLUDED.description;

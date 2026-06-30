"use server";

import { createClient } from "../../../lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createTransaction(data: {
  business_unit_id: string;
  type: "income" | "expense";
  category_id?: string;
  amount: number;
  description: string;
  transaction_date: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Authentication required" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("id", user.id)
    .single();

  if (!profile?.org_id) return { error: "Organization not found" };

  const { error } = await supabase.from("transactions").insert({
    org_id: profile.org_id,
    business_unit_id: data.business_unit_id,
    type: data.type,
    category_id: data.category_id || null,
    amount: data.amount,
    description: data.description,
    transaction_date: data.transaction_date,
    recorded_by: user.id,
    source: "manual",
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function createEventBooking(data: {
  business_unit_id: string;
  client_name: string;
  client_contact?: string;
  event_date: string;
  package_type?: string;
  hall_name?: string;
  deposit_amount: number;
  total_quoted: number;
  status: "inquiry" | "confirmed" | "completed" | "cancelled";
  notes?: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase.from("event_bookings").insert({
    business_unit_id: data.business_unit_id,
    client_name: data.client_name,
    client_contact: data.client_contact || null,
    event_date: data.event_date,
    package_type: data.package_type || null,
    hall_name: data.hall_name || null,
    deposit_amount: data.deposit_amount,
    total_quoted: data.total_quoted,
    status: data.status,
    notes: data.notes || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function createEateryDailySale(data: {
  business_unit_id: string;
  sale_date: string;
  total_covers: number;
  total_revenue: number;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("eatery_daily_sales").insert({
    business_unit_id: data.business_unit_id,
    sale_date: data.sale_date,
    total_covers: data.total_covers,
    total_revenue: data.total_revenue,
    recorded_by: user?.id || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function createLaundryOrder(data: {
  business_unit_id: string;
  customer_name: string;
  customer_contact?: string;
  items_description: string;
  drop_off_date: string;
  pickup_date?: string;
  status: "received" | "in_progress" | "ready" | "collected";
  amount_charged: number;
}) {
  const supabase = await createClient();

  const { error } = await supabase.from("laundry_orders").insert({
    business_unit_id: data.business_unit_id,
    customer_name: data.customer_name,
    customer_contact: data.customer_contact || null,
    items_description: data.items_description,
    drop_off_date: data.drop_off_date,
    pickup_date: data.pickup_date || null,
    status: data.status,
    amount_charged: data.amount_charged,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { success: true };
}

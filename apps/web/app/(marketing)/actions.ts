"use server";

import { createClient } from "../../lib/supabase/server";

export async function submitPublicEnquiry(data: {
  business_unit_id?: string;
  type: "event_enquiry" | "laundry_pickup" | "eatery_order" | "contact" | "notify_me";
  full_name: string;
  phone?: string;
  email?: string;
  message?: string;
  metadata?: any;
}) {
  const supabase = await createClient();

  const { error } = await supabase.from("public_enquiries").insert({
    business_unit_id: data.business_unit_id || null,
    type: data.type,
    full_name: data.full_name,
    phone: data.phone || null,
    email: data.email || null,
    message: data.message || null,
    metadata: data.metadata || {},
    status: "new",
  });

  if (error) {
    console.error("Enquiry submission error:", error);
    return { error: error.message };
  }

  return { success: true };
}

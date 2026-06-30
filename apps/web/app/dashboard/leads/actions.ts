"use server";

import { createClient } from "../../../lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateEnquiryStatus(id: string, status: "new" | "contacted" | "qualified" | "closed_won" | "closed_lost") {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required" };
  }

  const { error } = await supabase
    .from("public_enquiries")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Failed to update status:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard/leads");
  return { success: true };
}

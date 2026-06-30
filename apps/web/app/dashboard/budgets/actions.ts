"use server";

import { createClient } from "../../../lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createBudget(data: {
  business_unit_id: string;
  period_start: string;
  period_end: string;
  total_amount: number;
  line_items: { category_id: string; allocated_amount: number }[];
}) {
  const supabase = await createClient();

  const { data: budget, error: budgetError } = await supabase
    .from("budgets")
    .insert({
      business_unit_id: data.business_unit_id,
      period_start: data.period_start,
      period_end: data.period_end,
      total_amount: data.total_amount,
      status: "active",
    })
    .select()
    .single();

  if (budgetError) return { error: budgetError.message };

  const items = data.line_items.map((item) => ({
    budget_id: budget.id,
    category_id: item.category_id,
    allocated_amount: item.allocated_amount,
  }));

  const { error: itemsError } = await supabase.from("budget_line_items").insert(items);
  if (itemsError) return { error: itemsError.message };

  revalidatePath("/dashboard/budgets");
  revalidatePath("/dashboard");
  return { success: true };
}

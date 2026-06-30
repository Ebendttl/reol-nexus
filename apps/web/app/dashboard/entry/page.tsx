import { createClient } from "../../../lib/supabase/server";
import EntryForm from "../../../components/dashboard/EntryForm";

export default async function EntryPage() {
  const supabase = await createClient();

  const { data: userSession } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("id", userSession.user?.id || "")
    .single();

  const orgId = profile?.org_id;

  const { data: units } = await supabase
    .from("business_units")
    .select("id, name, type, color")
    .eq("org_id", orgId || "");

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, type, business_unit_id")
    .eq("org_id", orgId || "");

  // Fallbacks if tables are empty
  const fallbackUnits = [
    { id: "bu1", name: "Event Center", type: "event_center", color: "#D4AF37" },
    { id: "bu2", name: "Eatery", type: "eatery", color: "#FF5733" },
    { id: "bu3", name: "Laundry", type: "laundry", color: "#33B5E5" },
  ];

  const fallbackCategories = [
    { id: "c1", name: "General Income", type: "income" as const, business_unit_id: null },
    { id: "c2", name: "Event Revenue", type: "income" as const, business_unit_id: "bu1" },
    { id: "c3", name: "Eatery Revenue", type: "income" as const, business_unit_id: "bu2" },
    { id: "c4", name: "Laundry Revenue", type: "income" as const, business_unit_id: "bu3" },
    { id: "c5", name: "Diesel & Generator", type: "expense" as const, business_unit_id: null },
    { id: "c6", name: "Utilities & Electricity", type: "expense" as const, business_unit_id: null },
    { id: "c7", name: "Staff Wages", type: "expense" as const, business_unit_id: null },
    { id: "c8", name: "Supplies & Materials", type: "expense" as const, business_unit_id: null },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#17221A] dark:text-[#E2EAE4]">
          Record Operational & Financial Data
        </h1>
        <p className="text-sm text-[#5C6E62] dark:text-[#90A496]">
          Managers log details here to dynamically calculate ledger positions
        </p>
      </div>

      <EntryForm 
        businessUnits={units && units.length > 0 ? units : fallbackUnits}
        categories={categories && categories.length > 0 ? categories : (fallbackCategories as any)}
      />
    </div>
  );
}

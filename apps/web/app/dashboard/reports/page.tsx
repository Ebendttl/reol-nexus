import { createClient } from "../../../lib/supabase/server";
import ReportsViewer from "../../../components/dashboard/ReportsViewer";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  transaction_date: string;
  source: string;
  business_unit: {
    name: string;
    color: string;
  };
  category: {
    name: string;
  };
}

export default async function ReportsPage() {
  const supabase = await createClient();

  const { data: userSession } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("id", userSession.user?.id || "")
    .single();

  const orgId = profile?.org_id;

  // Query actual business units
  const { data: units } = await supabase
    .from("business_units")
    .select("id, name")
    .eq("org_id", orgId || "");

  // Query actual ledger transactions
  const { data: dbTransactions } = await supabase
    .from("transactions")
    .select("*, business_units(name, color), categories(name)")
    .order("transaction_date", { ascending: false });

  // Fallbacks if data does not exist
  const fallbackUnits = [
    { id: "bu1", name: "Event Center" },
    { id: "bu2", name: "Eatery" },
    { id: "bu3", name: "Laundry" },
  ];

  const fallbackTransactions: Transaction[] = [
    {
      id: "t1",
      type: "income",
      amount: 250000,
      description: "Booking Deposit - Wedding Reception (Hall A)",
      transaction_date: "2026-06-30",
      source: "booking",
      business_unit: { name: "Event Center", color: "#D4AF37" },
      category: { name: "Event Revenue" },
    },
    {
      id: "t2",
      type: "expense",
      amount: 85000,
      description: "Purchase of 50L Diesel for Central Generator",
      transaction_date: "2026-06-30",
      source: "manual",
      business_unit: { name: "Event Center", color: "#D4AF37" },
      category: { name: "Diesel & Generator" },
    },
    {
      id: "t3",
      type: "income",
      amount: 180000,
      description: "Daily Eatery Sales Summary",
      transaction_date: "2026-06-30",
      source: "sale",
      business_unit: { name: "Eatery", color: "#FF5733" },
      category: { name: "Eatery Revenue" },
    },
    {
      id: "t4",
      type: "income",
      amount: 90000,
      description: "Laundry Collected - Bulk dry cleaning client",
      transaction_date: "2026-06-29",
      source: "order",
      business_unit: { name: "Laundry", color: "#33B5E5" },
      category: { name: "Laundry Revenue" },
    },
    {
      id: "t5",
      type: "expense",
      amount: 35000,
      description: "Eatery - Restocking fresh produce and baking supplies",
      transaction_date: "2026-06-29",
      source: "manual",
      business_unit: { name: "Eatery", color: "#FF5733" },
      category: { name: "Supplies & Materials" },
    },
    {
      id: "t6",
      type: "expense",
      amount: 12000,
      description: "Laundry - Purchased stain removing chemical agents",
      transaction_date: "2026-06-28",
      source: "manual",
      business_unit: { name: "Laundry", color: "#33B5E5" },
      category: { name: "Supplies & Materials" },
    },
  ];

  const hasTransactions = dbTransactions && dbTransactions.length > 0;

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#17221A] dark:text-[#E2EAE4]">
          Ledger Reports & Audit Log
        </h1>
        <p className="text-sm text-[#5C6E62] dark:text-[#90A496]">
          View, search, filter, and export the unified master transaction history
        </p>
      </div>

      <ReportsViewer
        initialTransactions={hasTransactions ? (dbTransactions as unknown as Transaction[]) : fallbackTransactions}
        businessUnits={units && units.length > 0 ? units : fallbackUnits}
      />

    </div>
  );
}

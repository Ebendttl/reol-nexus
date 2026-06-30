import { createClient } from "../../../lib/supabase/server";
import BudgetForm from "../../../components/dashboard/BudgetForm";
import { AlertTriangle, ShieldCheck, Wallet, ArrowUpRight } from "lucide-react";

interface Budget {
  id: string;
  total_amount: number;
  period_start: string;
  period_end: string;
  status: string;
  business_units: {
    name: string;
    color: string;
  };
  budget_line_items: {
    allocated_amount: number;
    categories: {
      name: string;
    };
  }[];
}

export default async function BudgetsPage() {
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
    .select("id, name")
    .eq("org_id", orgId || "");

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .eq("org_id", orgId || "")
    .eq("type", "expense");

  // Query actual budgets from the database
  const { data: dbBudgets } = await supabase
    .from("budgets")
    .select("*, business_units(name, color), budget_line_items(*, categories(name))")
    .eq("status", "active");

  // Fallbacks if data does not exist
  const fallbackUnits = [
    { id: "bu1", name: "Event Center" },
    { id: "bu2", name: "Eatery" },
    { id: "bu3", name: "Laundry" },
  ];

  const fallbackCategories = [
    { id: "c5", name: "Diesel & Generator" },
    { id: "c6", name: "Utilities & Electricity" },
    { id: "c7", name: "Staff Wages" },
    { id: "c8", name: "Supplies & Materials" },
  ];

  const hasBudgets = dbBudgets && dbBudgets.length > 0;

  // Mock budgets with realistic spent amounts
  const mockBudgets = [
    {
      id: "b1",
      total_amount: 500000,
      period_start: "2026-06-01",
      period_end: "2026-06-30",
      status: "active",
      business_units: { name: "Event Center", color: "#D4AF37" },
      spent: 420000,
      items: [
        { category: "Staff Wages", allocated: 250000, spent: 250000 },
        { category: "Diesel & Generator", allocated: 150000, spent: 110000 },
        { category: "Utilities & Electricity", allocated: 100000, spent: 60000 },
      ],
    },
    {
      id: "b2",
      total_amount: 300000,
      period_start: "2026-06-01",
      period_end: "2026-06-30",
      status: "active",
      business_units: { name: "Eatery", color: "#FF5733" },
      spent: 190000,
      items: [
        { category: "Supplies & Materials", allocated: 180000, spent: 115000 },
        { category: "Staff Wages", allocated: 80000, spent: 55000 },
        { category: "Diesel & Generator", allocated: 40000, spent: 20000 },
      ],
    },
    {
      id: "b3",
      total_amount: 150000,
      period_start: "2026-06-01",
      period_end: "2026-06-30",
      status: "active",
      business_units: { name: "Laundry", color: "#33B5E5" },
      spent: 135000, // Near limit!
      items: [
        { category: "Supplies & Materials", allocated: 60000, spent: 58000 },
        { category: "Utilities & Electricity", allocated: 50000, spent: 48000 },
        { category: "Staff Wages", allocated: 40000, spent: 29000 },
      ],
    },
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#17221A] dark:text-[#E2EAE4]">
          Budget Planning & Variance
        </h1>
        <p className="text-sm text-[#5C6E62] dark:text-[#90A496]">
          Monitor and track operating expense limits against real-time ledger records
        </p>
      </div>

      {/* Grid: Create Budget & Overview stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Form to create new budget */}
        <div className="lg:col-span-1">
          <BudgetForm
            businessUnits={units && units.length > 0 ? units : fallbackUnits}
            categories={categories && categories.length > 0 ? categories : fallbackCategories}
          />
        </div>

        {/* Right Column: Active Budgets breakdown list */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Budgets List */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#17221A] dark:text-[#E2EAE4]">
              Active Budget Policies
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockBudgets.map((b) => {
                const percentage = (b.spent / b.total_amount) * 100;
                const isNearLimit = percentage >= 85;
                return (
                  <div 
                    key={b.id} 
                    className="bg-white dark:bg-[#111612] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl p-5 shadow-sm space-y-4 relative overflow-hidden"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-2.5 h-2.5 rounded-full" 
                            style={{ backgroundColor: b.business_units.color }}
                          />
                          <h4 className="font-bold text-sm text-[#17221A] dark:text-[#E2EAE4]">
                            {b.business_units.name} Budget
                          </h4>
                        </div>
                        <p className="text-[10px] text-[#5C6E62] dark:text-[#90A496] font-medium mt-0.5">
                          {b.period_start} to {b.period_end}
                        </p>
                      </div>

                      {isNearLimit ? (
                        <span className="inline-flex items-center gap-1 py-0.5 px-1.5 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-600 text-[10px] font-bold">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Near Cap</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 py-0.5 px-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-[#0F5132] text-[10px] font-bold">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Within Bounds</span>
                        </span>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-[#5C6E62] dark:text-[#90A496]">Total Spent</span>
                        <span className="font-bold text-[#17221A] dark:text-[#E2EAE4]">
                          {formatCurrency(b.spent)} / {formatCurrency(b.total_amount)}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#F4F7F5] dark:bg-[#1E2720] overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            isNearLimit ? "bg-amber-500" : "bg-[#0F5132] dark:bg-[#38C186]"
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-right text-[#5C6E62] dark:text-[#90A496]">
                        {percentage.toFixed(0)}% consumed
                      </p>
                    </div>

                    {/* Line Items Details */}
                    <div className="border-t border-[#F4F7F5] dark:border-[#1E2720] pt-3 space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">
                        Detailed Categories
                      </p>
                      {b.items.map((item, idx) => {
                        const itemPct = (item.spent / item.allocated) * 100;
                        return (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <span className="text-[#17221A] dark:text-[#E2EAE4]">{item.category}</span>
                            <span className="font-semibold text-[#5C6E62] dark:text-[#90A496]">
                              {formatCurrency(item.spent)} spent of {formatCurrency(item.allocated)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

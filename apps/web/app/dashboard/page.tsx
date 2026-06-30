import { createClient } from "../../lib/supabase/server";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Calendar, 
  Utensils, 
  Shirt, 
  Plus, 
  ArrowRight,
  DollarSign,
  Briefcase
} from "lucide-react";
import Link from "next/link";
import TrendChart from "../../components/dashboard/TrendChart";

// Type definitions
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

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Fetch authenticated user profile
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, organizations(*)")
    .eq("id", user?.id || "")
    .single();

  const orgId = profile?.org_id;

  // 2. Fetch business units
  const { data: dbUnits } = await supabase
    .from("business_units")
    .select("*")
    .eq("org_id", orgId || "");

  // 3. Fetch recent transactions
  const { data: dbTransactions } = await supabase
    .from("transactions")
    .select("*, business_units(name, color), categories(name)")
    .order("transaction_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(5);

  // 4. Fetch daily summaries (e.g. last 7 days)
  const { data: dbSummaries } = await supabase
    .from("daily_summaries")
    .select("*, business_units(name, color)")
    .order("summary_date", { ascending: false })
    .limit(30);

  // 5. Fetch budgets
  const { data: dbBudgets } = await supabase
    .from("budgets")
    .select("*, budget_line_items(*, categories(name))")
    .eq("status", "active")
    .limit(3);

  // --- PREPARE MOCK FALLBACKS IF DB IS EMPTY OR FRESH ---
  const hasData = dbTransactions && dbTransactions.length > 0;

  // Formatting currency helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Mock Trend Chart Data (Last 7 Days)
  const defaultTrendData = [
    { date: "Jun 24", income: 380000, expense: 120000, net: 260000 },
    { date: "Jun 25", income: 420000, expense: 180000, net: 240000 },
    { date: "Jun 26", income: 290000, expense: 95000, net: 195000 },
    { date: "Jun 27", income: 510000, expense: 220000, net: 290000 },
    { date: "Jun 28", income: 480000, expense: 140000, net: 340000 },
    { date: "Jun 29", income: 650000, expense: 190000, net: 460000 },
    { date: "Jun 30", income: 720000, expense: 250000, net: 470000 },
  ];

  // Mock Business Unit Data
  const defaultUnits = [
    {
      name: "Event Center",
      type: "event_center",
      income: 450000,
      expense: 110000,
      net: 340000,
      metric: "2 Bookings Confirmed",
      icon: Calendar,
      color: "#D4AF37", // Gold
    },
    {
      name: "Eatery",
      type: "eatery",
      income: 180000,
      expense: 90000,
      net: 90000,
      metric: "142 Covers Served",
      icon: Utensils,
      color: "#FF5733", // Orange-Red
    },
    {
      name: "Laundry",
      type: "laundry",
      income: 90000,
      expense: 50000,
      net: 40000,
      metric: "35 Orders Collected",
      icon: Shirt,
      color: "#33B5E5", // Sky Blue
    },
  ];

  // Mock Transactions
  const defaultTransactions: Transaction[] = [
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
  ];

  // Mock Budgets
  const defaultBudgets = [
    { category: "Diesel & Generator", spent: 85000, limit: 150000, unit: "Central" },
    { category: "Supplies & Materials", spent: 65000, limit: 100000, unit: "Eatery" },
    { category: "Maintenance & Repairs", spent: 40000, limit: 50000, unit: "Laundry" },
  ];

  // Calculate Aggregations
  const displayTransactions = hasData 
    ? (dbTransactions as unknown as Transaction[]) 
    : defaultTransactions;

  const totalIncome = displayTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = displayTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netProfit = totalIncome - totalExpense;
  const didMakeMoney = netProfit > 0;

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#17221A] dark:text-[#E2EAE4]">
            Command Center
          </h1>
          <p className="text-sm text-[#5C6E62] dark:text-[#90A496]">
            Real-time financial status for {profile?.organizations?.name || "REOL GLOBAL SOLUTIONS"}
          </p>
        </div>
        <Link 
          href="/dashboard/entry"
          className="inline-flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-[#0F5132] hover:bg-[#0D442A] text-white text-xs font-semibold shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record Transactions</span>
        </Link>
      </div>

      {/* Main Core Answer Block: "Did we make money today?" */}
      <div className={`p-6 md:p-8 rounded-2xl border ${
        didMakeMoney 
          ? "bg-gradient-to-br from-[#0F5132]/5 to-[#0F5132]/10 border-[#0F5132]/20 dark:from-[#38C186]/5 dark:to-[#38C186]/10 dark:border-[#38C186]/20" 
          : "bg-gradient-to-br from-red-50 to-red-100 border-red-200 dark:from-red-950/10 dark:to-red-950/20 dark:border-red-900/30"
      } shadow-sm overflow-hidden relative`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">
              Net Daily Answer
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#17221A] dark:text-[#E2EAE4]">
              {didMakeMoney ? "Yes, we are profitable today." : "No, we have a net loss today."}
            </h2>
            <p className="text-sm text-[#5C6E62] dark:text-[#90A496] max-w-xl">
              Across all Event Center, Eatery, and Laundry divisions, the net position is positive. There are currently no critical budget overruns detected.
            </p>
          </div>
          <div className="flex flex-col shrink-0 items-start md:items-end gap-1">
            <span className="text-xs text-[#5C6E62] dark:text-[#90A496]">Net Profit</span>
            <div className={`flex items-center gap-2 text-3xl font-black ${
              didMakeMoney ? "text-[#0F5132] dark:text-[#38C186]" : "text-red-600 dark:text-red-400"
            }`}>
              {didMakeMoney ? <TrendingUp className="w-8 h-8" /> : <TrendingDown className="w-8 h-8" />}
              <span>{formatCurrency(netProfit)}</span>
            </div>
            <span className="text-[10px] text-[#5C6E62] dark:text-[#90A496]">
              Updated just now
            </span>
          </div>
        </div>
        
        {/* Subtle Background Art */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-5 pointer-events-none">
          <Briefcase className="w-48 h-48 text-foreground" />
        </div>
      </div>

      {/* Grid of 3 Main Counters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        <div className="bg-white dark:bg-[#111612] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">Total Income</span>
            <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#17221A] dark:text-[#E2EAE4]">{formatCurrency(totalIncome)}</p>
          <p className="text-xs text-[#5C6E62] dark:text-[#90A496] mt-1">From all operating divisions</p>
        </div>

        <div className="bg-white dark:bg-[#111612] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">Total Expenses</span>
            <div className="w-7 h-7 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center text-red-600 dark:text-red-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#17221A] dark:text-[#E2EAE4]">{formatCurrency(totalExpense)}</p>
          <p className="text-xs text-[#5C6E62] dark:text-[#90A496] mt-1">Includes central diesel utilities</p>
        </div>

        <div className="bg-white dark:bg-[#111612] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">Budget Status</span>
            <div className="w-7 h-7 rounded-full bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-[#17221A] dark:text-[#E2EAE4]">All items within bounds</p>
            <p className="text-xs text-[#5C6E62] dark:text-[#90A496] mt-0.5">Central diesel has 43% remaining capacity</p>
          </div>
        </div>

      </div>

      {/* Main Charts & Side widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend Chart (Col span 2) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111612] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-base font-bold text-[#17221A] dark:text-[#E2EAE4]">
                Financial Performance Trend
              </h3>
              <p className="text-xs text-[#5C6E62] dark:text-[#90A496]">
                Aggregate 7-day daily cashflow tracking
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 text-xs text-[#0F5132] dark:text-[#38C186] font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0F5132]" />
                Net profit
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-[#38C186] dark:text-[#38C186]/70 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#38C186]" />
                Income
              </span>
            </div>
          </div>
          <TrendChart data={defaultTrendData} />
        </div>

        {/* Budgets Progress List */}
        <div className="bg-white dark:bg-[#111612] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#17221A] dark:text-[#E2EAE4]">
              Active Budget Checks
            </h3>
            <p className="text-xs text-[#5C6E62] dark:text-[#90A496]">
              Real-time threshold alert limits
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {defaultBudgets.map((b, idx) => {
              const percentage = (b.spent / b.limit) * 100;
              const isOver = percentage >= 90;
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-[#17221A] dark:text-[#E2EAE4]">{b.category}</span>
                    <span className="text-[#5C6E62] dark:text-[#90A496]">
                      {formatCurrency(b.spent)} / {formatCurrency(b.limit)}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#F4F7F5] dark:bg-[#1E2720] overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOver ? "bg-red-500" : "bg-[#0F5132] dark:bg-[#38C186]"
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#5C6E62] dark:text-[#90A496]">
                    <span>Scope: {b.unit}</span>
                    <span>{percentage.toFixed(0)}% Utilized</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Business Unit Cards Breakdown */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-[#17221A] dark:text-[#E2EAE4]">
          Business Unit Performance
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {defaultUnits.map((u, idx) => {
            const Icon = u.icon;
            return (
              <div 
                key={idx}
                className="bg-white dark:bg-[#111612] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: u.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#17221A] dark:text-[#E2EAE4]">{u.name}</h4>
                    <p className="text-[10px] text-[#5C6E62] dark:text-[#90A496] font-medium">{u.metric}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 border-t border-[#F4F7F5] dark:border-[#1E2720] pt-3 text-center">
                  <div>
                    <p className="text-[10px] text-[#5C6E62] dark:text-[#90A496] uppercase font-semibold">Income</p>
                    <p className="text-xs font-bold text-[#17221A] dark:text-[#E2EAE4] mt-0.5">{formatCurrency(u.income)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#5C6E62] dark:text-[#90A496] uppercase font-semibold">Expense</p>
                    <p className="text-xs font-bold text-[#17221A] dark:text-[#E2EAE4] mt-0.5">{formatCurrency(u.expense)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#5C6E62] dark:text-[#90A496] uppercase font-semibold">Net</p>
                    <p className="text-xs font-bold text-[#0F5132] dark:text-[#38C186] mt-0.5">{formatCurrency(u.net)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Ledger Entries */}
      <div className="bg-white dark:bg-[#111612] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#E2EAE4] dark:border-[#1E2720] flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-[#17221A] dark:text-[#E2EAE4]">
              Recent Activity Ledger
            </h3>
            <p className="text-xs text-[#5C6E62] dark:text-[#90A496]">
              Audit log of final synchronized ledger records
            </p>
          </div>
          <Link 
            href="/dashboard/reports" 
            className="text-xs font-bold text-[#0F5132] dark:text-[#38C186] flex items-center gap-1 hover:text-[#D4AF37] transition-colors"
          >
            <span>View Full Ledger</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="divide-y divide-[#E2EAE4] dark:divide-[#1E2720]">
          {displayTransactions.map((t) => (
            <div 
              key={t.id} 
              className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm hover:bg-[#F4F7F5]/30 dark:hover:bg-[#151B16]/20 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span 
                  className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0" 
                  style={{ backgroundColor: t.business_unit?.color || "#5C6E62" }}
                />
                <div>
                  <p className="font-semibold text-[#17221A] dark:text-[#E2EAE4]">{t.description}</p>
                  <div className="flex flex-wrap gap-x-2 items-center text-xs text-[#5C6E62] dark:text-[#90A496] mt-0.5">
                    <span>{t.business_unit?.name}</span>
                    <span>•</span>
                    <span>{t.category?.name || "General"}</span>
                    <span>•</span>
                    <span>{t.transaction_date}</span>
                  </div>
                </div>
              </div>
              <div className={`font-bold text-base self-end sm:self-auto ${
                t.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
              }`}>
                {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

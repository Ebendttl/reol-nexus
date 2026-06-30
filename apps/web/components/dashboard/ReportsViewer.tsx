"use client";

import { useState } from "react";
import { 
  Download, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Filter, 
  Calendar,
  FileText
} from "lucide-react";

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

interface ReportsViewerProps {
  initialTransactions: Transaction[];
  businessUnits: { id: string; name: string }[];
}

export default function ReportsViewer({ initialTransactions, businessUnits }: ReportsViewerProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  
  // Filter States
  const [selectedUnit, setSelectedUnit] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filtering Logic
  const filteredTransactions = transactions.filter((t) => {
    // Business Unit filter
    if (selectedUnit !== "all" && t.business_unit?.name !== selectedUnit) {
      return false;
    }
    // Type filter
    if (selectedType !== "all" && t.type !== selectedType) {
      return false;
    }
    // Start Date filter
    if (startDate && t.transaction_date < startDate) {
      return false;
    }
    // End Date filter
    if (endDate && t.transaction_date > endDate) {
      return false;
    }
    // Text search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const desc = t.description.toLowerCase();
      const cat = t.category?.name.toLowerCase() || "";
      if (!desc.includes(q) && !cat.includes(q)) {
        return false;
      }
    }
    return true;
  });

  // Aggregations
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netProfit = totalIncome - totalExpense;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    const headers = ["Date", "Business Unit", "Type", "Category", "Description", "Amount (NGN)", "Source"];
    const rows = filteredTransactions.map((t) => [
      t.transaction_date,
      t.business_unit?.name || "General",
      t.type.toUpperCase(),
      t.category?.name || "Uncategorized",
      t.description.replace(/"/g, '""'),
      t.amount,
      t.source
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((val) => `"${val}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `reol_nexus_ledger_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Aggregation Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-[#111612] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">Blended Income</span>
            <span className="text-emerald-600 dark:text-emerald-400"><TrendingUp className="w-4 h-4" /></span>
          </div>
          <p className="text-2xl font-bold text-[#17221A] dark:text-[#E2EAE4]">{formatCurrency(totalIncome)}</p>
          <p className="text-xs text-[#5C6E62] dark:text-[#90A496] mt-1">Based on {filteredTransactions.filter(t => t.type === 'income').length} items</p>
        </div>

        <div className="bg-white dark:bg-[#111612] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">Blended Expense</span>
            <span className="text-red-600 dark:text-red-400"><TrendingDown className="w-4 h-4" /></span>
          </div>
          <p className="text-2xl font-bold text-[#17221A] dark:text-[#E2EAE4]">{formatCurrency(totalExpense)}</p>
          <p className="text-xs text-[#5C6E62] dark:text-[#90A496] mt-1">Based on {filteredTransactions.filter(t => t.type === 'expense').length} items</p>
        </div>

        <div className="bg-white dark:bg-[#111612] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">Net Position</span>
            <span className={netProfit >= 0 ? "text-[#0F5132]" : "text-red-600"}><FileText className="w-4 h-4" /></span>
          </div>
          <p className={`text-2xl font-bold ${netProfit >= 0 ? "text-[#0F5132] dark:text-[#38C186]" : "text-red-600"}`}>
            {formatCurrency(netProfit)}
          </p>
          <p className="text-xs text-[#5C6E62] dark:text-[#90A496] mt-1">Blended operational status</p>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white dark:bg-[#111612] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 font-bold text-sm text-[#17221A] dark:text-[#E2EAE4]">
          <Filter className="w-4.5 h-4.5 text-[#0F5132] dark:text-[#38C186]" />
          <span>Ledger Filter Options</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
          {/* Business Unit dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">Division</label>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#E2EAE4] dark:border-[#1E2720] bg-white dark:bg-[#151B16] text-xs font-medium text-[#17221A] dark:text-[#E2EAE4] focus:outline-none focus:ring-1 focus:ring-[#0F5132]"
            >
              <option value="all">All Divisions</option>
              {businessUnits.map((bu) => (
                <option key={bu.id} value={bu.name}>{bu.name}</option>
              ))}
            </select>
          </div>

          {/* Type dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#E2EAE4] dark:border-[#1E2720] bg-white dark:bg-[#151B16] text-xs font-medium text-[#17221A] dark:text-[#E2EAE4] focus:outline-none focus:ring-1 focus:ring-[#0F5132]"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Start Date */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#E2EAE4] dark:border-[#1E2720] bg-white dark:bg-[#151B16] text-xs font-medium text-[#17221A] dark:text-[#E2EAE4] focus:outline-none focus:ring-1 focus:ring-[#0F5132]"
            />
          </div>

          {/* End Date */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#E2EAE4] dark:border-[#1E2720] bg-white dark:bg-[#151B16] text-xs font-medium text-[#17221A] dark:text-[#E2EAE4] focus:outline-none focus:ring-1 focus:ring-[#0F5132]"
            />
          </div>

          {/* Search Box */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">Search</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-[#5C6E62] dark:text-[#90A496]" />
              <input
                type="text"
                placeholder="Description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-[#E2EAE4] dark:border-[#1E2720] bg-white dark:bg-[#151B16] text-xs font-medium text-[#17221A] dark:text-[#E2EAE4] focus:outline-none focus:ring-1 focus:ring-[#0F5132]"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center border-t border-[#F4F7F5] dark:border-[#1E2720] pt-4">
          <p className="text-xs text-[#5C6E62] dark:text-[#90A496] font-medium">
            Showing {filteredTransactions.length} of {transactions.length} records
          </p>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 py-1.5 px-3 bg-[#0F5132] hover:bg-[#0D442A] text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white dark:bg-[#111612] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-[#F4F7F5] dark:bg-[#151B16] border-b border-[#E2EAE4] dark:border-[#1E2720]">
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">Date</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">Division</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">Category</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">Description</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">Source</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496] text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2EAE4] dark:divide-[#1E2720]">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-[#F4F7F5]/30 dark:hover:bg-[#151B16]/20 transition-colors">
                    <td className="p-4 whitespace-nowrap text-[#17221A] dark:text-[#E2EAE4] text-xs font-medium">{t.transaction_date}</td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: t.business_unit?.color || "#5C6E62" }}
                        />
                        <span className="text-xs font-semibold text-[#17221A] dark:text-[#E2EAE4]">
                          {t.business_unit?.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap text-[#5C6E62] dark:text-[#90A496] text-xs">{t.category?.name || "General"}</td>
                    <td className="p-4 text-[#17221A] dark:text-[#E2EAE4] text-xs font-medium max-w-xs truncate">{t.description}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="inline-block py-0.5 px-2 bg-[#F4F7F5] dark:bg-[#151B16] border border-[#E2EAE4] dark:border-[#1E2720] rounded text-[10px] font-bold text-[#5C6E62] dark:text-[#90A496] uppercase">
                        {t.source}
                      </span>
                    </td>
                    <td className={`p-4 whitespace-nowrap text-right font-bold text-xs ${
                      t.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                    }`}>
                      {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-[#5C6E62] dark:text-[#90A496] font-medium">
                    No ledger records match the selected filter conditions.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

"use client";

import { useState } from "react";
import { createBudget } from "../../app/dashboard/budgets/actions";
import { Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";

interface BusinessUnit {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface BudgetFormProps {
  businessUnits: BusinessUnit[];
  categories: Category[];
}

export default function BudgetForm({ businessUnits, categories }: BudgetFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form State
  const [selectedUnit, setSelectedUnit] = useState(businessUnits[0]?.id || "");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  
  // Dynamic line items list
  const [lineItems, setLineItems] = useState<{ category_id: string; allocated_amount: number }[]>([
    { category_id: "", allocated_amount: 0 }
  ]);

  const addLineItem = () => {
    setLineItems([...lineItems, { category_id: "", allocated_amount: 0 }]);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, idx) => idx !== index));
  };

  const updateLineItemCategory = (index: number, categoryId: string) => {
    const updated = [...lineItems];
    updated[index].category_id = categoryId;
    setLineItems(updated);
  };

  const updateLineItemAmount = (index: number, amount: number) => {
    const updated = [...lineItems];
    updated[index].allocated_amount = amount;
    setLineItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Basic Validation
    if (!selectedUnit || !periodStart || !periodEnd) {
      setError("Please complete all general budget fields.");
      setLoading(false);
      return;
    }

    const validItems = lineItems.filter(item => item.category_id && item.allocated_amount > 0);
    if (validItems.length === 0) {
      setError("Please add at least one line item with a category and positive amount.");
      setLoading(false);
      return;
    }

    const totalAmount = validItems.reduce((sum, item) => sum + item.allocated_amount, 0);

    const payload = {
      business_unit_id: selectedUnit,
      period_start: periodStart,
      period_end: periodEnd,
      total_amount: totalAmount,
      line_items: validItems,
    };

    const res = await createBudget(payload);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setSuccess("Budget policy established successfully!");
      setPeriodStart("");
      setPeriodEnd("");
      setLineItems([{ category_id: "", allocated_amount: 0 }]);
    }
  };

  return (
    <div className="bg-white dark:bg-[#111612] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl p-6 shadow-sm">
      <h3 className="text-base font-bold text-[#17221A] dark:text-[#E2EAE4] mb-4">
        Establish New Budget Allocation
      </h3>

      {error && (
        <div className="flex items-center gap-2.5 p-3 mb-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2.5 p-3 mb-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-[#1E2720] text-emerald-600 dark:text-emerald-400 text-sm">
          <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">
              Business Unit
            </label>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2EAE4] dark:border-[#1E2720] bg-white dark:bg-[#151B16] text-[#17221A] dark:text-[#E2EAE4] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
            >
              {businessUnits.map((bu) => (
                <option key={bu.id} value={bu.id}>
                  {bu.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">
              Period Start
            </label>
            <input
              type="date"
              required
              value={periodStart}
              onChange={(e) => setPeriodStart(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2EAE4] dark:border-[#1E2720] bg-white dark:bg-[#151B16] text-[#17221A] dark:text-[#E2EAE4] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">
              Period End
            </label>
            <input
              type="date"
              required
              value={periodEnd}
              onChange={(e) => setPeriodEnd(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2EAE4] dark:border-[#1E2720] bg-white dark:bg-[#151B16] text-[#17221A] dark:text-[#E2EAE4] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
            />
          </div>
        </div>

        {/* Line Items List */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#17221A] dark:text-[#E2EAE4]">
              Category Line Items
            </h4>
            <button
              type="button"
              onClick={addLineItem}
              className="inline-flex items-center gap-1.5 text-xs text-[#0F5132] dark:text-[#38C186] font-bold hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Line Item</span>
            </button>
          </div>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {lineItems.map((item, idx) => (
              <div key={idx} className="flex gap-3 items-center">
                <div className="flex-1">
                  <select
                    value={item.category_id}
                    required
                    onChange={(e) => updateLineItemCategory(idx, e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#E2EAE4] dark:border-[#1E2720] bg-white dark:bg-[#151B16] text-[#17221A] dark:text-[#E2EAE4] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-1/3">
                  <input
                    type="number"
                    required
                    placeholder="Limit Amount"
                    value={item.allocated_amount || ""}
                    onChange={(e) => updateLineItemAmount(idx, Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#E2EAE4] dark:border-[#1E2720] bg-white dark:bg-[#151B16] text-[#17221A] dark:text-[#E2EAE4] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                  />
                </div>
                {lineItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLineItem(idx)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#0F5132] hover:bg-[#0D442A] text-white font-medium text-sm transition-colors border-b-4 border-[#09321F] disabled:opacity-50 mt-4"
        >
          {loading ? (
            <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            <span>Create Budget Allocation</span>
          )}
        </button>
      </form>
    </div>
  );
}

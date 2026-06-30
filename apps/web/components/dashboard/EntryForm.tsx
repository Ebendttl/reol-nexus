"use client";

import { useState } from "react";
import { 
  createTransaction, 
  createEventBooking, 
  createEateryDailySale, 
  createLaundryOrder 
} from "../../app/dashboard/entry/actions";
import { 
  PlusCircle, 
  Calendar, 
  Utensils, 
  Shirt, 
  AlertCircle, 
  CheckCircle2, 
  DollarSign, 
  FileText 
} from "lucide-react";

interface BusinessUnit {
  id: string;
  name: string;
  type: string;
  color: string;
}

interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  business_unit_id: string | null;
}

interface EntryFormProps {
  businessUnits: BusinessUnit[];
  categories: Category[];
}

type TabType = "ledger" | "booking" | "eatery" | "laundry";

export default function EntryForm({ businessUnits, categories }: EntryFormProps) {
  const [activeTab, setActiveTab] = useState<TabType>("ledger");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [ledgerBU, setLedgerBU] = useState(businessUnits[0]?.id || "");
  const [ledgerType, setLedgerType] = useState<"income" | "expense">("income");

  const filteredCategories = categories.filter(
    (c) => c.type === ledgerType && (!c.business_unit_id || c.business_unit_id === ledgerBU)
  );

  const resetMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleLedgerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const amount = Number(formData.get("amount"));
    
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount greater than 0");
      setLoading(false);
      return;
    }

    const payload = {
      business_unit_id: formData.get("business_unit_id") as string,
      type: ledgerType,
      category_id: formData.get("category_id") as string,
      amount,
      description: formData.get("description") as string,
      transaction_date: formData.get("transaction_date") as string,
    };

    const res = await createTransaction(payload);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setSuccess("General ledger transaction recorded successfully!");
      e.currentTarget.reset();
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const totalQuoted = Number(formData.get("total_quoted"));
    const depositAmount = Number(formData.get("deposit_amount"));

    if (isNaN(totalQuoted) || totalQuoted <= 0) {
      setError("Please enter a valid quote amount");
      setLoading(false);
      return;
    }

    const eventUnit = businessUnits.find((b) => b.type === "event_center")?.id || "";

    const payload = {
      business_unit_id: eventUnit,
      client_name: formData.get("client_name") as string,
      client_contact: formData.get("client_contact") as string,
      event_date: formData.get("event_date") as string,
      package_type: formData.get("package_type") as string,
      hall_name: formData.get("hall_name") as string,
      deposit_amount: depositAmount || 0,
      total_quoted: totalQuoted,
      status: formData.get("status") as any,
      notes: formData.get("notes") as string,
    };

    const res = await createEventBooking(payload);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setSuccess("Event booking created and synchronized with ledger!");
      e.currentTarget.reset();
    }
  };

  const handleEaterySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const totalCovers = Number(formData.get("total_covers"));
    const totalRevenue = Number(formData.get("total_revenue"));

    if (isNaN(totalCovers) || totalCovers < 0) {
      setError("Total covers must be a valid number");
      setLoading(false);
      return;
    }

    if (isNaN(totalRevenue) || totalRevenue <= 0) {
      setError("Total revenue must be a valid positive amount");
      setLoading(false);
      return;
    }

    const eateryUnit = businessUnits.find((b) => b.type === "eatery")?.id || "";

    const payload = {
      business_unit_id: eateryUnit,
      sale_date: formData.get("sale_date") as string,
      total_covers: totalCovers,
      total_revenue: totalRevenue,
    };

    const res = await createEateryDailySale(payload);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setSuccess("Eatery daily sales recorded and synchronized with ledger!");
      e.currentTarget.reset();
    }
  };

  const handleLaundrySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const amountCharged = Number(formData.get("amount_charged"));

    if (isNaN(amountCharged) || amountCharged <= 0) {
      setError("Amount charged must be a valid positive number");
      setLoading(false);
      return;
    }

    const laundryUnit = businessUnits.find((b) => b.type === "laundry")?.id || "";

    const payload = {
      business_unit_id: laundryUnit,
      customer_name: formData.get("customer_name") as string,
      customer_contact: formData.get("customer_contact") as string,
      items_description: formData.get("items_description") as string,
      drop_off_date: formData.get("drop_off_date") as string,
      pickup_date: formData.get("pickup_date") as string || undefined,
      status: formData.get("status") as any,
      amount_charged: amountCharged,
    };

    const res = await createLaundryOrder(payload);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setSuccess("Laundry order logged and synchronized with ledger!");
      e.currentTarget.reset();
    }
  };

  return (
    <div className="space-y-6">
      {/* Messages */}
      {error && (
        <div className="flex items-center gap-2.5 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2.5 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-[#1E2720] text-emerald-600 dark:text-emerald-400 text-sm animate-pulse">
          <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-1 bg-white dark:bg-[#111612] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl p-1.5 shadow-sm scrollbar-none">
        <button
          onClick={() => { setActiveTab("ledger"); resetMessages(); }}
          className={`flex items-center gap-2 shrink-0 py-2.5 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
            activeTab === "ledger"
              ? "bg-[#0F5132] text-white"
              : "text-[#5C6E62] dark:text-[#90A496] hover:bg-[#F4F7F5] dark:hover:bg-[#151B16]"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Ledger Entry</span>
        </button>
        <button
          onClick={() => { setActiveTab("booking"); resetMessages(); }}
          className={`flex items-center gap-2 shrink-0 py-2.5 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
            activeTab === "booking"
              ? "bg-[#0F5132] text-white"
              : "text-[#5C6E62] dark:text-[#90A496] hover:bg-[#F4F7F5] dark:hover:bg-[#151B16]"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Event Center</span>
        </button>
        <button
          onClick={() => { setActiveTab("eatery"); resetMessages(); }}
          className={`flex items-center gap-2 shrink-0 py-2.5 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
            activeTab === "eatery"
              ? "bg-[#0F5132] text-white"
              : "text-[#5C6E62] dark:text-[#90A496] hover:bg-[#F4F7F5] dark:hover:bg-[#151B16]"
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Eatery</span>
        </button>
        <button
          onClick={() => { setActiveTab("laundry"); resetMessages(); }}
          className={`flex items-center gap-2 shrink-0 py-2.5 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
            activeTab === "laundry"
              ? "bg-[#0F5132] text-white"
              : "text-[#5C6E62] dark:text-[#90A496] hover:bg-[#F4F7F5] dark:hover:bg-[#151B16]"
          }`}
        >
          <Shirt className="w-4 h-4" />
          <span>Laundry</span>
        </button>
      </div>

      {/* Main card panel */}
      <div className="bg-white dark:bg-[#111612] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl p-6 shadow-sm">
        
        {/* Ledger Entry Form */}
        {activeTab === "ledger" && (
          <form onSubmit={handleLedgerSubmit} className="space-y-4">
            <h3 className="text-base font-bold text-[#17221A] dark:text-[#E2EAE4] mb-4">
              Log General Transaction
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">
                  Business Unit
                </label>
                <select
                  name="business_unit_id"
                  value={ledgerBU}
                  onChange={(e) => setLedgerBU(e.target.value)}
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
                  Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLedgerType("income")}
                    className={`py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                      ledgerType === "income"
                        ? "bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-500 text-[#0F5132] dark:text-[#38C186]"
                        : "border border-[#E2EAE4] dark:border-[#1E2720] text-[#5C6E62] dark:text-[#90A496] hover:bg-[#F4F7F5] dark:hover:bg-[#151B16]"
                    }`}
                  >
                    Income
                  </button>
                  <button
                    type="button"
                    onClick={() => setLedgerType("expense")}
                    className={`py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                      ledgerType === "expense"
                        ? "bg-red-50 dark:bg-red-950/30 border-2 border-red-500 text-red-600"
                        : "border border-[#E2EAE4] dark:border-[#1E2720] text-[#5C6E62] dark:text-[#90A496] hover:bg-[#F4F7F5] dark:hover:bg-[#151B16]"
                    }`}
                  >
                    Expense
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">
                  Category
                </label>
                <select
                  name="category_id"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2EAE4] dark:border-[#1E2720] bg-white dark:bg-[#151B16] text-[#17221A] dark:text-[#E2EAE4] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                >
                  <option value="">Choose a category</option>
                  {filteredCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  name="amount"
                  required
                  placeholder="50,000"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2EAE4] dark:border-[#1E2720] bg-white dark:bg-[#151B16] text-[#17221A] dark:text-[#E2EAE4] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">
                  Transaction Date
                </label>
                <input
                  type="date"
                  name="transaction_date"
                  required
                  defaultValue={new Date().toISOString().substring(0, 10)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2EAE4] dark:border-[#1E2720] bg-white dark:bg-[#151B16] text-[#17221A] dark:text-[#E2EAE4] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  required
                  placeholder="Reason for transaction"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2EAE4] dark:border-[#1E2720] bg-white dark:bg-[#151B16] text-[#17221A] dark:text-[#E2EAE4] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                />
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
                <>
                  <PlusCircle className="w-4.5 h-4.5" />
                  <span>Submit Ledger Entry</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Event Center Form */}
        {activeTab === "booking" && (
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <h3 className="text-base font-bold text-[#17221A] dark:text-[#E2EAE4] mb-4">
              Add Event Center Booking
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">
                  Client Name
                </label>
                <input
                  type="text"
                  name="client_name"
                  required
                  placeholder="Mrs. Bola Ade"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2EAE4] dark:border-[#1E2720] bg-white dark:bg-[#151B16] text-[#17221A] dark:text-[#E2EAE4] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">
                  Client Phone / Email
                </label>
                <input
                  type="text"
                  name="client_contact"
                  placeholder="08031234567"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2EAE4] dark:border-[#1E2720] bg-white dark:bg-[#151B16] text-[#17221A] dark:text-[#E2EAE4] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">
                  Event Date
                </label>
                <input
                  type="date"
                  name="event_date"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2EAE4] dark:border-[#1E2720] bg-white dark:bg-[#151B16] text-[#17221A] dark:text-[#E2EAE4] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">
                  Package Type
                </label>
                <input
                  type="text"
                  name="package_type"
                  placeholder="Wedding / Seminar / Dinner"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2EAE4] dark:border-[#1E2720] bg-white dark:bg-[#151B16] text-[#17221A] dark:text-[#E2EAE4] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">
                  Hall Name
                </label>
                <input
                  type="text"
                  name="hall_name"
                  placeholder="Gold Main Hall"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2EAE4] dark:border-[#1E2720] bg-white dark:bg-[#151B16] text-[#17221A] dark:text-[#E2EAE4] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">
                  Total Quoted Price (₦)
                </label>
                <input
                  type="number"
                  name="total_quoted"
                  required
                  placeholder="500,000"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2EAE4] dark:border-[#1E2720] bg-white dark:bg-[#151B16] text-[#17221A] dark:text-[#E2EAE4] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">
                  Deposit Paid (₦)
                </label>
                <input
                  type="number"
                  name="deposit_amount"
                  placeholder="200,000"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2EAE4] dark:border-[#1E2720] bg-white dark:bg-[#151B16] text-[#17221A] dark:text-[#E2EAE4] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">
                  Booking Status
                </label>
                <select
                  name="status"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2EAE4] dark:border-[#1E2720] bg-white dark:bg-[#151B16] text-[#17221A] dark:text-[#E2EAE4] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                >
                  <option value="confirmed">Confirmed (Syncs Deposit to Ledger)</option>
                  <option value="completed">Completed (Syncs Total to Ledger)</option>
                  <option value="inquiry">Inquiry Only (No Ledger Sync)</option>
                  <option value="cancelled">Cancelled (Removes Ledger Sync)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">
                Notes
              </label>
              <textarea
                name="notes"
                rows={3}
                placeholder="Specific instructions or caterer preferences"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2EAE4] dark:border-[#1E2720] bg-white dark:bg-[#151B16] text-[#17221A] dark:text-[#E2EAE4] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#0F5132] hover:bg-[#0D442A] text-white font-medium text-sm transition-colors border-b-4 border-[#09321F] disabled:opacity-50 mt-4"
            >
              {loading ? (
                <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>
                  <Calendar className="w-4.5 h-4.5" />
                  <span>Create Booking</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Eatery Form */}
        {activeTab === "eatery" && (
          <form onSubmit={handleEaterySubmit} className="space-y-4">
            <h3 className="text-base font-bold text-[#17221A] dark:text-[#E2EAE4] mb-4">
              Record Eatery Daily Sales
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">
                  Sales Date
                </label>
                <input
                  type="date"
                  name="sale_date"
                  required
                  defaultValue={new Date().toISOString().substring(0, 10)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2EAE4] dark:border-[#1E2720] bg-white dark:bg-[#151B16] text-[#17221A] dark:text-[#E2EAE4] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">
                  Total Covers Served (Customer Count)
                </label>
                <input
                  type="number"
                  name="total_covers"
                  required
                  placeholder="120"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2EAE4] dark:border-[#1E2720] bg-white dark:bg-[#151B16] text-[#17221A] dark:text-[#E2EAE4] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">
                  Total Revenue (₦)
                </label>
                <input
                  type="number"
                  name="total_revenue"
                  required
                  placeholder="150,000"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2EAE4] dark:border-[#1E2720] bg-white dark:bg-[#151B16] text-[#17221A] dark:text-[#E2EAE4] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                />
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
                <>
                  <Utensils className="w-4.5 h-4.5" />
                  <span>Log Eatery Sales</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Laundry Form */}
        {activeTab === "laundry" && (
          <form onSubmit={handleLaundrySubmit} className="space-y-4">
            <h3 className="text-base font-bold text-[#17221A] dark:text-[#E2EAE4] mb-4">
              Add Laundry Order
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">
                  Customer Name
                </label>
                <input
                  type="text"
                  name="customer_name"
                  required
                  placeholder="Mr. Emeka"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2EAE4] dark:border-[#1E2720] bg-white dark:bg-[#151B16] text-[#17221A] dark:text-[#E2EAE4] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">
                  Customer Contact (Phone/Email)
                </label>
                <input
                  type="text"
                  name="customer_contact"
                  placeholder="08022223333"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2EAE4] dark:border-[#1E2720] bg-white dark:bg-[#151B16] text-[#17221A] dark:text-[#E2EAE4] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">
                  Drop-off Date
                </label>
                <input
                  type="date"
                  name="drop_off_date"
                  required
                  defaultValue={new Date().toISOString().substring(0, 10)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2EAE4] dark:border-[#1E2720] bg-white dark:bg-[#151B16] text-[#17221A] dark:text-[#E2EAE4] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">
                  Scheduled Pickup Date
                </label>
                <input
                  type="date"
                  name="pickup_date"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2EAE4] dark:border-[#1E2720] bg-white dark:bg-[#151B16] text-[#17221A] dark:text-[#E2EAE4] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">
                  Amount Charged (₦)
                </label>
                <input
                  type="number"
                  name="amount_charged"
                  required
                  placeholder="8,500"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2EAE4] dark:border-[#1E2720] bg-white dark:bg-[#151B16] text-[#17221A] dark:text-[#E2EAE4] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">
                  Order Status
                </label>
                <select
                  name="status"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2EAE4] dark:border-[#1E2720] bg-white dark:bg-[#151B16] text-[#17221A] dark:text-[#E2EAE4] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                >
                  <option value="received">Received (Unpaid / In Progress)</option>
                  <option value="in_progress">Washing / Ironing</option>
                  <option value="ready">Ready for Pickup</option>
                  <option value="collected">Collected (Syncs to Ledger)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">
                Items Description
              </label>
              <textarea
                name="items_description"
                rows={2}
                required
                placeholder="e.g., 3 Kaftans, 2 Suits, 1 Duvet"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2EAE4] dark:border-[#1E2720] bg-white dark:bg-[#151B16] text-[#17221A] dark:text-[#E2EAE4] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#0F5132] hover:bg-[#0D442A] text-white font-medium text-sm transition-colors border-b-4 border-[#09321F] disabled:opacity-50 mt-4"
            >
              {loading ? (
                <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>
                  <Shirt className="w-4.5 h-4.5" />
                  <span>Create Order</span>
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}

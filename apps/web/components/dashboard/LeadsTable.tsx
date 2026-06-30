"use client";

import { useState } from "react";
import { updateEnquiryStatus } from "../../app/dashboard/leads/actions";
import { Search, Mail, Phone, Calendar, ArrowUpDown, ChevronDown, ChevronUp, FileText, CheckCircle2, AlertCircle } from "lucide-react";

interface Enquiry {
  id: string;
  type: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  message: string | null;
  metadata: any;
  status: "new" | "contacted" | "qualified" | "closed_won" | "closed_lost";
  created_at: string;
}

export default function LeadsTable({ initialEnquiries }: { initialEnquiries: Enquiry[] }) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: any) => {
    setUpdatingId(id);
    setError(null);
    const result = await updateEnquiryStatus(id, newStatus);
    setUpdatingId(null);

    if (result.error) {
      setError(result.error);
    } else {
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
      );
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch =
      e.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (e.email && e.email.toLowerCase().includes(search.toLowerCase())) ||
      (e.message && e.message.toLowerCase().includes(search.toLowerCase()));

    const matchesType = typeFilter === "all" || e.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50";
      case "contacted":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50";
      case "qualified":
        return "bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 border border-purple-200 dark:border-purple-900/50";
      case "closed_won":
        return "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 border border-green-200 dark:border-green-900/50";
      case "closed_lost":
        return "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border border-red-200 dark:border-red-900/50";
      default:
        return "bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-400";
    }
  };

  const formatTypeLabel = (type: string) => {
    switch (type) {
      case "event_enquiry":
        return "🎟 Event Center";
      case "laundry_pickup":
        return "🧼 Laundry Pickup";
      case "eatery_order":
        return "🍔 Eatery Order";
      case "contact":
        return "✉ Contact Form";
      case "notify_me":
        return "🔔 Notify Me";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 flex gap-2 items-center text-red-600 dark:text-red-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filters Strip */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-[#111612] p-4 rounded-2xl border border-[#E2EAE4] dark:border-[#1E2720]">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#5C6E62] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads, emails, messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F4F7F5] dark:bg-[#18221B] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl text-xs focus:outline-none focus:border-[#D4AF37] transition-all text-[#17221A] dark:text-[#E2EAE4]"
          />
        </div>

        {/* Type Select */}
        <div className="flex gap-2 flex-wrap w-full sm:w-auto">
          {["all", "event_enquiry", "eatery_order", "laundry_pickup", "contact", "notify_me"].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                typeFilter === type
                  ? "bg-[#0F5132]/10 text-[#0F5132] dark:text-[#38C186] border-[#0F5132] dark:border-[#38C186]"
                  : "bg-transparent border-[#E2EAE4] dark:border-[#1E2720] text-[#5C6E62] dark:text-[#90A496] hover:bg-[#F4F7F5] dark:hover:bg-[#18221B]"
              }`}
            >
              {type === "all" ? "All Leads" : formatTypeLabel(type)}
            </button>
          ))}
        </div>

      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-[#111612] border border-[#E2EAE4] dark:border-[#1E2720] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#F4F7F5] dark:bg-[#151B16] border-b border-[#E2EAE4] dark:border-[#1E2720] text-[10px] uppercase font-bold text-[#5C6E62] dark:text-[#90A496]">
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Client Name</th>
                <th className="py-4 px-6">Lead Type</th>
                <th className="py-4 px-6">Contact Info</th>
                <th className="py-4 px-6">Pipeline Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2EAE4] dark:divide-[#1E2720] text-xs">
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#5C6E62] dark:text-[#90A496]">
                    No leads found matching current criteria.
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((e) => {
                  const isExpanded = expandedId === e.id;
                  return (
                    <>
                      <tr 
                        key={e.id} 
                        className={`hover:bg-[#F4F7F5]/50 dark:hover:bg-[#151B16]/20 transition-colors ${isExpanded ? "bg-[#F4F7F5]/20 dark:bg-[#151B16]/10" : ""}`}
                      >
                        <td className="py-4 px-6 text-[#5C6E62] dark:text-[#90A496] whitespace-nowrap">
                          {new Date(e.created_at).toLocaleDateString("en-NG", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-4 px-6 font-bold text-[#17221A] dark:text-white">
                          {e.full_name}
                        </td>
                        <td className="py-4 px-6 font-medium text-[#17221A] dark:text-[#E2EAE4]">
                          {formatTypeLabel(e.type)}
                        </td>
                        <td className="py-4 px-6 space-y-1 whitespace-nowrap">
                          {e.email && (
                            <div className="flex items-center gap-1.5 text-[10px] text-[#5C6E62] dark:text-[#90A496]">
                              <Mail className="w-3 h-3" />
                              <span>{e.email}</span>
                            </div>
                          )}
                          {e.phone && (
                            <div className="flex items-center gap-1.5 text-[10px] text-[#5C6E62] dark:text-[#90A496]">
                              <Phone className="w-3 h-3" />
                              <span>{e.phone}</span>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <select
                            value={e.status}
                            disabled={updatingId === e.id}
                            onChange={(event) => handleStatusChange(e.id, event.target.value)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold focus:outline-none cursor-pointer appearance-none ${getStatusBadgeClass(
                              e.status
                            )}`}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="qualified">Qualified</option>
                            <option value="closed_won">Closed Won</option>
                            <option value="closed_lost">Closed Lost</option>
                          </select>
                        </td>
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <button
                            onClick={() => toggleExpand(e.id)}
                            className="inline-flex items-center justify-center p-1.5 hover:bg-[#F4F7F5] dark:hover:bg-[#18221B] rounded-lg transition-colors border border-transparent hover:border-[#E2EAE4] dark:hover:border-[#1E2720]"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-[#5C6E62]" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-[#5C6E62]" />
                            )}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-[#F4F7F5]/30 dark:bg-[#151B16]/5">
                          <td colSpan={6} className="py-4 px-6 border-t border-[#E2EAE4]/60 dark:border-[#1E2720]/60">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
                              {/* Message details */}
                              <div className="space-y-2">
                                <h5 className="font-bold text-[10px] uppercase tracking-wider text-[#5C6E62]">Customer Notes & Message</h5>
                                <div className="p-4 rounded-xl bg-white dark:bg-[#161D18] border border-[#E2EAE4] dark:border-[#1E2720] text-xs text-[#17221A] dark:text-[#E2EAE4] whitespace-pre-wrap">
                                  {e.message || "No message provided."}
                                </div>
                              </div>
                              {/* Metadata specs */}
                              <div className="space-y-2">
                                <h5 className="font-bold text-[10px] uppercase tracking-wider text-[#5C6E62]">Lead Payload Details</h5>
                                <div className="p-4 rounded-xl bg-white dark:bg-[#161D18] border border-[#E2EAE4] dark:border-[#1E2720] space-y-2 text-xs">
                                  {Object.keys(e.metadata || {}).length === 0 ? (
                                    <p className="text-xs text-[#5C6E62] dark:text-[#90A496]">No metadata details.</p>
                                  ) : (
                                    Object.entries(e.metadata).map(([key, val]: [string, any]) => (
                                      <div key={key} className="flex justify-between items-center gap-4 py-1 border-b border-[#E2EAE4]/30 dark:border-[#1E2720]/30 last:border-0">
                                        <span className="font-bold text-[#5C6E62] uppercase text-[9px] tracking-wider">{key.replace(/_/g, " ")}</span>
                                        <span className="font-medium text-[#17221A] dark:text-[#E2EAE4]">
                                          {typeof val === "object" ? JSON.stringify(val) : String(val)}
                                        </span>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

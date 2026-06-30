import { createClient } from "../../../lib/supabase/server";
import { redirect } from "next/navigation";
import { Sparkles, Inbox } from "lucide-react";
import LeadsTable from "../../../components/dashboard/LeadsTable";

export const metadata = {
  title: "Public Leads Pipeline | REOL Nexus Dashboard",
};

export default async function DashboardLeadsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch all leads
  const { data: enquiries } = await supabase
    .from("public_enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-serif font-extrabold text-[#17221A] dark:text-white tracking-tight">
              Leads & Enquiries
            </h1>
            <span className="bg-[#0F5132]/10 dark:bg-[#38C186]/10 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-[#0F5132] dark:text-[#38C186] tracking-wider">
              Marketing Pipeline
            </span>
          </div>
          <p className="text-sm text-[#5C6E62] dark:text-[#90A496]">
            Track, qualify, and close enquiries submitted by public storefront visitors across all business divisions.
          </p>
        </div>
      </div>

      {/* Leads Table */}
      <LeadsTable initialEnquiries={enquiries || []} />
    </div>
  );
}

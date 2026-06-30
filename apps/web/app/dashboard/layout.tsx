import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import Link from "next/link";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Wallet, 
  FileText, 
  Settings, 
  LogOut, 
  Building2 
} from "lucide-react";
import { logout } from "../auth/actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile and organization
  const { data: profile } = await supabase
    .from("profiles")
    .select("*, organizations(*)")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.org_id) {
    redirect("/onboarding");
  }

  const orgName = profile.organizations?.name || "REOL GLOBAL";

  return (
    <div className="min-h-screen bg-[#F4F7F5] dark:bg-[#0A0D0B] flex flex-col md:flex-row font-sans selection:bg-[#D4AF37]/30">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-[#111612] border-r border-[#E2EAE4] dark:border-[#1E2720] shrink-0">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-[#E2EAE4] dark:border-[#1E2720] gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0F5132]/10 dark:bg-[#0F5132]/30 flex items-center justify-center text-[#0F5132] dark:text-[#38C186] font-bold text-sm">
            RN
          </div>
          <span className="font-bold text-[#17221A] dark:text-[#E2EAE4] tracking-tight">REOL Nexus</span>
        </div>

        {/* Org Selector (Read Only for now) */}
        <div className="px-4 py-3 border-b border-[#E2EAE4] dark:border-[#1E2720] bg-[#F4F7F5]/50 dark:bg-[#151B16]/30 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#5C6E62] dark:text-[#90A496]" />
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-[#17221A] dark:text-[#E2EAE4] truncate">{orgName}</p>
            <p className="text-[10px] text-[#5C6E62] dark:text-[#90A496]">Standard Tier</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#17221A] dark:text-[#E2EAE4] hover:bg-[#F4F7F5] dark:hover:bg-[#151B16] transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 text-[#0F5132] dark:text-[#38C186]" />
            <span>Overview</span>
          </Link>
          <Link
            href="/dashboard/entry"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#17221A] dark:text-[#E2EAE4] hover:bg-[#F4F7F5] dark:hover:bg-[#151B16] transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-[#0F5132] dark:text-[#38C186]" />
            <span>Record Data</span>
          </Link>
          <Link
            href="/dashboard/budgets"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#17221A] dark:text-[#E2EAE4] hover:bg-[#F4F7F5] dark:hover:bg-[#151B16] transition-colors"
          >
            <Wallet className="w-4 h-4 text-[#0F5132] dark:text-[#38C186]" />
            <span>Budgets</span>
          </Link>
          <Link
            href="/dashboard/reports"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#17221A] dark:text-[#E2EAE4] hover:bg-[#F4F7F5] dark:hover:bg-[#151B16] transition-colors"
          >
            <FileText className="w-4 h-4 text-[#0F5132] dark:text-[#38C186]" />
            <span>Reports</span>
          </Link>
        </nav>

        {/* User profile & Logout */}
        <div className="p-4 border-t border-[#E2EAE4] dark:border-[#1E2720] mt-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-[#0F5132] text-white flex items-center justify-center font-bold text-sm">
              {profile.full_name ? profile.full_name[0].toUpperCase() : "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-[#17221A] dark:text-[#E2EAE4] truncate">{profile.full_name || "Manager"}</p>
              <p className="text-[10px] text-[#5C6E62] dark:text-[#90A496] truncate">{user.email}</p>
            </div>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="md:hidden h-14 bg-white dark:bg-[#111612] border-b border-[#E2EAE4] dark:border-[#1E2720] flex items-center justify-between px-4 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-[#0F5132]/10 dark:bg-[#0F5132]/30 flex items-center justify-center text-[#0F5132] dark:text-[#38C186] font-bold text-xs">
            RN
          </div>
          <span className="font-bold text-sm text-[#17221A] dark:text-[#E2EAE4] truncate">{orgName}</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#0F5132] text-white flex items-center justify-center font-bold text-xs">
          {profile.full_name ? profile.full_name[0].toUpperCase() : "U"}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto pb-20 md:pb-0">
        <div className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-[#111612] border-t border-[#E2EAE4] dark:border-[#1E2720] flex items-center justify-around px-2 z-10 shadow-lg">
        <Link
          href="/dashboard"
          className="flex flex-col items-center gap-1 text-[10px] font-medium text-[#5C6E62] dark:text-[#90A496] hover:text-[#0F5132] dark:hover:text-[#38C186] transition-colors"
        >
          <LayoutDashboard className="w-5 h-5 text-[#0F5132] dark:text-[#38C186]" />
          <span>Overview</span>
        </Link>
        <Link
          href="/dashboard/entry"
          className="flex flex-col items-center gap-1 text-[10px] font-medium text-[#5C6E62] dark:text-[#90A496] hover:text-[#0F5132] dark:hover:text-[#38C186] transition-colors"
        >
          <PlusCircle className="w-5 h-5 text-[#0F5132] dark:text-[#38C186]" />
          <span>Record</span>
        </Link>
        <Link
          href="/dashboard/budgets"
          className="flex flex-col items-center gap-1 text-[10px] font-medium text-[#5C6E62] dark:text-[#90A496] hover:text-[#0F5132] dark:hover:text-[#38C186] transition-colors"
        >
          <Wallet className="w-5 h-5 text-[#0F5132] dark:text-[#38C186]" />
          <span>Budgets</span>
        </Link>
        <form action={logout} className="flex flex-col items-center justify-center">
          <button
            type="submit"
            className="flex flex-col items-center gap-1 text-[10px] font-medium text-[#5C6E62] dark:text-[#90A496] hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5 text-[#5C6E62] dark:text-[#90A496]" />
            <span>Log Out</span>
          </button>
        </form>
      </nav>
    </div>
  );
}

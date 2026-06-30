import { createClient } from "../../../lib/supabase/server";
import { Building, Home, Car, ShoppingBag, Bell, Rocket, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import NotifyMeForm from "../../../components/marketing/NotifyMeForm";

export const metadata = {
  title: "REOL Nexus Growth Roadmap | New Lekki Services",
  description: "Explore the launch roadmap of REOL Plaza in Lekki, Lagos. Coming soon: Luxury shortlet suites, professional auto spa wash, and convenience express mini-mart.",
};

export default async function ComingSoonPage() {
  const supabase = await createClient();

  // Fetch Coming Soon Units
  const { data: units } = await supabase
    .from("coming_soon_units")
    .select("*")
    .order("display_order", { ascending: true });

  const iconsMap: Record<string, any> = {
    Home: Home,
    Car: Car,
    ShoppingBag: ShoppingBag,
  };

  return (
    <div className="bg-[#F4F7F5] dark:bg-[#0D110E]">
      
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-[#1E2720] via-[#0A2E1C] to-[#1E2720] text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800c_1px,transparent_1px),linear-gradient(to_bottom,#8080800c_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/15 border border-[#D4AF37]/30 px-3.5 py-1 rounded-full text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
            <Rocket className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Operational Roadmap</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            Future Growth & Roadmap
          </h1>
          <p className="text-sm sm:text-lg text-[#90A496] max-w-2xl mx-auto font-light leading-relaxed">
            REOL Plaza is expanding to deliver complete luxury and lifestyle convenience under one unified roof. Check out what is coming next in Lekki.
          </p>
        </div>
      </section>

      {/* ROADMAP GRID */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#111612]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#17221A] dark:text-white">
                Launch Roadmap
              </h2>
              <p className="text-sm text-[#5C6E62] dark:text-[#90A496] leading-relaxed font-light">
                Each of our new units is being designed to replicate the elite convenience and pristine service delivery of our Event Center, Eatery, and Laundry divisions.
              </p>
            </div>

            <div className="space-y-8 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-[#E2EAE4] dark:before:bg-[#1E2720]">
              {units && units.map((unit: any) => {
                const IconComponent = iconsMap[unit.icon] || Building;
                return (
                  <div key={unit.id} className="relative pl-14 group">
                    <div className="absolute left-2.5 top-0.5 w-7 h-7 rounded-full bg-white dark:bg-[#111612] border-2 border-[#D4AF37] flex items-center justify-center text-xs font-black shadow-sm group-hover:scale-110 transition-transform">
                      ★
                    </div>
                    <div className="p-6 rounded-3xl bg-[#F4F7F5] dark:bg-[#171D18] border border-[#E2EAE4] dark:border-[#1E2720] space-y-4 shadow-sm hover:shadow transition-shadow">
                      <div className="flex justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#111612] border border-[#E2EAE4] dark:border-[#1E2720] flex items-center justify-center text-[#D4AF37]">
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <h4 className="font-bold text-base text-[#17221A] dark:text-white">{unit.name}</h4>
                        </div>
                        <span className="text-[10px] font-bold text-[#0F5132] dark:text-[#38C186] bg-[#0F5132]/5 border border-[#0F5132]/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                          {unit.expected_launch_label}
                        </span>
                      </div>
                      <p className="text-xs text-[#5C6E62] dark:text-[#90A496] leading-relaxed">
                        {unit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <div>
            <div className="sticky top-24">
              <NotifyMeForm selectedUnitName="all" />
            </div>
          </div>

        </div>
      </section>

      {/* SYNERGY HIGHLIGHT */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-[#E2EAE4]/50 dark:border-[#1E2720]/50 bg-[#F4F7F5] dark:bg-[#0D110E]">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="w-16 h-16 rounded-full bg-[#0F5132]/10 flex items-center justify-center mx-auto text-[#0F5132] dark:text-[#38C186]">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#17221A] dark:text-white">
            Unifying Lagos Comfort
          </h2>
          <p className="text-xs sm:text-sm text-[#5C6E62] dark:text-[#90A496] leading-relaxed max-w-2xl mx-auto font-light">
            Each upcoming service integrates with our existing backend dashboard database systems. This ensures your customer accounts, promotional benefits, and corporate memberships cover suites, dining, and garment care seamlessly.
          </p>
        </div>
      </section>

    </div>
  );
}

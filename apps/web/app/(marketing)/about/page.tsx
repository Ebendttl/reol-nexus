import { ShieldCheck, Zap, Award, Target, Landmark, Users } from "lucide-react";

export const metadata = {
  title: "About REOL GLOBAL | Multi-Service Hub Lekki Lagos",
  description: "Learn about the mission, infrastructure, and values of REOL GLOBAL SOLUTIONS LIMITED. Discover how we unify events, dining, and laundry services under one roof in Lagos.",
};

export default function AboutPage() {
  const stats = [
    { icon: Landmark, val: "1", label: "Unified Plaza Hub" },
    { icon: Users, val: "50+", label: "Professional Staff" },
    { icon: Zap, val: "99.9%", label: "Power Uptime" },
  ];

  return (
    <div className="bg-[#F4F7F5] dark:bg-[#0D110E]">
      
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-[#1E2720] via-[#0A2E1C] to-[#1E2720] text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800c_1px,transparent_1px),linear-gradient(to_bottom,#8080800c_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            About REOL Global
          </h1>
          <p className="text-sm sm:text-lg text-[#90A496] max-w-2xl mx-auto font-light leading-relaxed">
            Unifying premium hospitality, gourmet foods, and professional fabric dry cleaning under one institutional-grade roof.
          </p>
        </div>
      </section>

      {/* CORE VISION SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#111612]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-block bg-[#0F5132]/10 dark:bg-[#38C186]/10 px-3 py-1 rounded-full text-xs font-bold text-[#0F5132] dark:text-[#38C186] uppercase tracking-wider">
              Our Vision & Philosophy
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#17221A] dark:text-white leading-tight">
              Rethinking Convenience for Discerning Lagosians
            </h2>
            <p className="text-sm text-[#5C6E62] dark:text-[#90A496] leading-relaxed font-light">
              REOL GLOBAL SOLUTIONS LIMITED was incorporated with a clear mandate: to resolve the operational fragmentation that frustrates busy professionals in Lagos. By placing high-quality services in a single, high-security, custom-engineered plaza on Admiralty Way, Lekki Phase 1, we eliminate hours of traffic and coordinating struggles.
            </p>
            <p className="text-sm text-[#5C6E62] dark:text-[#90A496] leading-relaxed font-light">
              Our parent brand represents reliability, security, and attention to detail. Whether you are hosting 800 wedding guests, buying family lunch, or entrusting us with designer silk garments, you experience the same uncompromising standards of excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl bg-[#F4F7F5] dark:bg-[#171D18] border border-[#E2EAE4] dark:border-[#1E2720] text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] mx-auto border border-[#D4AF37]/20">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-black text-[#17221A] dark:text-white">{s.val}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#5C6E62] dark:text-[#90A496]">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-[#E2EAE4]/50 dark:border-[#1E2720]/50">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#17221A] dark:text-white">
              Our Core Standards
            </h2>
            <p className="text-xs sm:text-sm text-[#5C6E62] dark:text-[#90A496] max-w-lg mx-auto font-light">
              Every employee, service procedure, and facility detail is aligned with these three pillars.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white dark:bg-[#111612] border border-[#E2EAE4] dark:border-[#1E2720] space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#0F5132]/10 dark:bg-[#38C186]/10 flex items-center justify-center text-[#0F5132] dark:text-[#38C186]">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-[#17221A] dark:text-white">High Precision Operations</h4>
              <p className="text-xs text-[#5C6E62] dark:text-[#90A496] leading-relaxed">
                From weight sorting at the laundry to ingredient measurements in the eatery, our workflows are tracked and optimized for quality consistency.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-[#111612] border border-[#E2EAE4] dark:border-[#1E2720] space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#0F5132]/10 dark:bg-[#38C186]/10 flex items-center justify-center text-[#0F5132] dark:text-[#38C186]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-[#17221A] dark:text-white">Infrastructure Integrity</h4>
              <p className="text-xs text-[#5C6E62] dark:text-[#90A496] leading-relaxed">
                We operate multiple dual-grid backup generators, solar cells, private water treatment plants, and professional round-the-clock physical security guards.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-[#111612] border border-[#E2EAE4] dark:border-[#1E2720] space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#0F5132]/10 dark:bg-[#38C186]/10 flex items-center justify-center text-[#0F5132] dark:text-[#38C186]">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-[#17221A] dark:text-white">Customer Custodianship</h4>
              <p className="text-xs text-[#5C6E62] dark:text-[#90A496] leading-relaxed">
                We value your belongings, your celebrations, and your time. Our concierge handles feedback immediately, ensuring an elite experience.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

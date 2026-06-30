import { createClient } from "../../lib/supabase/server";
import Link from "next/link";
import { 
  ArrowRight, 
  Calendar, 
  Utensils, 
  Shirt, 
  ShieldCheck, 
  Zap, 
  Sparkles,
  Clock,
  Star,
  Building,
  Car,
  ShoppingBag,
  Home
} from "lucide-react";

export const metadata = {
  title: "REOL GLOBAL SOLUTIONS | Event Center, Eatery, Laundry in Lekki",
  description: "Lagos' premium multi-service hub. Experience world-class banquet halls, authentic Nigerian dine-in eatery, and five-star laundry & dry cleaning under one roof on Admiralty Way, Lekki Phase 1.",
};

export default async function MarketingHomePage() {
  const supabase = await createClient();

  // Fetch testimonials
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_featured", true)
    .limit(3);

  // Fetch coming soon units
  const { data: comingSoonUnits } = await supabase
    .from("coming_soon_units")
    .select("*")
    .order("display_order", { ascending: true });

  const iconsMap: Record<string, any> = {
    Home: Home,
    Car: Car,
    ShoppingBag: ShoppingBag,
  };

  return (
    <div className="overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-br from-[#0A2E1C] via-[#0F5132] to-[#1E2720] text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        {/* Decorative ambient gold glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#D4AF37]/10 blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-white/10 dark:bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
            <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#E2EAE4]">
              Lekki's Ultimate Multi-Service Destination
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.1] text-white">
            Three Exceptional Brands. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F4E3A1] to-[#D4AF37]">
              One Unified Standard.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-[#90A496] max-w-3xl mx-auto font-light leading-relaxed">
            Experience world-class celebrations, authentic Nigerian gastronomy, and elite garment care. All under one roof with uninterrupted power and security in Lekki Phase 1, Lagos.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#C29E2E] text-[#111612] px-8 py-4 rounded-xl font-bold text-base shadow-lg shadow-[#D4AF37]/20 transition-all duration-300 hover:-translate-y-0.5"
            >
              <span>Book / Enquire Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 hover:bg-white/20"
            >
              <span>Explore Services</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. THE THREE BRANDS SECTION */}
      <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F4F7F5] dark:bg-[#0D110E]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="font-serif text-3xl sm:text-5xl font-black text-[#17221A] dark:text-white">
              Discover Our Services
            </h2>
            <p className="text-base sm:text-lg text-[#5C6E62] dark:text-[#90A496] max-w-2xl mx-auto font-light">
              Crafted to provide convenience, premium hospitality, and pristine maintenance for discerning Lagos residents.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Event Center Card */}
            <div className="group relative flex flex-col justify-between bg-white dark:bg-[#111612] rounded-3xl overflow-hidden border border-[#E2EAE4] dark:border-[#1E2720] shadow-sm hover:shadow-xl hover:border-[#D4AF37]/45 transition-all duration-500 hover:-translate-y-1">
              <div>
                <div className="relative h-64 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800"
                    alt="Event Center Hall"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-6 flex items-center gap-2 bg-[#D4AF37] text-[#111612] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Event Center</span>
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <h3 className="font-serif text-2xl font-bold text-[#17221A] dark:text-white group-hover:text-[#D4AF37] transition-colors">
                    Celebrate in Grandeur
                  </h3>
                  <p className="text-sm text-[#5C6E62] dark:text-[#90A496] leading-relaxed">
                    Host elite weddings, conferences, birthdays, and banquets in our state-of-the-art halls. Offering capacities up to 800 guests, intelligent acoustics, and climate control.
                  </p>
                  <ul className="space-y-2 pt-2">
                    <li className="flex items-center gap-2 text-xs font-semibold text-[#5C6E62] dark:text-[#90A496]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                      Climate Controlled Halls
                    </li>
                    <li className="flex items-center gap-2 text-xs font-semibold text-[#5C6E62] dark:text-[#90A496]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                      Capacity: 120 - 800 guests
                    </li>
                    <li className="flex items-center gap-2 text-xs font-semibold text-[#5C6E62] dark:text-[#90A496]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                      Ample Secure Valet Parking
                    </li>
                  </ul>
                </div>
              </div>
              <div className="p-8 pt-0">
                <Link
                  href="/event-center"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#F4F7F5] dark:bg-[#1E2720] hover:bg-[#D4AF37] hover:text-[#111612] dark:hover:bg-[#D4AF37] text-sm font-bold py-3.5 px-4 rounded-xl transition-all duration-300"
                >
                  <span>Explore Halls & Packages</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Eatery Card */}
            <div className="group relative flex flex-col justify-between bg-white dark:bg-[#111612] rounded-3xl overflow-hidden border border-[#E2EAE4] dark:border-[#1E2720] shadow-sm hover:shadow-xl hover:border-[#FF5733]/45 transition-all duration-500 hover:-translate-y-1">
              <div>
                <div className="relative h-64 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800"
                    alt="REOL Eatery Food"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-6 flex items-center gap-2 bg-[#FF5733] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    <Utensils className="w-3.5 h-3.5" />
                    <span>REOL Eatery</span>
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <h3 className="font-serif text-2xl font-bold text-[#17221A] dark:text-white group-hover:text-[#FF5733] transition-colors">
                    Authentic Culinary Heritage
                  </h3>
                  <p className="text-sm text-[#5C6E62] dark:text-[#90A496] leading-relaxed">
                    Savor the finest smokey firewood Jollof, spicy grilled proteins, and rich local soups. Prepared fresh daily by master chefs utilizing premium ingredients and traditional spices.
                  </p>
                  <ul className="space-y-2 pt-2">
                    <li className="flex items-center gap-2 text-xs font-semibold text-[#5C6E62] dark:text-[#90A496]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5733]" />
                      Signature Woodfire Smokey Jollof
                    </li>
                    <li className="flex items-center gap-2 text-xs font-semibold text-[#5C6E62] dark:text-[#90A496]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5733]" />
                      Royal Seafood & Grill Platters
                    </li>
                    <li className="flex items-center gap-2 text-xs font-semibold text-[#5C6E62] dark:text-[#90A496]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5733]" />
                      Dine-in, Takeout & Office Delivery
                    </li>
                  </ul>
                </div>
              </div>
              <div className="p-8 pt-0">
                <Link
                  href="/eatery"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#F4F7F5] dark:bg-[#1E2720] hover:bg-[#FF5733] hover:text-white dark:hover:bg-[#FF5733] text-sm font-bold py-3.5 px-4 rounded-xl transition-all duration-300"
                >
                  <span>View Eatery Menu</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Laundry Card */}
            <div className="group relative flex flex-col justify-between bg-white dark:bg-[#111612] rounded-3xl overflow-hidden border border-[#E2EAE4] dark:border-[#1E2720] shadow-sm hover:shadow-xl hover:border-[#33B5E5]/45 transition-all duration-500 hover:-translate-y-1">
              <div>
                <div className="relative h-64 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&q=80&w=800"
                    alt="REOL Laundry"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-6 flex items-center gap-2 bg-[#33B5E5] text-[#111612] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    <Shirt className="w-3.5 h-3.5" />
                    <span>REOL Laundry</span>
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <h3 className="font-serif text-2xl font-bold text-[#17221A] dark:text-white group-hover:text-[#33B5E5] transition-colors">
                    Pristine Garment Care
                  </h3>
                  <p className="text-sm text-[#5C6E62] dark:text-[#90A496] leading-relaxed">
                    Protect your premium fabrics, luxury native wears (Agbadas, Kaftans), and delicate silks. Cleaned with state-of-the-art machinery, ecological solvents, and steam pressed.
                  </p>
                  <ul className="space-y-2 pt-2">
                    <li className="flex items-center gap-2 text-xs font-semibold text-[#5C6E62] dark:text-[#90A496]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#33B5E5]" />
                      Specialized Native Wear Treatment
                    </li>
                    <li className="flex items-center gap-2 text-xs font-semibold text-[#5C6E62] dark:text-[#90A496]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#33B5E5]" />
                      Express 6-Hour Turnaround Available
                    </li>
                    <li className="flex items-center gap-2 text-xs font-semibold text-[#5C6E62] dark:text-[#90A496]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#33B5E5]" />
                      Lekki-Wide Pickup & Delivery
                    </li>
                  </ul>
                </div>
              </div>
              <div className="p-8 pt-0">
                <Link
                  href="/laundry"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#F4F7F5] dark:bg-[#1E2720] hover:bg-[#33B5E5] hover:text-[#111612] dark:hover:bg-[#33B5E5] text-sm font-bold py-3.5 px-4 rounded-xl transition-all duration-300"
                >
                  <span>Explore Laundry Services</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. SYNERGY / UNDER ONE ROOF VALUE PROP */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#111612] border-y border-[#E2EAE4]/50 dark:border-[#1E2720]/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block bg-[#0F5132]/10 dark:bg-[#38C186]/10 px-3 py-1 rounded-full text-xs font-bold text-[#0F5132] dark:text-[#38C186] uppercase tracking-wider">
              Lagos Convenience Reimagined
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#17221A] dark:text-white leading-tight">
              One Plaza. Zero Friction. Uninterrupted Power.
            </h2>
            <p className="text-base text-[#5C6E62] dark:text-[#90A496] leading-relaxed">
              We understand the dynamics of living and working in Lagos. That's why we engineered REOL Plaza to act as a seamless hub of activity. Drop off your corporate suits in the morning, have an business lunch with clients, and finalize hall reservations for your wedding – all in one visit.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0F5132]/15 dark:bg-[#38C186]/15 flex items-center justify-center text-[#0F5132] dark:text-[#38C186] shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#17221A] dark:text-white text-sm">24/7 Grid + Solar Hybrid</h4>
                  <p className="text-xs text-[#5C6E62] dark:text-[#90A496] mt-1">Zero downtime for events, food cold-storage, and laundry machinery.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0F5132]/15 dark:bg-[#38C186]/15 flex items-center justify-center text-[#0F5132] dark:text-[#38C186] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#17221A] dark:text-white text-sm">Armed & CCTV Security</h4>
                  <p className="text-xs text-[#5C6E62] dark:text-[#90A496] mt-1">Peace of mind for your guests, your vehicles, and your luxury items.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative aspect-video lg:aspect-square bg-gradient-to-br from-[#0F5132]/10 to-[#D4AF37]/10 rounded-3xl overflow-hidden border border-[#E2EAE4] dark:border-[#1E2720] flex items-center justify-center p-8">
            <div className="space-y-4 w-full">
              <div className="p-4 bg-white dark:bg-[#1C241E] rounded-2xl shadow-sm border border-[#E2EAE4]/80 dark:border-[#2D3930]/80 flex gap-4 items-center transform -translate-x-4">
                <div className="w-10 h-10 rounded-lg bg-[#33B5E5]/10 flex items-center justify-center text-[#33B5E5] font-bold">1</div>
                <div>
                  <h5 className="font-bold text-xs">08:00 AM — Drop Off</h5>
                  <p className="text-[11px] text-[#5C6E62] dark:text-[#90A496]">Drop off your Agbada dry cleaning at the drive-thru window.</p>
                </div>
              </div>
              <div className="p-4 bg-white dark:bg-[#1C241E] rounded-2xl shadow-sm border border-[#E2EAE4]/80 dark:border-[#2D3930]/80 flex gap-4 items-center transform translate-x-4 border-l-4 border-l-[#FF5733]">
                <div className="w-10 h-10 rounded-lg bg-[#FF5733]/10 flex items-center justify-center text-[#FF5733] font-bold">2</div>
                <div>
                  <h5 className="font-bold text-xs">01:00 PM — Savor Jollof</h5>
                  <p className="text-[11px] text-[#5C6E62] dark:text-[#90A496]">Dine on smokey Jollof rice during an air-conditioned business lunch.</p>
                </div>
              </div>
              <div className="p-4 bg-white dark:bg-[#1C241E] rounded-2xl shadow-sm border border-[#E2EAE4]/80 dark:border-[#2D3930]/80 flex gap-4 items-center transform -translate-x-4 border-l-4 border-l-[#D4AF37]">
                <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] font-bold">3</div>
                <div>
                  <h5 className="font-bold text-xs">04:00 PM — Tour Halls</h5>
                  <p className="text-[11px] text-[#5C6E62] dark:text-[#90A496]">Meet your wedding planner at the Royal Grand Ballroom for a setup walk-through.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TESTIMONIALS SECTION */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F4F7F5] dark:bg-[#0D110E]">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="font-serif text-3xl sm:text-5xl font-black text-[#17221A] dark:text-white">
                Trusted by Lagosians
              </h2>
              <p className="text-sm sm:text-base text-[#5C6E62] dark:text-[#90A496] max-w-xl mx-auto font-light">
                Here's what corporate executives, couples, and food lovers say about their REOL experiences.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((test: any) => (
                <div key={test.id} className="bg-white dark:bg-[#111612] p-8 rounded-3xl border border-[#E2EAE4] dark:border-[#1E2720] shadow-sm flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex gap-1 text-[#D4AF37]">
                      {[...Array(test.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#D4AF37]" />
                      ))}
                    </div>
                    <p className="text-sm text-[#5C6E62] dark:text-[#90A496] italic leading-relaxed">
                      "{test.content}"
                    </p>
                  </div>
                  <div className="pt-6 border-t border-[#E2EAE4]/50 dark:border-[#1E2720]/50 mt-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0F5132]/10 flex items-center justify-center font-bold text-xs text-[#0F5132] dark:text-[#38C186]">
                      {test.author_name[0] || "U"}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#17221A] dark:text-white">{test.author_name}</h4>
                      <p className="text-[10px] text-[#5C6E62] dark:text-[#90A496]">Verified Client</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. COMING SOON / GROWTH STORY */}
      {comingSoonUnits && comingSoonUnits.length > 0 && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#111612] border-t border-[#E2EAE4]/50 dark:border-[#1E2720]/50">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <div className="inline-block bg-[#D4AF37]/10 px-3 py-1 rounded-full text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                The Growth Story
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-black text-[#17221A] dark:text-white">
                More Comfort Coming Soon
              </h2>
              <p className="text-sm sm:text-base text-[#5C6E62] dark:text-[#90A496] max-w-xl mx-auto font-light">
                We are actively expanding REOL Plaza with exciting additions to make this your complete comfort ecosystem.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {comingSoonUnits.map((unit: any) => {
                const IconComponent = iconsMap[unit.icon] || Building;
                return (
                  <div key={unit.id} className="relative group p-8 rounded-3xl bg-[#F4F7F5] dark:bg-[#171D18] border border-[#E2EAE4]/80 dark:border-[#1E2720]/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#111612] flex items-center justify-center text-[#D4AF37] border border-[#E2EAE4] dark:border-[#1E2720]">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-lg text-[#17221A] dark:text-white">
                        {unit.name}
                      </h3>
                      <p className="text-xs text-[#5C6E62] dark:text-[#90A496] leading-relaxed">
                        {unit.description}
                      </p>
                    </div>
                    <div className="mt-8 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#0F5132] dark:text-[#38C186] bg-[#0F5132]/5 px-2.5 py-1 rounded-full border border-[#0F5132]/10">
                        {unit.expected_launch_label}
                      </span>
                      <Link
                        href="/coming-soon"
                        className="text-xs font-semibold text-[#5C6E62] dark:text-[#90A496] hover:text-[#0F5132] dark:hover:text-[#38C186] flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                      >
                        <span>Notify Me</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 6. CALL TO ACTION SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-tr from-[#0F5132] to-[#1E2720] text-white text-center relative overflow-hidden">
        {/* Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#D4AF3718,transparent_55%)] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto space-y-6">
          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight">
            Elevate Your Experience in Lagos Today
          </h2>
          <p className="text-[#90A496] max-w-xl mx-auto text-sm sm:text-base font-light">
            Whether you want to tour our premium banquet hall, order food, or schedule a laundry pickup, our team is standing by to serve you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#C29E2E] text-[#111612] px-8 py-4 rounded-xl font-bold transition-all duration-300"
            >
              <span>Get in Touch</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+2348123456789"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 px-8 py-4 rounded-xl font-bold transition-all"
            >
              <span>Call Us: +234 812 345 6789</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

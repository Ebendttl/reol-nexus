import { createClient } from "../../../lib/supabase/server";
import { 
  Check, 
  MapPin, 
  Users, 
  Maximize2, 
  Volume2, 
  Wind, 
  ShieldCheck, 
  Camera, 
  Scale, 
  HelpCircle,
  Clock,
  Sparkles
} from "lucide-react";
import EventEnquiryForm from "../../../components/marketing/EventEnquiryForm";

export const metadata = {
  title: "Premium Event Center Halls in Lekki, Lagos",
  description: "Book our premium banquet halls in Lekki Phase 1. Features 120-800 capacity venues with full air conditioning, backup generators, high-fidelity sound, and custom packages for weddings & events.",
};

export default async function EventCenterPage() {
  const supabase = await createClient();

  // Fetch Event Packages
  const { data: packages } = await supabase
    .from("event_packages")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  // Fetch Event Terms
  const { data: terms } = await supabase
    .from("event_terms")
    .select("*")
    .order("display_order", { ascending: true });

  // Fetch Gallery Images
  const { data: gallery } = await supabase
    .from("gallery_images")
    .select("*")
    .eq("business_unit_id", "bu1")
    .order("display_order", { ascending: true });

  // Format packages list for the form dropdown selector
  const formPackages = (packages || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    hall_name: p.hall_name || "General Hall"
  }));

  const features = [
    { icon: Wind, title: "Dual Zone AC System", desc: "Top-tier industrial air conditioning ensuring absolute comfort even at full hall capacity." },
    { icon: ShieldCheck, title: "Elite Armed Security", desc: "Comprehensive on-site security patrol, perimeter fencing, and parking lot guards." },
    { icon: Volume2, title: "Intelligent Sound Engineering", desc: "Acoustical paneling and crystal-clear sound truss systems optimized for speech and live bands." },
    { icon: Maximize2, title: "High Ceiling Clearance", desc: "Allows for grand, spectacular hanging floral decor installations and heavy-duty staging." },
  ];

  return (
    <div className="bg-[#F4F7F5] dark:bg-[#0D110E]">
      
      {/* 1. HERO HEADER */}
      <section className="relative bg-gradient-to-br from-[#1E2720] via-[#0A2E1C] to-[#1E2720] text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800c_1px,transparent_1px),linear-gradient(to_bottom,#8080800c_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-3.5 py-1 rounded-full text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Celebrate In Grandeur</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            REOL Event Center
          </h1>
          <p className="text-sm sm:text-lg text-[#90A496] max-w-2xl mx-auto font-light leading-relaxed">
            From intimate private dinners to magnificent grand weddings and high-profile corporate galas. Discover Lagos' premier event venue located on Admiralty Way, Lekki Phase 1.
          </p>
          <div className="flex justify-center gap-6 text-xs text-[#90A496] pt-2">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#D4AF37]" />
              <span>Up to 800 Capacity</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#D4AF37]" />
              <span>Lekki Phase 1, Lagos</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE HALLS SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#111612]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#17221A] dark:text-white">
                Venues Engineered for Perfection
              </h2>
              <p className="text-sm sm:text-base text-[#5C6E62] dark:text-[#90A496] leading-relaxed font-light">
                REOL Plaza offers two distinct, premium spaces customized to suit your guest count and aesthetic desires. Each space is equipped with independent staging, catering preparation zones, and climate controls.
              </p>
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#F4F7F5] dark:bg-[#171D18] border border-[#E2EAE4] dark:border-[#1E2720] flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center font-bold text-lg text-[#D4AF37] shrink-0 border border-[#D4AF37]/20">A</div>
                <div>
                  <h4 className="font-bold text-[#17221A] dark:text-white text-base">Grand Banquet Hall (Hall A)</h4>
                  <p className="text-xs text-[#5C6E62] dark:text-[#90A496] mt-1.5 leading-relaxed">
                    Designed for large-scale events, weddings, and concerts. Accommodates up to 450 guests banquet seating or 800 theater style. Features double-height high ceilings, professional staging truss, and 2 changing suites.
                  </p>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-[#F4F7F5] dark:bg-[#171D18] border border-[#E2EAE4] dark:border-[#1E2720] flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center font-bold text-lg text-[#D4AF37] shrink-0 border border-[#D4AF37]/20">B</div>
                <div>
                  <h4 className="font-bold text-[#17221A] dark:text-white text-base">Lounge & Garden Terrace (Hall B)</h4>
                  <p className="text-xs text-[#5C6E62] dark:text-[#90A496] mt-1.5 leading-relaxed">
                    Perfect for intimate birthdays, bridal showers, cocktail receptions, and corporate meetings. Accommodates up to 120 guests. Features glass walls opening out to our beautiful landscaped garden terrace.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="p-6 rounded-2xl bg-[#F4F7F5] dark:bg-[#171D18] border border-[#E2EAE4] dark:border-[#1E2720] space-y-3 shadow-sm hover:shadow transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-[#0F5132]/10 dark:bg-[#38C186]/10 flex items-center justify-center text-[#0F5132] dark:text-[#38C186]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-[#17221A] dark:text-white">{f.title}</h4>
                  <p className="text-xs text-[#5C6E62] dark:text-[#90A496] leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. EVENT PACKAGES & PRICING */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-y border-[#E2EAE4]/50 dark:border-[#1E2720]/50">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="font-serif text-3xl sm:text-5xl font-black text-[#17221A] dark:text-white">
              Elite Venue Packages
            </h2>
            <p className="text-sm sm:text-base text-[#5C6E62] dark:text-[#90A496] max-w-xl mx-auto font-light">
              Choose from our carefully curated pricing packages designed to take the stress out of your planning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages && packages.map((pkg: any) => (
              <div 
                key={pkg.id} 
                className="bg-white dark:bg-[#111612] rounded-3xl overflow-hidden border border-[#E2EAE4] dark:border-[#1E2720] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={pkg.image_url} 
                      alt={pkg.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-6">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">{pkg.hall_name}</p>
                      <h4 className="text-lg font-bold text-white mt-0.5">{pkg.name}</h4>
                    </div>
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="flex items-baseline gap-1.5 border-b border-[#E2EAE4]/50 dark:border-[#1E2720]/50 pb-4">
                      <span className="text-xs text-[#5C6E62] dark:text-[#90A496]">From</span>
                      <span className="text-3xl font-black text-[#0F5132] dark:text-[#38C186]">
                        ₦{Number(pkg.price_from).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-[#5C6E62] dark:text-[#90A496] leading-relaxed">
                      {pkg.description}
                    </p>
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-[#17221A] dark:text-white uppercase tracking-wider">What's Included:</p>
                      <ul className="space-y-2">
                        {pkg.inclusions && pkg.inclusions.map((inc: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-[#5C6E62] dark:text-[#90A496]">
                            <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="p-8 pt-0">
                  <a 
                    href="#enquiry-form-section" 
                    className="w-full inline-flex items-center justify-center bg-[#0F5132] hover:bg-[#0D442A] text-white text-xs font-bold py-3.5 px-4 rounded-xl shadow transition-colors"
                  >
                    Select Package & Reserve
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. GALLERY */}
      {gallery && gallery.length > 0 && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#111612]">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="font-serif text-3xl sm:text-5xl font-black text-[#17221A] dark:text-white flex items-center justify-center gap-2">
                <Camera className="w-6 h-6 text-[#D4AF37]" />
                <span>Captured Moments</span>
              </h2>
              <p className="text-sm sm:text-base text-[#5C6E62] dark:text-[#90A496] max-w-xl mx-auto font-light">
                Take a virtual tour through our past decor layouts, wedding setups, and gala dinners.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {gallery.map((img: any) => (
                <div key={img.id} className="group relative aspect-square bg-[#F4F7F5] dark:bg-[#1E2720] rounded-3xl overflow-hidden shadow-sm hover:shadow-lg border border-[#E2EAE4]/55 dark:border-[#1E2720]/55 transition-all duration-300">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={img.image_url} 
                    alt={img.caption || "Event Center Setup"} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6" />
                  <p className="absolute bottom-4 left-4 right-4 text-xs font-semibold text-white translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                    {img.caption}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. FORM & TERMS SPLIT SECTION */}
      <section id="enquiry-form-section" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-[#E2EAE4]/50 dark:border-[#1E2720]/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Enquiry Form */}
          <EventEnquiryForm packages={formPackages} />

          {/* Terms and Conditions & FAQs */}
          <div className="space-y-10 lg:pl-6">
            <div className="space-y-4">
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#17221A] dark:text-white flex items-center gap-2">
                <Scale className="w-6 h-6 text-[#D4AF37]" />
                <span>Venue Policies</span>
              </h2>
              <p className="text-sm text-[#5C6E62] dark:text-[#90A496] leading-relaxed font-light">
                To guarantee safety, premium comfort, and structural integrity, we maintain the following operational guidelines at the REOL Plaza Event Center.
              </p>
            </div>

            <div className="space-y-6">
              {terms && terms.map((term: any) => (
                <div key={term.id} className="p-6 rounded-2xl bg-white dark:bg-[#111612] border border-[#E2EAE4] dark:border-[#1E2720] shadow-sm space-y-2">
                  <div className="flex gap-2.5 items-center">
                    <div className="w-1.5 h-6 rounded-full bg-[#D4AF37] shrink-0" />
                    <h4 className="font-bold text-sm text-[#17221A] dark:text-white uppercase tracking-wider">
                      {term.title}
                    </h4>
                  </div>
                  <p className="text-xs text-[#5C6E62] dark:text-[#90A496] leading-relaxed pl-4">
                    {term.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Quick FAQ / Help */}
            <div className="p-6 rounded-3xl bg-[#0F5132]/5 border border-[#0F5132]/10 flex gap-4">
              <HelpCircle className="w-6 h-6 text-[#D4AF37] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h5 className="font-bold text-sm text-[#0F5132] dark:text-[#38C186]">Have questions about booking?</h5>
                <p className="text-xs text-[#5C6E62] dark:text-[#90A496] leading-relaxed">
                  Call our event concierge directly at <a href="tel:+2348123456789" className="font-semibold underline">+234 812 345 6789</a> or message us on WhatsApp for rapid date confirmations.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}

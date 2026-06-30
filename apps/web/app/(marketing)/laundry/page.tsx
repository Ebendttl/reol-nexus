import { createClient } from "../../../lib/supabase/server";
import { Shirt, Sparkles, Clock, MapPin, Tag, Truck, Check, HelpCircle } from "lucide-react";
import LaundryPickupForm from "../../../components/marketing/LaundryPickupForm";

export const metadata = {
  title: "REOL Laundry | Professional Dry Cleaning Lekki Lagos",
  description: "Lekki's premium dry cleaners. Specializing in designer native wear care, Agbada starching, suits, wedding gowns, and express same-day washing. Home pickup & delivery.",
};

export default async function LaundryPage() {
  const supabase = await createClient();

  // Fetch Laundry Services
  const { data: services } = await supabase
    .from("laundry_services")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  // Fetch Deals
  const { data: deals } = await supabase
    .from("deals_promotions")
    .select("*")
    .eq("is_active", true);

  const formServices = (services || []).map(s => ({
    id: s.id,
    name: s.name,
  }));

  const workflows = [
    { step: "1", title: "Schedule Pickup", desc: "Use the request form or call us to book a dispatch pickup slot." },
    { step: "2", title: "Garment Check", desc: "Our specialists inspect fabrics, pre-treat stains, and barcode items." },
    { step: "3", title: "Pristine Care", desc: "Garments are cleaned using green solvents and premium machinery." },
    { step: "4", title: "Crisp Delivery", desc: "Freshly pressed garments are wrapped and delivered back to your gate." },
  ];

  return (
    <div className="bg-[#F4F7F5] dark:bg-[#0D110E]">
      
      {/* 1. HERO HEADER */}
      <section className="relative bg-gradient-to-br from-[#1E2720] via-[#102B37] to-[#1E2720] text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-[#33B5E5]/20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800c_1px,transparent_1px),linear-gradient(to_bottom,#8080800c_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-[#33B5E5]/15 border border-[#33B5E5]/30 px-3.5 py-1 rounded-full text-xs font-bold text-[#33B5E5] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#33B5E5]" />
            <span>Premium Fabric Maintenance</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            REOL Laundry & Dry Cleaning
          </h1>
          <p className="text-sm sm:text-lg text-[#90A496] max-w-2xl mx-auto font-light leading-relaxed">
            Delivering pristine dry cleaning, standard native wear starching, and delicate treatment for designer apparel. Experience high-precision garment care with flexible Lekki home dispatch.
          </p>
          <div className="flex justify-center gap-6 text-xs text-[#90A496] pt-2">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#33B5E5]" />
              <span>Mon - Sat: 7:00 AM — 7:00 PM</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#33B5E5]" />
              <span>REOL Plaza Drive-Thru Window</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DEALS & PROMOTIONS STRIP */}
      {deals && deals.length > 0 && (
        <section className="bg-[#33B5E5] text-[#111612] py-4 px-4 overflow-hidden border-b border-[#33B5E5]/10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
            {deals.map((deal) => (
              <div key={deal.id} className="flex items-center gap-2 bg-[#111612]/5 dark:bg-white/10 px-4 py-1.5 rounded-full border border-black/10">
                <Tag className="w-4 h-4 text-white shrink-0 fill-white" />
                <span className="text-xs font-black tracking-wider uppercase">{deal.discount_label}</span>
                <span className="text-xs font-bold">—</span>
                <span className="text-xs font-semibold">{deal.title}: {deal.description}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. THE SERVICES SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#111612]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <div className="inline-block bg-[#33B5E5]/10 px-3 py-1 rounded-full text-xs font-bold text-[#33B5E5] uppercase tracking-wider">
              Garment Care Options
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#17221A] dark:text-white">
              Dry Cleaning & Laundry Menu
            </h2>
            <p className="text-xs sm:text-sm text-[#5C6E62] dark:text-[#90A496] max-w-lg mx-auto font-light">
              We separate colors, categorize fabrics, inspect pockets, and utilize certified detergents to prolong clothing life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services && services.map((service) => (
              <div 
                key={service.id} 
                className="group flex flex-col sm:flex-row gap-6 p-6 rounded-3xl bg-[#F4F7F5] dark:bg-[#171D18] border border-[#E2EAE4] dark:border-[#1E2720] shadow-sm hover:shadow transition-shadow"
              >
                <div className="relative w-full sm:w-40 h-40 rounded-2xl overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={service.image_url} 
                    alt={service.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="flex flex-col justify-between flex-grow space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline gap-2">
                      <h3 className="font-serif text-lg font-bold text-[#17221A] dark:text-white group-hover:text-[#33B5E5] transition-colors">
                        {service.name}
                      </h3>
                      <span className="font-black text-sm text-[#0F5132] dark:text-[#38C186] whitespace-nowrap">
                        ₦{Number(service.price_from).toLocaleString()} <span className="text-[10px] text-[#5C6E62] dark:text-[#90A496] font-normal">base</span>
                      </span>
                    </div>
                    <p className="text-xs text-[#5C6E62] dark:text-[#90A496] leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#33B5E5] bg-[#33B5E5]/5 border border-[#33B5E5]/15 px-3 py-1 rounded-lg w-max">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Est: {service.turnaround_time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WORKFLOW / LOGISTICS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F4F7F5] dark:bg-[#0D110E] border-t border-[#E2EAE4]/50 dark:border-[#1E2720]/50">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#17221A] dark:text-white">
              How Our Service Works
            </h2>
            <p className="text-xs sm:text-sm text-[#5C6E62] dark:text-[#90A496] max-w-lg mx-auto font-light">
              Enjoy effortless garment care in 4 simple steps. We pick up from your home and deliver back looking brand new.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflows.map((w) => (
              <div key={w.step} className="p-8 rounded-3xl bg-white dark:bg-[#111612] border border-[#E2EAE4] dark:border-[#1E2720] shadow-sm relative space-y-4">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-[#33B5E5] text-[#111612] flex items-center justify-center font-black text-sm shadow">
                  {w.step}
                </div>
                <h4 className="font-bold text-base text-[#17221A] dark:text-white pt-2">{w.title}</h4>
                <p className="text-xs text-[#5C6E62] dark:text-[#90A496] leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FORM & DETAILS SPLIT */}
      <section id="pickup-form-section" className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#111612] border-t border-[#E2EAE4]/50 dark:border-[#1E2720]/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Pickup Form */}
          <LaundryPickupForm services={formServices} />

          {/* Logistics information */}
          <div className="space-y-10 lg:pl-6">
            <div className="space-y-4">
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#17221A] dark:text-white flex items-center gap-2">
                <Truck className="w-6 h-6 text-[#33B5E5]" />
                <span>Professional Lekki Dispatch</span>
              </h2>
              <p className="text-sm text-[#5C6E62] dark:text-[#90A496] leading-relaxed font-light">
                We operate our own dedicated logistics fleet to ensure garments are handled with absolute care during transit. Delivery drivers carry weather-proof garment garment bags to prevent moisture or dust damage.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-3">
                <Check className="w-5 h-5 text-[#33B5E5] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-[#17221A] dark:text-white">Strict Tagging & Barcoding</h4>
                  <p className="text-xs text-[#5C6E62] dark:text-[#90A496] mt-0.5">Every garment bag receives a unique barcoded tracking tag immediately upon collection. This completely eliminates garment mix-ups.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Check className="w-5 h-5 text-[#33B5E5] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-[#17221A] dark:text-white">Eco-Friendly Cleaning Solvents</h4>
                  <p className="text-xs text-[#5C6E62] dark:text-[#90A496] mt-0.5">We avoid harsh chemicals. Our dry cleaning process uses bio-degradable solvents that protect fabrics and preserve colors.</p>
                </div>
              </div>
            </div>

            {/* Quick Contact Box */}
            <div className="p-6 rounded-3xl bg-[#33B5E5]/5 border border-[#33B5E5]/10 flex gap-4">
              <HelpCircle className="w-6 h-6 text-[#33B5E5] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h5 className="font-bold text-sm text-[#33B5E5]">Need urgent express same-day pickup?</h5>
                <p className="text-xs text-[#5C6E62] dark:text-[#90A496] leading-relaxed">
                  Call our dry cleaning desk at <a href="tel:+2348123456789" className="font-semibold underline">+234 812 345 6789</a> or drop off directly at the plaza drive-thru window for instant express servicing.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}

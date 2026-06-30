import { createClient } from "../../../lib/supabase/server";
import { Utensils, Clock, Flame, Heart, Sparkles, MapPin, PhoneCall } from "lucide-react";
import EateryOrderForm from "../../../components/marketing/EateryOrderForm";

export const metadata = {
  title: "REOL Eatery | Authentic Nigerian Gourmet Restaurant Lekki",
  description: "Dine-in, takeout, or office lunch delivery on Admiralty Way, Lekki. Signature woodfire smokey jollof, spicy grill platters, traditional Yoruba efo riro, and hibiscus zobo coolers.",
};

export default async function EateryPage() {
  const supabase = await createClient();

  // Fetch Menu Items
  const { data: menuItems } = await supabase
    .from("menu_items")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  const categories = ["Starters", "Mains", "Specials", "Drinks"];

  // Helper to group items by category
  const getItemsByCategory = (category: string) => {
    return (menuItems || []).filter((item: any) => item.category === category);
  };

  return (
    <div className="bg-[#F4F7F5] dark:bg-[#0D110E]">
      
      {/* 1. HERO HEADER */}
      <section className="relative bg-gradient-to-br from-[#1E2720] via-[#2E1815] to-[#1E2720] text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-[#FF5733]/20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800c_1px,transparent_1px),linear-gradient(to_bottom,#8080800c_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-[#FF5733]/15 border border-[#FF5733]/30 px-3.5 py-1 rounded-full text-xs font-bold text-[#FF5733] uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-[#FF5733] animate-pulse" />
            <span>Traditional Gourmet Heritage</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            REOL Eatery
          </h1>
          <p className="text-sm sm:text-lg text-[#90A496] max-w-2xl mx-auto font-light leading-relaxed">
            Taste the richness of Nigerian culinary craft. Savor authentic woodfire-infused Jollof, gourmet mixed grills, and traditional delicacies prepared fresh by our master chefs.
          </p>
          <div className="flex justify-center gap-6 text-xs text-[#90A496] pt-2">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#FF5733]" />
              <span>Daily: 8:00 AM — 10:00 PM</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#FF5733]" />
              <span>Lekki Plaza, Admiralty Way</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE MENU VIEW SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#111612]">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <div className="inline-block bg-[#FF5733]/10 px-3 py-1 rounded-full text-xs font-bold text-[#FF5733] uppercase tracking-wider">
              A la Carte
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#17221A] dark:text-white">
              Savor Our Premium Menu
            </h2>
            <p className="text-xs sm:text-sm text-[#5C6E62] dark:text-[#90A496] max-w-lg mx-auto font-light">
              Each recipe is curated to deliver rich flavor profiles, traditional cooking styles, and generous portions.
            </p>
          </div>

          <div className="space-y-16">
            {categories.map((category) => {
              const items = getItemsByCategory(category);
              if (items.length === 0) return null;

              return (
                <div key={category} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#17221A] dark:text-white border-b-2 border-[#FF5733] pb-1 shrink-0">
                      {category}
                    </h3>
                    <div className="h-px bg-[#E2EAE4] dark:bg-[#1E2720] w-full" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {items.map((item) => (
                      <div 
                        key={item.id} 
                        className="group flex flex-col sm:flex-row gap-6 p-4 rounded-2xl bg-[#F4F7F5] dark:bg-[#171D18] border border-[#E2EAE4] dark:border-[#1E2720] shadow-sm hover:shadow transition-shadow"
                      >
                        <div className="relative w-full sm:w-36 h-36 rounded-xl overflow-hidden shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={item.image_url} 
                            alt={item.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {item.is_featured && (
                            <div className="absolute top-2 left-2 bg-[#FF5733] text-white text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>Must Try</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col justify-between flex-grow space-y-3">
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-baseline gap-2">
                              <h4 className="font-serif text-lg font-bold text-[#17221A] dark:text-white group-hover:text-[#FF5733] transition-colors">
                                {item.name}
                              </h4>
                              <span className="font-black text-sm text-[#0F5132] dark:text-[#38C186] whitespace-nowrap">
                                ₦{Number(item.price).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-xs text-[#5C6E62] dark:text-[#90A496] leading-relaxed">
                              {item.description}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {item.dietary_tags && item.dietary_tags.map((tag: string, idx: number) => (
                              <span 
                                key={idx} 
                                className="text-[9px] font-bold text-[#FF5733] bg-[#FF5733]/5 border border-[#FF5733]/15 px-2 py-0.5 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. ORDERING SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-[#E2EAE4]/50 dark:border-[#1E2720]/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Reservation / Order Form */}
          <EateryOrderForm />

          {/* Bistro information */}
          <div className="space-y-10 lg:pl-6">
            <div className="space-y-4">
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#17221A] dark:text-white flex items-center gap-2">
                <Utensils className="w-6 h-6 text-[#FF5733]" />
                <span>The REOL Bistro Experience</span>
              </h2>
              <p className="text-sm text-[#5C6E62] dark:text-[#90A496] leading-relaxed font-light">
                Dine in elegant surroundings with friends, family, or business partners. We maintain high culinary standards, standard hygiene audits, and a relaxing environment.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-white dark:bg-[#111612] border border-[#E2EAE4] dark:border-[#1E2720] shadow-sm">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#FF5733] mb-2">Corporate Delivery</h4>
                <p className="text-xs text-[#5C6E62] dark:text-[#90A496] leading-relaxed">
                  We supply gourmet lunch packages for corporate board meetings, banks, and offices across Lekki, Victoria Island, and Ikoyi. Order before 10:00 AM for guaranteed 12:30 PM delivery.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white dark:bg-[#111612] border border-[#E2EAE4] dark:border-[#1E2720] shadow-sm">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#FF5733] mb-2">Private Catering</h4>
                <p className="text-xs text-[#5C6E62] dark:text-[#90A496] leading-relaxed">
                  Plan to host at home or your own venue? Our restaurant catering team can set up full buffet bars, live grill stations, and cocktail bars at your preferred venue.
                </p>
              </div>
            </div>

            {/* Quick Contact Box */}
            <div className="p-6 rounded-3xl bg-[#FF5733]/5 border border-[#FF5733]/10 flex gap-4">
              <PhoneCall className="w-6 h-6 text-[#FF5733] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h5 className="font-bold text-sm text-[#FF5733]">Want to reserve a table or order direct?</h5>
                <p className="text-xs text-[#5C6E62] dark:text-[#90A496] leading-relaxed">
                  Call our dining room hosts at <a href="tel:+2348123456789" className="font-semibold underline">+234 812 345 6789</a> for instant bookings, or connect directly through the WhatsApp button.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}

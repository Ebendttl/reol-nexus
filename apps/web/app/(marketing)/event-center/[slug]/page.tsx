import { createClient } from "../../../../lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, ArrowLeft, Calendar, Users, MapPin, Sparkles, AlertCircle } from "lucide-react";
import EventEnquiryForm from "../../../../components/marketing/EventEnquiryForm";

export async function generateMetadata({ params }: { params: any }) {
  const { slug } = await params;
  const capitalized = slug.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  return {
    title: `${capitalized} - Event Center Package`,
    description: `Details and booking information for the REOL Event Center ${capitalized} package in Lekki, Lagos.`,
  };
}

export default async function EventPackageDetailPage({ params }: { params: any }) {
  const { slug } = await params;
  const supabase = await createClient();

  // Map slug back to mock IDs
  const slugToIdMap: Record<string, string> = {
    "silver-celebration": "pack-silver",
    "gold-royale": "pack-gold",
    "platinum-elite": "pack-platinum",
  };

  const packageId = slugToIdMap[slug] || slug;

  // Fetch package
  const { data: pkg } = await supabase
    .from("event_packages")
    .select("*")
    .eq("id", packageId)
    .single();

  if (!pkg) {
    notFound();
  }

  // Fetch all packages for the form dropdown selector
  const { data: allPackages } = await supabase
    .from("event_packages")
    .select("*")
    .eq("is_active", true);

  const formPackages = (allPackages || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    hall_name: p.hall_name || "General Hall"
  }));

  return (
    <div className="bg-[#F4F7F5] dark:bg-[#0D110E] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Back Link */}
        <Link 
          href="/event-center" 
          className="inline-flex items-center gap-2 text-xs font-bold text-[#5C6E62] dark:text-[#90A496] hover:text-[#0F5132] dark:hover:text-[#38C186] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Event Center</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Package Details */}
          <div className="space-y-8">
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-[#E2EAE4] dark:border-[#1E2720] shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={pkg.image_url} 
                alt={pkg.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] bg-black/40 backdrop-blur-md px-2.5 py-1 rounded border border-white/10">
                  {pkg.hall_name}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/10 px-3 py-1 rounded-full text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Featured Venue Plan</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#17221A] dark:text-white">
                {pkg.name}
              </h1>
              <div className="flex gap-4 text-xs font-semibold text-[#5C6E62] dark:text-[#90A496]">
                <span className="flex items-center gap-1"><Users className="w-4 h-4 text-[#D4AF37]" /> Capacity: {pkg.capacity} guests</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-[#D4AF37]" /> Admiralty Way, Lekki</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#111612] border border-[#E2EAE4] dark:border-[#1E2720] shadow-sm space-y-4">
              <h3 className="text-xs uppercase tracking-wider font-bold text-[#5C6E62]">Investment From</h3>
              <div className="text-3xl font-black text-[#0F5132] dark:text-[#38C186]">
                ₦{Number(pkg.price_from).toLocaleString()}
              </div>
              <p className="text-xs text-[#5C6E62] dark:text-[#90A496] leading-relaxed">
                {pkg.description}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-wider text-[#17221A] dark:text-white">Premium Package Inclusions:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pkg.inclusions && pkg.inclusions.map((inc: string, i: number) => (
                  <div key={i} className="flex gap-2.5 p-4 rounded-xl bg-white dark:bg-[#111612] border border-[#E2EAE4] dark:border-[#1E2720]">
                    <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-[#5C6E62] dark:text-[#90A496]">{inc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enquiry Form */}
          <div>
            <div className="sticky top-24">
              <EventEnquiryForm packages={formPackages} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

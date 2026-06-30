import { MapPin, Phone, Mail, Clock, ShieldCheck, HelpCircle } from "lucide-react";
import ContactForm from "../../../components/marketing/ContactForm";

export const metadata = {
  title: "Contact REOL GLOBAL | Lekki Phase 1 Plaza Lagos",
  description: "Get in touch with the REOL Plaza management desk. Reach our Event Hall booking team, restaurant, or laundry dispatch line. Location: Admiralty Way, Lekki.",
};

export default function ContactPage() {
  const contacts = [
    {
      icon: MapPin,
      title: "Our Physical Address",
      details: "Plot 14, Admiralty Way, Lekki Phase 1, Lagos, Nigeria",
      sub: "Opposite Ebeano Supermarket",
    },
    {
      icon: Phone,
      title: "Direct Support Hotlines",
      details: "+234 (812) 345 6789",
      sub: "Available daily: 7:00 AM — 10:00 PM",
    },
    {
      icon: Mail,
      title: "Email Channels",
      details: "concierge@reolglobal.com",
      sub: "General corporate: info@reolglobal.com",
    },
  ];

  return (
    <div className="bg-[#F4F7F5] dark:bg-[#0D110E]">
      
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-[#1E2720] via-[#0A2E1C] to-[#1E2720] text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800c_1px,transparent_1px),linear-gradient(to_bottom,#8080800c_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            Get In Touch
          </h1>
          <p className="text-sm sm:text-lg text-[#90A496] max-w-2xl mx-auto font-light leading-relaxed">
            Have questions about date availability, menu selections, or logistics pickups? Write or call us directly.
          </p>
        </div>
      </section>

      {/* CONTACT INFO & FORM SPLIT */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#111612]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#17221A] dark:text-white">
                Contact Information
              </h2>
              <p className="text-sm text-[#5C6E62] dark:text-[#90A496] leading-relaxed font-light">
                We are strategically located at the heartbeat of Lekki Phase 1, making pickups, dining collections, and vendor setup access extremely straightforward.
              </p>
            </div>

            <div className="space-y-8">
              {contacts.map((c, i) => {
                const Icon = c.icon;
                return (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#0F5132]/5 dark:bg-[#38C186]/5 border border-[#E2EAE4] dark:border-[#1E2720] flex items-center justify-center text-[#D4AF37] shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-[#17221A] dark:text-white uppercase tracking-wider">{c.title}</h4>
                      <p className="text-xs font-semibold text-[#5C6E62] dark:text-[#90A496]">{c.details}</p>
                      <p className="text-[10px] text-[#5C6E62]/80 dark:text-[#90A496]/80">{c.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Google Map Mock / Location Highlight */}
            <div className="p-8 rounded-3xl bg-[#F4F7F5] dark:bg-[#171D18] border border-[#E2EAE4] dark:border-[#1E2720] space-y-4 shadow-sm relative overflow-hidden">
              <div className="flex gap-3 items-center">
                <Clock className="w-5 h-5 text-[#D4AF37]" />
                <h4 className="font-bold text-sm text-[#17221A] dark:text-white">Operating Hours</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="font-bold text-[#17221A] dark:text-white">REOL Eatery:</p>
                  <p className="text-[#5C6E62] dark:text-[#90A496]">Daily: 8:00 AM — 10:00 PM</p>
                </div>
                <div>
                  <p className="font-bold text-[#17221A] dark:text-white">REOL Laundry:</p>
                  <p className="text-[#5C6E62] dark:text-[#90A496]">Mon - Sat: 7:00 AM — 7:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <ContactForm />

        </div>
      </section>

    </div>
  );
}

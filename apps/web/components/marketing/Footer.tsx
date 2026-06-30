"use client";

import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { useToast } from "../ui/Toast";

export default function Footer() {
  const { showToast } = useToast();
  const currentYear = new Date().getFullYear();

  const businessUnits = [
    { name: "Event Center", href: "/event-center" },
    { name: "Eatery", href: "/eatery" },
    { name: "Laundry", href: "/laundry" },
    { name: "Coming Soon Services", href: "/coming-soon" },
  ];

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Contact & Support", href: "/contact" },
    { name: "Owner Dashboard", href: "/login" },
  ];

  return (
    <footer className="bg-[#111612] text-[#E2EAE4] border-t border-[#1E2720] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand Col */}
        <div className="space-y-4">
          <Link href="/" className="group flex items-center gap-2">
            <span className="font-serif text-2xl font-black tracking-tight text-white group-hover:opacity-85 transition-opacity">
              REOL<span className="text-[#D4AF37]">.</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#90A496] bg-[#1E2720] px-2 py-0.5 rounded border border-[#2D3930]">
              Global
            </span>
          </Link>
          <p className="text-sm text-[#90A496] leading-relaxed max-w-sm">
            Providing premium, institutional-grade services under one roof in Lagos. Experience the perfect synergy of luxury events, gourmet dining, and expert garment care.
          </p>
          <div className="flex gap-4 pt-2">
            <button 
              onClick={() => showToast("Instagram page is coming soon!", "warning")}
              className="p-2 rounded-lg bg-[#1E2720] hover:bg-[#0F5132] text-[#90A496] hover:text-white transition-all cursor-pointer border-0" 
              aria-label="Instagram"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </button>
            <button 
              onClick={() => showToast("Facebook page is coming soon!", "warning")}
              className="p-2 rounded-lg bg-[#1E2720] hover:bg-[#0F5132] text-[#90A496] hover:text-white transition-all cursor-pointer border-0" 
              aria-label="Facebook"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </button>
            <button 
              onClick={() => showToast("Twitter account is coming soon!", "warning")}
              className="p-2 rounded-lg bg-[#1E2720] hover:bg-[#0F5132] text-[#90A496] hover:text-white transition-all cursor-pointer border-0" 
              aria-label="Twitter"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </button>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
            Operating Hours
          </h4>
          <ul className="space-y-2.5 text-sm text-[#90A496]">
            <li className="flex justify-between border-b border-[#1E2720] pb-1.5">
              <span className="font-semibold text-white">Event Center:</span>
              <span>Mon - Sun (By Booking)</span>
            </li>
            <li className="flex justify-between border-b border-[#1E2720] pb-1.5">
              <span className="font-semibold text-white">REOL Eatery:</span>
              <span>Daily (8 AM - 10 PM)</span>
            </li>
            <li className="flex justify-between border-b border-[#1E2720] pb-1.5">
              <span className="font-semibold text-white">REOL Laundry:</span>
              <span>Mon - Sat (7 AM - 7 PM)</span>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4 md:col-span-1">
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
              Services
            </h4>
            <ul className="space-y-2 text-sm text-[#90A496]">
              {businessUnits.map((u) => (
                <li key={u.name}>
                  <Link href={u.href} className="hover:text-[#D4AF37] hover:underline transition-all">
                    {u.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-[#90A496]">
              {quickLinks.map((l) => (
                <li key={l.name}>
                  <Link href={l.href} className="hover:text-[#D4AF37] hover:underline transition-all">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Location & Info */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
            Find Us
          </h4>
          <ul className="space-y-3 text-sm text-[#90A496]">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>Plot 12, REOL Plaza, Admiralty Way, Lekki Phase 1, Lagos, Nigeria.</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <a href="tel:+2348137310107" className="hover:text-white transition-colors">+234 813 731 0107</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <a href="mailto:info@reolglobal.com" className="hover:text-white transition-colors">info@reolglobal.com</a>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-[#1E2720] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5C6E62]">
        <p>© {currentYear} REOL GLOBAL SOLUTIONS LIMITED. All rights reserved.</p>
        <div className="flex gap-4">
          <button 
            onClick={() => showToast("Privacy Policy page is coming soon!", "info")}
            className="hover:text-[#90A496] transition-colors cursor-pointer border-0 bg-transparent text-xs text-[#5C6E62] focus:outline-none"
          >
            Privacy Policy
          </button>
          <button 
            onClick={() => showToast("Terms of Service page is coming soon!", "info")}
            className="hover:text-[#90A496] transition-colors cursor-pointer border-0 bg-transparent text-xs text-[#5C6E62] focus:outline-none"
          >
            Terms of Service
          </button>
        </div>
      </div>
    </footer>
  );
}

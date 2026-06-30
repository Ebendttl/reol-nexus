import Link from "next/link";
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
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
            <a href="#" className="p-2 rounded-lg bg-[#1E2720] hover:bg-[#0F5132] text-[#90A496] hover:text-white transition-all">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-lg bg-[#1E2720] hover:bg-[#0F5132] text-[#90A496] hover:text-white transition-all">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-lg bg-[#1E2720] hover:bg-[#0F5132] text-[#90A496] hover:text-white transition-all">
              <Twitter className="w-4 h-4" />
            </a>
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
              <a href="tel:+2348123456789" className="hover:text-white transition-colors">+234 812 345 6789</a>
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
          <a href="#" className="hover:text-[#90A496] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#90A496] transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

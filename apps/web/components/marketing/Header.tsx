"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Phone } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Event Center", href: "/event-center", color: "hover:text-[#D4AF37]" },
    { name: "Eatery", href: "/eatery", color: "hover:text-[#FF5733]" },
    { name: "Laundry", href: "/laundry", color: "hover:text-[#33B5E5]" },
    { name: "About Us", href: "/about", color: "hover:text-[#D4AF37]" },
    { name: "Coming Soon", href: "/coming-soon", color: "hover:text-[#D4AF37]" },
    { name: "Contact", href: "/contact", color: "hover:text-[#D4AF37]" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 dark:bg-[#111612]/90 backdrop-blur-md shadow-sm border-b border-[#E2EAE4]/30 dark:border-[#1E2720]/30 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <span className="font-serif text-2xl font-black tracking-tight text-[#0F5132] dark:text-[#38C186] group-hover:opacity-85 transition-opacity">
              REOL<span className="text-[#D4AF37]">.</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest text-[#5C6E62] dark:text-[#90A496] bg-[#F4F7F5] dark:bg-[#18221B] px-2 py-0.5 rounded border border-[#E2EAE4]/50 dark:border-[#1E2720]/50">
              Nexus
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold tracking-wide transition-colors duration-200 ${link.color} ${
                    isActive
                      ? "text-[#0F5132] dark:text-[#38C186] underline decoration-2 underline-offset-4"
                      : "text-[#17221A] dark:text-[#E2EAE4]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-xs font-bold text-[#5C6E62] dark:text-[#90A496] hover:text-[#0F5132] dark:hover:text-[#38C186] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#0F5132] hover:bg-[#0D442A] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md shadow-[#0F5132]/10 transition-all duration-300 hover:-translate-y-0.5"
            >
              <span>Enquire Now</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-[#17221A] dark:text-[#E2EAE4] hover:bg-[#F4F7F5] dark:hover:bg-[#1E2720] transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] z-40 bg-white dark:bg-[#111612] border-t border-[#E2EAE4]/50 dark:border-[#1E2720]/50 overflow-y-auto animate-fade-in">
          <div className="px-4 pt-4 pb-6 space-y-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block py-3 px-4 rounded-xl text-base font-bold tracking-wide transition-all ${
                    isActive
                      ? "bg-[#0F5132]/5 text-[#0F5132] dark:text-[#38C186]"
                      : "text-[#17221A] dark:text-[#E2EAE4] hover:bg-[#F4F7F5] dark:hover:bg-[#1E2720]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="h-px bg-[#E2EAE4] dark:bg-[#1E2720] my-4" />
            <div className="grid grid-cols-2 gap-4 px-4">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center py-3 rounded-xl border border-[#E2EAE4] dark:border-[#1E2720] text-sm font-bold text-[#17221A] dark:text-[#E2EAE4] hover:bg-[#F4F7F5] dark:hover:bg-[#1E2720] transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0F5132] text-sm font-bold text-white shadow-md shadow-[#0F5132]/10 transition-all hover:bg-[#0D442A]"
              >
                <span>Enquire</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

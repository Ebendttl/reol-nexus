"use client";

import { MessageSquare } from "lucide-react";

export default function WhatsAppButton() {
  // Lagos WhatsApp Contact number (example formatting)
  const whatsappNumber = "2348123456789";
  const whatsappMessage = encodeURIComponent("Hello REOL Global, I would like to make an enquiry.");
  const url = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group cursor-pointer animate-bounce-subtle"
      aria-label="Contact us on WhatsApp"
    >
      <MessageSquare className="w-6 h-6 fill-white text-[#25D366] group-hover:text-[#128C7E] transition-colors" />
      <span className="absolute right-16 scale-0 group-hover:scale-100 bg-[#111612] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md transition-all duration-200 origin-right whitespace-nowrap border border-[#1E2720]">
        Chat with REOL
      </span>
    </a>
  );
}

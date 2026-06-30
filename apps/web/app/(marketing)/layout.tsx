import type { Metadata } from "next";
import Header from "../../components/marketing/Header";
import Footer from "../../components/marketing/Footer";
import WhatsAppButton from "../../components/marketing/WhatsAppButton";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | REOL GLOBAL SOLUTIONS",
    default: "REOL GLOBAL SOLUTIONS | Event Center, Eatery, Laundry in Lekki, Lagos",
  },
  description: "Experience premium multi-service comfort under one roof. Premium Event Center hall booking, authentic Nigerian Eatery dining, and professional dry cleaning laundry services.",
  keywords: ["Lagos Event Center", "Lekki Event Halls", "Smokey Jollof Lagos", "Lagos Dry Cleaners", "REOL Global", "Lekki Laundry Service"],
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://reolglobal.com",
    title: "REOL GLOBAL SOLUTIONS | Event Center, Eatery, Laundry in Lagos",
    description: "Premium Multi-Service Hub in Lekki, Lagos. Wedding & event hall bookings, gourmet diner, and laundry services.",
    siteName: "REOL GLOBAL",
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${playfair.variable} ${plusJakarta.variable} font-sans min-h-screen flex flex-col bg-[#F4F7F5] dark:bg-[#0D110E] text-[#17221A] dark:text-[#E2EAE4]`}>
      <Header />
      <main className="flex-grow pt-[64px]">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

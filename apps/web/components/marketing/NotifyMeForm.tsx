"use client";

import { useState } from "react";
import { submitPublicEnquiry } from "../../app/(marketing)/actions";
import { Send, CheckCircle2, AlertCircle, Bell, User, Mail, Phone, Home, Car, ShoppingBag } from "lucide-react";

export default function NotifyMeForm({ selectedUnitName = "" }: { selectedUnitName?: string }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    suites: selectedUnitName === "REOL Shortlet Suites" || selectedUnitName === "all",
    autoSpa: selectedUnitName === "Nexus Auto Spa & Detailers" || selectedUnitName === "all",
    miniMart: selectedUnitName === "REOL Express Mini-Mart" || selectedUnitName === "all",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: "suites" | "autoSpa" | "miniMart") => {
    setFormData((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const units: string[] = [];
    if (formData.suites) units.push("REOL Shortlet Suites");
    if (formData.autoSpa) units.push("Nexus Auto Spa & Detailers");
    if (formData.miniMart) units.push("REOL Express Mini-Mart");

    if (units.length === 0) {
      setError("Please select at least one service to get notified about.");
      setLoading(false);
      return;
    }

    const result = await submitPublicEnquiry({
      type: "notify_me",
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      message: `User requested launch notifications for: ${units.join(", ")}`,
      metadata: {
        interested_units: units,
      },
    });

    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        suites: false,
        autoSpa: false,
        miniMart: false,
      });
    }
  };

  return (
    <div className="bg-white dark:bg-[#111612] p-8 sm:p-10 rounded-3xl border border-[#E2EAE4] dark:border-[#1E2720] shadow-xl relative overflow-hidden">
      {/* Decorative gradient corner */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-bl-full pointer-events-none" />

      {success ? (
        <div className="text-center py-10 space-y-6 animate-fade-in">
          <div className="w-16 h-16 bg-[#0F5132]/10 dark:bg-[#38C186]/10 rounded-full flex items-center justify-center text-[#0F5132] dark:text-[#38C186] mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-2xl font-bold text-[#17221A] dark:text-white">
              Notification Set!
            </h3>
            <p className="text-sm text-[#5C6E62] dark:text-[#90A496] max-w-md mx-auto">
              We have recorded your details. You will be among the very first to receive invitation details, launch promotions, and soft-opening dates.
            </p>
          </div>
          <button
            onClick={() => setSuccess(false)}
            className="inline-flex items-center justify-center bg-[#0F5132] hover:bg-[#0D442A] text-white font-bold py-3 px-6 rounded-xl text-sm transition-colors cursor-pointer"
          >
            Manage Notifications
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="font-serif text-2xl font-bold text-[#17221A] dark:text-white flex items-center justify-center sm:justify-start gap-2">
              <Bell className="w-5 h-5 text-[#D4AF37]" />
              <span>Get Launch Invites</span>
            </h3>
            <p className="text-xs text-[#5C6E62] dark:text-[#90A496]">
              Select which services you are interested in, and we will keep you updated.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 flex gap-2 items-center text-red-600 dark:text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Service selectors */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-[#17221A] dark:text-[#E2EAE4]">Choose Services:</label>
            <div className="grid grid-cols-1 gap-2.5">
              
              {/* Suites */}
              <button
                type="button"
                onClick={() => handleCheckboxChange("suites")}
                className={`flex items-center gap-3 p-3.5 rounded-xl border text-left text-xs font-bold transition-all ${
                  formData.suites
                    ? "bg-[#0F5132]/5 border-[#0F5132] text-[#0F5132] dark:text-[#38C186] dark:border-[#38C186]"
                    : "bg-[#F4F7F5] dark:bg-[#18221B] border-[#E2EAE4] dark:border-[#1E2720] text-[#17221A] dark:text-[#E2EAE4] hover:bg-gray-100"
                }`}
              >
                <Home className="w-4 h-4 shrink-0" />
                <span className="flex-grow">REOL Shortlet Suites (Q3 2026)</span>
                <div className={`w-4 h-4 rounded border flex items-center justify-center ${formData.suites ? "bg-[#0F5132] text-white border-transparent" : "border-[#5C6E62]"}`}>
                  {formData.suites && <span className="text-[10px] font-black">✓</span>}
                </div>
              </button>

              {/* Auto Spa */}
              <button
                type="button"
                onClick={() => handleCheckboxChange("autoSpa")}
                className={`flex items-center gap-3 p-3.5 rounded-xl border text-left text-xs font-bold transition-all ${
                  formData.autoSpa
                    ? "bg-[#0F5132]/5 border-[#0F5132] text-[#0F5132] dark:text-[#38C186] dark:border-[#38C186]"
                    : "bg-[#F4F7F5] dark:bg-[#18221B] border-[#E2EAE4] dark:border-[#1E2720] text-[#17221A] dark:text-[#E2EAE4] hover:bg-gray-100"
                }`}
              >
                <Car className="w-4 h-4 shrink-0" />
                <span className="flex-grow">Nexus Auto Spa & Detailers (Q4 2026)</span>
                <div className={`w-4 h-4 rounded border flex items-center justify-center ${formData.autoSpa ? "bg-[#0F5132] text-white border-transparent" : "border-[#5C6E62]"}`}>
                  {formData.autoSpa && <span className="text-[10px] font-black">✓</span>}
                </div>
              </button>

              {/* Mini Mart */}
              <button
                type="button"
                onClick={() => handleCheckboxChange("miniMart")}
                className={`flex items-center gap-3 p-3.5 rounded-xl border text-left text-xs font-bold transition-all ${
                  formData.miniMart
                    ? "bg-[#0F5132]/5 border-[#0F5132] text-[#0F5132] dark:text-[#38C186] dark:border-[#38C186]"
                    : "bg-[#F4F7F5] dark:bg-[#18221B] border-[#E2EAE4] dark:border-[#1E2720] text-[#17221A] dark:text-[#E2EAE4] hover:bg-gray-100"
                }`}
              >
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span className="flex-grow">REOL Express Mini-Mart (Q1 2027)</span>
                <div className={`w-4 h-4 rounded border flex items-center justify-center ${formData.miniMart ? "bg-[#0F5132] text-white border-transparent" : "border-[#5C6E62]"}`}>
                  {formData.miniMart && <span className="text-[10px] font-black">✓</span>}
                </div>
              </button>

            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <label htmlFor="fullName" className="text-xs font-bold text-[#17221A] dark:text-[#E2EAE4] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#5C6E62]" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleTextChange}
              placeholder="Funke Adeyemi"
              className="w-full bg-[#F4F7F5] dark:bg-[#18221B] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-bold text-[#17221A] dark:text-[#E2EAE4] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#5C6E62]" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleTextChange}
                placeholder="funke@gmail.com"
                className="w-full bg-[#F4F7F5] dark:bg-[#18221B] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-xs font-bold text-[#17221A] dark:text-[#E2EAE4] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#5C6E62]" />
                <span>Phone Number (Optional)</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleTextChange}
                placeholder="+234 809 555 6666"
                className="w-full bg-[#F4F7F5] dark:bg-[#18221B] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#0F5132] hover:bg-[#0D442A] disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-xl transition-all cursor-pointer shadow-md shadow-[#0F5132]/10"
          >
            {loading ? (
              <span>Subscribing...</span>
            ) : (
              <>
                <span>Get Notified</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

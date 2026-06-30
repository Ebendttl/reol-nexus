"use client";

import { useState } from "react";
import { submitPublicEnquiry } from "../../app/(marketing)/actions";
import { Send, CheckCircle2, AlertCircle, User, Mail, Phone, Building, MessageSquare } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    businessUnitId: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const buNames: Record<string, string> = {
      bu1: "Event Center",
      bu2: "Eatery",
      bu3: "Laundry",
      general: "General Corporate Desk",
    };

    const result = await submitPublicEnquiry({
      business_unit_id: formData.businessUnitId !== "general" ? formData.businessUnitId : undefined,
      type: "contact",
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      metadata: {
        department: buNames[formData.businessUnitId] || "General",
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
        businessUnitId: "",
        message: "",
      });
    }
  };

  return (
    <div className="bg-white dark:bg-[#111612] p-8 sm:p-10 rounded-3xl border border-[#E2EAE4] dark:border-[#1E2720] shadow-xl relative overflow-hidden">
      {/* Decorative gradient corner */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#0F5132]/5 rounded-bl-full pointer-events-none" />

      {success ? (
        <div className="text-center py-10 space-y-6 animate-fade-in">
          <div className="w-16 h-16 bg-[#0F5132]/10 dark:bg-[#38C186]/10 rounded-full flex items-center justify-center text-[#0F5132] dark:text-[#38C186] mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-2xl font-bold text-[#17221A] dark:text-white">
              Message Sent!
            </h3>
            <p className="text-sm text-[#5C6E62] dark:text-[#90A496] max-w-md mx-auto">
              Thank you for contacting REOL. Our communications manager has received your message and will route it to the appropriate division for a prompt response.
            </p>
          </div>
          <button
            onClick={() => setSuccess(false)}
            className="inline-flex items-center justify-center bg-[#0F5132] hover:bg-[#0D442A] text-white font-bold py-3 px-6 rounded-xl text-sm transition-colors cursor-pointer"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="font-serif text-2xl font-bold text-[#17221A] dark:text-white flex items-center justify-center sm:justify-start gap-2">
              <span>Send Us a Message</span>
            </h3>
            <p className="text-xs text-[#5C6E62] dark:text-[#90A496]">
              Got feedback, custom corporate requests, or general complaints? Write to us directly.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 flex gap-2 items-center text-red-600 dark:text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

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
              onChange={handleChange}
              placeholder="Amara Cole"
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
                onChange={handleChange}
                placeholder="amara@gmail.com"
                className="w-full bg-[#F4F7F5] dark:bg-[#18221B] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-xs font-bold text-[#17221A] dark:text-[#E2EAE4] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#5C6E62]" />
                <span>Phone Number</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+234 812 000 9999"
                className="w-full bg-[#F4F7F5] dark:bg-[#18221B] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>
          </div>

          {/* Department selection */}
          <div className="space-y-1.5">
            <label htmlFor="businessUnitId" className="text-xs font-bold text-[#17221A] dark:text-[#E2EAE4] flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-[#5C6E62]" />
              <span>Route To Department</span>
            </label>
            <select
              id="businessUnitId"
              name="businessUnitId"
              required
              value={formData.businessUnitId}
              onChange={handleChange}
              className="w-full bg-[#F4F7F5] dark:bg-[#18221B] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] transition-all appearance-none cursor-pointer"
            >
              <option value="">Select department...</option>
              <option value="bu1">Event Center Venue Desk</option>
              <option value="bu2">Eatery Kitchen & Diner Desk</option>
              <option value="bu3">Laundry Garment Care Desk</option>
              <option value="general">General corporate administration</option>
            </select>
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <label htmlFor="message" className="text-xs font-bold text-[#17221A] dark:text-[#E2EAE4] flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#5C6E62]" />
              <span>Your Message</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="Describe your enquiry, proposal, or feedback here..."
              className="w-full bg-[#F4F7F5] dark:bg-[#18221B] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] transition-all resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#0F5132] hover:bg-[#0D442A] disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-xl transition-all cursor-pointer shadow-md shadow-[#0F5132]/10"
          >
            {loading ? (
              <span>Sending...</span>
            ) : (
              <>
                <span>Send Message</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

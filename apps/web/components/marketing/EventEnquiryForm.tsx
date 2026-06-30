"use client";

import { useState } from "react";
import { submitPublicEnquiry } from "../../app/(marketing)/actions";
import { Sparkles, Calendar, Users, Phone, Mail, User, FileText, Send, CheckCircle2, AlertCircle } from "lucide-react";

interface Package {
  id: string;
  name: string;
  hall_name: string;
}

export default function EventEnquiryForm({ packages }: { packages: Package[] }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    packageId: "",
    eventDate: "",
    guestCount: "",
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

    const selectedPack = packages.find((p) => p.id === formData.packageId);

    const result = await submitPublicEnquiry({
      business_unit_id: "bu1", // Event Center BU ID
      type: "event_enquiry",
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      metadata: {
        package_id: formData.packageId,
        package_name: selectedPack?.name || "None / General Enquiry",
        hall_name: selectedPack?.hall_name || "General",
        event_date: formData.eventDate,
        guest_count: formData.guestCount,
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
        packageId: "",
        eventDate: "",
        guestCount: "",
        message: "",
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
              Enquiry Received!
            </h3>
            <p className="text-sm text-[#5C6E62] dark:text-[#90A496] max-w-md mx-auto">
              Thank you for choosing REOL Event Center. Our booking manager will review your details and contact you via phone or email within the next 24 hours.
            </p>
          </div>
          <button
            onClick={() => setSuccess(false)}
            className="inline-flex items-center justify-center bg-[#0F5132] hover:bg-[#0D442A] text-white font-bold py-3 px-6 rounded-xl text-sm transition-colors cursor-pointer"
          >
            Submit Another Enquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="font-serif text-2xl font-bold text-[#17221A] dark:text-white flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
              <span>Book Your Date</span>
            </h3>
            <p className="text-xs text-[#5C6E62] dark:text-[#90A496]">
              Fill out the details below, and let's craft an elite experience for your guests.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 flex gap-2 items-center text-red-600 dark:text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                placeholder="Adebayo Cole"
                className="w-full bg-[#F4F7F5] dark:bg-[#18221B] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>

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
                placeholder="adebayo@gmail.com"
                className="w-full bg-[#F4F7F5] dark:bg-[#18221B] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                placeholder="+234 803 123 4567"
                className="w-full bg-[#F4F7F5] dark:bg-[#18221B] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>

            {/* Package selection */}
            <div className="space-y-1.5">
              <label htmlFor="packageId" className="text-xs font-bold text-[#17221A] dark:text-[#E2EAE4] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#5C6E62]" />
                <span>Preferred Package</span>
              </label>
              <select
                id="packageId"
                name="packageId"
                required
                value={formData.packageId}
                onChange={handleChange}
                className="w-full bg-[#F4F7F5] dark:bg-[#18221B] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] transition-all appearance-none cursor-pointer"
              >
                <option value="">Select a package...</option>
                {packages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.hall_name})
                  </option>
                ))}
                <option value="none">General Hall Rental Enquiry</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Event Date */}
            <div className="space-y-1.5">
              <label htmlFor="eventDate" className="text-xs font-bold text-[#17221A] dark:text-[#E2EAE4] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#5C6E62]" />
                <span>Event Date</span>
              </label>
              <input
                type="date"
                id="eventDate"
                name="eventDate"
                required
                value={formData.eventDate}
                onChange={handleChange}
                className="w-full bg-[#F4F7F5] dark:bg-[#18221B] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] transition-all cursor-pointer"
              />
            </div>

            {/* Guest Count */}
            <div className="space-y-1.5">
              <label htmlFor="guestCount" className="text-xs font-bold text-[#17221A] dark:text-[#E2EAE4] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#5C6E62]" />
                <span>Estimated Guests</span>
              </label>
              <input
                type="number"
                id="guestCount"
                name="guestCount"
                required
                min="1"
                value={formData.guestCount}
                onChange={handleChange}
                placeholder="200"
                className="w-full bg-[#F4F7F5] dark:bg-[#18221B] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>
          </div>

          {/* Notes / Message */}
          <div className="space-y-1.5">
            <label htmlFor="message" className="text-xs font-bold text-[#17221A] dark:text-[#E2EAE4] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#5C6E62]" />
              <span>Special Notes & Requests</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about your event theme, catering requirements, or any setup specifications..."
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
                <span>Submit Booking Request</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

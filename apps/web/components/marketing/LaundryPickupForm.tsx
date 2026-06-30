"use client";

import { useState } from "react";
import { submitPublicEnquiry } from "../../app/(marketing)/actions";
import { Send, CheckCircle2, AlertCircle, Shirt, User, Phone, Mail, MapPin, Calendar, MessageSquare } from "lucide-react";

interface Service {
  id: string;
  name: string;
}

export default function LaundryPickupForm({ services }: { services: Service[] }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    pickupAddress: "",
    serviceId: "",
    pickupDate: "",
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

    const selectedService = services.find((s) => s.id === formData.serviceId);

    const result = await submitPublicEnquiry({
      business_unit_id: "bu3", // Laundry BU ID
      type: "laundry_pickup",
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      metadata: {
        pickup_address: formData.pickupAddress,
        service_id: formData.serviceId,
        service_name: selectedService?.name || "General Service",
        pickup_date: formData.pickupDate,
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
        pickupAddress: "",
        serviceId: "",
        pickupDate: "",
        message: "",
      });
    }
  };

  return (
    <div className="bg-white dark:bg-[#111612] p-8 sm:p-10 rounded-3xl border border-[#E2EAE4] dark:border-[#1E2720] shadow-xl relative overflow-hidden">
      {/* Decorative gradient corner */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#33B5E5]/5 rounded-bl-full pointer-events-none" />

      {success ? (
        <div className="text-center py-10 space-y-6 animate-fade-in">
          <div className="w-16 h-16 bg-[#33B5E5]/10 rounded-full flex items-center justify-center text-[#33B5E5] mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-2xl font-bold text-[#17221A] dark:text-white">
              Request Submitted!
            </h3>
            <p className="text-sm text-[#5C6E62] dark:text-[#90A496] max-w-md mx-auto">
              We have received your laundry pickup request. Our dispatch logistics rider will contact you to coordinate the garment bag pickup.
            </p>
          </div>
          <button
            onClick={() => setSuccess(false)}
            className="inline-flex items-center justify-center bg-[#33B5E5] hover:bg-[#2CA4D0] text-[#111612] font-bold py-3 px-6 rounded-xl text-sm transition-colors cursor-pointer"
          >
            Submit Another Request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="font-serif text-2xl font-bold text-[#17221A] dark:text-white flex items-center justify-center sm:justify-start gap-2">
              <Shirt className="w-5 h-5 text-[#33B5E5]" />
              <span>Request a Pickup</span>
            </h3>
            <p className="text-xs text-[#5C6E62] dark:text-[#90A496]">
              Let us handle the chores. Enter your pickup address and desired service option.
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
                placeholder="Ngozi Okoye"
                className="w-full bg-[#F4F7F5] dark:bg-[#18221B] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#33B5E5] transition-all"
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
                placeholder="+234 802 333 4444"
                className="w-full bg-[#F4F7F5] dark:bg-[#18221B] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#33B5E5] transition-all"
              />
            </div>
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
                placeholder="ngozi@gmail.com"
                className="w-full bg-[#F4F7F5] dark:bg-[#18221B] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#33B5E5] transition-all"
              />
            </div>

            {/* Service option selection */}
            <div className="space-y-1.5">
              <label htmlFor="serviceId" className="text-xs font-bold text-[#17221A] dark:text-[#E2EAE4] flex items-center gap-1.5">
                <Shirt className="w-3.5 h-3.5 text-[#5C6E62]" />
                <span>Select Service</span>
              </label>
              <select
                id="serviceId"
                name="serviceId"
                required
                value={formData.serviceId}
                onChange={handleChange}
                className="w-full bg-[#F4F7F5] dark:bg-[#18221B] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#33B5E5] transition-all appearance-none cursor-pointer"
              >
                <option value="">Choose service...</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
                <option value="none">General Fabric Consultation</option>
              </select>
            </div>
          </div>

          {/* Pickup Date */}
          <div className="space-y-1.5">
            <label htmlFor="pickupDate" className="text-xs font-bold text-[#17221A] dark:text-[#E2EAE4] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#5C6E62]" />
              <span>Preferred Pickup Date & Time</span>
            </label>
            <input
              type="datetime-local"
              id="pickupDate"
              name="pickupDate"
              required
              value={formData.pickupDate}
              onChange={handleChange}
              className="w-full bg-[#F4F7F5] dark:bg-[#18221B] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#33B5E5] transition-all cursor-pointer"
            />
          </div>

          {/* Pickup Address */}
          <div className="space-y-1.5">
            <label htmlFor="pickupAddress" className="text-xs font-bold text-[#17221A] dark:text-[#E2EAE4] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#5C6E62]" />
              <span>Full Address for Dispatch Rider</span>
            </label>
            <input
              type="text"
              id="pickupAddress"
              name="pickupAddress"
              required
              value={formData.pickupAddress}
              onChange={handleChange}
              placeholder="e.g. Block 5, Flat 2, Lekki Gardens Phase 3, Lekki, Lagos."
              className="w-full bg-[#F4F7F5] dark:bg-[#18221B] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#33B5E5] transition-all"
            />
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <label htmlFor="message" className="text-xs font-bold text-[#17221A] dark:text-[#E2EAE4] flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#5C6E62]" />
              <span>Additional Comments (Optional)</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              value={formData.message}
              onChange={handleChange}
              placeholder="e.g. Delicate fabrics, wedding gown dry cleaning, heavy grease stains on suits..."
              className="w-full bg-[#F4F7F5] dark:bg-[#18221B] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#33B5E5] transition-all resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#33B5E5] hover:bg-[#2CA4D0] disabled:bg-gray-400 text-[#111612] font-bold py-4 px-6 rounded-xl transition-all cursor-pointer shadow-md shadow-[#33B5E5]/10"
          >
            {loading ? (
              <span>Scheduling...</span>
            ) : (
              <>
                <span>Schedule Pickup Rider</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { submitPublicEnquiry } from "../../app/(marketing)/actions";
import { Send, CheckCircle2, AlertCircle, ShoppingCart, User, Phone, Mail, Clock, MessageSquare } from "lucide-react";

export default function EateryOrderForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    orderDetails: "",
    serviceType: "dine_in",
    timeSlot: "",
    notes: "",
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

    const result = await submitPublicEnquiry({
      business_unit_id: "bu2", // Eatery BU ID
      type: "eatery_order",
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      message: formData.notes,
      metadata: {
        order_details: formData.orderDetails,
        service_type: formData.serviceType,
        pickup_or_dine_time: formData.timeSlot,
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
        orderDetails: "",
        serviceType: "dine_in",
        timeSlot: "",
        notes: "",
      });
    }
  };

  return (
    <div className="bg-white dark:bg-[#111612] p-8 sm:p-10 rounded-3xl border border-[#E2EAE4] dark:border-[#1E2720] shadow-xl relative overflow-hidden">
      {/* Decorative gradient corner */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF5733]/5 rounded-bl-full pointer-events-none" />

      {success ? (
        <div className="text-center py-10 space-y-6 animate-fade-in">
          <div className="w-16 h-16 bg-[#FF5733]/10 rounded-full flex items-center justify-center text-[#FF5733] mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-2xl font-bold text-[#17221A] dark:text-white">
              Order Placed!
            </h3>
            <p className="text-sm text-[#5C6E62] dark:text-[#90A496] max-w-md mx-auto">
              We have received your pre-order/reservation request. A restaurant host will contact you shortly to confirm your table or dispatch details.
            </p>
          </div>
          <button
            onClick={() => setSuccess(false)}
            className="inline-flex items-center justify-center bg-[#FF5733] hover:bg-[#E04E2C] text-white font-bold py-3 px-6 rounded-xl text-sm transition-colors cursor-pointer"
          >
            Submit Another Order
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="font-serif text-2xl font-bold text-[#17221A] dark:text-white flex items-center justify-center sm:justify-start gap-2">
              <ShoppingCart className="w-5 h-5 text-[#FF5733]" />
              <span>Dine or Pre-Order</span>
            </h3>
            <p className="text-xs text-[#5C6E62] dark:text-[#90A496]">
              Skip the wait. Reserve a table or pre-order your meals for rapid collection/delivery.
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
                placeholder="Chidi Nwosu"
                className="w-full bg-[#F4F7F5] dark:bg-[#18221B] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF5733] transition-all"
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
                placeholder="+234 803 987 6543"
                className="w-full bg-[#F4F7F5] dark:bg-[#18221B] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF5733] transition-all"
              />
            </div>
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
              placeholder="chidi@gmail.com"
              className="w-full bg-[#F4F7F5] dark:bg-[#18221B] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF5733] transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Service Type */}
            <div className="space-y-1.5">
              <label htmlFor="serviceType" className="text-xs font-bold text-[#17221A] dark:text-[#E2EAE4] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#5C6E62]" />
                <span>Service Type</span>
              </label>
              <select
                id="serviceType"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                className="w-full bg-[#F4F7F5] dark:bg-[#18221B] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF5733] transition-all appearance-none cursor-pointer"
              >
                <option value="dine_in">Table Reservation (Dine-in)</option>
                <option value="pickup">Self-Pickup Order</option>
                <option value="delivery">Lekki Dispatch Delivery</option>
              </select>
            </div>

            {/* Time Slot */}
            <div className="space-y-1.5">
              <label htmlFor="timeSlot" className="text-xs font-bold text-[#17221A] dark:text-[#E2EAE4] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#5C6E62]" />
                <span>Preferred Date & Time</span>
              </label>
              <input
                type="datetime-local"
                id="timeSlot"
                name="timeSlot"
                required
                value={formData.timeSlot}
                onChange={handleChange}
                className="w-full bg-[#F4F7F5] dark:bg-[#18221B] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF5733] transition-all cursor-pointer"
              />
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-1.5">
            <label htmlFor="orderDetails" className="text-xs font-bold text-[#17221A] dark:text-[#E2EAE4] flex items-center gap-1.5">
              <ShoppingCart className="w-3.5 h-3.5 text-[#5C6E62]" />
              <span>Meal Selections (Pre-Order)</span>
            </label>
            <textarea
              id="orderDetails"
              name="orderDetails"
              rows={3}
              value={formData.orderDetails}
              onChange={handleChange}
              placeholder="e.g. 2x Smokey Jollof Rice (Chicken), 1x Royal Grill Platter"
              className="w-full bg-[#F4F7F5] dark:bg-[#18221B] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF5733] transition-all resize-none"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label htmlFor="notes" className="text-xs font-bold text-[#17221A] dark:text-[#E2EAE4] flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#5C6E62]" />
              <span>Special Instructions</span>
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={2}
              value={formData.notes}
              onChange={handleChange}
              placeholder="e.g. Extra pepper sauce, allergy warnings, or dietary requests..."
              className="w-full bg-[#F4F7F5] dark:bg-[#18221B] border border-[#E2EAE4] dark:border-[#1E2720] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF5733] transition-all resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#FF5733] hover:bg-[#E04E2C] disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-xl transition-all cursor-pointer shadow-md shadow-[#FF5733]/10"
          >
            {loading ? (
              <span>Sending...</span>
            ) : (
              <>
                <span>Submit Order Request</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

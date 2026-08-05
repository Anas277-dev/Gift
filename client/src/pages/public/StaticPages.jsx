import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Mail, MapPin, ChevronDown, Clock, HelpCircle, Gift } from 'lucide-react';
import toast from 'react-hot-toast';

export function AboutUs() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-coral-500 uppercase tracking-widest">About Gifto</span>
        <h1 className="font-display text-4xl font-extrabold text-gray-900">Connecting Hearts Across Pakistan</h1>
        <p className="text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Gifto is Pakistan’s leading online gift delivery platform. Founded to help families and loved ones stay connected regardless of distance, we enable customers locally and internationally (USA, UK, UAE, Canada) to send fresh cakes, flowers, chocolates, sweets, and personalized gifts to major Pakistani cities.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 pt-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center space-y-2">
          <div className="text-3xl">🎂</div>
          <h3 className="font-bold text-gray-900 text-base">Fresh Bakery Cakes</h3>
          <p className="text-xs text-gray-500">Partnered with Layers, Jalal Sons, Tehzeeb & Pie In The Sky</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center space-y-2">
          <div className="text-3xl">🌹</div>
          <h3 className="font-bold text-gray-900 text-base">Imported & Local Roses</h3>
          <p className="text-xs text-gray-500">Hand-arranged fresh rose bouquets delivered same-day</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center space-y-2">
          <div className="text-3xl">🕛</div>
          <h3 className="font-bold text-gray-900 text-base">Midnight Surprise</h3>
          <p className="text-xs text-gray-500">12:00 AM midnight birthday & anniversary deliveries</p>
        </div>
      </div>
    </div>
  );
}

export function ContactUs() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('Thank you! Your message has been sent to our customer care team.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="font-display text-3xl font-extrabold text-gray-900">Contact Us</h1>
        <p className="text-xs text-gray-500">We are here to assist you 7 days a week (10:00 AM – 12:00 AM PST)</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 text-lg">Send Us a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Your Name</label>
              <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Your Email</label>
              <input required type="email" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Message</label>
              <textarea required rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs" />
            </div>
            <button type="submit" className="w-full gradient-teal text-white font-bold py-3 rounded-full text-xs shadow-md">
              Send Message
            </button>
          </form>
        </div>

        <div className="bg-teal-900 text-white p-6 rounded-2xl shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-xl text-amber-400">Customer Support Hotline</h3>
            <div className="space-y-3 text-xs text-teal-100">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400" /> Phone / WhatsApp: +92 300 1234567
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" /> Email: support@gifto.pk
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" /> Hours: 10:00 AM – 12:00 AM PST (7 Days)
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" /> Corporate Office: Gulberg III, Lahore, Pakistan
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-teal-800 text-[11px] text-teal-200">
            FBR NTN Registration: <strong>NTN # 8492019-3</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FAQs() {
  const faqsList = [
    { q: 'How do international orders work?', a: 'Customers from USA, UK, Canada, Australia, UAE, etc. can order online using Credit/Debit cards or Bank Transfer. We hand-deliver fresh gifts directly in Pakistan.' },
    { q: 'Can I request same-day or midnight delivery?', a: 'Yes! Same-day delivery is available for orders placed before 3:00 PM PST in Lahore, Karachi, and Islamabad. Midnight delivery (12:00 AM) is also supported.' },
    { q: 'What payment methods do you accept?', a: 'We accept Credit/Debit Cards (Visa/Mastercard), Direct Bank Transfers (Meezan Bank / Raast), and Cash on Delivery.' },
    { q: 'What happens if a bakery item is unavailable?', a: 'If an exact cake from a specific bakery is out of stock, we contact you immediately to offer an equal or higher value replacement from a top partner bakeshop.' },
  ];

  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-display text-3xl font-extrabold text-gray-900">Frequently Asked Questions (FAQs)</h1>
        <p className="text-xs text-gray-500">Everything you need to know about ordering and gift delivery</p>
      </div>

      <div className="space-y-3">
        {faqsList.map((faq, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
              className="w-full p-4 text-left font-bold text-sm text-gray-900 flex justify-between items-center"
            >
              <span>{faq.q}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${openIndex === i ? 'rotate-180 text-teal-700' : 'text-gray-400'}`} />
            </button>
            {openIndex === i && (
              <div className="p-4 pt-0 text-xs text-gray-600 leading-relaxed border-t border-gray-50">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PaymentMethods() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      <h1 className="font-display text-3xl font-extrabold text-gray-900">Accepted Payment Methods</h1>
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 text-xs text-gray-600">
        <h3 className="font-bold text-gray-900 text-sm">1. Credit / Debit Cards (International & Local)</h3>
        <p>We accept Visa and Mastercard. All transactions are encrypted via 256-bit SSL technology.</p>

        <h3 className="font-bold text-gray-900 text-sm pt-2">2. Direct Bank Transfer (Meezan Bank)</h3>
        <p>Meezan Bank Limited | Title: <strong>Gifto Online Pvt Ltd</strong> | Account: <strong>01020104928192</strong> | IBAN: <strong>PK36MEZN0001020104928192</strong></p>

        <h3 className="font-bold text-gray-900 text-sm pt-2">3. Cash on Delivery (COD)</h3>
        <p>Available for selected gift categories in major Pakistani cities.</p>
      </div>
    </div>
  );
}

export function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-4 text-xs text-gray-600">
      <h1 className="font-display text-3xl font-extrabold text-gray-900 mb-4">Privacy Policy</h1>
      <p>Your privacy is important to us at Gifto. We collect minimal recipient and purchaser information solely for order fulfillment and delivery communication.</p>
      <p>We do not store complete credit card information on our servers. All sensitive data is transmitted via encrypted gateways.</p>
    </div>
  );
}

export function TermsAndConditions() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-4 text-xs text-gray-600">
      <h1 className="font-display text-3xl font-extrabold text-gray-900 mb-4">Terms & Conditions</h1>
      <p>By placing an order on Gifto, you agree to provide accurate recipient contact details and delivery addresses in Pakistan.</p>
    </div>
  );
}

export function ReturnsRefundPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-4 text-xs text-gray-600">
      <h1 className="font-display text-3xl font-extrabold text-gray-900 mb-4">Returns & Refund Policy</h1>
      <p>Due to the perishable nature of cakes and fresh flower arrangements, refunds are provided if an order is cancelled at least 24 hours prior to scheduled delivery or if delivery fails due to merchant error.</p>
    </div>
  );
}

export function LegalIdentity() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-4 text-xs text-gray-600">
      <h1 className="font-display text-3xl font-extrabold text-gray-900 mb-4">Legal & Business Registration</h1>
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
        <p>Company Name: <strong>Gifto Online Pvt Ltd</strong></p>
        <p>FBR NTN Number: <strong>NTN # 8492019-3</strong></p>
        <p>Registered Country: <strong>Pakistan</strong></p>
      </div>
    </div>
  );
}

export function BlogListing() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <h1 className="font-display text-3xl font-extrabold text-gray-900">Gifto Delivery Blog & Guides</h1>
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-coral-500 uppercase">GIFT GUIDE</span>
          <h3 className="font-bold text-gray-900 text-sm">Best Birthday Cakes in Lahore for Midnight Surprise</h3>
          <p className="text-xs text-gray-500">Discover top bakeshops in Lahore including Layers, Jalal Sons, and Kitchen Cuisine.</p>
        </div>
      </div>
    </div>
  );
}

export function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
      <div className="text-6xl font-extrabold text-teal-700 font-display">404</div>
      <h2 className="text-2xl font-bold text-gray-900">Page Not Found</h2>
      <p className="text-xs text-gray-500">The page you are looking for does not exist or has been moved.</p>
      <Link to="/" className="inline-block bg-teal-700 text-white font-bold px-6 py-2.5 rounded-full text-xs">
        Return to Home
      </Link>
    </div>
  );
}

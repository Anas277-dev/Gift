import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Phone, Mail, MapPin, ShieldCheck, Clock, Award, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-gray-300 pt-12 pb-24 md:pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-gray-800 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-teal-900/50 text-teal-400 flex items-center justify-center mb-3">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-white text-sm">Same-Day & Midnight</h4>
            <p className="text-xs text-gray-400 mt-1">Delivery in major PK cities</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-coral-500/10 text-coral-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-white text-sm">100% Freshness Guarantee</h4>
            <p className="text-xs text-gray-400 mt-1">Bakery fresh cakes & roses</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-white text-sm">Earn Loyalty Points</h4>
            <p className="text-xs text-gray-400 mt-1">Get 5% points on every order</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
              <Heart className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-white text-sm">Worldwide Ordering</h4>
            <p className="text-xs text-gray-400 mt-1">Order from USA, UK, UAE & more</p>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl gradient-coral flex items-center justify-center text-white font-bold">
                <Gift className="w-5 h-5" />
              </div>
              <span className="font-display text-2xl font-bold text-white">GIFTO</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Pakistan's premier online gift delivery platform. Delivering cakes, flowers, chocolates, perfumes, food deals, and custom gift hampers to your loved ones in 15+ Pakistani cities.
            </p>
            <div className="pt-2 text-xs text-gray-400 space-y-1">
              <p>📌 NTN Registration: <strong>NTN # 8492019-3</strong></p>
              <p>🕒 Business Hours: 10:00 AM – 12:00 AM PST (7 Days)</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Gift Categories</h5>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/category/cakes" className="hover:text-coral-400">Lahore & Karachi Cakes</Link></li>
              <li><Link to="/category/flowers" className="hover:text-coral-400">Fresh Flower Bouquets</Link></li>
              <li><Link to="/category/chocolates" className="hover:text-coral-400">Ferrero & Chocolates</Link></li>
              <li><Link to="/category/sweets-mithai" className="hover:text-coral-400">Traditional Mithai</Link></li>
              <li><Link to="/category/combo-deals" className="hover:text-coral-400">Special Combo Deals</Link></li>
              <li><Link to="/category/food-deals" className="hover:text-coral-400">KFC & Food Combos</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h5 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Customer Care</h5>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/order-tracking" className="hover:text-amber-400">Track Your Order</Link></li>
              <li><Link to="/about-us" className="hover:text-amber-400">About Us</Link></li>
              <li><Link to="/contact-us" className="hover:text-amber-400">Contact Us</Link></li>
              <li><Link to="/faqs" className="hover:text-amber-400">FAQs</Link></li>
              <li><Link to="/payment-methods" className="hover:text-amber-400">Payment Options</Link></li>
              <li><Link to="/legal-identity" className="hover:text-amber-400">Legal & Business Info</Link></li>
            </ul>
          </div>

          {/* Legal Policies */}
          <div>
            <h5 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Policies</h5>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/privacy-policy" className="hover:text-teal-400">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions" className="hover:text-teal-400">Terms & Conditions</Link></li>
              <li><Link to="/returns-refund-policy" className="hover:text-teal-400">Returns & Refund</Link></li>
              <li><Link to="/account/login" className="hover:text-teal-400">Customer Login</Link></li>
              <li><Link to="/admin/login" className="hover:text-coral-400 font-medium">Admin Portal</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} Gifto Delivery Pakistan. All Rights Reserved.</p>
          <div className="flex items-center space-x-3 bg-gray-900 px-4 py-2 rounded-full border border-gray-800">
            <span>Accepted Payments:</span>
            <span className="font-bold text-white">Credit/Debit Card</span>
            <span>•</span>
            <span className="font-bold text-emerald-400">Bank Transfer</span>
            <span>•</span>
            <span className="font-bold text-amber-400">Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

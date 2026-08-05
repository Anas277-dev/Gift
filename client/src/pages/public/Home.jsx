import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Truck, ShieldCheck, Heart, ArrowRight, Gift, Clock, MapPin, Star } from 'lucide-react';
import ProductCard from '../../components/common/ProductCard';
import CategoryCard from '../../components/common/CategoryCard';
import { productsAPI, categoriesAPI } from '../../api/endpoints';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          productsAPI.getFeatured(),
          categoriesAPI.getAll(),
        ]);
        if (prodRes.success) setFeaturedProducts(prodRes.products);
        if (catRes.success) setCategories(catRes.categories);
      } catch (err) {
        console.error('Failed to fetch home data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden gradient-teal text-white rounded-b-3xl shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-300 border border-white/20">
              <Sparkles className="w-4 h-4 text-amber-400" /> #1 Online Gift Delivery Service in Pakistan
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Send Love Across <span className="text-amber-400">Pakistan</span> & Worldwide 🎁
            </h1>
            <p className="text-teal-100 text-base sm:text-lg max-w-lg leading-relaxed">
              Same-day & midnight delivery of bakery fresh cakes, imported roses, Ferrero Rocher, traditional mithai, and custom gift hampers.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <Link
                to="/shop"
                className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold px-7 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm"
              >
                Shop All Gifts <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/category/cakes"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-full border border-white/30 transition-all text-sm"
              >
                Order Cakes 🎂
              </Link>
            </div>

            <div className="pt-4 flex items-center justify-center md:justify-start gap-6 text-xs text-teal-200">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" /> Same-Day Delivery
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" /> Freshness Guaranteed
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1000&auto=format&fit=crop&q=80"
                alt="Gift Delivery Pakistan"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white text-gray-900 p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-100 hidden sm:flex">
              <div className="w-10 h-10 rounded-full bg-coral-500/10 text-coral-500 flex items-center justify-center font-bold">
                ❤️
              </div>
              <div>
                <p className="font-bold text-sm">50,000+ Gifts Delivered</p>
                <p className="text-xs text-gray-500">Lahore, Karachi, Islamabad & 12 Cities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">
              Explore Gift Categories
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Handcrafted gifts for every emotion, celebration, and milestone
            </p>
          </div>
          <Link to="/shop" className="text-sm font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-44 bg-gray-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        )}
      </section>

      {/* Featured / Trending Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex justify-between items-end border-b border-gray-200 pb-4">
          <div>
            <span className="text-xs font-bold text-coral-500 uppercase tracking-widest">Trending Now</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mt-0.5">
              Deals of the Week 🌟
            </h2>
          </div>
          <Link to="/shop?featured=true" className="text-sm font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1">
            Browse Trending <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 bg-gray-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Delivery Coverage Cities Section */}
      <section className="bg-lavender/60 py-12 rounded-3xl max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-8">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-widest">WIDESPREAD COVERAGE</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">
            Delivering Smiles to 15+ Pakistani Cities 🇵🇰
          </h2>
          <p className="text-sm text-gray-600">
            Order from anywhere in the world (USA, UK, UAE, Canada) and we will hand-deliver fresh gifts directly to your recipient's doorstep.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-center">
          {[
            'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad',
            'Multan', 'Gujranwala', 'Sialkot', 'Peshawar', 'Hyderabad',
            'Sahiwal', 'Bahawalpur', 'Rahim Yar Khan', 'Jhelum', 'Gujrat'
          ].map((city) => (
            <div key={city} className="bg-white p-3.5 rounded-xl shadow-sm border border-gray-100 font-semibold text-gray-800 text-sm flex items-center justify-center gap-1.5 hover:border-teal-700 transition-colors">
              <MapPin className="w-4 h-4 text-coral-500" /> {city}
            </div>
          ))}
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">
            Loved by Thousands Worldwide ❤️
          </h2>
          <p className="text-sm text-gray-500 mt-1">Real stories from overseas Pakistanis and local customers</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex text-amber-400 space-x-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-sm text-gray-600 italic">
              "Ordered a Layers Fudge Cake and 24 Red Roses for my mom's birthday in Lahore from London. Delivery was right at 12:00 midnight! Super impressed!"
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
                ZA
              </div>
              <div>
                <p className="font-bold text-sm text-gray-900">Zainab Ahmed</p>
                <p className="text-xs text-gray-400">London, UK (Delivered to Lahore)</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex text-amber-400 space-x-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-sm text-gray-600 italic">
              "The combo deal of Ferrero Rocher basket and bouquet was stunning. Fresh roses and crisp packaging. Will definitely use Gifto again!"
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-9 h-9 rounded-full bg-coral-100 text-coral-800 font-bold flex items-center justify-center text-xs">
                HM
              </div>
              <div>
                <p className="font-bold text-sm text-gray-900">Hassan Mahmood</p>
                <p className="text-xs text-gray-400">Dubai, UAE (Delivered to Islamabad)</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex text-amber-400 space-x-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-sm text-gray-600 italic">
              "Ordered KFC deal and personalized photo mug for my brother in Karachi. The team confirmed delivery via WhatsApp. Highly recommended!"
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-xs">
                MR
              </div>
              <div>
                <p className="font-bold text-sm text-gray-900">Maria Raza</p>
                <p className="text-xs text-gray-400">Toronto, Canada (Delivered to Karachi)</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

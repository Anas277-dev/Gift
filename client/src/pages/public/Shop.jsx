import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, MapPin, X } from 'lucide-react';
import ProductCard from '../../components/common/ProductCard';
import { productsAPI, categoriesAPI } from '../../api/endpoints';
import { useCartStore } from '../../store/useCartStore';

const CITIES = [
  'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Gujranwala', 'Sialkot', 'Peshawar', 'Hyderabad'
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedCity } = useCartStore();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters state
  const selectedCategory = searchParams.get('category') || '';
  const selectedCityFilter = searchParams.get('city') || selectedCity || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sortBy = searchParams.get('sortBy') || 'createdAt';

  useEffect(() => {
    async function loadShopData() {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          productsAPI.getProducts({
            category: selectedCategory,
            city: selectedCityFilter,
            minPrice,
            maxPrice,
            sortBy,
          }),
          categoriesAPI.getAll(),
        ]);

        if (prodRes.success) setProducts(prodRes.products);
        if (catRes.success) setCategories(catRes.categories);
      } catch (err) {
        console.error('Error loading shop products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadShopData();
  }, [selectedCategory, selectedCityFilter, minPrice, maxPrice, sortBy]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header & Sort Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-gray-900">
            {selectedCategory ? `Gifts in ${selectedCategory}` : 'All Online Gifts'}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Showing {products.length} products deliverable to <strong className="text-teal-700">{selectedCityFilter}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-800 px-3.5 py-2 rounded-xl text-xs font-bold"
          >
            <Filter className="w-4 h-4 text-teal-700" /> {mobileFilterOpen ? 'Close Filters' : 'Filter Gifts'}
          </button>

          <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
            <span className="hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => updateParam('sortBy', e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl py-1.5 px-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-700"
            >
              <option value="createdAt">Latest Added</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6 sm:gap-8 items-start">
        {/* Sidebar Filters */}
        <aside className={`bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-6 md:block ${mobileFilterOpen ? 'block' : 'hidden'}`}>
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-teal-700" /> Filter Gifts
            </h3>
            <div className="flex items-center gap-2">
              <button onClick={clearFilters} className="text-xs font-semibold text-coral-500 hover:underline">
                Reset All
              </button>
              <button onClick={() => setMobileFilterOpen(false)} className="md:hidden text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* City Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              Delivery City
            </label>
            <select
              value={selectedCityFilter}
              onChange={(e) => updateParam('city', e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold text-gray-800"
            >
              <option value="">All Cities</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Categories Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              Categories
            </label>
            <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
              <button
                onClick={() => updateParam('category', '')}
                className={`w-full text-left text-xs py-1.5 px-2.5 rounded-lg transition-colors ${
                  !selectedCategory ? 'bg-teal-50 text-teal-900 font-bold' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => updateParam('category', cat.slug)}
                  className={`w-full text-left text-xs py-1.5 px-2.5 rounded-lg transition-colors ${
                    selectedCategory === cat.slug ? 'bg-teal-50 text-teal-900 font-bold' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              Price Range (PKR)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => updateParam('minPrice', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => updateParam('maxPrice', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs"
              />
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="md:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-80 bg-gray-200 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white p-8 sm:p-12 text-center rounded-2xl border border-gray-100 space-y-4">
              <div className="text-4xl">🎁</div>
              <h3 className="font-bold text-gray-900 text-base sm:text-lg">No Products Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                No gifts match your filter parameters. Try clearing city or category filters.
              </p>
              <button
                onClick={clearFilters}
                className="bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-teal-800"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

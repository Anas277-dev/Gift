import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../../components/common/ProductCard';
import { categoriesAPI } from '../../api/endpoints';

export default function CategoryPage() {
  const { slug, childSlug } = useParams();
  const activeSlug = childSlug || slug;

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCat() {
      setLoading(true);
      try {
        const res = await categoriesAPI.getBySlug(activeSlug);
        if (res.success) setCategory(res.category);
      } catch (err) {
        console.error('Failed to fetch category detail:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCat();
  }, [activeSlug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-6">
        <div className="h-40 bg-gray-200 animate-pulse rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => <div key={n} className="h-72 bg-gray-200 animate-pulse rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Category Not Found</h2>
        <Link to="/shop" className="text-teal-700 font-semibold underline mt-2 inline-block">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Category Hero Header */}
      <div className="relative rounded-3xl overflow-hidden gradient-teal text-white p-8 md:p-12 shadow-xl flex items-center justify-between">
        <div className="space-y-3 max-w-xl z-10">
          <div className="flex items-center space-x-2 text-xs text-amber-300 font-semibold uppercase">
            <Link to="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:underline">Category</Link>
            <span>/</span>
            <span>{category.name}</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold">{category.name}</h1>
          <p className="text-teal-100 text-sm leading-relaxed">{category.description}</p>
        </div>

        {category.imageUrl && (
          <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-2xl hidden md:block border-2 border-white/30">
            <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Sub-categories Taxonomy Chips */}
      {category.children && category.children.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sub-Categories & Brands</h3>
          <div className="flex flex-wrap gap-2.5">
            {category.children.map((child) => (
              <Link
                key={child.id}
                to={`/category/${category.slug}/${child.slug}`}
                className="bg-white border border-gray-200 text-gray-800 text-xs font-semibold px-4 py-2 rounded-full hover:border-teal-700 hover:bg-teal-50 transition-colors shadow-sm"
              >
                🍰 {child.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold text-gray-900">
          Available {category.name} ({category.products ? category.products.length : 0})
        </h2>

        {category.products && category.products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {category.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-2xl border border-gray-100">
            <p className="text-gray-500 text-sm">No products currently listed in this sub-category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

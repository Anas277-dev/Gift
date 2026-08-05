import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/common/ProductCard';
import { productsAPI } from '../../api/endpoints';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function performSearch() {
      setLoading(true);
      try {
        const res = await productsAPI.search(query);
        if (res.success) setProducts(res.products);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    }
    if (query) performSearch();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="font-display text-2xl font-bold text-gray-900">
        Search Results for "{query}" ({products.length})
      </h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => <div key={n} className="h-72 bg-gray-200 animate-pulse rounded-2xl" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-100">
          <p className="text-gray-500 text-sm">No products found matching your search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, MapPin, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import StarRating from './StarRating';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';

export default function ProductCard({ product }) {
  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const isFavorite = isInWishlist(product.id);
  const isSale = Boolean(product.salePrice);
  const discountPercent = isSale
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const points = Math.floor((product.salePrice || product.price) * 0.05);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group relative"
    >
      {/* Image & Badges Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Link to={`/product/${product.slug}`}>
          <img
            src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Discount Badge */}
        {isSale && (
          <span className="absolute top-3 left-3 bg-coral-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
            SAVE {discountPercent}%
          </span>
        )}

        {/* Featured Tag */}
        {product.isFeatured && !isSale && (
          <span className="absolute top-3 left-3 bg-amber-500 text-gray-900 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> BESTSELLER
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product)}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-md text-gray-600 hover:text-coral-500 hover:bg-white shadow-md transition-all"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-coral-500 text-coral-500' : ''}`} />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          {/* Category & City tags */}
          <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
            <span className="font-medium text-teal-700">{product.category?.name || 'Gifts'}</span>
            <span className="flex items-center gap-0.5 text-gray-400">
              <MapPin className="w-3 h-3 text-coral-500" />
              {product.deliverableCities ? `${product.deliverableCities.length} Cities` : 'All PK'}
            </span>
          </div>

          {/* Title */}
          <Link
            to={`/product/${product.slug}`}
            className="font-semibold text-gray-900 line-clamp-2 hover:text-teal-700 transition-colors text-sm leading-snug"
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div className="mt-1.5">
            <StarRating rating={product.ratingAverage || 5} reviewCount={product.reviewCount || 0} />
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="font-bold text-teal-800 text-base">
                PKR {(product.salePrice || product.price).toLocaleString()}
              </span>
              {isSale && (
                <span className="text-xs text-gray-400 line-through">
                  PKR {product.price.toLocaleString()}
                </span>
              )}
            </div>
            <div className="text-[10px] text-amber-600 font-semibold">
              🎁 Earn {points} pts
            </div>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            className="p-2.5 rounded-full gradient-teal text-white hover:opacity-90 transition-all shadow-md active:scale-95 flex items-center justify-center"
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

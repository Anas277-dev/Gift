import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  MapPin,
  Clock,
  Eye,
  Gift,
  Star,
  CheckCircle2,
  AlertCircle,
  Share2,
} from 'lucide-react';
import StarRating from '../../components/common/StarRating';
import ProductCard from '../../components/common/ProductCard';
import { productsAPI, reviewsAPI } from '../../api/endpoints';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { addToCart, selectedCity } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { user } = useAuthStore();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Social Proof pseudo realtime counter
  const [viewingCount, setViewingCount] = useState(14);

  // Deliverability city check state
  const [checkCity, setCheckCity] = useState(selectedCity || 'Lahore');
  const [isDeliverable, setIsDeliverable] = useState(true);

  // Review Form
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await productsAPI.getBySlug(slug);
        if (res.success) {
          setProduct(res.product);
          setRelatedProducts(res.relatedProducts || []);
          if (res.product.images && res.product.images.length > 0) {
            setActiveImage(res.product.images[0]);
          }
          // Validate initial city
          if (res.product.deliverableCities) {
            setIsDeliverable(res.product.deliverableCities.includes(selectedCity || 'Lahore'));
          }
        }
      } catch (err) {
        console.error('Error loading product detail:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug, selectedCity]);

  // Pseudo realtime viewer counter effect
  useEffect(() => {
    const interval = setInterval(() => {
      setViewingCount((prev) => Math.max(7, Math.min(38, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCityCheck = (cityName) => {
    setCheckCity(cityName);
    if (product && product.deliverableCities) {
      setIsDeliverable(product.deliverableCities.includes(cityName));
    }
  };

  const handleAddToCart = () => {
    if (!isDeliverable) {
      toast.error(`Sorry, this product cannot be delivered to ${checkCity}`);
      return;
    }
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (!isDeliverable) {
      toast.error(`Sorry, this product cannot be delivered to ${checkCity}`);
      return;
    }
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to leave a review');
      return;
    }
    if (!comment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await reviewsAPI.add(product.id, { rating, comment });
      if (res.success) {
        toast.success('Thank you! Your review has been published.');
        setComment('');
        // Refresh product details
        const refreshed = await productsAPI.getBySlug(slug);
        if (refreshed.success) setProduct(refreshed.product);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-200 animate-pulse rounded-3xl" />
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 animate-pulse rounded-xl w-3/4" />
          <div className="h-6 bg-gray-200 animate-pulse rounded-xl w-1/3" />
          <div className="h-24 bg-gray-200 animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
        <Link to="/shop" className="text-teal-700 font-semibold underline mt-2 inline-block">
          Return to Shop
        </Link>
      </div>
    );
  }

  const price = product.salePrice || product.price;
  const isSale = Boolean(product.salePrice);
  const points = Math.floor(price * 0.05);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-12">
      {/* Main Product Info Section */}
      <div className="grid md:grid-cols-2 gap-6 sm:gap-10 bg-white p-5 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
        {/* Product Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 relative">
            <img
              src={activeImage || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {isSale && (
              <span className="absolute top-4 left-4 bg-coral-500 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-md">
                ON SALE
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImage === img ? 'border-teal-700 shadow-md scale-105' : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info & Actions */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Category & Live Viewer Counter */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-teal-700 uppercase tracking-wider">
                {product.category?.name || 'Gifts'}
              </span>
              <div className="flex items-center gap-1.5 text-coral-500 bg-coral-50 px-2.5 py-1 rounded-full font-bold text-[11px]">
                <Eye className="w-3.5 h-3.5 animate-pulse" />
                <span>{viewingCount} people viewing right now</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <StarRating rating={product.ratingAverage || 5} reviewCount={product.reviewCount || 0} />
              <span className="text-xs text-gray-400">| SKU: {product.sku}</span>
            </div>

            {/* Price Box */}
            <div className="bg-teal-50/60 p-4 rounded-2xl border border-teal-100/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <div className="flex items-baseline space-x-2">
                  <span className="font-display text-2xl sm:text-3xl font-bold text-teal-900">
                    PKR {price.toLocaleString()}
                  </span>
                  {isSale && (
                    <span className="text-xs sm:text-sm text-gray-400 line-through">
                      PKR {product.price.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-xs text-amber-600 font-bold mt-0.5">
                  🎁 Purchase & Earn <span className="underline">{points} Loyalty Points!</span>
                </p>
              </div>
              <span className="text-xs font-semibold text-teal-800 bg-white px-3 py-1 rounded-full border border-teal-200 shadow-sm">
                In Stock ({product.stock})
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* City Deliverability Validator */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2">
              <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-coral-500" /> Verify Delivery City Availability:
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <select
                  value={checkCity}
                  onChange={(e) => handleCityCheck(e.target.value)}
                  className="bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-teal-700"
                >
                  {['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Gujranwala', 'Sialkot', 'Peshawar', 'Hyderabad'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                {isDeliverable ? (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full w-fit">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Deliverable to {checkCity}
                  </span>
                ) : (
                  <span className="text-xs font-bold text-rose-600 flex items-center gap-1 bg-rose-50 px-2.5 py-1 rounded-full w-fit">
                    <AlertCircle className="w-3.5 h-3.5" /> Not available in {checkCity}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions: Quantity + Add To Cart + Buy Now */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
              <div className="flex items-center border border-gray-300 rounded-full bg-gray-50 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full bg-white font-bold text-gray-700 hover:bg-gray-200 flex items-center justify-center text-sm shadow-sm"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full bg-white font-bold text-gray-700 hover:bg-gray-200 flex items-center justify-center text-sm shadow-sm"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!isDeliverable}
                className="flex-1 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold py-3 px-5 rounded-full shadow-lg transition-all flex items-center justify-center gap-2 text-xs sm:text-sm min-w-[140px]"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-full border transition-all ${
                  isInWishlist(product.id)
                    ? 'bg-coral-50 border-coral-300 text-coral-500'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-coral-500' : ''}`} />
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              disabled={!isDeliverable}
              className="w-full gradient-coral hover:opacity-95 disabled:opacity-50 text-white font-bold py-3.5 rounded-full shadow-lg transition-all text-xs sm:text-sm uppercase tracking-wider"
            >
              Express Checkout (Buy Now)
            </button>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="bg-white p-5 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <h3 className="font-display text-lg sm:text-xl font-bold text-gray-900">
          Customer Reviews ({product.reviews ? product.reviews.length : 0})
        </h3>

        {/* Review Form */}
        <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-4 rounded-2xl space-y-3">
          <h4 className="text-sm font-bold text-gray-800">Write a Customer Review</h4>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-600">Rating:</span>
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-0.5"
                >
                  <Star className={`w-5 h-5 ${star <= rating ? 'fill-amber-400' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience regarding delivery, cake freshness, or flower arrangement..."
            rows={3}
            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-teal-700"
          />
          <button
            type="submit"
            disabled={submittingReview}
            className="bg-teal-700 text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-teal-800"
          >
            {submittingReview ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>

        {/* Reviews List */}
        <div className="space-y-4 pt-4 divide-y divide-gray-100">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((rev) => (
              <div key={rev.id} className="pt-4 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-900">{rev.user?.name || 'Verified Customer'}</span>
                  <span className="text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-600 pt-1">{rev.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-500">No reviews yet for this product. Be the first to review!</p>
          )}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <h2 className="font-display text-xl font-bold text-gray-900">You May Also Like 🎁</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

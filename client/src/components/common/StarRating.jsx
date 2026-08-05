import React from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating = 5, reviewCount = 0 }) {
  return (
    <div className="flex items-center space-x-1 text-xs">
      <div className="flex text-amber-500">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      <span className="font-semibold text-gray-800 ml-1">{rating}</span>
      {reviewCount > 0 && <span className="text-gray-400">({reviewCount})</span>}
    </div>
  );
}

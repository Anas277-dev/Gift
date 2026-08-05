import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CategoryCard({ category }) {
  return (
    <Link to={`/category/${category.slug}`}>
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.2 }}
        className="relative rounded-2xl overflow-hidden shadow-md group h-44 border border-gray-100"
      >
        <img
          src={category.imageUrl || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80'}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4">
          <h3 className="font-display font-bold text-white text-lg group-hover:text-amber-400 transition-colors">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-xs text-gray-200 line-clamp-1 mt-0.5 opacity-90">
              {category.description}
            </p>
          )}
        </div>
      </motion.div>
    </Link>
  );
}

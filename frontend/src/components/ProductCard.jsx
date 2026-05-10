import { Link } from 'react-router-dom'
import { Star, Heart } from 'lucide-react'
import { useState } from 'react'

export default function ProductCard({ product }) {
  const [liked, setLiked] = useState(false)
  const commentCount = product._count?.comments || 0
  const avgRating = 4.2 + Math.random() * 0.7 // demo

  const discountPercent = Math.floor(Math.random() * 30) + 10
  const originalPrice = product.price * (1 + discountPercent / 100)

  return (
    <Link to={`/products/${product.id}`} className="block group">
      <div className="card h-full flex flex-col relative">
        {/* Discount badge */}
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
          %{discountPercent}
        </div>

        {/* Favorite */}
        <button
          onClick={(e) => { e.preventDefault(); setLiked(!liked) }}
          className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full shadow flex items-center
                     justify-center hover:scale-110 transition-transform">
          <Heart size={16} className={liked ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
        </button>

        {/* Image */}
        <div className="relative overflow-hidden bg-white aspect-square">
          <img
            src={product.mainImage}
            alt={product.name}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.target.src = `https://placehold.co/400x400/f3f4f6/9ca3af?text=${encodeURIComponent(product.name.split(' ')[0])}`
            }}
          />
        </div>

        {/* Content */}
        <div className="p-3 flex flex-col flex-1 gap-1.5">
          {/* Brand */}
          {product.brand && (
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
              {product.brand}
            </span>
          )}

          {/* Name */}
          <h3 className="text-sm text-gray-600 leading-snug line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={11}
                  className={i < Math.round(avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
              ))}
            </div>
            <span className="text-xs text-gray-400">({commentCount})</span>
          </div>

          {/* Price */}
          <div className="mt-auto pt-1">
            <div className="text-xs text-gray-400 line-through">
              {originalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
            </div>
            <div className="text-lg font-bold text-orange-500">
              {product.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
            </div>
          </div>

          {/* Free shipping badge */}
          {product.price > 3000 && (
            <div className="text-xs text-green-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              Ücretsiz Kargo
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

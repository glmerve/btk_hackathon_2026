import { Link } from 'react-router-dom'
import { ShoppingCart, Star, MessageSquare, Shield } from 'lucide-react'

export default function ProductCard({ product }) {
  const avgRating = product.avgRating || 4.5
  const commentCount = product._count?.comments || 0

  return (
    <Link to={`/products/${product.id}`} className="block group">
      <div className="card h-full flex flex-col">

        {/* Image */}
        <div className="relative overflow-hidden bg-dark-border aspect-[4/3]">
          <img
            src={product.mainImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.target.src = `https://placehold.co/400x300/1f2937/6b7280?text=${encodeURIComponent(product.name)}`
            }}
          />
          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="badge badge-blue">{product.category}</span>
          </div>
          {/* AI Shield Badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1
                          bg-emerald-500/20 border border-emerald-500/30
                          text-emerald-400 text-xs font-semibold px-2 py-1 rounded-full
                          backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Shield size={10} />
            AI Korumalı
          </div>
          {/* Price overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-bg/90 to-transparent p-4">
            <span className="text-xl font-bold text-white">
              ₺{product.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1 gap-3">
          <h3 className="font-semibold text-white text-base leading-snug
                         group-hover:text-primary-300 transition-colors line-clamp-2">
            {product.name}
          </h3>

          <p className="text-sm text-gray-500 line-clamp-2 flex-1">
            {product.description}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between pt-1 border-t border-dark-border">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={i < Math.round(avgRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-700'}
                />
              ))}
              <span className="text-xs text-gray-500 ml-1">{avgRating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <MessageSquare size={12} />
              <span>{commentCount} yorum</span>
            </div>
          </div>

          {/* CTA */}
          <button className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-2">
            <ShoppingCart size={14} />
            İncele
          </button>
        </div>
      </div>
    </Link>
  )
}

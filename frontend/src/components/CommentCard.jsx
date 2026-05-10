import { Star, AlertTriangle, User, Image } from 'lucide-react'

function formatDate(dateStr) {
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric', month: 'long', day: 'numeric',
  }).format(new Date(dateStr))
}

export default function CommentCard({ comment }) {
  const { content, imageUrl, rating, isSpam, spamScore, createdAt, user } = comment

  return (
    <div className={`card p-5 animate-fade-in ${isSpam ? 'border-red-500/30 bg-red-950/10' : ''}`}>

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-primary-600/20 border border-primary-500/30
                          flex items-center justify-center flex-shrink-0">
            <User size={16} className="text-primary-400" />
          </div>
          {/* User info */}
          <div>
            <p className="text-sm font-semibold text-gray-200">
              {user?.email?.split('@')[0] || 'Anonim Kullanıcı'}
            </p>
            <p className="text-xs text-gray-500">{formatDate(createdAt)}</p>
          </div>
        </div>

        {/* Spam / Score badges */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isSpam ? (
            <span className="badge badge-red flex items-center gap-1">
              <AlertTriangle size={10} />
              Spam Tespit Edildi
            </span>
          ) : (
            <span className="badge badge-green">✓ Doğrulanmış</span>
          )}
          {spamScore !== undefined && (
            <span className={`badge text-xs ${
              spamScore > 0.7 ? 'badge-red'
              : spamScore > 0.3 ? 'badge-yellow'
              : 'badge-green'
            }`}>
              AI: {(spamScore * 100).toFixed(0)}%
            </span>
          )}
        </div>
      </div>

      {/* Stars */}
      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-700'}
          />
        ))}
        <span className="text-xs text-gray-500 ml-1">{rating}/5</span>
      </div>

      {/* Content */}
      <p className={`text-sm leading-relaxed mb-4 ${
        isSpam ? 'text-gray-500 line-through' : 'text-gray-300'
      }`}>
        {content}
      </p>

      {/* Review Image — ReviewGuard target element */}
      {imageUrl && (
        <div className="relative inline-block">
          <img
            src={imageUrl}
            alt="Yorum görseli"
            data-comment-id={comment.id}
            data-product-id={comment.productId}
            data-spam-score={spamScore}
            /* ↓ ReviewGuard eklentisi bu class ile görseli yakalar */
            className="review-image-ai w-full max-w-xs h-48"
            loading="lazy"
            onError={(e) => { e.target.style.display = 'none' }}
          />
          {isSpam && (
            <div className="absolute inset-0 bg-red-900/60 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <div className="text-center">
                <AlertTriangle size={24} className="text-red-400 mx-auto mb-1" />
                <p className="text-xs text-red-300 font-semibold">Spam Görsel</p>
              </div>
            </div>
          )}
          <div className="mt-1.5 flex items-center gap-1 text-xs text-gray-500">
            <Image size={10} />
            <span className="font-mono text-primary-500/60">review-image-ai</span>
            <span>• ReviewGuard tarafından analiz edildi</span>
          </div>
        </div>
      )}
    </div>
  )
}

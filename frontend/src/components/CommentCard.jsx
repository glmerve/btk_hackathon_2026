import { Star, AlertTriangle, User, Image } from 'lucide-react'

function formatDate(dateStr) {
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric', month: 'long', day: 'numeric',
  }).format(new Date(dateStr))
}

export default function CommentCard({ comment }) {
  const { content, imageUrl, rating, isSpam, spamScore, createdAt, user: cUser } = comment

  return (
    <div className={`p-4 border-b border-gray-100 last:border-0 ${isSpam ? 'bg-red-50' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">
            {(cUser?.email?.charAt(0) || 'A').toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">
              {cUser?.email?.split('@')[0] || 'Anonim'}
            </p>
            <p className="text-xs text-gray-400">{formatDate(createdAt)}</p>
          </div>
        </div>
        {isSpam && (
          <span className="badge badge-red flex items-center gap-1">
            <AlertTriangle size={10} /> Spam
          </span>
        )}
      </div>

      {/* Stars */}
      <div className="flex items-center gap-0.5 mb-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={13}
            className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
        ))}
      </div>

      {/* Content */}
      <p className={`text-sm leading-relaxed mb-3 ${isSpam ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
        {content}
      </p>

      {/* Image */}
      {imageUrl && (
        <div className="relative inline-block">
          <img
            src={imageUrl}
            alt="Yorum görseli"
            data-comment-id={comment.id}
            data-product-id={comment.productId}
            data-spam-score={spamScore}
            className="review-image-ai w-32 h-24 border border-gray-200"
            loading="lazy"
            onError={(e) => { e.target.style.display = 'none' }}
          />
          {isSpam && (
            <div className="absolute inset-0 bg-red-500/40 rounded-lg flex items-center justify-center">
              <AlertTriangle size={18} className="text-white" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

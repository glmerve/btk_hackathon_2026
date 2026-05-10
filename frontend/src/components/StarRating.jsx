import { Star } from 'lucide-react'

export default function StarRating({ value, onChange, readonly = false, size = 20 }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          className={`transition-transform duration-150 ${
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 active:scale-95'
          }`}
        >
          <Star
            size={size}
            className={
              star <= value
                ? 'text-amber-400 fill-amber-400'
                : 'text-gray-600 hover:text-amber-300'
            }
          />
        </button>
      ))}
      {!readonly && (
        <span className="text-sm text-gray-500 ml-1">{value}/5</span>
      )}
    </div>
  )
}

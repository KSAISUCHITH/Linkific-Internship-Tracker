import { useState } from 'react'
import { Star } from 'lucide-react'

export default function StarRating({
  rating = 0,
  onRate,
  readOnly = false,
  size = 18,
  showValue = true,
  className = ''
}) {
  const [hoverRating, setHoverRating] = useState(0)

  const displayRating = hoverRating || rating || 0

  const handleStarClick = (e, starValue) => {
    e.stopPropagation()
    if (!readOnly && onRate) {
      onRate(starValue)
    }
  }

  const handleMouseEnter = (starValue) => {
    if (!readOnly) {
      setHoverRating(starValue)
    }
  }

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0)
    }
  }

  const labels = {
    1: '1 star - Poor',
    2: '2 stars - Fair',
    3: '3 stars - Good',
    4: '4 stars - Very Good',
    5: '5 stars - Masterpiece'
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 ${className}`}
      onMouseLeave={handleMouseLeave}
      role={readOnly ? 'img' : 'radiogroup'}
      aria-label={`Rating: ${rating || 0} out of 5 stars`}
    >
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= displayRating
          return (
            <button
              key={star}
              type="button"
              disabled={readOnly}
              onClick={(e) => handleStarClick(e, star)}
              onMouseEnter={() => handleMouseEnter(star)}
              title={readOnly ? `${rating} / 5` : labels[star]}
              aria-label={labels[star]}
              className={`rounded p-0.5 transition-transform duration-150 ${
                readOnly
                  ? 'cursor-default'
                  : 'cursor-pointer hover:scale-115 active:scale-95 focus:outline-hidden'
              }`}
            >
              <Star
                size={size}
                className={`transition-colors duration-150 ${
                  isFilled
                    ? 'fill-amber-500 text-amber-500 drop-shadow-2xs'
                    : 'fill-transparent text-[#cfc7b8]'
                }`}
                strokeWidth={isFilled ? 1.5 : 1.8}
              />
            </button>
          )
        })}
      </div>

      {showValue && (
        <span className="text-xs font-semibold text-[#666] tabular-nums ml-0.5">
          {rating ? `${Number(rating).toFixed(1)}` : 'Unrated'}
        </span>
      )}
    </div>
  )
}

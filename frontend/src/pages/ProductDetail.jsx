import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Star, MessageSquare, Shield, Send, Image as ImageIcon,
  Truck, RotateCcw, ShoppingCart, Heart, Share2, Loader2, ChevronRight
} from 'lucide-react'
import api from '../api/axios'
import CommentCard from '../components/CommentCard'
import StarRating from '../components/StarRating'

export default function ProductDetail() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [product,  setProduct]  = useState(null)
  const [comments, setComments] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [commLoad, setCommLoad] = useState(true)
  const [selectedImage, setSelectedImage] = useState('')

  // Comment form
  const [content,  setContent]  = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [rating,   setRating]   = useState(5)
  const [submitting, setSubmitting] = useState(false)
  const [submitMsg,  setSubmitMsg]  = useState(null)
  const [liked, setLiked] = useState(false)

  const user = JSON.parse(localStorage.getItem('rg_user') || 'null')

  useEffect(() => {
    fetchProduct()
    fetchComments()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/products/${id}`)
      setProduct(res.data)
      setSelectedImage(res.data.mainImage)
    } catch { }
    finally { setLoading(false) }
  }

  const fetchComments = async () => {
    try {
      setCommLoad(true)
      const res = await api.get('/comments', { params: { productId: id } })
      setComments(res.data.comments || [])
    } catch { setComments([]) }
    finally { setCommLoad(false) }
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    try {
      setSubmitting(true); setSubmitMsg(null)
      await api.post('/comments', {
        content: content.trim(),
        imageUrl: imageUrl.trim() || null,
        rating,
        productId: parseInt(id),
      })
      setContent(''); setImageUrl(''); setRating(5)
      setSubmitMsg({ type: 'success', text: 'Yorumunuz eklendi!' })
      await fetchComments()
    } catch (err) {
      setSubmitMsg({ type: 'error', text: err.response?.data?.error || 'Yorum eklenemedi.' })
    } finally { setSubmitting(false) }
  }

  const avgRating = comments.length
    ? (comments.reduce((s, c) => s + c.rating, 0) / comments.length).toFixed(1) : '0'
  const spamCount  = comments.filter(c => c.isSpam).length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="text-orange-500 animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">Ürün bulunamadı.</p>
        <Link to="/" className="btn-primary">Ana Sayfaya Dön</Link>
      </div>
    )
  }

  const discountPercent = Math.floor(Math.random() * 30) + 10
  const originalPrice = product.price * (1 + discountPercent / 100)

  return (
    <div className="min-h-screen bg-gray-100 page-enter">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-2 text-xs text-gray-400">
          <Link to="/" className="hover:text-orange-500 transition-colors">Anasayfa</Link>
          <ChevronRight size={12} />
          <span className="hover:text-orange-500 cursor-pointer">{product.category}</span>
          <ChevronRight size={12} />
          <span className="text-gray-600">{product.name}</span>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* LEFT: Images */}
            <div>
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white mb-3">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-80 lg:h-[28rem] object-contain p-6"
                  onError={(e) => {
                    e.target.src = `https://placehold.co/600x600/f3f4f6/9ca3af?text=Ürün`
                  }}
                />
              </div>
              {/* Thumbnail gallery */}
              <div className="flex gap-2 overflow-x-auto">
                <button
                  onClick={() => setSelectedImage(product.mainImage)}
                  className={`w-16 h-16 border rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                    selectedImage === product.mainImage ? 'border-orange-500 ring-1 ring-orange-200' : 'border-gray-200'
                  }`}>
                  <img src={product.mainImage} alt="" className="w-full h-full object-contain p-1" />
                </button>
                {product.images?.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.url)}
                    className={`w-16 h-16 border rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                      selectedImage === img.url ? 'border-orange-500 ring-1 ring-orange-200' : 'border-gray-200'
                    }`}>
                    <img src={img.url} alt="" className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT: Info */}
            <div className="flex flex-col gap-4">
              {/* Brand */}
              {product.brand && (
                <Link to={`/?search=${product.brand}`}
                  className="text-sm font-bold text-orange-500 hover:underline">
                  {product.brand}
                </Link>
              )}

              {/* Title */}
              <h1 className="text-xl font-semibold text-gray-800 leading-snug">
                {product.name}
              </h1>

              {/* Rating summary */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15}
                      className={i < Math.round(Number(avgRating))
                        ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                  ))}
                </div>
                <span className="text-sm text-gray-500">{avgRating}</span>
                <span className="text-sm text-gray-400">({comments.length} değerlendirme)</span>
                {spamCount > 0 && (
                  <span className="badge badge-red text-xs">{spamCount} spam tespit</span>
                )}
              </div>

              <hr className="border-gray-100" />

              {/* Price */}
              <div>
                <div className="text-sm text-gray-400 line-through">
                  {originalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-orange-500">
                    {product.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                  </span>
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                    %{discountPercent}
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-3 py-2">
                {[
                  { icon: <Truck size={16} />, text: 'Ücretsiz Kargo' },
                  { icon: <RotateCcw size={16} />, text: '14 Gün İade' },
                  { icon: <Shield size={16} />, text: 'AI Yorum Doğrulama' },
                  { icon: <Star size={16} />, text: `${comments.length} Değerlendirme` },
                ].map((f) => (
                  <div key={f.text} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-orange-500">{f.icon}</span>
                    {f.text}
                  </div>
                ))}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>

              {/* Stock info */}
              <div className="text-sm">
                {product.stock > 0 ? (
                  <span className="text-green-600 font-medium">✓ Stokta ({product.stock} adet)</span>
                ) : (
                  <span className="text-red-500 font-medium">✕ Tükendi</span>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 mt-2">
                <button className="btn-primary flex-1 flex items-center justify-center gap-2 py-3.5 text-base">
                  <ShoppingCart size={18} />
                  Sepete Ekle
                </button>
                <button
                  onClick={() => setLiked(!liked)}
                  className={`w-13 h-13 border rounded-lg flex items-center justify-center transition-all ${
                    liked ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-300 text-gray-400 hover:border-orange-300'
                  }`}>
                  <Heart size={20} className={liked ? 'fill-red-500' : ''} />
                </button>
                <button className="w-13 h-13 border border-gray-300 rounded-lg flex items-center justify-center
                                   text-gray-400 hover:border-orange-300 transition-all">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── COMMENTS SECTION ── */}
        <div className="bg-white rounded-lg border border-gray-200 mt-6 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <MessageSquare size={20} className="text-orange-500" />
              Değerlendirmeler ({comments.length})
            </h2>
          </div>

          {/* Comment Form */}
          {user ? (
            <div className="p-5 border-b border-gray-100 bg-gray-50">
              <form onSubmit={handleSubmitComment} className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Puanınız:</span>
                  <StarRating value={rating} onChange={setRating} size={20} />
                </div>
                <textarea
                  id="comment-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Bu ürün hakkındaki düşünceleriniz..."
                  rows={3}
                  required
                  className="input text-sm resize-none"
                />
                <div className="flex items-center gap-3">
                  <input
                    id="comment-image-url"
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Görsel URL (isteğe bağlı)"
                    className="input text-sm flex-1"
                  />
                  <button id="submit-comment" type="submit" disabled={submitting || !content.trim()}
                    className="btn-primary flex items-center gap-2 text-sm">
                    {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                    Gönder
                  </button>
                </div>
                {submitMsg && (
                  <p className={`text-sm ${submitMsg.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                    {submitMsg.text}
                  </p>
                )}
              </form>
            </div>
          ) : (
            <div className="p-5 border-b border-gray-100 bg-gray-50 text-center">
              <p className="text-sm text-gray-500 mb-2">Yorum yapmak için giriş yapın</p>
              <Link to="/login" className="btn-primary text-sm">Giriş Yap</Link>
            </div>
          )}

          {/* Comments List */}
          {commLoad ? (
            <div className="p-5 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="skeleton w-8 h-8 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-3 w-32 rounded" />
                    <div className="skeleton h-3 w-full rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <div className="p-10 text-center text-gray-400 text-sm">
              Henüz yorum yapılmamış. İlk yorumu siz yazın!
            </div>
          ) : (
            <div>
              {comments.map((c) => <CommentCard key={c.id} comment={c} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

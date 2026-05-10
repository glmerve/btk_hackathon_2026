import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Star, MessageSquare, Shield, AlertTriangle,
  Send, Image as ImageIcon, Package, ShoppingCart, Loader2
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
  const [error,    setError]    = useState(null)

  // Comment form
  const [content,  setContent]  = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [rating,   setRating]   = useState(5)
  const [submitting, setSubmitting] = useState(false)
  const [submitMsg,  setSubmitMsg]  = useState(null)

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
    } catch {
      setError('Ürün bulunamadı.')
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      setCommLoad(true)
      const res = await api.get('/comments', { params: { productId: id } })
      setComments(res.data.comments || [])
    } catch {
      setComments([])
    } finally {
      setCommLoad(false)
    }
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!content.trim()) return

    try {
      setSubmitting(true)
      setSubmitMsg(null)
      await api.post('/comments', {
        content: content.trim(),
        imageUrl: imageUrl.trim() || null,
        rating,
        productId: parseInt(id),
      })
      setContent('')
      setImageUrl('')
      setRating(5)
      setSubmitMsg({ type: 'success', text: 'Yorumunuz başarıyla eklendi!' })
      await fetchComments()
    } catch (err) {
      setSubmitMsg({
        type: 'error',
        text: err.response?.data?.error || 'Yorum eklenemedi.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const spamCount  = comments.filter((c) => c.isSpam).length
  const cleanCount = comments.filter((c) => !c.isSpam).length
  const avgRating  = comments.length
    ? (comments.reduce((s, c) => s + c.rating, 0) / comments.length).toFixed(1)
    : '–'

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 size={32} className="text-primary-400 animate-spin" />
      </div>
    )
  }

  // ── Error ──
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 gap-4">
        <Package size={48} className="text-gray-700" />
        <p className="text-gray-400 text-lg">{error || 'Ürün bulunamadı.'}</p>
        <Link to="/" className="btn-primary">Ana Sayfaya Dön</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-20 page-enter">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
          <Link to="/" className="flex items-center gap-1 hover:text-primary-400 transition-colors">
            <ArrowLeft size={14} />
            Ürünler
          </Link>
          <span>/</span>
          <span className="text-gray-300">{product.name}</span>
        </div>

        {/* ── Product Detail ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

          {/* Image */}
          <div className="card overflow-hidden">
            <img
              src={product.mainImage}
              alt={product.name}
              className="w-full h-80 lg:h-96 object-cover"
              onError={(e) => {
                e.target.src = `https://placehold.co/600x400/1f2937/6b7280?text=${encodeURIComponent(product.name)}`
              }}
            />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            <div>
              <span className="badge badge-blue mb-3">{product.category}</span>
              <h1 className="text-3xl font-bold text-white leading-tight mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16}
                      className={i < Math.round(Number(avgRating))
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-700'} />
                  ))}
                </div>
                <span className="text-gray-400 text-sm">
                  {avgRating} ({comments.length} yorum)
                </span>
              </div>
              <p className="text-4xl font-extrabold gradient-text">
                ₺{product.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed">
              {product.description}
            </p>

            {/* AI Review Stats */}
            <div className="card p-4 bg-dark-card/50">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={16} className="text-primary-400" />
                <span className="text-sm font-semibold text-white">ReviewGuard Analizi</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-2 rounded-lg bg-dark-bg">
                  <p className="text-lg font-bold text-white">{comments.length}</p>
                  <p className="text-xs text-gray-500">Toplam Yorum</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-emerald-950/30">
                  <p className="text-lg font-bold text-emerald-400">{cleanCount}</p>
                  <p className="text-xs text-gray-500">Doğrulanmış</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-red-950/30">
                  <p className="text-lg font-bold text-red-400">{spamCount}</p>
                  <p className="text-xs text-gray-500">Spam</p>
                </div>
              </div>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 text-sm">
              <Package size={14} className="text-gray-500" />
              <span className="text-gray-500">Stok:</span>
              <span className={`font-semibold ${product.stock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {product.stock > 0 ? `${product.stock} adet mevcut` : 'Tükendi'}
              </span>
            </div>

            <button className="btn-primary flex items-center justify-center gap-2 py-3">
              <ShoppingCart size={18} />
              Sepete Ekle
            </button>
          </div>
        </div>

        {/* ── COMMENTS SECTION ── */}
        <section id="comments">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="section-title flex items-center gap-2">
                <MessageSquare size={22} className="text-primary-400" />
                Müşteri Yorumları
              </h2>
              <p className="section-subtitle">
                Tüm yorumlar ReviewGuard AI tarafından denetlenmektedir
              </p>
            </div>
          </div>

          {/* Comment Form */}
          {user ? (
            <div className="card p-6 mb-8">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Send size={16} className="text-primary-400" />
                Yorum Yaz
              </h3>
              <form onSubmit={handleSubmitComment} className="space-y-4">
                {/* Rating */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Puanınız</label>
                  <StarRating value={rating} onChange={setRating} size={24} />
                </div>

                {/* Comment content */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Yorumunuz</label>
                  <textarea
                    id="comment-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Ürün hakkındaki düşüncelerinizi paylaşın..."
                    rows={4}
                    required
                    className="input resize-none"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2 flex items-center gap-1">
                    <ImageIcon size={13} />
                    Görsel URL (İsteğe bağlı — ReviewGuard tarafından analiz edilir)
                  </label>
                  <input
                    id="comment-image-url"
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="input"
                  />
                </div>

                {/* Submit message */}
                {submitMsg && (
                  <div className={`text-sm px-4 py-2.5 rounded-lg ${
                    submitMsg.type === 'success'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {submitMsg.text}
                  </div>
                )}

                <button
                  id="submit-comment"
                  type="submit"
                  disabled={submitting || !content.trim()}
                  className="btn-primary flex items-center gap-2"
                >
                  {submitting ? (
                    <><Loader2 size={14} className="animate-spin" /> Gönderiliyor...</>
                  ) : (
                    <><Send size={14} /> Yorumu Gönder</>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="card p-6 mb-8 text-center">
              <Shield size={32} className="text-primary-400 mx-auto mb-3" />
              <p className="text-gray-400 mb-4">Yorum yapmak için giriş yapmalısınız</p>
              <div className="flex items-center justify-center gap-3">
                <Link to="/login"    className="btn-primary">Giriş Yap</Link>
                <Link to="/register" className="btn-outline">Kayıt Ol</Link>
              </div>
            </div>
          )}

          {/* Comments List */}
          {commLoad ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="skeleton w-9 h-9 rounded-full" />
                    <div className="space-y-1.5 flex-1">
                      <div className="skeleton h-3 w-32 rounded" />
                      <div className="skeleton h-2.5 w-24 rounded" />
                    </div>
                  </div>
                  <div className="skeleton h-3 w-full rounded" />
                  <div className="skeleton h-3 w-4/5 rounded" />
                </div>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <div className="card p-10 text-center">
              <MessageSquare size={36} className="text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500">Henüz yorum yapılmamış. İlk yorumu siz yazın!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <CommentCard key={comment.id} comment={comment} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

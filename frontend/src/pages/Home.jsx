import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal, Shield, Zap, Star, ChevronRight, X } from 'lucide-react'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'

const CATEGORIES = ['Tümü', 'Elektronik', 'Bilgisayar', 'Ev Aletleri', 'Giyim & Ayakkabı', 'Fotoğraf & Video', 'Oyuncak']

function SkeletonCard() {
  return (
    <div className="card">
      <div className="skeleton aspect-[4/3] w-full" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-5/6 rounded" />
        <div className="skeleton h-9 w-full rounded-xl mt-4" />
      </div>
    </div>
  )
}

export default function Home() {
  const [products, setProducts]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [search, setSearch]         = useState('')
  const [category, setCategory]     = useState('Tümü')
  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [search, category])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const params = {}
      if (search) params.search = search
      if (category !== 'Tümü') params.category = category

      const res = await api.get('/products', { params })
      setProducts(res.data.products || [])
    } catch (err) {
      setError('Ürünler yüklenemedi. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
  }

  const clearSearch = () => {
    setSearchInput('')
    setSearch('')
  }

  return (
    <div className="min-h-screen">
      {/* ── HERO ── */}
      <section className="relative pt-28 pb-20 px-4 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px]
                          bg-primary-600/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                          bg-primary-500/10 border border-primary-500/20 text-primary-400
                          text-sm font-medium mb-6 animate-fade-in">
            <Shield size={14} />
            <span>AI Destekli Yorum Doğrulama Aktif</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-5 leading-tight tracking-tight animate-slide-up">
            Gerçek Yorumlar,<br />
            <span className="gradient-text">Güvenli Alışveriş</span>
          </h1>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 animate-fade-in">
            ReviewGuard AI sistemi, sahte yorumları otomatik tespit eder.
            Her yorum analiz edilir, her görsel doğrulanır.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mb-10 animate-fade-in">
            {[
              { label: 'Analiz Edilen Yorum', value: '12.4K+' },
              { label: 'Tespit Edilen Spam', value: '98.2%' },
              { label: 'Güvenilir Ürün',      value: '850+'  },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch}
            className="flex gap-2 max-w-xl mx-auto animate-slide-up">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                id="product-search"
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Ürün ara..."
                className="input pl-10 pr-10"
              />
              {searchInput && (
                <button type="button" onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  <X size={14} />
                </button>
              )}
            </div>
            <button type="submit" className="btn-primary px-6 flex items-center gap-2">
              <Search size={14} />
              Ara
            </button>
          </form>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

        {/* Category Filter */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <SlidersHorizontal size={16} className="text-gray-500 flex-shrink-0" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              id={`cat-${cat}`}
              onClick={() => setCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                category === cat
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                  : 'bg-dark-card border border-dark-border text-gray-400 hover:text-white hover:border-primary-500/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">
              {search ? `"${search}" Sonuçları` : category === 'Tümü' ? 'Tüm Ürünler' : category}
            </h2>
            {!loading && (
              <p className="section-subtitle">{products.length} ürün bulundu</p>
            )}
          </div>
          {search && (
            <button onClick={clearSearch} className="btn-outline text-sm flex items-center gap-1">
              <X size={14} /> Temizle
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={fetchProducts} className="btn-primary">Tekrar Dene</button>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-dark-card border border-dark-border
                            flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-gray-600" />
            </div>
            <p className="text-gray-400 text-lg font-medium">Ürün bulunamadı</p>
            <p className="text-gray-600 text-sm mt-1">Farklı bir arama terimi deneyin</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ── FEATURES BANNER ── */}
      <section className="border-t border-dark-border bg-dark-card/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Shield size={20} className="text-primary-400" />,
                title: 'AI Yorum Denetimi',
                desc: 'Her yorum gerçek zamanlı olarak analiz edilir, spam içerikler otomatik işaretlenir.',
              },
              {
                icon: <Zap size={20} className="text-amber-400" />,
                title: 'Görsel Doğrulama',
                desc: 'Yorum görselleri review-image-ai sistemi ile taranır, sahte görseller tespit edilir.',
              },
              {
                icon: <Star size={20} className="text-emerald-400" />,
                title: 'Güven Skoru',
                desc: 'Her yorum için 0-100 arası güven skoru hesaplanır, şeffaf sonuçlar gösterilir.',
              },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-4 p-4 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-dark-bg border border-dark-border
                                flex items-center justify-center flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm mb-1">{f.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

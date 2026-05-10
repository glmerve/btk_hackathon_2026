import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, ChevronRight, Zap, Truck, Shield, CreditCard, X } from 'lucide-react'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'

function SkeletonCard() {
  return (
    <div className="card">
      <div className="skeleton aspect-square w-full" />
      <div className="p-3 space-y-2">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-3/4 rounded" />
        <div className="skeleton h-5 w-24 rounded mt-2" />
      </div>
    </div>
  )
}

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const currentSearch   = searchParams.get('search') || ''
  const currentCategory = searchParams.get('category') || ''

  useEffect(() => {
    fetchProducts()
  }, [currentSearch, currentCategory])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const params = {}
      if (currentSearch) params.search = currentSearch
      if (currentCategory) params.category = currentCategory
      const res = await api.get('/products', { params })
      setProducts(res.data.products || [])
    } catch {
      setError('Ürünler yüklenemedi.')
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => setSearchParams({})

  return (
    <div className="min-h-screen bg-gray-100 page-enter">

      {/* ── HERO BANNER ── */}
      {!currentSearch && !currentCategory && (
        <section className="bg-gradient-to-r from-orange-500 to-orange-400">
          <div className="max-w-7xl mx-auto px-4 py-10 md:py-14 flex items-center justify-between">
            <div className="text-white max-w-lg">
              <h1 className="text-3xl md:text-4xl font-extrabold mb-3 leading-tight">
                Aradığın Herşey<br/>Burada!
              </h1>
              <p className="text-orange-100 text-sm md:text-base mb-5">
                Binlerce ürün, güvenli ödeme ve hızlı kargo ile kapında.
                AI destekli yorum doğrulama sistemi ile güvenle alışveriş yap.
              </p>
              <div className="flex gap-3">
                <button className="bg-white text-orange-600 font-semibold px-6 py-2.5 rounded-lg
                                   hover:bg-orange-50 transition-colors text-sm">
                  Alışverişe Başla
                </button>
                <button className="border border-white/40 text-white font-medium px-6 py-2.5 rounded-lg
                                   hover:bg-white/10 transition-colors text-sm">
                  Kampanyalar
                </button>
              </div>
            </div>
            <div className="hidden lg:block text-white/20 text-9xl font-black select-none">
              AHB
            </div>
          </div>
        </section>
      )}

      {/* ── TRUST BADGES ── */}
      {!currentSearch && !currentCategory && (
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Truck size={20} />, title: 'Hızlı Kargo', desc: 'Aynı gün kargo' },
              { icon: <Shield size={20} />, title: 'Güvenli Alışveriş', desc: 'AI yorum doğrulama' },
              { icon: <CreditCard size={20} />, title: 'Güvenli Ödeme', desc: '256-bit SSL şifreleme' },
              { icon: <Zap size={20} />, title: 'Kolay İade', desc: '14 gün iade garantisi' },
            ].map((b) => (
              <div key={b.title} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  {b.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{b.title}</p>
                  <p className="text-xs text-gray-400">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── PRODUCTS SECTION ── */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        {/* Heading */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              {currentSearch ? `"${currentSearch}" için sonuçlar`
                : currentCategory ? currentCategory
                : 'Çok Satanlar'}
            </h2>
            {!loading && (
              <p className="text-xs text-gray-400 mt-0.5">{products.length} ürün listeleniyor</p>
            )}
          </div>
          {(currentSearch || currentCategory) && (
            <button onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-orange-500 hover:text-orange-600 font-medium">
              <X size={14} /> Filtreleri Temizle
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-red-500 mb-3">{error}</p>
            <button onClick={fetchProducts} className="btn-primary text-sm">Tekrar Dene</button>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg">
            <Search size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Ürün bulunamadı</p>
            <p className="text-gray-400 text-sm mt-1">Farklı anahtar kelimeler deneyin</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  )
}

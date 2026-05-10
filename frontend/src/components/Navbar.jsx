import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingBag, LogOut, User, Menu, X, Search, Heart, ShoppingCart } from 'lucide-react'

export default function Navbar() {
  const [user, setUser]         = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const navigate  = useNavigate()
  const location  = useLocation()

  useEffect(() => {
    const stored = localStorage.getItem('rg_user')
    if (stored) setUser(JSON.parse(stored))
  }, [location])

  const handleLogout = () => {
    localStorage.removeItem('rg_token')
    localStorage.removeItem('rg_user')
    setUser(null)
    navigate('/')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      navigate(`/?search=${encodeURIComponent(searchInput.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top bar */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-8 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>Kampanyalardan haberdar olun!</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span>Yardım & Destek</span>
            <span>|</span>
            <span>Hakkımızda</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-6 h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <ShoppingBag size={18} className="text-white" />
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-bold text-gray-800 text-sm">Aradığın Herşey</span>
              <span className="text-orange-500 text-xs font-semibold -mt-0.5">Burada</span>
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <input
                id="search-input"
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Ürün, kategori veya marka ara..."
                className="w-full bg-gray-100 border border-gray-200 rounded-lg pl-4 pr-12 py-2.5 text-sm
                           focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100
                           transition-all placeholder-gray-400"
              />
              <button type="submit"
                className="absolute right-1 top-1 bottom-1 bg-orange-500 hover:bg-orange-600 text-white
                           rounded-md px-3 transition-colors">
                <Search size={16} />
              </button>
            </div>
          </form>

          {/* Right */}
          <div className="hidden md:flex items-center gap-1">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <User size={18} className="text-gray-500" />
                  <div className="flex flex-col text-xs leading-tight">
                    <span className="text-gray-400">Hesabım</span>
                    <span className="text-gray-700 font-medium truncate max-w-[100px]">
                      {user.email.split('@')[0]}
                    </span>
                  </div>
                </div>
                <button onClick={handleLogout}
                  className="p-2.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all"
                  title="Çıkış Yap">
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <User size={18} className="text-gray-500" />
                  <div className="flex flex-col text-xs leading-tight">
                    <span className="text-gray-400">Giriş Yap</span>
                    <span className="text-gray-700 font-medium">Hesabım</span>
                  </div>
                </Link>
              </>
            )}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <Heart size={18} className="text-gray-500" />
              <div className="flex flex-col text-xs leading-tight">
                <span className="text-gray-400">Favorilerim</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <ShoppingCart size={18} className="text-gray-500" />
              <div className="flex flex-col text-xs leading-tight">
                <span className="text-gray-400">Sepetim</span>
              </div>
            </div>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Category bar */}
      <div className="border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 h-10 overflow-x-auto text-sm">
          {['Elektronik','Bilgisayar','Giyim & Ayakkabı','Ev Aletleri','Ev & Yaşam','Kozmetik','Fotoğraf'].map((cat) => (
            <Link key={cat} to={`/?category=${encodeURIComponent(cat)}`}
              className="flex-shrink-0 px-3 py-1.5 rounded text-gray-600 hover:text-orange-600
                         hover:bg-orange-50 transition-colors font-medium whitespace-nowrap">
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-2">
          {user ? (
            <>
              <div className="text-sm text-gray-500 px-3 py-1">{user.email}</div>
              <button onClick={() => { handleLogout(); setMenuOpen(false) }}
                className="block w-full text-left px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 text-sm">
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 text-sm">Giriş Yap</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-orange-600 hover:bg-orange-50 text-sm">Kayıt Ol</Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}

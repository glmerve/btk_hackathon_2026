import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingBag, Shield, LogOut, User, Menu, X, Search } from 'lucide-react'

export default function Navbar() {
  const [user, setUser]         = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate  = useNavigate()
  const location  = useLocation()

  useEffect(() => {
    const stored = localStorage.getItem('rg_user')
    if (stored) setUser(JSON.parse(stored))
  }, [location])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('rg_token')
    localStorage.removeItem('rg_user')
    setUser(null)
    navigate('/')
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass shadow-lg shadow-black/20' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center
                            group-hover:bg-primary-500 transition-colors shadow-lg shadow-primary-500/30">
              <Shield size={18} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white leading-tight text-lg tracking-tight">
                Review<span className="gradient-text">Guard</span>
              </span>
              <span className="text-xs text-gray-500 leading-none -mt-0.5">AI Korumalı Mağaza</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'bg-primary-600/20 text-primary-300'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}>
              Ürünler
            </Link>

            {user ? (
              <div className="flex items-center gap-2 ml-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-card border border-dark-border">
                  <User size={14} className="text-primary-400" />
                  <span className="text-sm text-gray-300 max-w-[140px] truncate">{user.email}</span>
                  {user.role === 'ADMIN' && (
                    <span className="badge badge-blue text-xs">Admin</span>
                  )}
                </div>
                <button onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm
                             text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                  <LogOut size={14} />
                  <span>Çıkış</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link to="/login"    className="btn-secondary text-sm py-2 px-4">Giriş Yap</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Kayıt Ol</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-dark-border px-4 py-4 space-y-2 animate-fade-in">
          <Link to="/" onClick={() => setMenuOpen(false)}
            className="block px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5">
            Ürünler
          </Link>
          {user ? (
            <>
              <div className="px-4 py-2 text-sm text-gray-400">{user.email}</div>
              <button onClick={() => { handleLogout(); setMenuOpen(false) }}
                className="block w-full text-left px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10">
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5">Giriş Yap</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded-lg text-primary-400 hover:bg-primary-500/10">Kayıt Ol</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

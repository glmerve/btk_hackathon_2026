import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react'
import api from '../api/axios'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true); setError(null)
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('rg_token', res.data.token)
      localStorage.setItem('rg_user', JSON.stringify(res.data.user))
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Giriş yapılamadı.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ShoppingBag size={22} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Giriş Yap</h1>
            <p className="text-sm text-gray-400 mt-1">Aradığın Herşey Burada hesabınıza giriş yapın</p>
          </div>

          <div className="mb-5 p-3 rounded-lg bg-orange-50 border border-orange-100 text-xs text-gray-600">
            <p className="font-semibold text-orange-600 mb-1">Demo Hesaplar:</p>
            <p>👤 ahmet@mail.com / user123</p>
            <p>🔑 admin@ahb.com / admin123</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">E-posta</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@mail.com" required className="input pl-10 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Şifre</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input id="login-password" type={showPass ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required
                  className="input pl-10 pr-10 text-sm" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
            <button id="login-submit" type="submit" disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Giriş yapılıyor...</> : 'Giriş Yap'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-5">
            Hesabınız yok mu? <Link to="/register" className="text-orange-500 hover:underline font-medium">Kayıt Ol</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

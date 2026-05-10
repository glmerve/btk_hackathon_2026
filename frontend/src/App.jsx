import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Login from './pages/Login'
import Register from './pages/Register'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="page-enter">
          <Routes>
            <Route path="/"             element={<Home />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/login"        element={<Login />} />
            <Route path="/register"     element={<Register />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

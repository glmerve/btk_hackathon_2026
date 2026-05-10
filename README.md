# ReviewGuard — AI Destekli E-Ticaret Platformu

> **BTK Hackathon 2026** | Full-Stack · Railway Deployment · ReviewGuard AI Extension Entegrasyonu

[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)](https://prisma.io)
[![Railway](https://img.shields.io/badge/Deploy-Railway-purple?logo=railway)](https://railway.app)

---

## 📁 Proje Yapısı

```
btk_hackathon_2026/
├── backend/                 # Express.js API
│   ├── prisma/
│   │   └── schema.prisma    # Veritabanı şeması
│   ├── src/
│   │   ├── controllers/     # İş mantığı (auth, product, comment)
│   │   ├── routes/          # API rotaları
│   │   ├── middlewares/     # JWT auth, error handler
│   │   ├── services/        # Harici servisler
│   │   └── utils/
│   │       └── seed.js      # Demo veri yükleyici
│   ├── app.js               # Express sunucu giriş noktası
│   └── .env.example         # Ortam değişkeni şablonu
│
├── frontend/                # React + Tailwind
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js     # Axios instance + interceptors
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── CommentCard.jsx  ← review-image-ai entegrasyonu
│   │   │   └── StarRating.jsx
│   │   └── pages/
│   │       ├── Home.jsx         # Ürün listesi + arama
│   │       ├── ProductDetail.jsx # Detay + yorum bölümü
│   │       ├── Login.jsx
│   │       └── Register.jsx
│   └── index.html
│
└── README.md
```

---

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- PostgreSQL 14+
- npm 9+

### 1. Repoyu Klonla
```bash
git clone https://github.com/kullanici/btk_hackathon_2026.git
cd btk_hackathon_2026
```

### 2. Backend Kurulumu
```bash
cd backend
npm install

# .env dosyası oluştur
cp .env.example .env
# .env dosyasını düzenle → DATABASE_URL ve JWT_SECRET ekle
```

**.env içeriği:**
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/reviewguard"
JWT_SECRET="guclu-gizli-anahtar-buraya"
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### 3. Veritabanı Kur & Seed
```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
node src/utils/seed.js
```

### 4. Backend'i Başlat
```bash
npm run dev   # geliştirme
npm start     # production
```

### 5. Frontend Kurulumu
```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`  
Backend API: `http://localhost:5000/api`

---

## 🔌 API Endpointleri

### Auth
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/api/auth/register` | Kayıt ol |
| POST | `/api/auth/login` | Giriş yap |
| GET | `/api/auth/me` | Profil bilgisi |

### Products
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/products` | Ürün listesi (filtre/arama) |
| GET | `/api/products/:id` | Ürün detayı |
| POST | `/api/products` | Ürün ekle (Admin) |

### Comments — ReviewGuard Uyumlu
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/comments?productId=1` | Ürün yorumları |
| POST | `/api/comments` | Yorum ekle (Auth) |
| PATCH | `/api/comments/:id/spam` | Spam işaretle (Admin) |

---

## 🤖 ReviewGuard Entegrasyon Noktaları

### CSS Class Hedefi
Tarayıcı eklentisi DOM'da `review-image-ai` class'ını arar:
```html
<img
  class="review-image-ai"
  data-comment-id="42"
  data-product-id="5"
  data-spam-score="0.03"
  src="https://..."
/>
```

### API Yanıt Formatı
`GET /api/comments?productId=1` yanıtı:
```json
{
  "comments": [
    {
      "id": 1,
      "content": "Harika ürün!",
      "imageUrl": "https://...",
      "rating": 5,
      "isSpam": false,
      "spamScore": 0.03,
      "createdAt": "2026-05-10T...",
      "user": { "id": 2, "email": "ahmet@mail.com" },
      "productId": 1
    }
  ],
  "total": 1
}
```

---

## ☁️ Railway Deployment

### Backend
1. Railway'de **New Project → Deploy from GitHub** seç
2. `backend/` klasörünü root olarak belirt
3. **Environment Variables** ekle:
   ```
   DATABASE_URL  = (Railway PostgreSQL bağlantı URL'i)
   JWT_SECRET    = (güçlü rastgele string)
   NODE_ENV      = production
   FRONTEND_URL  = https://frontend-url.vercel.app
   ```
4. **Start Command:** `npm start`
5. PostgreSQL eklentisi ekle → `DATABASE_URL` otomatik atanır
6. Deploy sonrası: `npx prisma migrate deploy` ve seed çalıştır

### Frontend (Vercel)
1. Vercel'de **New Project → Import from GitHub** seç
2. `frontend/` klasörünü root olarak belirt
3. **Environment Variables:**
   ```
   VITE_API_URL = https://backend-url.railway.app/api
   ```
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`

---

## 📝 Commit Geçmişi (Conventional Commits)

```
chore: initialize monorepo structure
feat(backend): add prisma schema (User, Product, Comment)
feat(backend): implement auth controller and JWT middleware
feat(backend): add product and comment routes
feat(backend): add database seed with demo data
feat(frontend): scaffold vite + react + tailwind
feat(frontend): add navbar with dark mode and auth state
feat(frontend): implement home page with product grid
feat(frontend): add product detail page with comments
feat(frontend): integrate review-image-ai class for ReviewGuard
docs: add README with setup and architecture guide
```

---

## 👤 Demo Hesaplar (Seed sonrası)

| Rol | Email | Şifre |
|-----|-------|-------|
| Admin | admin@reviewguard.com | admin123 |
| User | ahmet@mail.com | user123 |
| User | zeynep@mail.com | user123 |

---

## 🛠️ Tech Stack

| Katman | Teknoloji |
|--------|-----------|
| Backend | Node.js, Express.js, Prisma ORM |
| Veritabanı | PostgreSQL |
| Frontend | React 18, Tailwind CSS, Vite |
| HTTP Client | Axios |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Icons | Lucide React |
| Deployment | Railway (backend + DB), Vercel (frontend) |

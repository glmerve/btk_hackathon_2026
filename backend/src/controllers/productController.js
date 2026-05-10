const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ─── MOCK DATA (Veritabanı boşsa gözükecek veriler) ──────────────────────────
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Sony WH-1000XM5 Kablosuz Kulaklık',
    price: 4299.99,
    description: 'Sektörün en iyi gürültü engelleme özelliğine sahip premium kablosuz kulaklık. 30 saate kadar pil ömrü, katlanabilir tasarım ve mükemmel ses kalitesi.',
    mainImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop',
    category: 'Elektronik',
    stock: 45,
    _count: { comments: 3 }
  },
  {
    id: 2,
    name: 'Apple MacBook Air M2',
    price: 32999.99,
    description: 'Apple M2 çip ile güçlendirilmiş ultra ince dizüstü bilgisayar. 13.6 inç Liquid Retina ekran, 18 saat pil ömrü.',
    mainImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop',
    category: 'Bilgisayar',
    stock: 20,
    _count: { comments: 2 }
  },
  {
    id: 3,
    name: 'Nike Air Max 270',
    price: 2899.99,
    description: 'Maksimum hava yastığı konforu ile günlük kullanım için tasarlanmış spor ayakkabı. Hafif mesh üst, dayanıklı taban.',
    mainImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop',
    category: 'Giyim & Ayakkabı',
    stock: 120,
    _count: { comments: 4 }
  },
  {
    id: 4,
    name: 'Dyson V15 Detect Süpürge',
    price: 12999.99,
    description: 'Lazer tozu algılama teknolojisi. 60 dakika pil ömrü, HEPA filtrasyon sistemi, LCD ekranlı akıllı mod.',
    mainImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
    category: 'Ev Aletleri',
    stock: 25,
    _count: { comments: 1 }
  }
];

// ─── GET ALL PRODUCTS ─────────────────────────────────────────────────────────
const getAllProducts = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (category && category !== 'Tümü') where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    let [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { comments: true } } },
      }),
      prisma.product.count({ where }),
    ]);

    // EĞER VERİTABANI BOŞSA MOCK VERİLERİ DÖNDÜR
    if (products.length === 0 && !category && !search) {
      products = MOCK_PRODUCTS;
      total = MOCK_PRODUCTS.length;
    }

    res.json({
      products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    // Veritabanı hatası alsa bile mock verileri döndür (demo için)
    res.json({
      products: MOCK_PRODUCTS,
      pagination: { total: MOCK_PRODUCTS.length, page: 1, limit: 12, totalPages: 1 }
    });
  }
};

// ─── GET SINGLE PRODUCT ───────────────────────────────────────────────────────
const getProductById = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    let product = await prisma.product.findUnique({
      where: { id: productId },
      include: { _count: { select: { comments: true } } },
    });

    // Veritabanında yoksa mock veriden bul
    if (!product) {
      product = MOCK_PRODUCTS.find(p => p.id === productId);
    }

    if (!product) {
      return res.status(404).json({ error: 'Ürün bulunamadı.' });
    }

    res.json(product);
  } catch (err) {
    const productId = parseInt(req.params.id);
    const product = MOCK_PRODUCTS.find(p => p.id === productId);
    if (product) return res.json(product);
    next(err);
  }
};

// ─── CREATE PRODUCT (Admin only) ──────────────────────────────────────────────
const createProduct = async (req, res, next) => {
  try {
    const { name, price, description, mainImage, category, stock } = req.body;

    if (!name || !price || !description) {
      return res.status(400).json({ error: 'Zorunlu alanlar eksik.' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        description,
        mainImage: mainImage || 'https://placehold.co/400x300/1f2937/6b7280?text=Ürün',
        category: category || 'Genel',
        stock: parseInt(stock) || 100,
      },
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllProducts, getProductById, createProduct };

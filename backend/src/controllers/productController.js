const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// ─── GET ALL PRODUCTS ─────────────────────────────────────────────────────────
const getAllProducts = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { comments: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

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
    next(err);
  }
};

// ─── GET SINGLE PRODUCT ───────────────────────────────────────────────────────
const getProductById = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        _count: { select: { comments: true } },
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Ürün bulunamadı.' });
    }

    res.json(product);
  } catch (err) {
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

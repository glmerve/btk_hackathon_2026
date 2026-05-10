const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// ─── GET COMMENTS FOR PRODUCT ─────────────────────────────────────────────────
// ReviewGuard eklentisi bu endpoint'i okur → standart JSON yapısı korunmalı
const getCommentsByProduct = async (req, res, next) => {
  try {
    const { productId } = req.query;

    if (!productId) {
      return res.status(400).json({ error: 'productId gereklidir.' });
    }

    const comments = await prisma.comment.findMany({
      where: { productId: parseInt(productId) },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, email: true },
        },
      },
    });

    // ReviewGuard standart format — eklenti bu yapıyı bekler
    const formatted = comments.map((c) => ({
      id: c.id,
      content: c.content,
      imageUrl: c.imageUrl || null,    // ← Eklenti bu alanı okur
      rating: c.rating,
      isSpam: c.isSpam,
      spamScore: c.spamScore,          // ← ReviewGuard AI skoru
      createdAt: c.createdAt,
      user: c.user,
      productId: c.productId,
    }));

    res.json({ comments: formatted, total: formatted.length });
  } catch (err) {
    next(err);
  }
};

// ─── CREATE COMMENT ───────────────────────────────────────────────────────────
const createComment = async (req, res, next) => {
  try {
    const { content, imageUrl, rating, productId } = req.body;
    const userId = req.user.userId;

    if (!content || !productId) {
      return res.status(400).json({ error: 'content ve productId zorunludur.' });
    }

    // Ürün var mı kontrol et
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });
    if (!product) {
      return res.status(404).json({ error: 'Ürün bulunamadı.' });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        imageUrl: imageUrl || null,
        rating: parseInt(rating) || 5,
        userId,
        productId: parseInt(productId),
      },
      include: {
        user: { select: { id: true, email: true } },
      },
    });

    res.status(201).json({
      id: comment.id,
      content: comment.content,
      imageUrl: comment.imageUrl,
      rating: comment.rating,
      isSpam: comment.isSpam,
      spamScore: comment.spamScore,
      createdAt: comment.createdAt,
      user: comment.user,
      productId: comment.productId,
    });
  } catch (err) {
    next(err);
  }
};

// ─── UPDATE SPAM STATUS (Admin / ReviewGuard webhook) ─────────────────────────
const updateSpamStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isSpam, spamScore } = req.body;

    const comment = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: {
        isSpam: Boolean(isSpam),
        spamScore: parseFloat(spamScore) || 0,
      },
    });

    res.json(comment);
  } catch (err) {
    next(err);
  }
};

module.exports = { getCommentsByProduct, createComment, updateSpamStatus };

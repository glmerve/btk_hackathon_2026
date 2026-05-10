const express = require('express');
const router = express.Router();
const {
  getCommentsByProduct,
  createComment,
  updateSpamStatus,
} = require('../controllers/commentController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// GET /api/comments?productId=1  ← ReviewGuard eklentisi bu endpoint'i okur
router.get('/', getCommentsByProduct);

// POST /api/comments  ← Kullanıcı yorum ekler (auth gerekli)
router.post('/', protect, createComment);

// PATCH /api/comments/:id/spam  ← ReviewGuard AI webhook'u veya admin
router.patch('/:id/spam', protect, adminOnly, updateSpamStatus);

module.exports = router;

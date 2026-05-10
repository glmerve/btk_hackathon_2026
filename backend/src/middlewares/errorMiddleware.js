const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);

  // Prisma specific errors
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Bu kayıt zaten mevcut.' });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Kayıt bulunamadı.' });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Sunucu hatası.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { errorHandler };

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed başlıyor...');

  // Tabloları temizle
  try {
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "Comment" RESTART IDENTITY CASCADE');
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "ProductImage" RESTART IDENTITY CASCADE');
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE');
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "User" RESTART IDENTITY CASCADE');
    console.log('✅ Tablolar temizlendi');
  } catch (e) {
    console.log('⚠️ Tablolar temizlenemedi (ilk çalıştırma olabilir):', e.message);
  }

  // Kullanıcılar
  const adminPass = await bcrypt.hash('admin123', 10);
  const userPass  = await bcrypt.hash('user123', 10);

  await prisma.user.createMany({
    data: [
      { email: 'admin@ahb.com',   password: adminPass, role: 'ADMIN' },
      { email: 'ahmet@mail.com',  password: userPass,  role: 'USER' },
      { email: 'zeynep@mail.com', password: userPass,  role: 'USER' },
      { email: 'mehmet@mail.com', password: userPass,  role: 'USER' },
      { email: 'ayse@mail.com',   password: userPass,  role: 'USER' },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Kullanıcılar eklendi');

  const users = await prisma.user.findMany();

  // Ürünler
  const productData = [
    { name: 'Sony WH-1000XM5 Kablosuz Kulaklık', price: 11299, description: 'Sektörün en iyi aktif gürültü engelleme teknolojisine sahip premium kablosuz kulaklık. 30 saate kadar pil ömrü.', mainImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop', category: 'Elektronik', brand: 'Sony', stock: 45 },
    { name: 'Apple MacBook Air 15" M3', price: 54999, description: 'Apple M3 çip, 15.3 inç Liquid Retina ekran ve 18 saate kadar pil ömrü.', mainImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop', category: 'Bilgisayar', brand: 'Apple', stock: 18 },
    { name: 'Samsung Galaxy S24 Ultra', price: 54999, description: 'Gelişmiş yapay zeka özellikleri, 200MP kamera ve S Pen ile amiral gemisi deneyimi.', mainImage: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=800&fit=crop', category: 'Elektronik', brand: 'Samsung', stock: 35 },
    { name: 'Nike Air Max Pulse', price: 6999, description: 'Sokak stilini sportif rahatlıkla birleştiren yeni nesil Air Max tasarımı.', mainImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop', category: 'Giyim & Ayakkabı', brand: 'Nike', stock: 150 },
    { name: 'Dyson V15 Detect Absolute', price: 17999, description: 'Lazer tozu algılama teknolojisi ve LCD ekranıyla akıllı temizlik deneyimi.', mainImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop', category: 'Ev Aletleri', brand: 'Dyson', stock: 22 },
    { name: 'Philips Airfryer XXL HD9650', price: 4599, description: '%90 daha az yağ ile çıtır ve lezzetli yemekler. 7.3 litre büyük kapasite.', mainImage: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&h=800&fit=crop', category: 'Ev Aletleri', brand: 'Philips', stock: 60 },
    { name: 'Adidas Ultraboost 24', price: 7499, description: 'BOOST teknolojisi ve Continental kauçuk taban ile maksimum enerji geri dönüşü.', mainImage: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800&h=800&fit=crop', category: 'Giyim & Ayakkabı', brand: 'Adidas', stock: 80 },
    { name: 'Apple AirPods Pro 2. Nesil', price: 9499, description: 'Uyarlanabilir ses, Kişiselleştirilmiş Uzamsal Ses ve en iyi ANC kalitesi.', mainImage: 'https://images.unsplash.com/photo-1588423771073-b8903fead714?w=800&h=800&fit=crop', category: 'Elektronik', brand: 'Apple', stock: 75 },
    { name: 'Nespresso Vertuo Pop Kahve Makinesi', price: 4299, description: 'Centrifusion teknolojisiyle mükemmel kremalı kahve. Kompakt tasarım.', mainImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=800&fit=crop', category: 'Ev Aletleri', brand: 'Nespresso', stock: 40 },
    { name: 'Samsung 65" Neo QLED 4K', price: 42999, description: 'Quantum Matrix teknolojisi ile sinema kalitesinde görüntü. Tizen OS.', mainImage: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&h=800&fit=crop', category: 'Elektronik', brand: 'Samsung', stock: 12 },
    { name: "Levi's 501 Original Straight Jean", price: 2499, description: 'Efsanevi 501 kesim, %100 organik pamuk denim. Zamansız stil.', mainImage: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop', category: 'Giyim & Ayakkabı', brand: 'Levis', stock: 200 },
    { name: 'Canon EOS R50 Aynasız Kamera', price: 28999, description: '24.2 MP APS-C sensör, 4K video ve gelişmiş otofokus sistemi.', mainImage: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=800&fit=crop', category: 'Fotoğraf', brand: 'Canon', stock: 15 },
    { name: 'Nike Dri-FIT Erkek T-Shirt', price: 799, description: 'Dri-FIT teknolojisi ile nem yönetimi sağlayan hafif antrenman t-shirt.', mainImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop', category: 'Giyim & Ayakkabı', brand: 'Nike', stock: 300 },
    { name: 'Tefal Ingenio Essential 13 Parça Set', price: 3299, description: 'Çıkarılabilir saplı tencere tava seti. Tüm ocak türlerine uyumlu.', mainImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=800&fit=crop', category: 'Ev & Yaşam', brand: 'Tefal', stock: 55 },
    { name: 'Xiaomi Mi Smart Band 8', price: 1299, description: '1.62 inç AMOLED ekran, 16 gün pil ömrü ve 150+ spor modu.', mainImage: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&h=800&fit=crop', category: 'Elektronik', brand: 'Xiaomi', stock: 120 },
    { name: 'Versace Eros Pour Homme 100ml', price: 3799, description: 'Nane, limon ve yeşil elma notalarıyla maskülen parfüm.', mainImage: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800&h=800&fit=crop', category: 'Kozmetik', brand: 'Versace', stock: 30 },
    { name: 'IKEA KALLAX Raf Ünitesi', price: 2999, description: 'Çok yönlü ve işlevsel raf sistemi. 4 gözlü kompakt tasarım.', mainImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop', category: 'Ev & Yaşam', brand: 'IKEA', stock: 45 },
    { name: 'Logitech MX Master 3S', price: 4599, description: 'MagSpeed tekerlek, 8000 DPI sensör ve ergonomik tasarım.', mainImage: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=800&fit=crop', category: 'Bilgisayar', brand: 'Logitech', stock: 65 },
    { name: 'Zara Basic Oxford Gömlek', price: 1299, description: '%100 pamuklu Oxford kumaş, rahat regular fit ve klasik yaka.', mainImage: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=800&fit=crop', category: 'Giyim & Ayakkabı', brand: 'Zara', stock: 180 },
    { name: 'Apple iPad Air 11" M2', price: 32999, description: 'Apple M2 çip ve 11 inç Liquid Retina ekran. Apple Pencil Pro uyumlu.', mainImage: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop', category: 'Bilgisayar', brand: 'Apple', stock: 25 },
  ];

  for (const p of productData) {
    await prisma.product.create({ data: p });
  }
  console.log(`✅ ${productData.length} ürün eklendi`);

  const products = await prisma.product.findMany();

  // Ürün fotoğrafları
  await prisma.productImage.createMany({
    data: [
      { url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop', productId: products[0].id },
      { url: 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=600&h=600&fit=crop', productId: products[0].id },
      { url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop', productId: products[1].id },
      { url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop', productId: products[2].id },
      { url: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=600&h=600&fit=crop', productId: products[3].id },
      { url: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&h=600&fit=crop', productId: products[5].id },
      { url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop', productId: products[7].id },
      { url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop', productId: products[8].id },
    ],
  });
  console.log('✅ Ürün fotoğrafları eklendi');

  // Yorumlar
  const commentData = [
    { content: 'Gerçekten mükemmel bir kulaklık! Gürültü engelleme inanılmaz.', imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop', rating: 5, isSpam: false, spamScore: 0.03, userId: users[1].id, productId: products[0].id },
    { content: 'Ses kalitesi harika ama fiyatı biraz yüksek.', rating: 4, isSpam: false, spamScore: 0.07, userId: users[2].id, productId: products[0].id },
    { content: 'ÇOK UCUZ!!! TIKLA KAZAN www.spam123.com', rating: 5, isSpam: true, spamScore: 0.96, userId: users[3].id, productId: products[0].id },
    { content: '3 aydır kullanıyorum, hiç sorun yaşamadım.', rating: 5, isSpam: false, spamScore: 0.05, userId: users[4].id, productId: products[0].id },
    { content: 'MacBook pil ömrü gerçekten 18 saat! Harika!', imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop', rating: 5, isSpam: false, spamScore: 0.02, userId: users[1].id, productId: products[1].id },
    { content: 'M3 çip inanılmaz hızlı, video editing akıcı.', rating: 5, isSpam: false, spamScore: 0.04, userId: users[2].id, productId: products[1].id },
    { content: 'S24 Ultra kamera sistemi muhteşem!', imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop', rating: 5, isSpam: false, spamScore: 0.03, userId: users[4].id, productId: products[2].id },
    { content: 'S Pen çok kullanışlı, premium hissettiriyor.', rating: 5, isSpam: false, spamScore: 0.05, userId: users[1].id, productId: products[2].id },
    { content: 'Nike Air Max gerçekten çok rahat!', rating: 5, isSpam: false, spamScore: 0.04, userId: users[3].id, productId: products[3].id },
    { content: 'Kalite fiyatına değer. Hızlı kargo geldi.', rating: 5, isSpam: false, spamScore: 0.06, userId: users[4].id, productId: products[3].id },
    { content: 'Dyson süpürge hayat kurtarıyor!', rating: 5, isSpam: false, spamScore: 0.02, userId: users[1].id, productId: products[4].id },
    { content: '60 dakika pil ömrü tam 60 dakika!', rating: 5, isSpam: false, spamScore: 0.03, userId: users[2].id, productId: products[4].id },
    { content: 'Airfryer patates kızartması çıtır çıtır.', rating: 5, isSpam: false, spamScore: 0.04, userId: users[3].id, productId: products[5].id },
    { content: 'Büyük aile için ideal, 6 kişilik yemek hazırlanıyor.', rating: 4, isSpam: false, spamScore: 0.07, userId: users[4].id, productId: products[5].id },
    { content: 'AirPods Pro gürültü engelleme mükemmel!', rating: 5, isSpam: false, spamScore: 0.03, userId: users[1].id, productId: products[7].id },
    { content: 'UCUZ KAZANIN!!! BU ÜRÜNÜ ALANA HEDİYE!', rating: 5, isSpam: true, spamScore: 0.98, userId: users[2].id, productId: products[7].id },
    { content: 'Nespresso kahvesi gerçekten çok lezzetli.', rating: 4, isSpam: false, spamScore: 0.06, userId: users[3].id, productId: products[8].id },
    { content: 'Samsung TV 4K görüntü kalitesi inanılmaz!', rating: 5, isSpam: false, spamScore: 0.02, userId: users[4].id, productId: products[9].id },
    { content: 'Levi\'s jean yıllar geçse bile formunu koruyor.', rating: 5, isSpam: false, spamScore: 0.04, userId: users[1].id, productId: products[10].id },
    { content: 'Canon R50 bu fiyata çok iyi bir başlangıç kamerası.', rating: 4, isSpam: false, spamScore: 0.05, userId: users[2].id, productId: products[11].id },
  ];

  for (const c of commentData) {
    await prisma.comment.create({ data: c });
  }
  console.log(`✅ ${commentData.length} yorum eklendi`);

  console.log('\n🎉 Seed tamamlandı!');
  console.log('👤 Admin: admin@ahb.com / admin123');
  console.log('👤 User:  ahmet@mail.com / user123');
}

main()
  .catch((e) => { console.error('❌ Hata:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

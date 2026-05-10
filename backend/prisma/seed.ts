import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed başlıyor...');

  // ─── TABLOLARI TEMİZLE ────────────────────────────────────────────────────
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Comment" RESTART IDENTITY CASCADE`);
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "ProductImage" RESTART IDENTITY CASCADE`);
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE`);
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`);

  // ─── KULLANICILAR ─────────────────────────────────────────────────────────
  const adminPass = await bcrypt.hash('admin123', 10);
  const userPass  = await bcrypt.hash('user123', 10);

  await prisma.$executeRawUnsafe(`
    INSERT INTO "User" (email, password, role, "createdAt") VALUES
    ('admin@ahb.com',   '${adminPass}', 'ADMIN', NOW()),
    ('ahmet@mail.com',  '${userPass}',  'USER',  NOW()),
    ('zeynep@mail.com', '${userPass}',  'USER',  NOW()),
    ('mehmet@mail.com', '${userPass}',  'USER',  NOW()),
    ('ayse@mail.com',   '${userPass}',  'USER',  NOW())
  `);
  console.log('✅ Kullanıcılar eklendi');

  // ─── ÜRÜNLER ─────────────────────────────────────────────────────────────
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Product" (name, price, description, "mainImage", category, brand, stock, "createdAt") VALUES
    (
      'Sony WH-1000XM5 Kablosuz Kulaklık',
      11299.00,
      'Sektörün en iyi aktif gürültü engelleme teknolojisine sahip premium kablosuz kulaklık. 30 saate kadar pil ömrü, Multipoint bağlantı ve kristal netliğinde ses kalitesi sunar.',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
      'Elektronik', 'Sony', 45, NOW()
    ),
    (
      'Apple MacBook Air 15" M3',
      54999.00,
      'Apple M3 çip, 15.3 inç Liquid Retina ekran ve 18 saate kadar pil ömrüyle profesyonel kullanım için ideal dizüstü bilgisayar. Fanless tasarım, sessiz ve güçlü.',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop',
      'Bilgisayar', 'Apple', 18, NOW()
    ),
    (
      'Samsung Galaxy S24 Ultra',
      54999.00,
      'Gelişmiş yapay zeka özellikleri, 200MP kamera ve entegre S Pen ile amiral gemisi Android deneyimi. Titanyum çerçeve ve 6.8 inç Dynamic AMOLED 2X ekran.',
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=800&fit=crop',
      'Elektronik', 'Samsung', 35, NOW()
    ),
    (
      'Nike Air Max Pulse',
      6999.00,
      'Sokak stilini sportif rahatlıkla birleştiren Air Max Pulse, gün boyu konfor ve şık görünüm sunar. Nefes alabilen mesh üst, dayanıklı kauçuk taban.',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
      'Giyim & Ayakkabı', 'Nike', 150, NOW()
    ),
    (
      'Dyson V15 Detect Absolute',
      17999.00,
      'Lazer tozu algılama teknolojisi ve gerçek zamanlı geri bildirim LCD ekranıyla akıllı temizlik deneyimi. 60 dakika pil ömrü ve HEPA filtrasyon sistemi.',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop',
      'Ev Aletleri', 'Dyson', 22, NOW()
    ),
    (
      'Philips Airfryer XXL HD9650',
      4599.00,
      '%90 daha az yağ ile çıtır ve lezzetli yemekler. 7.3 litre büyük kapasiteli, Rapid Air teknolojili ve 6 ön ayarlı programlı hava fritözü.',
      'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&h=800&fit=crop',
      'Ev Aletleri', 'Philips', 60, NOW()
    ),
    (
      'Adidas Ultraboost 24',
      7499.00,
      'BOOST teknolojisi ve Continental kauçuk taban ile maksimum enerji geri dönüşü sağlayan koşu ayakkabısı. Primeknit+ üst, Torsion System destek sistemi.',
      'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800&h=800&fit=crop',
      'Giyim & Ayakkabı', 'Adidas', 80, NOW()
    ),
    (
      'Apple AirPods Pro 2. Nesil',
      9499.00,
      'Uyarlanabilir ses, Kişiselleştirilmiş Uzamsal Ses ve En iyi ANC kalitesiyle gerçek kablosuz deneyim. MagSafe şarj kutusuyla 30 saate kadar kullanım.',
      'https://images.unsplash.com/photo-1588423771073-b8903fead714?w=800&h=800&fit=crop',
      'Elektronik', 'Apple', 75, NOW()
    ),
    (
      'Nespresso Vertuo Pop Kahve Makinesi',
      4299.00,
      'Centrifusion teknolojisiyle mükemmel kremalı kahve. Kompakt tasarım, 5 fincan boyutu seçeneği ve 30 saniyede ısınma özelliğiyle günlük kahve ritüelinizi yükseltin.',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=800&fit=crop',
      'Ev Aletleri', 'Nespresso', 40, NOW()
    ),
    (
      'Samsung 65" Neo QLED 4K QN85C',
      42999.00,
      'Quantum Matrix teknolojisi ve Neural Quantum Processor 4K ile sinema kalitesinde görüntü. Tizen OS, Dolby Atmos ve 120Hz yenileme hızı ile tam anlamıyla ev sineması.',
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&h=800&fit=crop',
      'Elektronik', 'Samsung', 12, NOW()
    ),
    (
      'Levi''s 501 Original Straight Jean',
      2499.00,
      'Efsanevi 501 kesim, %100 organik pamuk denim ile. Yüksek bel, straight fit tasarım ve klasik Levi''s dikişiyle zamansız stil.',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop',
      'Giyim & Ayakkabı', 'Levis', 200, NOW()
    ),
    (
      'Canon EOS R50 Aynasız Fotoğraf Makinesi',
      28999.00,
      '24.2 MP APS-C sensör, 4K video ve gelişmiş otofokus sistemiyle hem yeni başlayanlar hem de ileri düzey kullanıcılar için ideal aynasız kamera.',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=800&fit=crop',
      'Fotoğraf', 'Canon', 15, NOW()
    ),
    (
      'Nike Dri-FIT Erkek Eğitim T-Shirt',
      799.00,
      'Dri-FIT teknolojisi ile nem yönetimi sağlayan hafif antrenman t-shirt. Ergonomik kesim, nefes alabilen kumaş ve reflektif detaylarla yoğun antrenmanlar için ideal.',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
      'Giyim & Ayakkabı', 'Nike', 300, NOW()
    ),
    (
      'Tefal Ingenio Essential Set 13 Parça',
      3299.00,
      'Çıkarılabilir saplı devrimci tencere tava seti. Titanyum kaplama, tüm ocak türlerine uyumlu ve fırında kullanılabilir. 13 parçalı eksiksiz mutfak seti.',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=800&fit=crop',
      'Ev & Yaşam', 'Tefal', 55, NOW()
    ),
    (
      'Xiaomi Mi Smart Band 8',
      1299.00,
      '1.62 inç AMOLED ekran, 16 gün pil ömrü ve 150+ spor modu desteğiyle akıllı bant deneyimi. SpO2 ve kalp atışı takibi, su geçirmez tasarım.',
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&h=800&fit=crop',
      'Elektronik', 'Xiaomi', 120, NOW()
    ),
    (
      'Versace Eros Pour Homme 100ml EDP',
      3799.00,
      'Nane, limon ve yeşil elma üst notaları, tonka fasulyesi ve ambroksan orta notalarıyla maskülen ve büyüleyici parfüm. Kalıcı koku, şık şişe tasarımı.',
      'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800&h=800&fit=crop',
      'Kozmetik', 'Versace', 30, NOW()
    ),
    (
      'IKEA KALLAX Raf Ünitesi',
      2999.00,
      'Çok yönlü ve işlevsel raf sistemi. 4 gözlü kompakt tasarım, sepet ve kutu aksesuarlarıyla kişiselleştirilebilir. Oda düzenleyici olarak ideal.',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop',
      'Ev & Yaşam', 'IKEA', 45, NOW()
    ),
    (
      'Logitech MX Master 3S Mouse',
      4599.00,
      'MagSpeed elektromanyetik tekerlek, 8000 DPI sensör ve ergonomik tasarımla profesyonel kullanım için optimum kablosuz mouse. Sessiz tıklama, çoklu cihaz desteği.',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=800&fit=crop',
      'Bilgisayar', 'Logitech', 65, NOW()
    ),
    (
      'Zara Basic Oxford Gömlek',
      1299.00,
      '%100 pamuklu Oxford kumaş, rahat regular fit ve klasik düğmeli yaka detayıyla her kombine uyum sağlayan temel gömlek. Beyaz ve mavi renk seçenekleri.',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=800&fit=crop',
      'Giyim & Ayakkabı', 'Zara', 180, NOW()
    ),
    (
      'Apple iPad Air 11" M2',
      32999.00,
      'Apple M2 çip ve 11 inç Liquid Retina ekranla güçlü bir tablet deneyimi. Apple Pencil Pro ve Magic Keyboard ile tam profesyonel iş akışı.',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop',
      'Bilgisayar', 'Apple', 25, NOW()
    )
  `);
  console.log('✅ 20 ürün eklendi');

  // ─── ÜRÜN FOTOĞRAFLARI ────────────────────────────────────────────────────
  await prisma.$executeRawUnsafe(`
    INSERT INTO "ProductImage" (url, "productId") VALUES
    ('https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop', 1),
    ('https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=600&h=600&fit=crop', 1),
    ('https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop', 1),
    ('https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop', 2),
    ('https://images.unsplash.com/photo-1611186871525-2fc92efba438?w=600&h=600&fit=crop', 2),
    ('https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop', 3),
    ('https://images.unsplash.com/photo-1434494817513-cc112a976e36?w=600&h=600&fit=crop', 4),
    ('https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=600&h=600&fit=crop', 4),
    ('https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&h=600&fit=crop', 6),
    ('https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop', 8),
    ('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop', 9),
    ('https://images.unsplash.com/photo-1593359677879-a4bb92f4834f?w=600&h=600&fit=crop', 10)
  `);
  console.log('✅ Ürün fotoğrafları eklendi');

  // ─── YORUMLAR ────────────────────────────────────────────────────────────
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Comment" (content, "imageUrl", rating, "isSpam", "spamScore", "userId", "productId", "createdAt") VALUES
    ('Gerçekten mükemmel bir kulaklık! Gürültü engelleme özelliği inanılmaz, ofiste konsantrasyonum ikiye katlandı.', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop', 5, false, 0.03, 2, 1, NOW()),
    ('Ses kalitesi harika ama fiyatı biraz yüksek. Yine de Sony kalitesini hissediyorsunuz.', NULL, 4, false, 0.07, 3, 1, NOW()),
    ('ÇOK UCUZ!!! TIKLA KAZAN www.spam123.com', NULL, 5, true, 0.96, 4, 1, NOW()),
    ('3 aydır kullanıyorum, hiç sorun yaşamadım. Bluetooth bağlantısı çok stabil.', NULL, 5, false, 0.05, 5, 1, NOW()),
    ('MacBook pil ömrü gerçekten 18 saat! İş seyahatlerinde şarj aleti taşımak zorunda kalmıyorum.', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop', 5, false, 0.02, 2, 2, NOW()),
    ('M3 çip inanılmaz hızlı, video editing yaparken bile ısınmıyor. Kesinlikle alın!', NULL, 5, false, 0.04, 3, 2, NOW()),
    ('Ekran renkleri ve parlaklığı mükemmel. macOS öğrenmesi biraz zaman aldı ama değdi.', NULL, 4, false, 0.06, 4, 2, NOW()),
    ('S24 Ultra kamera sistemi beni çok etkiledi, özellikle gece çekimleri muhteşem.', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop', 5, false, 0.03, 5, 3, NOW()),
    ('S Pen çok kullanışlı, not almak için ideal. Titanium çerçeve premium hissettiriyor.', NULL, 5, false, 0.05, 2, 3, NOW()),
    ('Biraz ağır ama bu kadar özellik için normal. Batarya 2 gün dayıyor.', NULL, 4, false, 0.08, 3, 3, NOW()),
    ('Nike Air Max gerçekten çok rahat, sabah 8den akşam 8e kadar ayağımda kaldı hiç zorlanmadım.', NULL, 5, false, 0.04, 4, 4, NOW()),
    ('Kalite fiyatına değer, Türkiye''de bu kaliteyi bulmak zor. Hızlı kargo geldi.', NULL, 5, false, 0.06, 5, 4, NOW()),
    ('Dyson süpürge hayat kurtarıyor! Evcil hayvanlı evler için kesinlikle tavsiye.', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', 5, false, 0.02, 2, 5, NOW()),
    ('60 dakika pil ömrü tam 60 dakika! Vaatlerini tutuyor bu ürün.', NULL, 5, false, 0.03, 3, 5, NOW()),
    ('Airfryer patates kızartması gerçekten yağsız oluyor ve çıtır çıtır. Harika!', NULL, 5, false, 0.04, 4, 6, NOW()),
    ('7.3 litre büyük aile için ideal, 6 kişilik yemek aynı anda hazırlanabiliyor.', NULL, 4, false, 0.07, 5, 6, NOW()),
    ('AirPods Pro gürültü engelleme Sony''e yakın, ama Apple ekosistemiyle entegrasyon üstün.', NULL, 5, false, 0.03, 2, 8, NOW()),
    ('UCUZ KAZANIN!!! BU ÜRÜNÜ ALANA HEDİYE !!! www.kazansite.com', NULL, 5, true, 0.98, 3, 8, NOW()),
    ('Nespresso kahvesi gerçekten çok lezzetli, kapsüller pahalı ama kaliteli.', NULL, 4, false, 0.06, 4, 9, NOW()),
    ('Samsung TV 4K görüntü kalitesi inanılmaz, HDR içerikler bambaşka oluyor.', NULL, 5, false, 0.02, 5, 10, NOW())
  `);
  console.log('✅ 20 yorum eklendi');

  console.log('\n🎉 Seed tamamlandı!');
  console.log('─────────────────────────────────');
  console.log('👤 Admin  : admin@ahb.com  / admin123');
  console.log('👤 User   : ahmet@mail.com / user123');
  console.log('─────────────────────────────────');
}

main()
  .catch((e) => { console.error('❌ Hata:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

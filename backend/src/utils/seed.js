require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const products = [
  {
    name: 'Sony WH-1000XM5 Kablosuz Kulaklık',
    price: 4299.99,
    description:
      'Sektörün en iyi gürültü engelleme özelliğine sahip premium kablosuz kulaklık. 30 saate kadar pil ömrü, katlanabilir tasarım ve mükemmel ses kalitesi.',
    mainImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop',
    category: 'Elektronik',
    stock: 45,
  },
  {
    name: 'Apple MacBook Air M2',
    price: 32999.99,
    description:
      'Apple M2 çip ile güçlendirilmiş ultra ince dizüstü bilgisayar. 13.6 inç Liquid Retina ekran, 18 saat pil ömrü.',
    mainImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop',
    category: 'Bilgisayar',
    stock: 20,
  },
  {
    name: 'Samsung 65" 4K QLED Smart TV',
    price: 18499.99,
    description:
      'Kuantum Nokta teknolojisi ile 1 milyar renk. Tizen OS, Dolby Atmos ses sistemi ve 120Hz yenileme hızı.',
    mainImage: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&h=400&fit=crop',
    category: 'Elektronik',
    stock: 15,
  },
  {
    name: 'Nike Air Max 270',
    price: 2899.99,
    description:
      'Maksimum hava yastığı konforu ile günlük kullanım için tasarlanmış spor ayakkabı. Hafif mesh üst, dayanıklı taban.',
    mainImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop',
    category: 'Giyim & Ayakkabı',
    stock: 120,
  },
  {
    name: 'Philips Airfryer XXL',
    price: 3199.99,
    description:
      'Yağsız kızartma teknolojisi ile sağlıklı yemekler. 7.3 litre kapasite, dijital dokunmatik ekran, 6 ön ayarlı program.',
    mainImage: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&h=400&fit=crop',
    category: 'Ev Aletleri',
    stock: 60,
  },
  {
    name: 'LEGO Technic Bugatti Chiron',
    price: 4199.99,
    description:
      '3599 parçalı özel koleksiyon seti. Çalışan şanzıman, aktif arka kanat ve gerçekçi Bugatti detayları.',
    mainImage: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&h=400&fit=crop',
    category: 'Oyuncak',
    stock: 30,
  },
  {
    name: 'Canon EOS R6 Mark II',
    price: 54999.99,
    description:
      'Full-frame aynasız fotoğraf makinesi. 40 fps hız, 6K RAW video, çift piksel CMOS AF II sistemi.',
    mainImage: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=400&fit=crop',
    category: 'Fotoğraf & Video',
    stock: 10,
  },
  {
    name: 'Dyson V15 Detect Süpürge',
    price: 12999.99,
    description:
      'Lazer tozu algılama teknolojisi. 60 dakika pil ömrü, HEPA filtrasyon sistemi, LCD ekranlı akıllı mod.',
    mainImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
    category: 'Ev Aletleri',
    stock: 25,
  },
];

const commentTemplates = [
  {
    content: 'Ürün gerçekten harika! Beklentilerimin çok üzerinde. Herkese tavsiye ederim.',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    rating: 5,
    isSpam: false,
    spamScore: 0.05,
  },
  {
    content: 'Fiyat/performans oranı çok iyi. Kaliteli malzeme kullanılmış, sağlam yapı.',
    imageUrl: null,
    rating: 4,
    isSpam: false,
    spamScore: 0.08,
  },
  {
    content: 'Kargo çok hızlı geldi, ürün tam açıklandığı gibi. Teşekkürler!',
    imageUrl: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=300&fit=crop',
    rating: 5,
    isSpam: false,
    spamScore: 0.03,
  },
  {
    content: 'BEDAVA KAZANIN TIKLAYIN!!! www.spam-site.com çok iyi ürün çok kaliteli!!!',
    imageUrl: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=400&h=300&fit=crop',
    rating: 5,
    isSpam: true,
    spamScore: 0.97,
  },
  {
    content: 'Biraz pahalı buldum ama kalitesi gerçekten iyi. 3 aydır kullanıyorum, sorun yaşamadım.',
    imageUrl: null,
    rating: 4,
    isSpam: false,
    spamScore: 0.1,
  },
  {
    content: 'Şiddetle tavsiye ederim! Ailem de çok beğendi. Tekrar alacağım.',
    imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    rating: 5,
    isSpam: false,
    spamScore: 0.06,
  },
];

async function main() {
  console.log('🌱 Seed başlıyor...');

  // Admin kullanıcı
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@reviewguard.com' },
    update: {},
    create: {
      email: 'admin@reviewguard.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin oluşturuldu:', admin.email);

  // Demo kullanıcılar
  const userPassword = await bcrypt.hash('user123', 10);
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'ahmet@mail.com' },
      update: {},
      create: { email: 'ahmet@mail.com', password: userPassword, role: 'USER' },
    }),
    prisma.user.upsert({
      where: { email: 'zeynep@mail.com' },
      update: {},
      create: { email: 'zeynep@mail.com', password: userPassword, role: 'USER' },
    }),
    prisma.user.upsert({
      where: { email: 'mehmet@mail.com' },
      update: {},
      create: { email: 'mehmet@mail.com', password: userPassword, role: 'USER' },
    }),
  ]);
  console.log('✅ Demo kullanıcılar oluşturuldu');

  // Ürünler
  const createdProducts = [];
  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { id: products.indexOf(p) + 1 },
      update: p,
      create: p,
    });
    createdProducts.push(product);
  }
  console.log(`✅ ${createdProducts.length} ürün oluşturuldu`);

  // Yorumlar
  const allUsers = [admin, ...users];
  let commentCount = 0;

  for (const product of createdProducts) {
    // Her ürüne 3-4 yorum ekle
    const numComments = 3 + Math.floor(Math.random() * 2);
    for (let i = 0; i < numComments; i++) {
      const template = commentTemplates[i % commentTemplates.length];
      const user = allUsers[i % allUsers.length];

      await prisma.comment.create({
        data: {
          content: template.content,
          imageUrl: template.imageUrl,
          rating: template.rating,
          isSpam: template.isSpam,
          spamScore: template.spamScore,
          userId: user.id,
          productId: product.id,
        },
      });
      commentCount++;
    }
  }

  console.log(`✅ ${commentCount} yorum oluşturuldu`);
  console.log('\n🎉 Seed tamamlandı!');
  console.log('📧 Admin: admin@reviewguard.com / admin123');
  console.log('📧 User: ahmet@mail.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Seed hatası:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

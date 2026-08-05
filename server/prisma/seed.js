const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Gifto E-Commerce Database Seeding...');

  // 1. Clean existing data
  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.deliveryZone.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.siteSetting.deleteMany();

  // 2. Users
  const passwordHash = await bcrypt.hash('admin123', 10);
  const userPasswordHash = await bcrypt.hash('user123', 10);

  const superAdmin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@gifto.pk',
      phone: '+923001234567',
      passwordHash: passwordHash,
      role: 'SUPER_ADMIN',
      points: 500,
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      name: 'Ayesha Khan',
      email: 'ayesha@example.com',
      phone: '+923219876543',
      passwordHash: userPasswordHash,
      role: 'CUSTOMER',
      points: 120,
    },
  });

  console.log('✅ Users seeded (Admin: admin@gifto.pk / admin123)');

  // 3. Delivery Zones
  const cities = [
    { cityName: 'Lahore', deliveryCharge: 200 },
    { cityName: 'Karachi', deliveryCharge: 250 },
    { cityName: 'Islamabad', deliveryCharge: 250 },
    { cityName: 'Rawalpindi', deliveryCharge: 250 },
    { cityName: 'Faisalabad', deliveryCharge: 300 },
    { cityName: 'Multan', deliveryCharge: 300 },
    { cityName: 'Gujranwala', deliveryCharge: 300 },
    { cityName: 'Sialkot', deliveryCharge: 300 },
    { cityName: 'Peshawar', deliveryCharge: 350 },
    { cityName: 'Hyderabad', deliveryCharge: 350 },
    { cityName: 'Sahiwal', deliveryCharge: 350 },
    { cityName: 'Bahawalpur', deliveryCharge: 350 },
    { cityName: 'Rahim Yar Khan', deliveryCharge: 350 },
    { cityName: 'Jhelum', deliveryCharge: 350 },
    { cityName: 'Gujrat', deliveryCharge: 350 },
  ];

  for (const city of cities) {
    await prisma.deliveryZone.create({ data: city });
  }

  console.log('✅ 15 Pakistani Delivery Zones seeded');

  // 4. Categories & Taxonomy
  // Top Categories
  const cakesCat = await prisma.category.create({
    data: {
      name: 'Cakes',
      slug: 'cakes',
      description: 'Fresh bakery cakes delivered same-day in major Pakistani cities',
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
    },
  });

  const flowersCat = await prisma.category.create({
    data: {
      name: 'Flowers',
      slug: 'flowers',
      description: 'Fresh imported and local rose bouquets, lilies & mixed floral arrangements',
      imageUrl: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&auto=format&fit=crop&q=80',
    },
  });

  const chocolatesCat = await prisma.category.create({
    data: {
      name: 'Chocolates',
      slug: 'chocolates',
      description: 'Ferrero Rocher, Lindt, Cadbury chocolate baskets and bouquets',
      imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&auto=format&fit=crop&q=80',
    },
  });

  const sweetsCat = await prisma.category.create({
    data: {
      name: 'Sweets & Mithai',
      slug: 'sweets-mithai',
      description: 'Traditional Pakistani Mithai from Tehzeeb, Baba Bakers, Nirala & Rehmat-e-Shereen',
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
    },
  });

  const occasionsCat = await prisma.category.create({
    data: {
      name: 'Gifts by Occasion',
      slug: 'gifts-by-occasion',
      description: 'Birthday, Anniversary, Eid, Ramadan, Valentine & Wedding Gifts',
      imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
    },
  });

  const combosCat = await prisma.category.create({
    data: {
      name: 'Combo Deals',
      slug: 'combo-deals',
      description: 'Cake + Flower + Chocolate bundles with free gift card',
      imageUrl: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&auto=format&fit=crop&q=80',
    },
  });

  const personalisedCat = await prisma.category.create({
    data: {
      name: 'Personalised Gifts',
      slug: 'personalised-gifts',
      description: 'Custom mugs, cushions, photo frames, explosion boxes & balloons',
      imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80',
    },
  });

  const foodDealsCat = await prisma.category.create({
    data: {
      name: 'Food Deals',
      slug: 'food-deals',
      description: 'KFC, McDonald\'s, Pizza & Desi Food combos delivered to your loved ones',
      imageUrl: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&auto=format&fit=crop&q=80',
    },
  });

  const perfumesCat = await prisma.category.create({
    data: {
      name: 'Perfumes',
      slug: 'perfumes',
      description: 'J., Bonanza Satrangi, Scents N Stories, and international designer fragrances',
      imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80',
    },
  });

  // Sub-categories for Cakes (Lahore, Karachi, Islamabad)
  const lahoreCakes = await prisma.category.create({
    data: {
      name: 'Lahore Cakes',
      slug: 'lahore-cakes',
      parentId: cakesCat.id,
      description: 'Cakes delivered in Lahore from Layers, Jalal Sons, Kitchen Cuisine & Pie In The Sky',
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
    },
  });

  const layersBakeshop = await prisma.category.create({
    data: {
      name: 'Layers Bakeshop',
      slug: 'layers-bakeshop',
      parentId: lahoreCakes.id,
      description: 'Premium Layers Bakeshop cakes in Lahore & Islamabad',
      imageUrl: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=600&auto=format&fit=crop&q=80',
    },
  });

  const karachiCakes = await prisma.category.create({
    data: {
      name: 'Karachi Cakes',
      slug: 'karachi-cakes',
      parentId: cakesCat.id,
      description: 'Cakes delivered in Karachi from Rehmat-e-Shereen, Pie in the Sky, Delizia',
      imageUrl: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=600&auto=format&fit=crop&q=80',
    },
  });

  console.log('✅ Categories taxonomy seeded');

  // 5. Products
  const productsData = [
    {
      name: 'Layers Chocolate Fudge Cake (2 Lbs)',
      slug: 'layers-chocolate-fudge-cake-2lbs',
      description: 'Rich, moist chocolate sponge layered with decadent dark fudge frosting from Layers Bakeshop. The ultimate treat for chocolate lovers in Lahore & Islamabad.',
      price: 3200,
      salePrice: 2899,
      sku: 'CAKE-LAY-001',
      stock: 30,
      categoryId: layersBakeshop.id,
      images: [
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&auto=format&fit=crop&q=80'
      ],
      deliverableCities: ['Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad'],
      isFeatured: true,
      ratingAverage: 4.9,
      reviewCount: 24,
    },
    {
      name: 'Red Velvet Royale Cake (2 Lbs)',
      slug: 'red-velvet-royale-cake-2lbs',
      description: 'Classic red velvet cake layers with smooth cream cheese icing, decorated with fresh red velvet crumbs and chocolate accents.',
      price: 3500,
      salePrice: 3199,
      sku: 'CAKE-RV-002',
      stock: 25,
      categoryId: lahoreCakes.id,
      images: [
        'https://images.unsplash.com/photo-1586788680404-329d2b450ca3?w=800&auto=format&fit=crop&q=80'
      ],
      deliverableCities: ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi'],
      isFeatured: true,
      ratingAverage: 4.8,
      reviewCount: 18,
    },
    {
      name: '24 Red Roses Premium Bouquet',
      slug: '24-red-roses-premium-bouquet',
      description: '24 handpicked long-stem fresh red roses beautifully wrapped in black Korean wrapping paper with a red satin ribbon.',
      price: 4500,
      salePrice: 3999,
      sku: 'FLW-ROS-024',
      stock: 50,
      categoryId: flowersCat.id,
      images: [
        'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop&q=80'
      ],
      deliverableCities: ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Gujranwala', 'Sialkot', 'Peshawar', 'Hyderabad', 'Sahiwal', 'Bahawalpur', 'Rahim Yar Khan', 'Jhelum', 'Gujrat'],
      isFeatured: true,
      ratingAverage: 5.0,
      reviewCount: 42,
    },
    {
      name: 'Ferrero Rocher Deluxe Basket (24 Pcs)',
      slug: 'ferrero-rocher-deluxe-basket-24pcs',
      description: '24 golden Ferrero Rocher pralines arranged in an elegant wicker basket with silk flowers and ribbon embellishments.',
      price: 5200,
      salePrice: 4799,
      sku: 'CHO-FER-024',
      stock: 40,
      categoryId: chocolatesCat.id,
      images: [
        'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&auto=format&fit=crop&q=80'
      ],
      deliverableCities: ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Sialkot'],
      isFeatured: true,
      ratingAverage: 4.9,
      reviewCount: 31,
    },
    {
      name: 'Tehzeeb Assorted Mix Mithai Box (1 Kg)',
      slug: 'tehzeeb-assorted-mix-mithai-box-1kg',
      description: 'Fresh 1kg Box of premium mix mithai including Gulab Jamun, Cham Cham, Barfi, and Akhrot Halwa from Tehzeeb Bakers.',
      price: 2400,
      salePrice: null,
      sku: 'SWT-TEH-001',
      stock: 60,
      categoryId: sweetsCat.id,
      images: [
        'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80'
      ],
      deliverableCities: ['Islamabad', 'Rawalpindi', 'Lahore'],
      isFeatured: false,
      ratingAverage: 4.7,
      reviewCount: 15,
    },
    {
      name: 'Grand Birthday Surprise Combo Deal',
      slug: 'grand-birthday-surprise-combo-deal',
      description: 'Includes 2 Lbs Chocolate Fudge Cake + 12 Red Roses Bouquet + 16 Pcs Ferrero Rocher Box + Personalized Birthday Greeting Card!',
      price: 9500,
      salePrice: 8299,
      sku: 'CMB-BDAY-001',
      stock: 20,
      categoryId: combosCat.id,
      images: [
        'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&auto=format&fit=crop&q=80'
      ],
      deliverableCities: ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan'],
      isFeatured: true,
      ratingAverage: 5.0,
      reviewCount: 56,
    },
    {
      name: 'Custom Magic LED Photo Mug',
      slug: 'custom-magic-led-photo-mug',
      description: 'Heat-sensitive magic mug that reveals your custom photo and message when hot tea or coffee is poured.',
      price: 1850,
      salePrice: 1599,
      sku: 'PRS-MUG-001',
      stock: 100,
      categoryId: personalisedCat.id,
      images: [
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80'
      ],
      deliverableCities: ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Gujranwala', 'Sialkot', 'Peshawar', 'Hyderabad', 'Sahiwal', 'Bahawalpur', 'Rahim Yar Khan', 'Jhelum', 'Gujrat'],
      isFeatured: false,
      ratingAverage: 4.6,
      reviewCount: 19,
    },
    {
      name: 'Janan Pour Homme Perfume by J. (100 ml)',
      slug: 'janan-pour-homme-perfume-j-100ml',
      description: 'Original J. Janan EDP 100ml fragrance for men with rich woody and citrus amber tones. Comes in official velvet box packaging.',
      price: 6800,
      salePrice: 6299,
      sku: 'PRF-JNN-100',
      stock: 15,
      categoryId: perfumesCat.id,
      images: [
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80'
      ],
      deliverableCities: ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Sialkot'],
      isFeatured: true,
      ratingAverage: 4.9,
      reviewCount: 38,
    },
    {
      name: 'KFC Family Festive Feast Deal',
      slug: 'kfc-family-festive-feast-deal',
      description: 'Includes 4 Zinger Burgers, 4 Crisp Pieces, 2 Large Fries, and 1.5L Pepsi delivered fresh to your loved one\'s home.',
      price: 3450,
      salePrice: 3150,
      sku: 'FOD-KFC-001',
      stock: 100,
      categoryId: foodDealsCat.id,
      images: [
        'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&auto=format&fit=crop&q=80'
      ],
      deliverableCities: ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar'],
      isFeatured: false,
      ratingAverage: 4.8,
      reviewCount: 22,
    }
  ];

  for (const item of productsData) {
    const prod = await prisma.product.create({ data: item });
    // Seed a initial review for featured products
    if (prod.isFeatured) {
      await prisma.review.create({
        data: {
          productId: prod.id,
          userId: customerUser.id,
          rating: 5,
          comment: 'Absolutely loved the delivery speed and quality! Recipient in Lahore was thrilled.',
          isApproved: true,
        },
      });
    }
  }

  console.log('✅ Products & Reviews seeded');

  // 6. Coupons
  await prisma.coupon.create({
    data: {
      code: 'GIFTO10',
      discountType: 'PERCENTAGE',
      value: 10,
      minOrderAmount: 2000,
      expiryDate: new Date('2027-12-31'),
      isActive: true,
    },
  });

  await prisma.coupon.create({
    data: {
      code: 'WELCOME500',
      discountType: 'FIXED',
      value: 500,
      minOrderAmount: 5000,
      expiryDate: new Date('2027-12-31'),
      isActive: true,
    },
  });

  console.log('✅ Coupons GIFTO10 & WELCOME500 seeded');

  // 7. Banners
  await prisma.banner.create({
    data: {
      title: 'Deliver Love Across Pakistan & Worldwide',
      imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1600&auto=format&fit=crop&q=80',
      linkUrl: '/shop',
      position: 'HERO',
      isActive: true,
    },
  });

  await prisma.banner.create({
    data: {
      title: 'Same-Day & Midnight Delivery in Lahore, Karachi & Islamabad',
      imageUrl: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=1600&auto=format&fit=crop&q=80',
      linkUrl: '/category/combo-deals',
      position: 'HERO',
      isActive: true,
    },
  });

  console.log('✅ Banners seeded');

  // 8. Site Settings
  const settings = [
    { key: 'SITE_NAME', value: 'Gifto — Premium Gift Delivery Pakistan', description: 'Website title' },
    { key: 'CONTACT_PHONE', value: '+92 300 1234567', description: 'Customer support hotline' },
    { key: 'CONTACT_EMAIL', value: 'support@gifto.pk', description: 'Support email address' },
    { key: 'SUPPORT_HOURS', value: '10:00 AM – 12:00 AM PST (7 Days a Week)', description: 'Display hours' },
    { key: 'NTN_NUMBER', value: 'NTN # 8492019-3', description: 'FBR Business registration' },
    { key: 'LOYALTY_POINT_RATE', value: '0.05', description: '5% order amount converted to points' },
    { key: 'BANK_ACCOUNT_TITLE', value: 'Gifto Online Pvt Ltd', description: 'Bank Account Title' },
    { key: 'BANK_NAME', value: 'Meezan Bank Limited', description: 'Bank Name' },
    { key: 'BANK_ACCOUNT_NUMBER', value: '01020104928192', description: 'Bank Account Number' },
    { key: 'BANK_IBAN', value: 'PK36MEZN0001020104928192', description: 'Bank IBAN' },
  ];

  for (const s of settings) {
    await prisma.siteSetting.create({ data: s });
  }

  console.log('✅ Site settings seeded');
  console.log('🎉 Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

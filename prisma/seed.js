const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
require("dotenv").config({ override: true });

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding MongoDB database...");

  // Create admin
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await prisma.admin.upsert({
    where: { email: "admin@solebazar.com" },
    update: {},
    create: {
      email: "admin@solebazar.com",
      password: hashedPassword,
      name: "SoleBazar Admin",
    },
  });
  console.log("✅ Admin created: admin@solebazar.com / admin123");

  // Create brands
  const brandsData = [
    { name: "Nike", slug: "nike", icon: "nike" },
    { name: "Adidas", slug: "adidas", icon: "adidas" },
    { name: "Puma", slug: "puma", icon: "puma" },
    { name: "Cat & Sofa", slug: "cat-sofa", icon: "cat-sofa" },
  ];

  const brands = [];
  for (const b of brandsData) {
    const brand = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {},
      create: b,
    });
    brands.push(brand);
  }
  console.log("✅ Brands created");

  // Create categories
  const categoriesData = [
    { name: "Sneakers", slug: "sneakers", icon: "sneakers" },
    { name: "Running", slug: "running", icon: "running" },
    { name: "Casual", slug: "casual", icon: "casual" },
    { name: "Lifestyle", slug: "lifestyle", icon: "lifestyle" },
  ];

  const categories = [];
  for (const c of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
    categories.push(category);
  }
  console.log("✅ Categories created");

  const brandMap = Object.fromEntries(brands.map((b) => [b.name, b.id]));
  const catMap = Object.fromEntries(categories.map((c) => [c.name, c.id]));

  // Create products
  const products = [
    {
      name: "Dread locks sneakers",
      slug: "dread-locks-sneakers",
      description: "Premium Cat & Sofa sneakers with unique dreadlock-inspired design. Pre-loved in excellent condition.",
      price: 1800,
      condition: "Pre-loved",
      gender: "Unisex",
      sizes: JSON.stringify(["7", "8", "8.5", "9"]),
      colors: JSON.stringify(["Black", "Brown"]),
      stock: 1,
      featured: false,
      brandId: brandMap["Cat & Sofa"],
      categoryId: catMap["Sneakers"],
      images: [{ url: "/Cat_sofa.png", alt: "Cat & Sofa Dread Locks Sneakers", order: 0 }],
    },
    {
      name: "Adidas Stan Smith",
      slug: "adidas-stan-smith",
      description: "The iconic Adidas Stan Smith — clean white leather upper with green heel tab. Brand new, never worn.",
      price: 3200,
      condition: "New",
      gender: "Men",
      sizes: JSON.stringify(["8", "9", "9.5", "10", "10.5"]),
      colors: JSON.stringify(["White/Green"]),
      stock: 3,
      featured: true,
      brandId: brandMap["Adidas"],
      categoryId: catMap["Casual"],
      images: [
        { url: "/adidas-stan-smith-white-sneaker.jpg", alt: "Adidas Stan Smith White", order: 0 },
        { url: "/adidas-stan-smith-white.jpg", alt: "Adidas Stan Smith Side View", order: 1 },
      ],
    },
    {
      name: "Puma RS-X",
      slug: "puma-rs-x",
      description: "Retro-inspired Puma RS-X with bold color blocking and chunky silhouette. Pre-loved in great condition.",
      price: 3800,
      condition: "Pre-loved",
      gender: "Unisex",
      sizes: JSON.stringify(["10", "10.5", "11"]),
      colors: JSON.stringify(["Multi"]),
      stock: 1,
      featured: true,
      brandId: brandMap["Puma"],
      categoryId: catMap["Running"],
      images: [
        { url: "/puma-rs-x-retro-sneaker.jpg", alt: "Puma RS-X Retro Sneaker", order: 0 },
        { url: "/puma-rs-x-retro.jpg", alt: "Puma RS-X Side View", order: 1 },
      ],
    },
    {
      name: "Nike Jordan 1 Low",
      slug: "nike-jordan-1-low",
      description: "The legendary Air Jordan 1 Low in a premium colorway. Brand new with box. A must-have for sneakerheads.",
      price: 5500,
      condition: "New",
      gender: "Men",
      sizes: JSON.stringify(["9", "9.5", "10", "10.5", "11"]),
      colors: JSON.stringify(["White/Black/Red"]),
      stock: 2,
      featured: true,
      brandId: brandMap["Nike"],
      categoryId: catMap["Sneakers"],
      images: [
        { url: "/nike-jordan-1-low-sneaker.jpg", alt: "Nike Jordan 1 Low", order: 0 },
        { url: "/nike-jordan-1-low.jpg", alt: "Nike Jordan 1 Low Alt", order: 1 },
      ],
    },
    {
      name: "Adidas Ultraboost",
      slug: "adidas-ultraboost",
      description: "The ultimate running shoe with Boost technology. Pre-loved but in excellent condition with plenty of life left.",
      price: 4200,
      condition: "Pre-loved",
      gender: "Men",
      sizes: JSON.stringify(["9", "9.5", "10"]),
      colors: JSON.stringify(["Black"]),
      stock: 1,
      featured: false,
      brandId: brandMap["Adidas"],
      categoryId: catMap["Running"],
      images: [{ url: "/adidas-ultraboost-black-sneaker.jpg", alt: "Adidas Ultraboost Black", order: 0 }],
    },
    {
      name: "Puma Suede Classic",
      slug: "puma-suede-classic",
      description: "Vintage Puma Suede Classic — timeless streetwear essential. Brand new with suede upper and rubber outsole.",
      price: 2800,
      condition: "New",
      gender: "Women",
      sizes: JSON.stringify(["7", "8", "8.5"]),
      colors: JSON.stringify(["Navy", "Black"]),
      stock: 2,
      featured: false,
      brandId: brandMap["Puma"],
      categoryId: catMap["Lifestyle"],
      images: [{ url: "/puma-suede-classic-vintage-sneaker.jpg", alt: "Puma Suede Classic", order: 0 }],
    },
    {
      name: "Nike Blazer Mid",
      slug: "nike-blazer-mid",
      description: "Classic Nike Blazer Mid with vintage styling. Pre-loved with minor wear, perfect for casual outfits.",
      price: 4000,
      condition: "Pre-loved",
      gender: "Women",
      sizes: JSON.stringify(["9", "10", "10.5"]),
      colors: JSON.stringify(["White/Black"]),
      stock: 1,
      featured: true,
      brandId: brandMap["Nike"],
      categoryId: catMap["Lifestyle"],
      images: [{ url: "/nike-blazer-mid-classic-sneaker.jpg", alt: "Nike Blazer Mid Classic", order: 0 }],
    },
    {
      name: "Adidas NMD R1",
      slug: "adidas-nmd-r1",
      description: "Modern Adidas NMD R1 with Boost cushioning and Primeknit upper. Brand new, ready to ship.",
      price: 3900,
      condition: "New",
      gender: "Unisex",
      sizes: JSON.stringify(["8", "9", "9.5", "10"]),
      colors: JSON.stringify(["Core Black", "White"]),
      stock: 3,
      featured: false,
      brandId: brandMap["Adidas"],
      categoryId: catMap["Sneakers"],
      images: [{ url: "/adidas-nmd-r1-modern-sneaker.jpg", alt: "Adidas NMD R1", order: 0 }],
    },
  ];

  for (const p of products) {
    const { images, ...productData } = p;
    const exists = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (!exists) {
      await prisma.product.create({
        data: {
          ...productData,
          images: { create: images },
        },
      });
    }
  }
  console.log("✅ Products created");

  console.log("\n🎉 Seed complete!");
  console.log("📋 Admin Credentials:");
  console.log("   Email: admin@solebazar.com");
  console.log("   Password: admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

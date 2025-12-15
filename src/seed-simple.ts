import { prisma } from "./server/db";

// CHỈ dùng ảnh thật từ /public
const REAL_IMAGES = {
  vga: [
    "/Card/card (1).jpg",
    "/Card/card (2).jpg",
    "/Card/card (3).jpg",
    "/Card/card (4).jpg",
    "/Card/card (5).jpg",
    "/Card/card (6).jpg",
  ],
  case: [
    "/Case/case (1).jpg",
    "/Case/case (2).jpg",
    "/Case/case (3).jpg",
    "/Case/case (4).jpg",
    "/Case/case (5).jpg",
  ],
  cpu: [
    "/cpu/cpu (1).jpg",
    "/cpu/cpu (2).jpg",
    "/cpu/cpu (3).jpg",
    "/cpu/cpu (4).jpg",
    "/cpu/cpu (5).jpg",
    "/cpu/cpu (6).jpg",
  ],
  monitor: [
    "/Monitor/monitor (1).jpg",
    "/Monitor/monitor (2).jpg",
    "/Monitor/monitor (3).jpg",
    "/Monitor/monitor (4).jpg",
    "/Monitor/monitor (5).jpg",
  ],
  ram: [
    "/ram/ram (1).jpg",
    "/ram/ram (2).jpg",
    "/ram/ram (3).jpg",
    "/ram/ram (4).jpg",
    "/ram/ram (5).jpg",
    "/ram/ram (6).jpg",
  ],
  ssd: [
    "/ssd/ssd (1).jpg",
    "/ssd/ssd (2).jpg",
    "/ssd/ssd (3).jpg",
    "/ssd/ssd (4).jpg",
    "/ssd/ssd (5).jpg",
  ],
};

// Random lấy 1-3 ảnh từ pool (có thể trùng)
function getRandomImages(type: keyof typeof REAL_IMAGES): string[] {
  const pool = REAL_IMAGES[type];
  const count = Math.floor(Math.random() * 3) + 1; // 1-3 ảnh
  const result: string[] = [];

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    result.push(pool[randomIndex]);
  }

  return result;
}

// Random price
function randomPrice(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log("🚀 Bắt đầu seed dữ liệu đơn giản (CHỈ ảnh thật)...");

  // Lấy store đầu tiên
  const store = await prisma.store.findFirst();
  if (!store) {
    console.log("⚠️ Không có store nào. Vui lòng tạo user/store trước!");
    return;
  }

  // Lấy hoặc tạo categories (CHỈ các category có ảnh thật)
  const vgaCategory =
    (await prisma.category.findUnique({
      where: { slug: "card-man-hinh-vga" },
    })) ||
    (await prisma.category.create({
      data: {
        name: "Card màn hình (VGA)",
        slug: "card-man-hinh-vga",
        color: "#10b981",
      },
    }));

  const caseCategory =
    (await prisma.category.findUnique({ where: { slug: "case-pc" } })) ||
    (await prisma.category.create({
      data: { name: "Case PC", slug: "case-pc", color: "#8b5cf6" },
    }));

  const cpuCategory =
    (await prisma.category.findUnique({
      where: { slug: "bo-vi-xu-ly-cpu" },
    })) ||
    (await prisma.category.create({
      data: {
        name: "Bộ vi xử lý (CPU)",
        slug: "bo-vi-xu-ly-cpu",
        color: "#0ea5e9",
      },
    }));

  const monitorCategory =
    (await prisma.category.findUnique({ where: { slug: "man-hinh" } })) ||
    (await prisma.category.create({
      data: { name: "Màn hình", slug: "man-hinh", color: "#facc15" },
    }));

  const ramCategory =
    (await prisma.category.findUnique({ where: { slug: "ram" } })) ||
    (await prisma.category.create({
      data: { name: "RAM", slug: "ram", color: "#f97316" },
    }));

  const ssdCategory =
    (await prisma.category.findUnique({ where: { slug: "ssd" } })) ||
    (await prisma.category.create({
      data: { name: "SSD", slug: "ssd", color: "#06b6d4" },
    }));

  console.log("✅ Đã tạo/lấy categories");

  // Xóa products cũ
  await prisma.product.deleteMany({ where: { storeId: store.id } });
  console.log("🗑️ Đã xóa products cũ");

  // Tạo products
  const productsData = [
    // VGA (10 sản phẩm)
    ...Array.from({ length: 10 }, (_, i) => ({
      name: `Card màn hình RTX ${4060 + i * 10}`,
      slug: `vga-rtx-${4060 + i * 10}-${Date.now()}-${i}`,
      description: `Card màn hình gaming hiệu năng cao RTX ${4060 + i * 10}, 8GB VRAM, Ray Tracing, DLSS 3.0`,
      price: randomPrice(8000000, 25000000),
      categoryId: vgaCategory.id,
      storeId: store.id,
      stock: Math.floor(Math.random() * 20) + 5,
      isFeatured: i < 3,
      images: getRandomImages("vga"),
    })),

    // Case (8 sản phẩm)
    ...Array.from({ length: 8 }, (_, i) => ({
      name: `Case Gaming RGB ${["NZXT", "Corsair", "Lian Li", "Cooler Master"][i % 4]}`,
      slug: `case-gaming-${Date.now()}-${i}`,
      description:
        "Case gaming với thiết kế hiện đại, hỗ trợ tản nhiệt tốt, đèn RGB",
      price: randomPrice(1500000, 5000000),
      categoryId: caseCategory.id,
      storeId: store.id,
      stock: Math.floor(Math.random() * 15) + 5,
      isFeatured: i < 2,
      images: getRandomImages("case"),
    })),

    // CPU (10 sản phẩm)
    ...Array.from({ length: 10 }, (_, i) => ({
      name: `${i % 2 === 0 ? "Intel Core i7" : "AMD Ryzen 7"} Gen ${13 + i}`,
      slug: `cpu-${i % 2 === 0 ? "intel" : "amd"}-${Date.now()}-${i}`,
      description: `Bộ vi xử lý hiệu năng cao, ${i % 2 === 0 ? "16 nhân 24 luồng" : "12 nhân 24 luồng"}, tốc độ tối đa 5.5GHz`,
      price: randomPrice(5000000, 15000000),
      categoryId: cpuCategory.id,
      storeId: store.id,
      stock: Math.floor(Math.random() * 20) + 10,
      isFeatured: i < 3,
      images: getRandomImages("cpu"),
    })),

    // Monitor (8 sản phẩm)
    ...Array.from({ length: 8 }, (_, i) => ({
      name: `Màn hình ${["LG", "Samsung", "Asus", "Dell"][i % 4]} ${24 + i}" ${144 + i * 20}Hz`,
      slug: `monitor-${Date.now()}-${i}`,
      description: `Màn hình gaming ${24 + i} inch, ${144 + i * 20}Hz, 1ms, IPS/VA, FreeSync/G-Sync`,
      price: randomPrice(3000000, 12000000),
      categoryId: monitorCategory.id,
      storeId: store.id,
      stock: Math.floor(Math.random() * 15) + 5,
      isFeatured: i < 2,
      images: getRandomImages("monitor"),
    })),

    // RAM (10 sản phẩm)
    ...Array.from({ length: 10 }, (_, i) => ({
      name: `RAM ${["Corsair", "G.Skill", "Kingston", "Adata"][i % 4]} ${16 + i * 8}GB DDR5`,
      slug: `ram-${Date.now()}-${i}`,
      description: `RAM DDR5 ${16 + i * 8}GB, tốc độ ${5200 + i * 200}MHz, RGB, tản nhiệt nhôm`,
      price: randomPrice(1500000, 5000000),
      categoryId: ramCategory.id,
      storeId: store.id,
      stock: Math.floor(Math.random() * 30) + 10,
      isFeatured: i < 3,
      images: getRandomImages("ram"),
    })),

    // SSD (8 sản phẩm)
    ...Array.from({ length: 8 }, (_, i) => ({
      name: `SSD ${["Samsung", "WD", "Kingston", "Crucial"][i % 4]} ${512 + i * 256}GB NVMe`,
      slug: `ssd-${Date.now()}-${i}`,
      description: `SSD NVMe Gen4 ${512 + i * 256}GB, tốc độ đọc ${5000 + i * 500}MB/s, TBW cao`,
      price: randomPrice(1000000, 4000000),
      categoryId: ssdCategory.id,
      storeId: store.id,
      stock: Math.floor(Math.random() * 25) + 15,
      isFeatured: i < 2,
      images: getRandomImages("ssd"),
    })),
  ];

  // Insert products
  for (const product of productsData) {
    await prisma.product.create({ data: product });
  }

  console.log(
    `✅ Đã tạo ${productsData.length} products với ảnh thật từ /public!`
  );
  console.log("📊 Thống kê:");
  console.log("  - VGA: 10 sản phẩm");
  console.log("  - Case: 8 sản phẩm");
  console.log("  - CPU: 10 sản phẩm");
  console.log("  - Monitor: 8 sản phẩm");
  console.log("  - RAM: 10 sản phẩm");
  console.log("  - SSD: 8 sản phẩm");
  console.log("🎉 Hoàn thành!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

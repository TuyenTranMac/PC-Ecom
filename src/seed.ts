import { PrismaClient, Role, SubscriptionPlan, SubscriptionStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Bắt đầu seed dữ liệu (Schema: User -> Store -> Product)...");

  // ==========================================
  // 1. CLEANUP & SETUP USERS (OWNERS)
  // ==========================================
  
  // Tạo User 1: Chủ shop GearVN
  const gearUserEmail = "admin@gearvn.com";
  let gearUser = await prisma.user.findUnique({ where: { email: gearUserEmail } });
  
  if (!gearUser) {
    console.log("👤 Đang tạo User Admin (GearVN)...");
    gearUser = await prisma.user.create({
      data: {
        username: "GearVN Admin",
        email: gearUserEmail,
        password: "password123", // Lưu ý: Thực tế cần hash password (bcrypt)
        role: Role.VENDOR, // Hoặc ADMIN tùy logic
        image: "https://github.com/shadcn.png",
        Subscription: {
            create: {
                plan: SubscriptionPlan.PRO,
                status: SubscriptionStatus.ACTIVE,
                startDate: new Date(),
            }
        }
      },
    });
  }

  // Tạo User 2: Chủ shop ConMeoCute
  const catUserEmail = "meo@conmeocute.com";
  let catUser = await prisma.user.findUnique({ where: { email: catUserEmail } });

  if (!catUser) {
    console.log("👤 Đang tạo User Vendor (ConMeoCute)...");
    catUser = await prisma.user.create({
      data: {
        username: "conmeocute",
        email: catUserEmail,
        password: "password123",
        role: Role.VENDOR,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
        Subscription: {
            create: {
                plan: SubscriptionPlan.FREE,
                status: SubscriptionStatus.ACTIVE,
                startDate: new Date(),
            }
        }
      },
    });
  }

  // ==========================================
  // 2. SETUP STORES (LINK TO USERS)
  // ==========================================
  
  // Store 1: GearVN Official
  const gearStoreSlug = "gearvn-official";
  let gearStore = await prisma.store.findUnique({ where: { slug: gearStoreSlug } });

  if (!gearStore) {
    console.log("🏪 Đang tạo Store: GearVN Official...");
    gearStore = await prisma.store.create({
      data: {
        name: "GearVN Official",
        slug: gearStoreSlug,
        description: "Hệ thống bán lẻ Gear hàng đầu Việt Nam",
        ownerId: gearUser.id, // BẮT BUỘC: Link tới User
        isActive: true,
      }
    });
  }

  // Store 2: Con Meo Cute
  const catStoreSlug = "con-meo-cute";
  let catStore = await prisma.store.findUnique({ where: { slug: catStoreSlug } });

  if (!catStore) {
    console.log("🏪 Đang tạo Store: Con Meo Cute...");
    catStore = await prisma.store.create({
      data: {
        name: "Shop Con Mèo Cute",
        slug: catStoreSlug,
        description: "Chuyên đồ Gear màu hường và phụ kiện mèo",
        ownerId: catUser.id, // BẮT BUỘC: Link tới User
        isActive: true,
      }
    });
  }

  // Gom store vào mảng để dùng cho phần product
  const stores = [gearStore, catStore];

  // ==========================================
  // 3. SEED CATEGORIES
  // ==========================================
  // Kiểm tra xem categories đã tồn tại chưa
  const existingCategories = await prisma.category.count();
  const shouldSeedCategories = existingCategories === 0;

  const createCategory = async (
    name: string,
    slug: string,
    parentId: string | null = null,
    color: string | null = null
  ) => {
    if (!shouldSeedCategories) {
      return await prisma.category.findUnique({ where: { slug } });
    }
    return await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name, slug, parentId, color },
    });
  };

  if (shouldSeedCategories) {
      console.log("📦 Đang seed categories...");
      // --- COPY LẠI LOGIC TẠO CATEGORY TỪ PHẦN TRƯỚC ---
      // 1. LAPTOP
      const laptop = await createCategory("Laptop Gaming", "laptop", null, "#ef4444");
      await createCategory("Asus ROG/TUF", "laptop-asus", laptop?.id);
      await createCategory("MSI", "laptop-msi", laptop?.id);
      await createCategory("Acer Predator", "laptop-acer", laptop?.id);
      await createCategory("Lenovo Legion", "laptop-lenovo", laptop?.id);

      // 2. MÀN HÌNH
      const monitor = await createCategory("Màn hình", "man-hinh", null, "#facc15");
      await createCategory("LG", "monitor-lg", monitor?.id);
      await createCategory("Samsung", "monitor-samsung", monitor?.id);
      await createCategory("Asus", "monitor-asus", monitor?.id);
      await createCategory("Dell", "monitor-dell", monitor?.id);

      // 3. LINH KIỆN
      const cpu = await createCategory("Vi xử lý (CPU)", "cpu", null, "#0ea5e9");
      await createCategory("Intel", "cpu-intel", cpu?.id);
      await createCategory("AMD", "cpu-amd", cpu?.id);

      const vga = await createCategory("Card màn hình", "vga", null, "#10b981");
      await createCategory("Asus", "vga-asus", vga?.id);
      await createCategory("MSI", "vga-msi", vga?.id);
      await createCategory("Gigabyte", "vga-gigabyte", vga?.id);

      const ram = await createCategory("RAM", "ram", null, "#f59e0b");
      await createCategory("Corsair", "ram-corsair", ram?.id);
      await createCategory("Kingston", "ram-kingston", ram?.id);

      const storage = await createCategory("Ổ cứng SSD", "ssd", null, "#6366f1");
      await createCategory("Samsung", "ssd-samsung", storage?.id);

      // 4. GEAR
      const keyboard = await createCategory("Bàn phím cơ", "ban-phim", null, "#f43f5e");
      await createCategory("Akko", "kb-akko", keyboard?.id);
      await createCategory("Keychron", "kb-keychron", keyboard?.id);
      await createCategory("Logitech", "kb-logitech", keyboard?.id);

      const mouse = await createCategory("Chuột Gaming", "chuot", null, "#f97316");
      await createCategory("Logitech G", "mouse-logitech", mouse?.id);
      await createCategory("Razer", "mouse-razer", mouse?.id);

      const chair = await createCategory("Ghế (Chairs)", "ghe", null, "#84cc16");
      await createCategory("Secretlab", "chair-secretlab", chair?.id);
      await createCategory("Sihoo", "chair-sihoo", chair?.id);
  } else {
      console.log("✅ Categories đã có sẵn.");
  }

  // ==========================================
  // 4. CONFIG HÌNH ẢNH (Mapping)
  // ==========================================
  const PLACEHOLDER_IMG = [
      `https://placehold.co/800x800/png?text=Demo+Product+1`,
      `https://placehold.co/800x800/png?text=Demo+Product+2`,
  ];

  // (Bạn có thể giữ lại object imagesByCategory đầy đủ từ code cũ ở đây)
  // Để code gọn, tôi sẽ dùng placeholder logic đơn giản
  const getImagesForCategory = (slug: string) => {
      // Logic mapping ảnh thực tế ở đây...
      return PLACEHOLDER_IMG;
  };

  // ==========================================
  // 5. SEED PRODUCTS
  // ==========================================
  console.log("🎯 Bắt đầu seed products...");
  const allCategories = await prisma.category.findMany();

  // Danh sách sản phẩm mẫu (Giữ nguyên hoặc thêm bớt tùy ý)
  const products = [
    {
      name: "Asus ROG Strix G16 RTX 4060",
      slug: "asus-rog-g16-4060",
      description: 'Intel Core i7-13650HX, RTX 4060 8GB, 16GB RAM, 512GB SSD, 16" FHD 165Hz',
      price: 32990000,
      categorySlug: "laptop-asus",
      stock: 5,
    },
    {
      name: "LG UltraGear 27GN950 4K 144Hz",
      slug: "lg-27gn950",
      description: '27" IPS 4K UHD, 144Hz, 1ms, G-Sync, HDR600, USB-C PD 60W',
      price: 18990000,
      categorySlug: "monitor-lg",
      stock: 5,
    },
    {
      name: "Intel Core i9-13900K",
      slug: "i9-13900k",
      description: "24 Cores (8P+16E), 32 Threads, 5.8GHz Turbo, 36MB Cache, Socket 1700",
      price: 15990000,
      categorySlug: "cpu-intel",
      stock: 10,
    },
    {
      name: "Asus ROG Strix RTX 4090 OC",
      slug: "asus-rtx4090-oc",
      description: "24GB GDDR6X, 2640MHz Boost, 3x8-pin, 3.5 slot, Aura RGB",
      price: 59990000,
      categorySlug: "vga-asus",
      stock: 2,
    },
    {
      name: "Akko MOD007B HE Sakura",
      slug: "akko-mod007b-sakura",
      description: "Hall Effect Magnetic Switch, Gasket mount, PBT keycap, Hot-swap",
      price: 3490000,
      categorySlug: "kb-akko",
      stock: 12,
    },
    {
      name: "Secretlab Titan Evo 2022",
      slug: "secretlab-titan-evo",
      description: "NEO Hybrid Leatherette, 4D armrests, Magnetic head pillow",
      price: 12990000,
      categorySlug: "chair-secretlab",
      stock: 5,
    },
  ];

  // Seed sản phẩm thủ công
  for (const productData of products) {
    // Random chọn 1 trong 2 store đã tạo
    const randomStore = stores[Math.floor(Math.random() * stores.length)];
    const category = allCategories.find((c) => c.slug === productData.categorySlug);

    if (!category || !randomStore) continue;

    const comparePrice = productData.price * 1.1; // Float

    await prisma.product.upsert({
      where: {
        storeId_slug: { // Unique constraint theo schema mới
          storeId: randomStore.id,
          slug: productData.slug
        }
      },
      update: {},
      create: {
        name: productData.name,
        slug: productData.slug,
        description: productData.description,
        price: productData.price, // Float
        comparePrice: comparePrice, // Float?
        stock: productData.stock,
        images: getImagesForCategory(category.slug),
        isFeatured: Math.random() < 0.2,
        categoryId: category.id,
        storeId: randomStore.id,
      },
    });
    console.log(`  ✓ ${productData.name} -> ${randomStore.name}`);
  }

  // ==========================================
  // 6. SEED RANDOM PRODUCTS CHO "conmeocute"
  // ==========================================
  console.log("🎯 Seed thêm 20 sản phẩm cho Shop Con Mèo Cute...");
  
  const categorySlugs = ["kb-akko", "kb-keychron", "mouse-razer", "chair-sihoo", "laptop-asus"];
  
  for (let i = 1; i <= 20; i++) {
    const randomCategorySlug = categorySlugs[Math.floor(Math.random() * categorySlugs.length)];
    const category = allCategories.find((c) => c.slug === randomCategorySlug);
    
    if (!category) continue;

    const modelNum = Math.floor(Math.random() * 9000) + 1000;
    const pSlug = `random-p-${i}-${modelNum}`;

    await prisma.product.upsert({
      where: {
        storeId_slug: {
          storeId: catStore.id,
          slug: pSlug
        }
      },
      update: {},
      create: {
        name: `Sản phẩm Mèo ${i} - ${category.name}`,
        slug: pSlug,
        description: "Mô tả sản phẩm random...",
        price: 1500000,
        comparePrice: 2000000,
        stock: 50,
        images: PLACEHOLDER_IMG,
        categoryId: category.id,
        storeId: catStore.id,
      }
    });
  }

  console.log("✅ Seed dữ liệu hoàn tất!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Có lỗi xảy ra:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
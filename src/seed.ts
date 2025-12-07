// import { prisma } from "./server/db";

// async function main() {
//   console.log("🚀 Bắt đầu seed dữ liệu (Tách riêng Ghế & Bàn)...");

//   // Kiểm tra xem categories đã tồn tại chưa
//   const existingCategories = await prisma.category.count();
//   const shouldSeedCategories = existingCategories === 0;

//   if (!shouldSeedCategories) {
//     console.log("✅ Categories đã tồn tại, bỏ qua seed categories");
//   } else {
//     console.log("📦 Đang seed categories...");
//   }

//   const createCategory = async (
//     name: string,
//     slug: string,
//     parentId: string | null = null,
//     color: string | null = null
//   ) => {
//     if (!shouldSeedCategories) {
//       // Nếu không seed categories mới, trả về category có sẵn
//       return await prisma.category.findUnique({ where: { slug } });
//     }
//     return await prisma.category.create({
//       data: { name, slug, parentId, color },
//     });
//   };

//   // ==========================================
//   // 1. LAPTOP GAMING
//   // ==========================================
//   const laptop = await createCategory(
//     "Laptop Gaming",
//     "laptop",
//     null,
//     "#ef4444"
//   ); // Red
//   await createCategory("Asus ROG/TUF", "laptop-asus", laptop.id);
//   await createCategory("MSI", "laptop-msi", laptop.id);
//   await createCategory("Acer Predator", "laptop-acer", laptop.id);
//   await createCategory("Lenovo Legion", "laptop-lenovo", laptop.id);
//   await createCategory("Dell Alienware", "laptop-dell", laptop.id);
//   await createCategory("HP Omen", "laptop-hp", laptop.id);
//   await createCategory("Gigabyte Aorus", "laptop-gigabyte", laptop.id);

//   // ==========================================
//   // 2. MÀN HÌNH (DISPLAYS)
//   // ==========================================
//   const monitor = await createCategory("Màn hình", "man-hinh", null, "#facc15"); // Yellow
//   await createCategory("LG", "monitor-lg", monitor.id);
//   await createCategory("Samsung", "monitor-samsung", monitor.id);
//   await createCategory("Asus", "monitor-asus", monitor.id);
//   await createCategory("Dell", "monitor-dell", monitor.id);
//   await createCategory("ViewSonic", "monitor-viewsonic", monitor.id);
//   await createCategory("Gigabyte", "monitor-gigabyte", monitor.id);
//   await createCategory("MSI", "monitor-msi", monitor.id);
//   await createCategory("AOC", "monitor-aoc", monitor.id);
//   await createCategory("E-Dra", "monitor-edra", monitor.id); // Brand giá rẻ VN

//   // ==========================================
//   // 3. LINH KIỆN PC (CORE)
//   // ==========================================

//   // CPU
//   const cpu = await createCategory("Vi xử lý (CPU)", "cpu", null, "#0ea5e9");
//   await createCategory("Intel", "cpu-intel", cpu.id);
//   await createCategory("AMD", "cpu-amd", cpu.id);

//   // Mainboard
//   const mainboard = await createCategory(
//     "Bo mạch chủ",
//     "mainboard",
//     null,
//     "#3b82f6"
//   );
//   await createCategory("Asus", "mainboard-asus", mainboard.id);
//   await createCategory("MSI", "mainboard-msi", mainboard.id);
//   await createCategory("Gigabyte", "mainboard-gigabyte", mainboard.id);
//   await createCategory("ASRock", "mainboard-asrock", mainboard.id);
//   await createCategory("NZXT", "mainboard-nzxt", mainboard.id);

//   // VGA
//   const vga = await createCategory("Card màn hình", "vga", null, "#10b981");
//   await createCategory("Asus", "vga-asus", vga.id);
//   await createCategory("MSI", "vga-msi", vga.id);
//   await createCategory("Gigabyte", "vga-gigabyte", vga.id);
//   await createCategory("Colorful", "vga-colorful", vga.id);
//   await createCategory("Zotac", "vga-zotac", vga.id);
//   await createCategory("Galax", "vga-galax", vga.id);

//   // RAM
//   const ram = await createCategory("RAM", "ram", null, "#f59e0b");
//   await createCategory("Corsair", "ram-corsair", ram.id);
//   await createCategory("G.Skill", "ram-gskill", ram.id);
//   await createCategory("Kingston", "ram-kingston", ram.id);
//   await createCategory("Adata/XPG", "ram-adata", ram.id);
//   await createCategory("TeamGroup", "ram-teamgroup", ram.id);

//   // SSD
//   const storage = await createCategory("Ổ cứng SSD", "ssd", null, "#6366f1");
//   await createCategory("Samsung", "ssd-samsung", storage.id);
//   await createCategory("Western Digital", "ssd-wd", storage.id);
//   await createCategory("Kingston", "ssd-kingston", storage.id);
//   await createCategory("Crucial", "ssd-crucial", storage.id);

//   // Nguồn (PSU)
//   const psu = await createCategory("Nguồn (PSU)", "psu", null, "#8b5cf6");
//   await createCategory("Corsair", "psu-corsair", psu.id);
//   await createCategory("Cooler Master", "psu-coolermaster", psu.id);
//   await createCategory("Asus ROG", "psu-asus", psu.id);
//   await createCategory("MSI", "psu-msi", psu.id);
//   await createCategory("Super Flower", "psu-superflower", psu.id);
//   await createCategory("Deepcool", "psu-deepcool", psu.id);

//   // Case
//   const pcCase = await createCategory("Vỏ Case", "case", null, "#ec4899");
//   await createCategory("NZXT", "case-nzxt", pcCase.id);
//   await createCategory("Corsair", "case-corsair", pcCase.id);
//   await createCategory("Lian Li", "case-lianli", pcCase.id);
//   await createCategory("Mik", "case-mik", pcCase.id);
//   await createCategory("Montech", "case-montech", pcCase.id);
//   await createCategory("Hyte", "case-hyte", pcCase.id); // Case bể cá hot trend

//   // Tản nhiệt
//   const cooling = await createCategory("Tản nhiệt", "cooling", null, "#06b6d4");
//   await createCategory("Thermalright", "cool-thermalright", cooling.id);
//   await createCategory("Noctua", "cool-noctua", cooling.id);
//   await createCategory("Deepcool", "cool-deepcool", cooling.id);
//   await createCategory("Corsair AIO", "cool-corsair", cooling.id);
//   await createCategory("NZXT AIO", "cool-nzxt", cooling.id);
//   await createCategory("ID-Cooling", "cool-idcooling", cooling.id);

//   // ==========================================
//   // 4. GAMING GEAR
//   // ==========================================

//   // Bàn phím
//   const keyboard = await createCategory(
//     "Bàn phím cơ",
//     "ban-phim",
//     null,
//     "#f43f5e"
//   );
//   await createCategory("Akko", "kb-akko", keyboard.id);
//   await createCategory("Keychron", "kb-keychron", keyboard.id);
//   await createCategory("Logitech G", "kb-logitech", keyboard.id);
//   await createCategory("Razer", "kb-razer", keyboard.id);
//   await createCategory("Monsgeek", "kb-monsgeek", keyboard.id);
//   await createCategory("Glorious", "kb-glorious", keyboard.id);
//   await createCategory("FL-Esports", "kb-flesports", keyboard.id);
//   await createCategory("Aula", "kb-aula", keyboard.id); // Hot trend giá rẻ mới
//   await createCategory("Rainy75 (Wob)", "kb-rainy", keyboard.id); // Trend nhôm nguyên khối

//   // Chuột
//   const mouse = await createCategory("Chuột Gaming", "chuot", null, "#f97316");
//   await createCategory("Logitech G", "mouse-logitech", mouse.id);
//   await createCategory("Razer", "mouse-razer", mouse.id);
//   await createCategory("Zowie", "mouse-zowie", mouse.id);
//   await createCategory("Pulsar", "mouse-pulsar", mouse.id);
//   await createCategory("Lamzu", "mouse-lamzu", mouse.id);
//   await createCategory("Ninjutso", "mouse-ninjutso", mouse.id);
//   await createCategory("VXE / VGN", "mouse-vxe", mouse.id); // Dragonfly hot trend

//   // Tai nghe
//   const headset = await createCategory("Tai nghe", "headset", null, "#d946ef");
//   await createCategory("HyperX", "hs-hyperx", headset.id);
//   await createCategory("SteelSeries", "hs-steelseries", headset.id);
//   await createCategory("Logitech", "hs-logitech", headset.id);
//   await createCategory("Razer", "hs-razer", headset.id);
//   await createCategory("Corsair", "hs-corsair", headset.id);

//   // ==========================================
//   // 5. GHẾ (CHAIRS) - TÁCH RIÊNG
//   // ==========================================
//   const chair = await createCategory("Ghế (Chairs)", "ghe", null, "#84cc16"); // Lime

//   // High-end
//   await createCategory("Herman Miller", "chair-hermanmiller", chair.id);
//   await createCategory("Steelcase", "chair-steelcase", chair.id);

//   // Gaming Brand
//   await createCategory("Secretlab", "chair-secretlab", chair.id);
//   await createCategory("Anda Seat", "chair-andaseat", chair.id);
//   await createCategory("Noblechairs", "chair-noblechairs", chair.id);
//   await createCategory("Corsair", "chair-corsair", chair.id);
//   await createCategory("E-Dra", "chair-edra", chair.id); // Giá rẻ VN

//   // Ergonomic Brand phổ biến VN
//   await createCategory("Sihoo", "chair-sihoo", chair.id);
//   await createCategory("Epione", "chair-epione", chair.id);
//   await createCategory("Vchair", "chair-vchair", chair.id);

//   // ==========================================
//   // 6. BÀN (DESKS) - TÁCH RIÊNG
//   // ==========================================
//   const desk = await createCategory("Bàn (Desks)", "ban", null, "#a3e635"); // Lime-400

//   // Brand Bàn nâng hạ & Setup nổi tiếng ở VN
//   await createCategory("HyperWork", "desk-hyperwork", desk.id); // Rất hot
//   await createCategory("Epione", "desk-epione", desk.id);
//   await createCategory("Manson", "desk-manson", desk.id);
//   await createCategory("UpGen", "desk-upgen", desk.id);

//   // Bàn Gaming truyền thống
//   await createCategory("Bàn Gaming E-Dra", "desk-edra", desk.id);
//   await createCategory("Bàn Warrior", "desk-warrior", desk.id);
//   await createCategory("IKEA Setup", "desk-ikea", desk.id); // Kiểu bàn IKEA

//   // ==========================================
//   // 7. PHỤ KIỆN (ACCESSORIES)
//   // ==========================================
//   const accessory = await createCategory(
//     "Phụ kiện",
//     "phu-kien",
//     null,
//     "#64748b"
//   ); // Slate
//   await createCategory("Lót chuột (Mousepad)", "acc-mousepad", accessory.id);
//   await createCategory("Arm màn hình", "acc-arm", accessory.id); // Human Motion, HyperWork...
//   await createCategory("Dây cáp Custom", "acc-cable", accessory.id);
//   await createCategory("Keycap", "acc-keycap", accessory.id);
//   await createCategory("Switch", "acc-switch", accessory.id);
//   await createCategory("Webcam & Mic", "acc-stream", accessory.id);

//   console.log("✅ Đã tạo categories!");

//   // ==========================================
//   // SEED PRODUCTS (50 sản phẩm)
//   // ==========================================
//   console.log("🎯 Bắt đầu seed products...");

//   // Lấy tất cả stores và categories
//   const stores = await prisma.store.findMany();
//   const allCategories = await prisma.category.findMany();

//   if (stores.length === 0) {
//     console.log("⚠️ Không có store nào. Vui lòng tạo user/store trước!");
//     return;
//   }

//   // Sample product data
//   const products = [
//     // Laptop Gaming (10 products)
//     {
//       name: "Asus ROG Strix G16 RTX 4060",
//       slug: "asus-rog-g16-4060",
//       description:
//         'Intel Core i7-13650HX, RTX 4060 8GB, 16GB RAM, 512GB SSD, 16" FHD 165Hz',
//       price: 32990000,
//       categorySlug: "laptop-asus",
//       stock: 5,
//     },
//     {
//       name: "MSI Katana 15 RTX 4070",
//       slug: "msi-katana-4070",
//       description:
//         'Intel Core i7-13620H, RTX 4070 8GB, 32GB RAM, 1TB SSD, 15.6" FHD 144Hz',
//       price: 38990000,
//       categorySlug: "laptop-msi",
//       stock: 3,
//     },
//     {
//       name: "Acer Predator Helios Neo 16",
//       slug: "acer-helios-neo",
//       description:
//         "Intel Core i7-13700HX, RTX 4060 8GB, 16GB RAM, 512GB SSD, QHD 165Hz",
//       price: 35990000,
//       categorySlug: "laptop-acer",
//       stock: 4,
//     },
//     {
//       name: "Lenovo Legion 5 Pro RTX 4060",
//       slug: "lenovo-legion-5-pro",
//       description:
//         "AMD Ryzen 7 7745HX, RTX 4060 8GB, 16GB RAM, 512GB SSD, WQXGA 165Hz",
//       price: 33990000,
//       categorySlug: "laptop-lenovo",
//       stock: 6,
//     },
//     {
//       name: "Dell Alienware M15 R7",
//       slug: "dell-alienware-m15",
//       description:
//         "Intel Core i7-12700H, RTX 3070 Ti 8GB, 32GB RAM, 1TB SSD, FHD 360Hz",
//       price: 45990000,
//       categorySlug: "laptop-dell",
//       stock: 2,
//     },
//     {
//       name: "HP Omen 16 RTX 4060",
//       slug: "hp-omen-16-4060",
//       description:
//         "Intel Core i7-13700HX, RTX 4060 8GB, 16GB RAM, 512GB SSD, QHD 240Hz",
//       price: 36990000,
//       categorySlug: "laptop-hp",
//       stock: 5,
//     },
//     {
//       name: "Gigabyte Aorus 15 RTX 4070",
//       slug: "gigabyte-aorus-4070",
//       description:
//         "Intel Core i7-13700H, RTX 4070 8GB, 32GB RAM, 1TB SSD, FHD 360Hz",
//       price: 42990000,
//       categorySlug: "laptop-gigabyte",
//       stock: 3,
//     },
//     {
//       name: "Asus TUF Gaming A15 RTX 4050",
//       slug: "asus-tuf-a15",
//       description:
//         "AMD Ryzen 7 7735HS, RTX 4050 6GB, 16GB RAM, 512GB SSD, FHD 144Hz",
//       price: 26990000,
//       categorySlug: "laptop-asus",
//       stock: 8,
//     },
//     {
//       name: "MSI Cyborg 15 RTX 4050",
//       slug: "msi-cyborg-4050",
//       description:
//         "Intel Core i5-12450H, RTX 4050 6GB, 16GB RAM, 512GB SSD, FHD 144Hz",
//       price: 22990000,
//       categorySlug: "laptop-msi",
//       stock: 10,
//     },
//     {
//       name: "Acer Nitro 5 RTX 3050",
//       slug: "acer-nitro-3050",
//       description:
//         "Intel Core i5-12500H, RTX 3050 4GB, 8GB RAM, 512GB SSD, FHD 144Hz",
//       price: 19990000,
//       categorySlug: "laptop-acer",
//       stock: 12,
//     },

//     // Màn hình (8 products)
//     {
//       name: "LG UltraGear 27GN950 4K 144Hz",
//       slug: "lg-27gn950",
//       description: '27" IPS 4K UHD, 144Hz, 1ms, G-Sync, HDR600, USB-C PD 60W',
//       price: 18990000,
//       categorySlug: "monitor-lg",
//       stock: 5,
//     },
//     {
//       name: 'Samsung Odyssey G7 32" Cong',
//       slug: "samsung-g7-32",
//       description: '32" VA Cong 1000R, QHD 240Hz, 1ms, G-Sync, HDR600',
//       price: 14990000,
//       categorySlug: "monitor-samsung",
//       stock: 6,
//     },
//     {
//       name: 'Asus ROG Swift PG279QM 27"',
//       slug: "asus-pg279qm",
//       description: '27" IPS QHD, 240Hz, 1ms, G-Sync Ultimate, HDR400',
//       price: 16990000,
//       categorySlug: "monitor-asus",
//       stock: 4,
//     },
//     {
//       name: 'Dell S2721DGF 27" Gaming',
//       slug: "dell-s2721dgf",
//       description: '27" IPS QHD, 165Hz, 1ms, FreeSync Premium Pro, HDR400',
//       price: 9990000,
//       categorySlug: "monitor-dell",
//       stock: 8,
//     },
//     {
//       name: 'ViewSonic XG2431 24" 240Hz',
//       slug: "viewsonic-xg2431",
//       description:
//         '24" IPS FHD, 240Hz, 0.5ms, FreeSync Premium, Blur Busters Approved',
//       price: 7490000,
//       categorySlug: "monitor-viewsonic",
//       stock: 10,
//     },
//     {
//       name: 'Gigabyte M27Q X 27" SS IPS',
//       slug: "gigabyte-m27qx",
//       description: '27" SS IPS QHD, 240Hz, 0.5ms, KVM Switch, USB-C PD 15W',
//       price: 10990000,
//       categorySlug: "monitor-gigabyte",
//       stock: 7,
//     },
//     {
//       name: 'MSI MAG274QRF-QD 27" Rapid',
//       slug: "msi-mag274qrf",
//       description: '27" Rapid IPS QHD, 165Hz, 1ms, Quantum Dot, HDR400',
//       price: 8990000,
//       categorySlug: "monitor-msi",
//       stock: 9,
//     },
//     {
//       name: 'E-Dra EGM2401 24" 180Hz',
//       slug: "edra-egm2401",
//       description: '24" VA FHD, 180Hz, 1ms, FreeSync, Giá rẻ VN',
//       price: 2990000,
//       categorySlug: "monitor-edra",
//       stock: 15,
//     },

//     // CPU (4 products)
//     {
//       name: "Intel Core i9-13900K",
//       slug: "i9-13900k",
//       description:
//         "24 Cores (8P+16E), 32 Threads, 5.8GHz Turbo, 36MB Cache, Socket 1700",
//       price: 15990000,
//       categorySlug: "cpu-intel",
//       stock: 5,
//     },
//     {
//       name: "Intel Core i7-13700K",
//       slug: "i7-13700k",
//       description: "16 Cores (8P+8E), 24 Threads, 5.4GHz Turbo, 30MB Cache",
//       price: 11990000,
//       categorySlug: "cpu-intel",
//       stock: 8,
//     },
//     {
//       name: "AMD Ryzen 9 7950X",
//       slug: "r9-7950x",
//       description: "16 Cores, 32 Threads, 5.7GHz Boost, 80MB Cache, AM5",
//       price: 17990000,
//       categorySlug: "cpu-amd",
//       stock: 4,
//     },
//     {
//       name: "AMD Ryzen 7 7700X",
//       slug: "r7-7700x",
//       description: "8 Cores, 16 Threads, 5.4GHz Boost, 40MB Cache, AM5",
//       price: 9990000,
//       categorySlug: "cpu-amd",
//       stock: 10,
//     },

//     // VGA (6 products)
//     {
//       name: "Asus ROG Strix RTX 4090 OC",
//       slug: "asus-rtx4090-oc",
//       description: "24GB GDDR6X, 2640MHz Boost, 3x8-pin, 3.5 slot, Aura RGB",
//       price: 59990000,
//       categorySlug: "vga-asus",
//       stock: 2,
//     },
//     {
//       name: "MSI RTX 4070 Ti Gaming X Trio",
//       slug: "msi-4070ti-trio",
//       description: "12GB GDDR6X, 2640MHz Boost, Tri-Frozr 3, ARGB Mystic Light",
//       price: 27990000,
//       categorySlug: "vga-msi",
//       stock: 5,
//     },
//     {
//       name: "Gigabyte RTX 4060 Ti Aero OC",
//       slug: "gigabyte-4060ti-aero",
//       description: "16GB GDDR6, 2580MHz Boost, White Aesthetic, 2 slot",
//       price: 15990000,
//       categorySlug: "vga-gigabyte",
//       stock: 7,
//     },
//     {
//       name: "Colorful RTX 4060 NB DUO",
//       slug: "colorful-4060-duo",
//       description: "8GB GDDR6, 2460MHz Boost, Dual Fan, Giá tốt",
//       price: 9990000,
//       categorySlug: "vga-colorful",
//       stock: 12,
//     },
//     {
//       name: "Zotac RTX 4070 Twin Edge OC",
//       slug: "zotac-4070-twin",
//       description: "12GB GDDR6X, 2490MHz Boost, IceStorm 2.0 Cooling, 2 slot",
//       price: 19990000,
//       categorySlug: "vga-zotac",
//       stock: 6,
//     },
//     {
//       name: "Galax RTX 4060 Ti EX Gamer",
//       slug: "galax-4060ti-ex",
//       description: "8GB GDDR6, 2535MHz Boost, White LED, Xtreme Tuner+",
//       price: 12990000,
//       categorySlug: "vga-galax",
//       stock: 8,
//     },

//     // RAM (4 products)
//     {
//       name: "Corsair Vengeance RGB 32GB DDR5",
//       slug: "corsair-rgb-ddr5-32gb",
//       description: "32GB (2x16GB) DDR5-6000 CL30, RGB, Intel XMP 3.0, Black",
//       price: 4990000,
//       categorySlug: "ram-corsair",
//       stock: 15,
//     },
//     {
//       name: "G.Skill Trident Z5 64GB DDR5",
//       slug: "gskill-z5-64gb",
//       description: "64GB (2x32GB) DDR5-6400 CL32, RGB, Intel XMP 3.0",
//       price: 9990000,
//       categorySlug: "ram-gskill",
//       stock: 8,
//     },
//     {
//       name: "Kingston Fury Beast 32GB DDR4",
//       slug: "kingston-fury-32gb",
//       description: "32GB (2x16GB) DDR4-3600 CL17, No RGB, Intel XMP",
//       price: 2990000,
//       categorySlug: "ram-kingston",
//       stock: 20,
//     },
//     {
//       name: "TeamGroup T-Force Delta RGB 16GB",
//       slug: "teamgroup-delta-16gb",
//       description: "16GB (2x8GB) DDR4-3200 CL16, 120° Ultra-Wide RGB",
//       price: 1490000,
//       categorySlug: "ram-teamgroup",
//       stock: 25,
//     },

//     // SSD (4 products)
//     {
//       name: "Samsung 990 Pro 2TB PCIe 4.0",
//       slug: "samsung-990pro-2tb",
//       description: "2TB NVMe Gen4, 7450/6900 MB/s, TLC V-NAND, 5 năm BH",
//       price: 5990000,
//       categorySlug: "ssd-samsung",
//       stock: 10,
//     },
//     {
//       name: "WD Black SN850X 1TB Gen4",
//       slug: "wd-sn850x-1tb",
//       description: "1TB NVMe Gen4, 7300/6300 MB/s, Game Mode 2.0, Heatsink",
//       price: 3490000,
//       categorySlug: "ssd-wd",
//       stock: 15,
//     },
//     {
//       name: "Kingston KC3000 1TB PCIe 4.0",
//       slug: "kingston-kc3000-1tb",
//       description:
//         "1TB NVMe Gen4, 7000/6000 MB/s, TLC 3D NAND, Graphene heatspreader",
//       price: 2990000,
//       categorySlug: "ssd-kingston",
//       stock: 18,
//     },
//     {
//       name: "Crucial P3 Plus 500GB Gen4",
//       slug: "crucial-p3plus-500gb",
//       description: "500GB NVMe Gen4, 5000/3600 MB/s, QLC NAND, Giá rẻ",
//       price: 1490000,
//       categorySlug: "ssd-crucial",
//       stock: 30,
//     },

//     // Bàn phím (6 products)
//     {
//       name: "Akko MOD007B HE Sakura",
//       slug: "akko-mod007b-sakura",
//       description:
//         "Hall Effect Magnetic Switch, Gasket mount, PBT keycap, Hot-swap, Bluetooth/2.4GHz/USB-C",
//       price: 3490000,
//       categorySlug: "kb-akko",
//       stock: 12,
//     },
//     {
//       name: "Keychron Q1 Pro QMK/VIA",
//       slug: "keychron-q1-pro",
//       description: "Aluminum CNC 75%, Hot-swap, Gasket mount, RGB, Wireless",
//       price: 5490000,
//       categorySlug: "kb-keychron",
//       stock: 8,
//     },
//     {
//       name: "Logitech G Pro X TKL Lightspeed",
//       slug: "logitech-gpro-tkl",
//       description: "Wireless Gaming, GX Switch Hot-swap, LIGHTSYNC RGB, 1ms",
//       price: 4990000,
//       categorySlug: "kb-logitech",
//       stock: 10,
//     },
//     {
//       name: "Razer Huntsman V3 Pro TKL",
//       slug: "razer-huntsman-v3",
//       description: "Analog Optical Switch Gen-2, 8000Hz, Adjustable actuation",
//       price: 6990000,
//       categorySlug: "kb-razer",
//       stock: 6,
//     },
//     {
//       name: "FL-Esports MK870 TKL",
//       slug: "fl-mk870",
//       description: "Gasket mount, POM plate, Tri-mode, PBT Cherry profile",
//       price: 1990000,
//       categorySlug: "kb-flesports",
//       stock: 20,
//     },
//     {
//       name: "Rainy75 Aluminum Edition",
//       slug: "rainy75-alu",
//       description: "Nhôm nguyên khối, Gasket mount, Knob encoder, South-facing",
//       price: 2490000,
//       categorySlug: "kb-rainy",
//       stock: 15,
//     },

//     // Ghế (4 products)
//     {
//       name: "Secretlab Titan Evo 2022",
//       slug: "secretlab-titan-evo",
//       description:
//         "NEO Hybrid Leatherette, 4D armrests, Magnetic head pillow, 5 năm BH",
//       price: 12990000,
//       categorySlug: "chair-secretlab",
//       stock: 5,
//     },
//     {
//       name: "Herman Miller Aeron Remastered",
//       slug: "hermanmiller-aeron",
//       description:
//         "Size B, PostureFit SL, Graphite, 12 năm BH, Hàng chính hãng",
//       price: 45990000,
//       categorySlug: "chair-hermanmiller",
//       stock: 2,
//     },
//     {
//       name: "Sihoo M18 Ergonomic",
//       slug: "sihoo-m18",
//       description:
//         "Lưới thoáng khí, Tựa đầu 3D, Tựa lưng điều chỉnh 4 vùng, Giá tốt VN",
//       price: 4990000,
//       categorySlug: "chair-sihoo",
//       stock: 15,
//     },
//     {
//       name: "E-Dra Mars EGC203",
//       slug: "edra-mars-egc203",
//       description: "Da PU, Nâng hạ khí nén Class 4, Ngả 135°, Giá sinh viên",
//       price: 2490000,
//       categorySlug: "chair-edra",
//       stock: 25,
//     },
//   ];

//   console.log(`📦 Chuẩn bị tạo ${products.length} products...`);

//   for (const productData of products) {
//     // Random chọn 1 store
//     const randomStore = stores[Math.floor(Math.random() * stores.length)];

//     // Tìm category theo slug
//     const category = allCategories.find(
//       (c) => c.slug === productData.categorySlug
//     );

//     if (!category) {
//       console.log(`⚠️ Không tìm thấy category ${productData.categorySlug}`);
//       continue;
//     }

//     // Random isFeatured (20% chance)
//     const isFeatured = Math.random() < 0.2;

//     // Tạo comparePrice (10-20% cao hơn price)
//     const comparePrice = Math.floor(
//       productData.price * (1 + (Math.random() * 0.1 + 0.1))
//     );

//     // Sample images (dùng placeholder)
//     const images = [
//       `https://placehold.co/800x800/png?text=${encodeURIComponent(productData.name.substring(0, 30))}`,
//       `https://placehold.co/800x800/png?text=Image+2`,
//       `https://placehold.co/800x800/png?text=Image+3`,
//     ];

//     await prisma.product.create({
//       data: {
//         name: productData.name,
//         slug: productData.slug,
//         description: productData.description,
//         price: productData.price,
//         comparePrice,
//         stock: productData.stock,
//         images,
//         isFeatured,
//         isArchived: false,
//         categoryId: category.id,
//         storeId: randomStore.id,
//       },
//     });

//     console.log(`  ✓ ${productData.name}`);
//   }

//   console.log(`✅ Đã tạo ${products.length} products thành công!`);
//   console.log("✅ Seed dữ liệu hoàn tất!");
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error("❌ Có lỗi xảy ra:", e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });

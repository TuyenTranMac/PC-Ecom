import { prisma } from "./server/db";

async function main() {
  console.log('🚀 Bắt đầu seed dữ liệu (Tách riêng Ghế & Bàn)...');

  try {
    await prisma.category.deleteMany();
    console.log('🧹 Đã dọn dẹp database cũ.');
  } catch (error) {
    console.log('⚠️ Database mới, bỏ qua bước xóa.');
  }

  const createCategory = async (name: string, slug: string, parentId: string | null = null, color: string | null = null) => {
    return await prisma.category.create({
      data: { name, slug, parentId, color },
    });
  };

  // ==========================================
  // 1. LAPTOP GAMING
  // ==========================================
  const laptop = await createCategory('Laptop Gaming', 'laptop', null, '#ef4444'); // Red
  await createCategory('Asus ROG/TUF', 'laptop-asus', laptop.id);
  await createCategory('MSI', 'laptop-msi', laptop.id);
  await createCategory('Acer Predator', 'laptop-acer', laptop.id);
  await createCategory('Lenovo Legion', 'laptop-lenovo', laptop.id);
  await createCategory('Dell Alienware', 'laptop-dell', laptop.id);
  await createCategory('HP Omen', 'laptop-hp', laptop.id);
  await createCategory('Gigabyte Aorus', 'laptop-gigabyte', laptop.id);

  // ==========================================
  // 2. MÀN HÌNH (DISPLAYS)
  // ==========================================
  const monitor = await createCategory('Màn hình', 'man-hinh', null, '#facc15'); // Yellow
  await createCategory('LG', 'monitor-lg', monitor.id);
  await createCategory('Samsung', 'monitor-samsung', monitor.id);
  await createCategory('Asus', 'monitor-asus', monitor.id);
  await createCategory('Dell', 'monitor-dell', monitor.id);
  await createCategory('ViewSonic', 'monitor-viewsonic', monitor.id);
  await createCategory('Gigabyte', 'monitor-gigabyte', monitor.id);
  await createCategory('MSI', 'monitor-msi', monitor.id);
  await createCategory('AOC', 'monitor-aoc', monitor.id);
  await createCategory('E-Dra', 'monitor-edra', monitor.id); // Brand giá rẻ VN

  // ==========================================
  // 3. LINH KIỆN PC (CORE)
  // ==========================================
  
  // CPU
  const cpu = await createCategory('Vi xử lý (CPU)', 'cpu', null, '#0ea5e9');
  await createCategory('Intel', 'cpu-intel', cpu.id);
  await createCategory('AMD', 'cpu-amd', cpu.id);

  // Mainboard
  const mainboard = await createCategory('Bo mạch chủ', 'mainboard', null, '#3b82f6');
  await createCategory('Asus', 'mainboard-asus', mainboard.id);
  await createCategory('MSI', 'mainboard-msi', mainboard.id);
  await createCategory('Gigabyte', 'mainboard-gigabyte', mainboard.id);
  await createCategory('ASRock', 'mainboard-asrock', mainboard.id);
  await createCategory('NZXT', 'mainboard-nzxt', mainboard.id);

  // VGA
  const vga = await createCategory('Card màn hình', 'vga', null, '#10b981');
  await createCategory('Asus', 'vga-asus', vga.id);
  await createCategory('MSI', 'vga-msi', vga.id);
  await createCategory('Gigabyte', 'vga-gigabyte', vga.id);
  await createCategory('Colorful', 'vga-colorful', vga.id);
  await createCategory('Zotac', 'vga-zotac', vga.id);
  await createCategory('Galax', 'vga-galax', vga.id);

  // RAM
  const ram = await createCategory('RAM', 'ram', null, '#f59e0b');
  await createCategory('Corsair', 'ram-corsair', ram.id);
  await createCategory('G.Skill', 'ram-gskill', ram.id);
  await createCategory('Kingston', 'ram-kingston', ram.id);
  await createCategory('Adata/XPG', 'ram-adata', ram.id);
  await createCategory('TeamGroup', 'ram-teamgroup', ram.id);

  // SSD
  const storage = await createCategory('Ổ cứng SSD', 'ssd', null, '#6366f1');
  await createCategory('Samsung', 'ssd-samsung', storage.id);
  await createCategory('Western Digital', 'ssd-wd', storage.id);
  await createCategory('Kingston', 'ssd-kingston', storage.id);
  await createCategory('Crucial', 'ssd-crucial', storage.id);

  // Nguồn (PSU)
  const psu = await createCategory('Nguồn (PSU)', 'psu', null, '#8b5cf6');
  await createCategory('Corsair', 'psu-corsair', psu.id);
  await createCategory('Cooler Master', 'psu-coolermaster', psu.id);
  await createCategory('Asus ROG', 'psu-asus', psu.id);
  await createCategory('MSI', 'psu-msi', psu.id);
  await createCategory('Super Flower', 'psu-superflower', psu.id);
  await createCategory('Deepcool', 'psu-deepcool', psu.id);

  // Case
  const pcCase = await createCategory('Vỏ Case', 'case', null, '#ec4899');
  await createCategory('NZXT', 'case-nzxt', pcCase.id);
  await createCategory('Corsair', 'case-corsair', pcCase.id);
  await createCategory('Lian Li', 'case-lianli', pcCase.id);
  await createCategory('Mik', 'case-mik', pcCase.id);
  await createCategory('Montech', 'case-montech', pcCase.id);
  await createCategory('Hyte', 'case-hyte', pcCase.id); // Case bể cá hot trend

  // Tản nhiệt
  const cooling = await createCategory('Tản nhiệt', 'cooling', null, '#06b6d4');
  await createCategory('Thermalright', 'cool-thermalright', cooling.id);
  await createCategory('Noctua', 'cool-noctua', cooling.id);
  await createCategory('Deepcool', 'cool-deepcool', cooling.id);
  await createCategory('Corsair AIO', 'cool-corsair', cooling.id);
  await createCategory('NZXT AIO', 'cool-nzxt', cooling.id);
  await createCategory('ID-Cooling', 'cool-idcooling', cooling.id);

  // ==========================================
  // 4. GAMING GEAR
  // ==========================================
  
  // Bàn phím
  const keyboard = await createCategory('Bàn phím cơ', 'ban-phim', null, '#f43f5e');
  await createCategory('Akko', 'kb-akko', keyboard.id);
  await createCategory('Keychron', 'kb-keychron', keyboard.id);
  await createCategory('Logitech G', 'kb-logitech', keyboard.id);
  await createCategory('Razer', 'kb-razer', keyboard.id);
  await createCategory('Monsgeek', 'kb-monsgeek', keyboard.id);
  await createCategory('Glorious', 'kb-glorious', keyboard.id);
  await createCategory('FL-Esports', 'kb-flesports', keyboard.id);
  await createCategory('Aula', 'kb-aula', keyboard.id); // Hot trend giá rẻ mới
  await createCategory('Rainy75 (Wob)', 'kb-rainy', keyboard.id); // Trend nhôm nguyên khối

  // Chuột
  const mouse = await createCategory('Chuột Gaming', 'chuot', null, '#f97316');
  await createCategory('Logitech G', 'mouse-logitech', mouse.id);
  await createCategory('Razer', 'mouse-razer', mouse.id);
  await createCategory('Zowie', 'mouse-zowie', mouse.id);
  await createCategory('Pulsar', 'mouse-pulsar', mouse.id);
  await createCategory('Lamzu', 'mouse-lamzu', mouse.id);
  await createCategory('Ninjutso', 'mouse-ninjutso', mouse.id);
  await createCategory('VXE / VGN', 'mouse-vxe', mouse.id); // Dragonfly hot trend

  // Tai nghe
  const headset = await createCategory('Tai nghe', 'headset', null, '#d946ef');
  await createCategory('HyperX', 'hs-hyperx', headset.id);
  await createCategory('SteelSeries', 'hs-steelseries', headset.id);
  await createCategory('Logitech', 'hs-logitech', headset.id);
  await createCategory('Razer', 'hs-razer', headset.id);
  await createCategory('Corsair', 'hs-corsair', headset.id);

  // ==========================================
  // 5. GHẾ (CHAIRS) - TÁCH RIÊNG
  // ==========================================
  const chair = await createCategory('Ghế (Chairs)', 'ghe', null, '#84cc16'); // Lime
  
  // High-end
  await createCategory('Herman Miller', 'chair-hermanmiller', chair.id);
  await createCategory('Steelcase', 'chair-steelcase', chair.id);
  
  // Gaming Brand
  await createCategory('Secretlab', 'chair-secretlab', chair.id);
  await createCategory('Anda Seat', 'chair-andaseat', chair.id);
  await createCategory('Noblechairs', 'chair-noblechairs', chair.id);
  await createCategory('Corsair', 'chair-corsair', chair.id);
  await createCategory('E-Dra', 'chair-edra', chair.id); // Giá rẻ VN

  // Ergonomic Brand phổ biến VN
  await createCategory('Sihoo', 'chair-sihoo', chair.id);
  await createCategory('Epione', 'chair-epione', chair.id);
  await createCategory('Vchair', 'chair-vchair', chair.id);

  // ==========================================
  // 6. BÀN (DESKS) - TÁCH RIÊNG
  // ==========================================
  const desk = await createCategory('Bàn (Desks)', 'ban', null, '#a3e635'); // Lime-400
  
  // Brand Bàn nâng hạ & Setup nổi tiếng ở VN
  await createCategory('HyperWork', 'desk-hyperwork', desk.id); // Rất hot
  await createCategory('Epione', 'desk-epione', desk.id);
  await createCategory('Manson', 'desk-manson', desk.id);
  await createCategory('UpGen', 'desk-upgen', desk.id);
  
  // Bàn Gaming truyền thống
  await createCategory('Bàn Gaming E-Dra', 'desk-edra', desk.id);
  await createCategory('Bàn Warrior', 'desk-warrior', desk.id);
  await createCategory('IKEA Setup', 'desk-ikea', desk.id); // Kiểu bàn IKEA

  // ==========================================
  // 7. PHỤ KIỆN (ACCESSORIES)
  // ==========================================
  const accessory = await createCategory('Phụ kiện', 'phu-kien', null, '#64748b'); // Slate
  await createCategory('Lót chuột (Mousepad)', 'acc-mousepad', accessory.id);
  await createCategory('Arm màn hình', 'acc-arm', accessory.id); // Human Motion, HyperWork...
  await createCategory('Dây cáp Custom', 'acc-cable', accessory.id);
  await createCategory('Keycap', 'acc-keycap', accessory.id);
  await createCategory('Switch', 'acc-switch', accessory.id);
  await createCategory('Webcam & Mic', 'acc-stream', accessory.id);

  console.log('✅ Seed dữ liệu (Tách Ghế/Bàn) thành công!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Có lỗi xảy ra:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
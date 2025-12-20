import { prisma } from "./server/db";
import fs from "fs";
import path from "path";

async function main() {
  console.log("🚀 Đang export dữ liệu từ Category và Product...");

  // Lấy tất cả categories
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "asc" },
  });

  // Lấy tất cả products
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "asc" },
  });

  const data = {
    categories,
    products,
  };

  const filePath = path.join(process.cwd(), "export-data.json");
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

  console.log(`✅ Export hoàn thành! Đã lưu vào ${filePath}`);
  console.log(
    `📊 Tổng: ${categories.length} categories và ${products.length} products.`
  );
}

main()
  .catch((e) => {
    console.error("❌ Lỗi khi export:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

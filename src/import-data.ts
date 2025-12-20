import { prisma } from "./server/db";
import fs from "fs";
import path from "path";

async function main() {
  console.log("🚀 Đang import dữ liệu từ export-data.json...");

  const filePath = path.join(process.cwd(), "export-data.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  // Import categories trước (vì products cần categoryId)
  console.log("📦 Import categories...");
  for (const category of data.categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: category,
      create: category,
    });
  }

  // Import products
  console.log("📦 Import products...");
  for (const product of data.products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: product,
      create: product,
    });
  }

  console.log(
    `✅ Import hoàn thành! ${data.categories.length} categories và ${data.products.length} products.`
  );
}

main()
  .catch((e) => {
    console.error("❌ Lỗi khi import:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

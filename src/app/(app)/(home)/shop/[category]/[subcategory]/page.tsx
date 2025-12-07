import { api } from "@/server/server";
import { notFound } from "next/navigation";
// import { ProductCard } from "@/modules/home/ui/components/ProductCard";
import { ProductCard } from "@/modules/products/ui/ProductCard";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";

interface Props {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
}

const SubcategoryPage = async ({ params }: Props) => {
  const { category: categorySlug, subcategory: subcategorySlug } = await params;
  const caller = await api();
  const session = await getSession();
  const userId = session?.user?.id;

  // Lấy thông tin parent category và subcategory
  const [parentCategory, subcategory, userWishlist] = await Promise.all([
    caller.categories.getBySlug({ slug: categorySlug }),
    caller.categories.getBySlug({ slug: subcategorySlug }),
    userId ? caller.wishlist.getAll() : Promise.resolve([]),
  ]);

  if (!parentCategory || !subcategory) {
    notFound();
  }

  // Verify subcategory thuộc parent category
  if (subcategory.parentId !== parentCategory.id) {
    notFound();
  }

  // Lấy products thuộc subcategory này
  const { products } = await caller.product.getAllForMarketplace({
    limit: 50,
    categoryId: subcategory.id,
  });

  // Tạo Set các productId trong wishlist
  const wishlistProductIds = new Set(userWishlist.map((w) => w.productId));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Trang chủ
        </Link>
        <span>/</span>
        <Link href={`/shop/${categorySlug}`} className="hover:text-foreground">
          {parentCategory.name}
        </Link>
        <span>/</span>
        <span className="text-foreground">{subcategory.name}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">{subcategory.name}</h1>
        <p className="text-muted-foreground">
          {products.length} sản phẩm trong danh mục này
        </p>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center rounded-lg border bg-muted/30">
          <div className="text-center">
            <p className="text-muted-foreground text-lg">
              Chưa có sản phẩm nào trong danh mục này
            </p>
            <Link
              href={`/shop/${categorySlug}`}
              className="mt-4 inline-block text-sm text-primary hover:underline"
            >
              ← Quay lại {parentCategory.name}
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isInWishlist={wishlistProductIds.has(product.id)}
              isLoggedIn={!!userId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SubcategoryPage;

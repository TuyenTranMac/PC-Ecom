import { api } from "@/server/server";
import { notFound } from "next/navigation";
import { ProductCard } from "@/modules/products/ui/ProductCard";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";

interface Props {
  params: Promise<{
    category: string;
  }>;
}

const CategoryPage = async ({ params }: Props) => {
  const { category: categorySlug } = await params;
  const caller = await api();
  const session = await getSession();
  const userId = session?.user?.id;

  const [category, userWishlist] = await Promise.all([
    caller.categories.getBySlug({ slug: categorySlug }),
    userId ? caller.wishlist.getAll() : Promise.resolve([]),
  ]);

  if (!category) {
    notFound();
  }

  // Lấy tất cả IDs của category và children để filter products
  const categoryIds = [
    category.id,
    ...category.other_Category.map((c) => c.id),
  ];

  // Lấy products thuộc category này hoặc children của nó
  const { products } = await caller.product.getAllForMarketplace({
    limit: 50,
    categoryId: category.id, // Chỉ lấy của parent category
  });

  // Lấy products của tất cả subcategories
  const childProductsPromises = category.other_Category.map((child) =>
    caller.product.getAllForMarketplace({
      limit: 50,
      categoryId: child.id,
    })
  );

  const childProductsResults = await Promise.all(childProductsPromises);
  const allProducts = [
    ...products,
    ...childProductsResults.flatMap((result) => result.products),
  ];

  const wishlistProductIds = new Set(userWishlist.map((w) => w.productId));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      {/* Subcategories Navigation */}
      {category.other_Category.length > 0 && (
        <div className="mb-8 rounded-lg border bg-card p-4">
          <div className="flex flex-wrap gap-2">
            {category.other_Category.map((child) => (
              <Link
                key={child.id}
                href={`/shop/${categorySlug}/${child.slug}`}
                className="rounded-full border bg-background px-4 py-2 text-sm transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                {child.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      {allProducts.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center rounded-lg border bg-muted/30">
          <div className="text-center">
            <p className="text-muted-foreground text-lg">
              Chưa có sản phẩm nào trong danh mục này
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {allProducts.map((product) => (
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

export default CategoryPage;

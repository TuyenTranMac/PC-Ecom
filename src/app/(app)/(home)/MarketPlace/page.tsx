import { api } from "@/server/server";
import { ProductCard } from "@/modules/products/ui/ProductCard";
import { getSession } from "@/lib/auth/session";

const MarketplacePage = async () => {
  const caller = await api();
  const session = await getSession();
  const userId = session?.user?.id;

  const [{ products }, userWishlist] = await Promise.all([
    caller.product.getAllForMarketplace({ limit: 24 }),
    userId ? caller.wishlist.getAll() : Promise.resolve([]),
  ]);

  const wishlistProductIds = new Set(userWishlist.map((w) => w.productId));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Marketplace</h1>
        <p className="text-muted-foreground">
          Khám phá tất cả sản phẩm từ các vendor
        </p>
      </div>

      {/* Filters Section - TODO: Thêm sau */}
      <div className="mb-6 flex items-center justify-between rounded-lg border bg-card p-4">
        <p className="text-muted-foreground text-sm">
          Hiển thị {products.length} sản phẩm
        </p>
        {/* TODO: Thêm filter/sort sau */}
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center rounded-lg border bg-muted/30">
          <div className="text-center">
            <p className="text-muted-foreground text-lg">
              Chưa có sản phẩm nào trong marketplace
            </p>
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

export default MarketplacePage;

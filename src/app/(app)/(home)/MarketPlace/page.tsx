import { api } from "@/server/server";
import { getSession } from "@/lib/auth/session";
import { MarketplaceProducts } from "@/modules/products/ui/MarketplaceProducts";

const MarketplacePage = async () => {
  const caller = await api();
  const session = await getSession();
  const userId = session?.user?.id;

  const [{ products, nextCursor }, userWishlist, totalCount] =
    await Promise.all([
      caller.product.getAllForMarketplace({ limit: 72 }), // Fetch 72 sản phẩm (24*3) ban đầu
      userId ? caller.wishlist.getAll() : Promise.resolve([]),
      caller.product.getTotalCount({}), // Lấy tổng số sản phẩm
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

      {/* Filters Section */}
      <div className="mb-6 flex items-center justify-between rounded-lg border bg-card p-4">
        <p className="text-muted-foreground text-sm">
          Tổng cộng {totalCount} sản phẩm
        </p>
        {/* TODO: Thêm filter/sort sau */}
      </div>

      <MarketplaceProducts
        initialProducts={products}
        initialCursor={nextCursor}
        totalCount={totalCount}
        wishlistProductIds={wishlistProductIds}
        isLoggedIn={!!userId}
      />
    </div>
  );
};

export default MarketplacePage;

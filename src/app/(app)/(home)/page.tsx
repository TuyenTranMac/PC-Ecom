import { api } from "@/server/server";
import { FeaturedSlider } from "@/modules/products/ui/FeaturedSlider";
import { ProductCard } from "@/modules/products/ui/ProductCard";
import { getSession } from "@/lib/auth/session";

const HomePage = async () => {
  const caller = await api();
  const session = await getSession();
  const userId = session?.user?.id;
  console.log(session?.user.role);
  // Lấy song song featured, latest products, và wishlist nếu đã login
  const [featuredProducts, latestProducts, userWishlist] = await Promise.all([
    caller.product.getFeatured({ limit: 10 }),
    caller.product.getLatest({ limit: 12 }),
    userId ? caller.wishlist.getAll() : Promise.resolve([]),
  ]);

  // Tạo Set các productId trong wishlist để lookup nhanh
  const wishlistProductIds = new Set(userWishlist.map((w) => w.productId));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="mb-2 text-4xl font-bold">
          Chào mừng đến Gear Marketplace
        </h1>
        <p className="text-muted-foreground text-lg">
          Khám phá hàng nghìn sản phẩm từ các vendor uy tín
        </p>
      </div>

      {/* Featured Products Slider */}
      {featuredProducts.length > 0 && (
        <section className="mb-16">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Sản phẩm nổi bật</h2>
              <p className="text-muted-foreground text-sm">
                Những sản phẩm được yêu thích nhất
              </p>
            </div>
          </div>
          <FeaturedSlider
            products={featuredProducts}
            wishlistProductIds={wishlistProductIds}
            isLoggedIn={!!userId}
          />
        </section>
      )}

      {/* Latest Products Grid */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Sản phẩm mới</h2>
          <p className="text-muted-foreground text-sm">
            Vừa được đăng bởi các vendor
          </p>
        </div>

        {latestProducts.length === 0 ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-lg border bg-muted/30">
            <div className="text-center">
              <p className="text-muted-foreground text-lg">
                Chưa có sản phẩm nào
              </p>
              <p className="text-muted-foreground text-sm">
                Hãy quay lại sau nhé!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {latestProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isInWishlist={wishlistProductIds.has(product.id)}
                isLoggedIn={!!userId}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;

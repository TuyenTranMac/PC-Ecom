import { api } from "@/server/server";
import { ProductCard } from "@/modules/products/ui/ProductCard";
import { getSession } from "@/lib/auth/session";

type Props = {
  searchParams: Promise<{ q?: string; category?: string }>;
};

const SearchPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const query = params.q || "";
  const categoryId = params.category;

  const caller = await api();
  const session = await getSession();
  const userId = session?.user?.id;
  // Nếu không có query thì return empty
  if (!query) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Tìm kiếm sản phẩm</h1>
        <div className="flex min-h-[400px] items-center justify-center rounded-lg border bg-muted/30">
          <div className="text-center">
            <p className="text-muted-foreground text-lg">
              Nhập từ khóa để tìm kiếm
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Fetch search results
  const products = await caller.product.search({
    query,
    categoryId,
    limit: 20,
  });

  // Fetch wishlist data nếu đã đăng nhập
  const userWishlist = userId ? await caller.wishlist.getAll() : [];
  const wishlistProductIds = new Set(userWishlist.map((w) => w.productId));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Kết quả tìm kiếm cho &quot;{query}&quot;
        </h1>
        <p className="text-muted-foreground text-sm">
          Tìm thấy {products.length} sản phẩm
        </p>
      </div>

      {products.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center rounded-lg border bg-muted/30">
          <div className="text-center">
            <p className="text-muted-foreground text-lg">
              Không tìm thấy sản phẩm nào
            </p>
            <p className="text-muted-foreground text-sm">
              Thử tìm kiếm với từ khóa khác
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

export default SearchPage;

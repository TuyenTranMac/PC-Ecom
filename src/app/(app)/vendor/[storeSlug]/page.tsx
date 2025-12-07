import { notFound } from "next/navigation";
import { api } from "@/server/server";
import { auth } from "@/lib/auth/auth";

/**
 * Public Storefront - Trang chủ của Shop Vendor
 * Route: {vendor}.gear.org hoặc {vendor}.localhost:3000
 */

interface Props {
  params: Promise<{ storeSlug: string }>;
}

const VendorStorefrontPage = async ({ params }: Props) => {
  const { storeSlug } = await params;
  const caller = await api();
  const session = await auth();

  try {
    // Lấy thông tin store theo slug (username)
    const store = await caller.store.getStoreBySlug({ slug: storeSlug });

    if (!store) {
      notFound();
    }

    // Check xem user hiện tại có phải chủ shop không
    const isOwner =
      session?.user.username?.toLowerCase() === storeSlug.toLowerCase();

    // Lấy danh sách sản phẩm public của store này
    const products = await caller.product.getProductsByStore({
      storeId: store.id,
    });

    return (
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Bar */}
        <div className="mb-6 flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm">
          <a
            href="/"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Về trang chủ Gear
          </a>
          {isOwner && (
            <a
              href={`/vendor/${storeSlug}/dashboard`}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              Quản lý Dashboard
            </a>
          )}
        </div>

        {/* Header Store */}
        <div className="mb-8 border-b pb-6">
          <h1 className="text-3xl font-bold">{store.name}</h1>
          {store.description && (
            <p className="text-muted-foreground mt-2">{store.description}</p>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.length === 0 ? (
            <div className="col-span-full py-12 text-center">
              <p className="text-muted-foreground">
                Cửa hàng chưa có sản phẩm nào
              </p>
            </div>
          ) : (
            products.map((product) => {
              // Type assertion: Prisma Json type -> string[]
              const images = (product.images as string[]) || [];

              return (
                <div
                  key={product.id}
                  className="group overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* Product Image */}
                  {images[0] && (
                    <div className="aspect-square overflow-hidden bg-muted">
                      <img
                        src={images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="line-clamp-1 font-semibold">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                        {product.description}
                      </p>
                    )}
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        {product.price.toLocaleString("vi-VN")}₫
                      </span>
                      <span className="text-muted-foreground text-xs">
                        Kho: {product.stock}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  } catch (error: any) {
    console.error("Error loading storefront:", error);
    notFound();
  }
};

export default VendorStorefrontPage;

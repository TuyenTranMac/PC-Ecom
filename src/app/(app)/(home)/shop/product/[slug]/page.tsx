import { api } from "@/server/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PackageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductActions } from "@/modules/products/ui/ProductActions";
import { WishlistButton } from "@/modules/products/ui/WishlistButton";
import { getSession } from "@/lib/auth/session";

type Props = {
  params: Promise<{ slug: string }>;
};

const ProductDetailPage = async ({ params }: Props) => {
  const { slug } = await params;
  const caller = await api();
  const session = await getSession();
  const userId = session?.user.id;
  const product = await caller.product.getByProductSlug({ slug });

  if (!product) notFound();

  // Check wishlist status
  let isInWishlist = false;
  if (userId) {
    try {
      const wishlistStatus = await caller.wishlist.check({
        productId: product.id,
      });
      isInWishlist = wishlistStatus.isInWishlist;
    } catch (e) {
      // User not logged in or error
    }
  }

  const images = (product.images as string[]) || [];
  const hasDiscount =
    product.comparePrice && product.comparePrice > product.price;
  const discountPercent =
    hasDiscount && product.comparePrice
      ? Math.round(
          ((product.comparePrice - product.price) / product.comparePrice) * 100
        )
      : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Trang chủ
        </Link>
        {" / "}
        <Link
          href={`/shop/${product.category.slug}`}
          className="hover:text-foreground"
        >
          {product.category.name}
        </Link>
        {" / "}
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
            {images.length > 0 ? (
              <Image
                src={images[0]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <PackageIcon className="h-24 w-24 text-muted-foreground" />
              </div>
            )}
            {hasDiscount && (
              <Badge className="absolute right-4 top-4 bg-red-500">
                -{discountPercent}%
              </Badge>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.slice(1, 5).map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square overflow-hidden rounded border"
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${idx + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="outline">{product.category.name}</Badge>
              <Link
                href={`/vendor/${product.store.slug}`}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Bởi {product.store.name}
              </Link>
            </div>
          </div>

          <Separator />

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary">
                {product.price.toLocaleString("vi-VN")}₫
              </span>
              {hasDiscount && (
                <span className="text-xl text-muted-foreground line-through">
                  {product.comparePrice?.toLocaleString("vi-VN")}₫
                </span>
              )}
            </div>
            {product.stock > 0 ? (
              <p className="text-sm text-green-600">
                Còn {product.stock} sản phẩm
              </p>
            ) : (
              <p className="text-sm text-red-600">Hết hàng</p>
            )}
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="mb-2 font-semibold">Mô tả sản phẩm</h3>
            <p className="whitespace-pre-line text-sm text-muted-foreground">
              {product.description || "Không có mô tả"}
            </p>
          </div>

          <Separator />

          {/* Actions */}
          <ProductActions product={product} />

          <Separator />

          {/* Wishlist */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {product.wishlistCount > 0 && (
                <span>{product.wishlistCount} người đã thích sản phẩm này</span>
              )}
            </div>
            {userId && (
              <WishlistButton
                productId={product.id}
                initialCount={product.wishlistCount}
                isInWishlist={isInWishlist}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

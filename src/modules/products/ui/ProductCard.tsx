"use client";

import Link from "next/link";
import { HeartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTRPC } from "@/app/(app)/trpcHelper/useTRPC";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  images: any;
  wishlistCount: number;
  Store: {
    id: string;
    name: string;
    slug: string;
  };
  Category: {
    name: string;
    slug: string;
  };
}

interface Props {
  product: Product;
  isInWishlist: boolean;
  isLoggedIn: boolean;
}

export const ProductCard = ({
  product,
  isInWishlist: initialIsInWishlist,
  isLoggedIn,
}: Props) => {
  const images = (product.images as string[]) || [];
  const firstImage = images[0];
  const router = useRouter();
  const { toast } = useToast();
  const trpc = useTRPC();

  const [wishlistCount, setWishlistCount] = useState(product.wishlistCount);
  const [isInWishlist, setIsInWishlist] = useState(initialIsInWishlist);

  const toggleMutation = useMutation(
    trpc.wishlist.toggle.mutationOptions({
      onSuccess: (data) => {
        setIsInWishlist(data.added);
        setWishlistCount((prev) => (data.added ? prev + 1 : prev - 1));
        toast({
          title: data.added ? "Đã thêm vào yêu thích" : "Đã xóa",
          description: product.name,
        });
        router.refresh();
      },
      onError: () => {
        toast({
          title: "Có lỗi xảy ra",
          description: "Vui lòng thử lại",
          variant: "destructive",
        });
      },
    })
  );

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("🔍 isLoggedIn:", isLoggedIn);

    if (!isLoggedIn) {
      console.log("❌ Not logged in, showing toast only");
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để thêm vào yêu thích",
        variant: "destructive",
      });
      // Không redirect nữa, chỉ hiện toast
      return;
    }

    console.log("✅ Logged in, mutating");
    toggleMutation.mutate({ productId: product.id });
  };

  return (
    <Link
      href={`/shop/product/${product.slug}`}
      className="group relative block overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Wishlist Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
        onClick={handleWishlistClick}
        disabled={toggleMutation.isPending}
      >
        <HeartIcon
          className={`h-4 w-4 transition-colors ${
            isInWishlist ? "fill-red-500 text-red-500" : "text-muted-foreground"
          }`}
        />
      </Button>

      {/* Product Image */}
      <div className="aspect-square overflow-hidden bg-muted">
        {firstImage ? (
          <img
            src={firstImage}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 font-semibold">{product.name}</h3>
          <span className="text-xs text-muted-foreground shrink-0">
            {product.Category.name}
          </span>
        </div>

        {product.description && (
          <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-lg font-bold text-primary">
              {product.price.toLocaleString("vi-VN")}₫
            </span>
            <span className="text-xs text-muted-foreground">
              bởi {product.Store.name}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-muted-foreground text-xs">
              Kho: {product.stock}
            </span>
            {wishlistCount > 0 && (
              <span className="text-xs text-red-500">❤️ {wishlistCount}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

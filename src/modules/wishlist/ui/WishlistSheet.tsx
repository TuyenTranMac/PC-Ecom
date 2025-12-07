"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { HeartIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useTRPC } from "@/app/(app)/trpcHelper/useTRPC";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: any;
    stock: number;
    store: {
      name: string;
      slug: string;
    };
  };
}

export const WishlistSheet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const trpc = useTRPC();
  const router = useRouter();

  const { data: wishlist = [], refetch } = useQuery(
    trpc.wishlist.getAll.queryOptions()
  );

  const removeMutation = useMutation(
    trpc.wishlist.remove.mutationOptions({
      onSuccess: () => {
        refetch();
        toast({
          title: "Đã xóa khỏi yêu thích",
        });
        router.refresh();
      },
      onError: () => {
        toast({
          title: "Có lỗi xảy ra",
          variant: "destructive",
        });
      },
    })
  );

  const handleRemove = (productId: string) => {
    removeMutation.mutate({ productId });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <HeartIcon className="h-5 w-5" />
          {wishlist.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {wishlist.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Yêu thích ({wishlist.length})</SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-4">
          {wishlist.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
              <HeartIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">
                Chưa có sản phẩm yêu thích
              </p>
              <p className="text-muted-foreground text-sm">
                Thêm sản phẩm để xem sau
              </p>
            </div>
          ) : (
            <>
              <div className="flex-1 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
                {wishlist.map((item) => {
                  const images = (item.product.images as string[]) || [];
                  const firstImage = images[0];

                  return (
                    <div
                      key={item.id}
                      className="flex gap-3 rounded-lg border p-3"
                    >
                      <Link
                        href={`/shop/product/${item.product.slug}`}
                        className="relative h-20 w-20 shrink-0 overflow-hidden rounded"
                        onClick={() => setIsOpen(false)}
                      >
                        {firstImage ? (
                          <Image
                            src={firstImage}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-muted">
                            <HeartIcon className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </Link>
                      <div className="flex flex-1 flex-col gap-2">
                        <Link
                          href={`/shop/product/${item.product.slug}`}
                          className="text-sm font-semibold hover:underline line-clamp-2"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.product.name}
                        </Link>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-bold text-primary">
                              {item.product.price.toLocaleString("vi-VN")}₫
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {item.product.store.name}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleRemove(item.productId)}
                            disabled={removeMutation.isPending}
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </Button>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Kho: {item.product.stock}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button
                variant="outline"
                className="w-full"
                asChild
                onClick={() => setIsOpen(false)}
              >
                <Link href="/wishlist">Xem tất cả</Link>
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

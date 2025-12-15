"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCartIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

export const CartSheet = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const loadCart = () => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        setCartItems(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse cart:", e);
        setCartItems([]);
      }
    }
  };

  useEffect(() => {
    loadCart();

    const handleCartUpdate = () => loadCart();
    window.addEventListener("cart-updated", handleCartUpdate);
    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, []);

  const removeItem = (productId: string) => {
    const newCart = cartItems.filter((item) => item.id !== productId);
    localStorage.setItem("cart", JSON.stringify(newCart));
    setCartItems(newCart);
    window.dispatchEvent(new Event("cart-updated"));
    toast({
      title: "Đã xóa khỏi giỏ hàng",
    });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    const item = cartItems.find((i) => i.id === productId);
    if (!item) return;

    if (newQuantity > item.stock) {
      toast({
        title: "Vượt quá số lượng trong kho",
        variant: "destructive",
      });
      return;
    }

    if (newQuantity < 1) {
      removeItem(productId);
      return;
    }

    const newCart = cartItems.map((i) =>
      i.id === productId ? { ...i, quantity: newQuantity } : i
    );
    localStorage.setItem("cart", JSON.stringify(newCart));
    setCartItems(newCart);
    window.dispatchEvent(new Event("cart-updated"));
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCartIcon className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Giỏ hàng ({totalItems})</SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-4">
          {cartItems.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
              <ShoppingCartIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">Giỏ hàng trống</p>
              <p className="text-muted-foreground text-sm">
                Thêm sản phẩm để bắt đầu mua sắm
              </p>
            </div>
          ) : (
            <>
              <div className="flex-1 space-y-4 overflow-y-auto max-h-[calc(100vh-250px)]">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 rounded-lg border p-3"
                  >
                    <Link
                      href={`/shop/product/${item.slug}`}
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded"
                      onClick={() => setIsOpen(false)}
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col gap-2">
                      <Link
                        href={`/shop/product/${item.slug}`}
                        className="text-sm font-semibold hover:underline line-clamp-2"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-primary">
                          {item.price.toLocaleString("vi-VN")}₫
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            -
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Tổng cộng:</span>
                  <span className="text-primary">
                    {totalPrice.toLocaleString("vi-VN")}₫
                  </span>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  asChild
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/checkout">Thanh toán</Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  asChild
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/cart">Xem giỏ hàng</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};


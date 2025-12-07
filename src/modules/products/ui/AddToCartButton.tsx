"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCartIcon } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: unknown;
  stock: number;
};

type Props = {
  product: Product;
};

type CartItem = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
};

export const AddToCartButton = ({ product }: Props) => {
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const addToCart = () => {
    setIsAdding(true);

    // Lấy cart từ localStorage
    const cartStr = localStorage.getItem("cart");
    const cart: CartItem[] = cartStr ? JSON.parse(cartStr) : [];

    // Check stock
    if (product.stock <= 0) {
      toast({
        title: "Hết hàng",
        description: "Sản phẩm này hiện đang hết hàng",
        variant: "destructive",
      });
      setIsAdding(false);
      return;
    }

    // Check nếu đã có trong cart
    const existingIndex = cart.findIndex((item) => item.id === product.id);

    if (existingIndex >= 0) {
      // Tăng quantity
      const currentQty = cart[existingIndex].quantity;
      if (currentQty >= product.stock) {
        toast({
          title: "Không thể thêm",
          description: `Chỉ còn ${product.stock} sản phẩm`,
          variant: "destructive",
        });
        setIsAdding(false);
        return;
      }
      cart[existingIndex].quantity += 1;
    } else {
      // Thêm mới
      const images = (product.images as string[]) || [];
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: images[0] || "",
        quantity: 1,
        stock: product.stock,
      };
      cart.push(newItem);
    }

    // Save lại localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    toast({
      title: "Đã thêm vào giỏ hàng",
      description: `${product.name} x1`,
    });

    setIsAdding(false);

    // Trigger custom event để update cart count ở header
    window.dispatchEvent(new Event("cart-updated"));
  };

  return (
    <Button
      className="flex-1"
      size="lg"
      variant="outline"
      onClick={addToCart}
      disabled={isAdding || product.stock <= 0}
    >
      <ShoppingCartIcon className="mr-2 h-5 w-5" />
      {product.stock > 0 ? "Thêm vào giỏ" : "Hết hàng"}
    </Button>
  );
};

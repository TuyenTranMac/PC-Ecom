"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCartIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  images: any;
}

interface Props {
  product: Product;
}

export const ProductActions = ({ product }: Props) => {
  const { toast } = useToast();

  const addToCart = () => {
    const images = (product.images as string[]) || [];
    const firstImage = images[0] || "";

    const cartItem = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: firstImage,
      quantity: 1,
      stock: product.stock,
    };

    // Lấy cart hiện tại
    const stored = localStorage.getItem("cart");
    const cart = stored ? JSON.parse(stored) : [];

    // Check xem đã có trong cart chưa
    const existingIndex = cart.findIndex((item: any) => item.id === product.id);

    if (existingIndex > -1) {
      // Tăng số lượng
      const newQuantity = cart[existingIndex].quantity + 1;
      if (newQuantity > product.stock) {
        toast({
          title: "Vượt quá số lượng trong kho",
          description: `Chỉ còn ${product.stock} sản phẩm`,
          variant: "destructive",
        });
        return;
      }
      cart[existingIndex].quantity = newQuantity;
    } else {
      // Thêm mới
      cart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));

    toast({
      title: "Đã thêm vào giỏ hàng",
      description: product.name,
    });
  };

  const buyNow = () => {
    addToCart();
    // TODO: Navigate to checkout page
    toast({
      title: "Chức năng đang phát triển",
      description: "Sẽ chuyển đến trang thanh toán",
    });
  };

  return (
    <div className="space-y-3">
      <Button
        className="w-full"
        size="lg"
        variant="outline"
        disabled={product.stock <= 0}
        onClick={addToCart}
      >
        <ShoppingCartIcon className="mr-2 h-5 w-5" />
        {product.stock > 0 ? "Thêm vào giỏ" : "Hết hàng"}
      </Button>
      <Button
        className="w-full"
        size="lg"
        variant="default"
        disabled={product.stock <= 0}
        onClick={buyNow}
      >
        <ShoppingCartIcon className="mr-2 h-5 w-5" />
        Mua ngay
      </Button>
    </div>
  );
};

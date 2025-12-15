"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCartIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  images: any;
  storeId?: string;
  Store?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Props {
  product: Product;
}

export const ProductActions = ({ product }: Props) => {
  const { toast } = useToast();
  const router = useRouter();

  const addToCart = () => {
    if (product.stock <= 0) {
      toast({
        title: "Hết hàng",
        description: "Sản phẩm này hiện không còn hàng",
        variant: "destructive",
      });
      return;
    }

    // Debug: Check product structure
    console.log("Product data:", {
      id: product.id,
      storeId: product.storeId,
      Store: product.Store,
    });

    if (!product.storeId && !product.Store?.id) {
      toast({
        title: "Lỗi",
        description: "Sản phẩm thiếu thông tin cửa hàng",
        variant: "destructive",
      });
      console.error("Missing store info:", product);
      return;
    }

    try {
      // Lấy cart hiện tại từ localStorage
      const stored = localStorage.getItem("cart");
      const currentCart = stored ? JSON.parse(stored) : [];

      // Kiểm tra sản phẩm đã có trong cart chưa
      const existingIndex = currentCart.findIndex(
        (item: any) => item.id === product.id
      );

      if (existingIndex >= 0) {
        // Tăng quantity
        const newQuantity = currentCart[existingIndex].quantity + 1;
        if (newQuantity > product.stock) {
          toast({
            title: "Không đủ hàng",
            description: `Chỉ còn ${product.stock} sản phẩm trong kho`,
            variant: "destructive",
          });
          return;
        }
        currentCart[existingIndex].quantity = newQuantity;
      } else {
        // Thêm mới
        const cartItem = {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          image:
            product.images && Array.isArray(product.images)
              ? (product.images[0] as string)
              : null,
          quantity: 1,
          stock: product.stock,
          storeId: product.storeId || product.Store?.id,
          storeName: product.Store?.name,
        };
        currentCart.push(cartItem);
      }

      // Lưu lại localStorage
      localStorage.setItem("cart", JSON.stringify(currentCart));

      toast({
        title: "Thành công",
        description: "Đã thêm vào giỏ hàng",
      });

      // Trigger cart update
      window.dispatchEvent(new Event("cart-updated"));
      router.refresh();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể thêm vào giỏ hàng",
        variant: "destructive",
      });
    }
  };

  const buyNow = () => {
    addToCart();
    // Navigate to checkout
    router.push("/checkout");
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

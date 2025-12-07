"use client";

import { Button } from "@/components/ui/button";
import { HeartIcon } from "lucide-react";
import { useState } from "react";
import { useTRPC } from "@/app/(app)/trpcHelper/useTRPC";
import { useSession } from "@/modules/auth/ui/sign-in/views/providers/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

type Props = {
  productId: string;
  initialCount: number;
  isInWishlist: boolean; // Nhận từ server
};

export const WishlistButton = ({
  productId,
  initialCount,
  isInWishlist: initialIsInWishlist,
}: Props) => {
  const { user } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const trpc = useTRPC();

  const [wishlistCount, setWishlistCount] = useState(initialCount);
  const [isInWishlist, setIsInWishlist] = useState(initialIsInWishlist);

  const toggleMutation = useMutation(
    trpc.wishlist.toggle.mutationOptions({
      onSuccess: (data) => {
        console.log("✅ Mutation success:", data);
        setIsInWishlist(data.added);
        setWishlistCount((prev) => (data.added ? prev + 1 : prev - 1));
        toast({
          title: data.added ? "Đã thêm vào yêu thích" : "Đã xóa khỏi yêu thích",
          description: data.added
            ? "Xem danh sách trong trang cá nhân"
            : "Sản phẩm đã được xóa",
        });
        router.refresh();
      },
      onError: (error) => {
        console.error("❌ Mutation error:", error);
        console.error("❌ Error message:", error.message);
        console.error("❌ Error data:", error.data);
        toast({
          title: "Có lỗi xảy ra",
          description: "Vui lòng thử lại",
          variant: "destructive",
        });
      },
    })
  );

  const handleToggle = () => {
    console.log("🔍 Debug user:", user);
    console.log("🔍 User type:", typeof user);
    console.log("🔍 User falsy check:", !user);

    if (!user) {
      console.log("❌ User is falsy, redirecting to auth");
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để thêm vào yêu thích",
        variant: "destructive",
      });
      router.push("/");
      return;
    }

    console.log("✅ User is truthy, mutating");
    toggleMutation.mutate({ productId });
  };

  return (
    <Button
      variant={isInWishlist ? "default" : "outline"}
      size="lg"
      className="gap-2"
      onClick={handleToggle}
      disabled={toggleMutation.isPending}
    >
      <HeartIcon className={`h-5 w-5 ${isInWishlist ? "fill-current" : ""}`} />
      <span className="text-sm">{wishlistCount}</span>
    </Button>
  );
};

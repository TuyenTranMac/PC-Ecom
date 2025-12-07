"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { redirectToMainDomain } from "@/lib/utils/domain";

interface LogoutButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export const LogoutButton = ({
  variant = "outline",
  size = "default",
  className,
}: LogoutButtonProps) => {
  const handleLogout = async () => {
    // Đăng xuất
    await signOut({ redirect: false });

    // Redirect về main domain (loại bỏ subdomain)
    redirectToMainDomain("/auth");
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      className={className}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Đăng xuất
    </Button>
  );
};

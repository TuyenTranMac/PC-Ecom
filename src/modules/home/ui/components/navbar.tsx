"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavBarSideBar } from "./navbar.sidebar";
import { useState } from "react";
import { MenuIcon, User } from "lucide-react";
import { useSession } from "@/modules/auth/ui/sign-in/views/providers/SessionProvider";
import { CartSheet } from "@/modules/cart/ui/CartSheet";
import { WishlistSheet } from "@/modules/wishlist/ui/WishlistSheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
interface NavbarItemProps {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
}

const NavbarItem = ({ href, children, isActive }: NavbarItemProps) => {
  return (
    <Button
      asChild
      variant={"outline"}
      className={cn(
        "hover:border-primary rounded-full border-transparent bg-transparent px-3.5 text-lg hover:bg-transparent",
        isActive && "bg-black text-white hover:bg-black hover:text-white"
      )}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
};

const navbarItems = [
  { href: "/", children: "Home" },
  { href: "/About", children: "About" },
  { href: "/MarketPlace", children: "Market Place" },
  { href: "/Contact", children: "Contact" },
];

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

export const Navbar = () => {
  const { user } = useSession();
  const pathName = usePathname();
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  // const trpc = useTRPC();
  // const session = useQuery(trpc.auth.getMe.queryOptions());
  return (
    <nav className="bg-secondary flex h-20 justify-between border-b font-medium">
      <Link href="" className="flex items-center pl-6">
        <span className={cn("text-5xl font-semibold", poppins.className)}>
          JustGear
        </span>
      </Link>
      <NavBarSideBar
        items={navbarItems}
        open={isSideBarOpen}
        onOpenChange={setIsSideBarOpen}
      />
      <div className="hidden items-center gap-4 lg:flex">
        {navbarItems.map((item) => (
          <NavbarItem
            isActive={pathName === item.href}
            key={item.href}
            {...item}
          >
            {item.children}
          </NavbarItem>
        ))}
        {/* Cart & Wishlist Icons */}
        <div className="flex items-center gap-2">
          <CartSheet />
          {user && <WishlistSheet />}
        </div>
      </div>
      {user ? (
        <div className="hidden items-center gap-2 pr-6 lg:flex">
          {/* User Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar>
                  <AvatarImage
                    src={user.image || undefined}
                    alt={user.username || "User"}
                  />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {user.username || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href=""
                  className="cursor-pointer font-bold text-amber-600"
                >
                  Start Selling
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="hidden lg:flex">
          <Button
            asChild
            variant={"elevated"}
            className="rounded-non hover:text-secondary bg-secondary h-full border border-t-0 border-r-0 border-b-0 px-12 text-lg transition-colors hover:bg-blue-400"
          >
            <Link href={"/auth"}>Login</Link>
          </Button>
          <Button
            asChild
            variant={"elevated"}
            className="rounded-non hover:text-primary bg-secondary h-full border-t-0 border-r-0 border-b-0 border-l px-12 text-lg font-bold font-stretch-95% transition-colors hover:bg-amber-300"
          >
            <Link href={""}>Start Selling</Link>
          </Button>
        </div>
      )}

      <div className="flex items-center gap-2 lg:hidden">
        <CartSheet />
        {user && <WishlistSheet />}
        <Button
          variant={"ghost"}
          className="size-12 border-transparent"
          onClick={() => setIsSideBarOpen(true)}
        >
          <MenuIcon />
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;

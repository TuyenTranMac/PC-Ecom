"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavBarSideBar } from "./navbar.sidebar";
import { useState } from "react";
import { BookmarkCheck, MenuIcon } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
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
  const pathName = usePathname();
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const trpc = useTRPC();
  const session = useQuery(trpc.auth.getMe.queryOptions());
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
      </div>
      {session.data?.user && (
        <div className="hidden lg:flex">
          <Button
            asChild
            variant={"elevated"}
            className="rounded-non hover:text-primary bg-secondary h-full border-t-0 border-r-0 border-b-0 border-l px-12 text-lg font-bold font-stretch-95% transition-colors hover:bg-amber-300"
          >
            <Link href={""}>Start Selling</Link>
          </Button>
        </div>
      )}
      {!session.data?.user && (
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

      <div className="flex items-center justify-center lg:hidden">
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

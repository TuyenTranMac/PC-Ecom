"use client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Poppins } from "next/font/google"
import Link from "next/link"
import { usePathname } from "next/navigation";
import { NavBarSideBar } from "./navbar.sidebar"
import { useState } from "react"
import { MenuIcon, MenuSquareIcon } from "lucide-react"
interface NavbarItemProps {
  href: string,
  children: React.ReactNode,
  isActive: boolean
}

const NavbarItem = ({href,children,isActive}:NavbarItemProps) => {
  return(
    <Button
      asChild 
      variant={"outline"} 
      className={cn("bg-transparent hover:bg-transparent rounded-full hover:border-primary border-transparent px-3.5 text-lg"
        ,isActive &&"bg-black text-white hover:bg-black hover:text-white")}
    >
      <Link href={href}>{children}</Link>
    </Button>
  )
}

const navbarItems =[
  {href:"/", children:"Home"},
  {href:'/About', children:"About"},
  {href:'/MarketPlace', children:"Market Place"},
  {href:'/Contact', children:"Contact"},

]

const poppins = Poppins({
    subsets:["latin"],
    weight:["700"]
})
export const Navbar = () => {
  const pathName = usePathname()
  const [isSideBarOpen, setIsSideBarOpen] = useState(false)
  return (
    <nav className="h-20 flex border-b justify-between  font-medium bg-secondary">
      <Link href="" className="pl-6 flex items-center">
        <span className={cn("text-5xl font-semibold ", poppins.className)}>JustGear</span>
      </Link>
      <NavBarSideBar
        items={navbarItems}
        open={isSideBarOpen}
        onOpenChange={setIsSideBarOpen}
      />
      <div className="items-center gap-4 hidden lg:flex ">
        {navbarItems.map((item)=> (
          <NavbarItem
            isActive={pathName === item.href} key={item.href}

            {...item}
            >
            {item.children}
            
          </NavbarItem>
        ))}
      </div>
      <div className="hidden lg:flex">
        
        <Button 
          asChild
          variant={"elevated"}
          className="border-1 border-t-0 border-b-0 border-r-0 px-12 h-full rounded-non 
          transition-colors text-lg hover:text-secondary bg-secondary hover:bg-blue-400 "
        >
           <Link href={"/login"}>
            Login
          </Link>
        </Button>
        <Button
          asChild
          variant={"elevated"}
          className="border-l border-t-0 border-b-0 border-r-0 px-12 font-bold font-stretch-95% h-full rounded-non 
          transition-colors text-lg hover:text-primary bg-secondary hover:bg-amber-300"
        >
          <Link href={"/sign-up"}>
            Start Selling
          </Link>
        </Button>
      </div>
      <div className="flex lg:hidden items-center justify-center">
        <Button
          variant={"ghost"}
          className="size-12 border-transparent bg-teal-500"
          onClick={() => setIsSideBarOpen(true)}
        >
          <MenuIcon/>
        </Button>
      </div>
    </nav>
  )
}

export default Navbar
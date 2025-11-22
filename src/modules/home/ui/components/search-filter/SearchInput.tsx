"use client";
import { Input } from "@/components/ui/input";
import { BookmarkCheck, SearchIcon } from "lucide-react";
import { useContext, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { tr } from "date-fns/locale";
import { useSession } from "@/modules/auth/ui/sign-in/views/providers/SessionProvider";
interface Props {
  disable?: boolean;
}

const SearchInput = ({ disable }: Props) => {
  const { user } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-row items-center gap-2 w-full">
      <div className="relative flex items-center w-full">
        <SearchIcon
          onClick={() => setIsOpen((prev) => !prev)}
          className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500 cursor-pointer"
        />
        <Input
          className={cn(
            "pl-8 transition-all duration-700",
            isOpen ? "w-full opacity-100" : "w-0 opacity-0 pointer-events-none"
          )}
          placeholder="Search product"
          disabled={disable}
        />
        {user ? (
          <Button variant="elevated">
            <Link href={""}>
              <BookmarkCheck />
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default SearchInput;

"use client";
import { Input } from "@/components/ui/input";
import { BookmarkCheck, SearchIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { tr } from "date-fns/locale";
interface Props {
  disable?: boolean;
}

const SearchInput = ({ disable }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const trpc = useTRPC();
  const session = useQuery(trpc.auth.getMe.queryOptions());
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
        {session.data?.user && (
          <Button variant="elevated">
            <Link href={""}>
              <BookmarkCheck />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchInput;

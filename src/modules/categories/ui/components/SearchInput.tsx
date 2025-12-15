"use client";

import { Input } from "@/components/ui/input";
import { BookmarkCheck, SearchIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/modules/auth/ui/sign-in/views/providers/SessionProvider";

interface Props {
  disable?: boolean;
}

const SearchInput = ({ disable }: Props) => {
  const { user } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
    }
  };

  return (
    <div className="flex flex-row items-center gap-2 w-full">
      <form
        onSubmit={handleSearch}
        className="relative flex items-center w-full"
      >
        <SearchIcon
          onClick={() => setIsOpen((prev) => !prev)}
          className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500 cursor-pointer"
        />
        <Input
          className={cn(
            "pl-8 transition-all duration-700",
            isOpen ? "w-full opacity-100" : "w-0 opacity-0 pointer-events-none"
          )}
          placeholder="Tìm kiếm sản phẩm..."
          disabled={disable}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {user && (
          <Button variant="elevated" type="button">
            <Link href="/wishlist">
              <BookmarkCheck />
            </Link>
          </Button>
        )}
      </form>
    </div>
  );
};

export default SearchInput;


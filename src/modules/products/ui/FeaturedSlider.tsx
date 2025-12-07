"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ProductCard } from "./ProductCard";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  images: any;
  wishlistCount: number;
  store: {
    id: string;
    name: string;
    slug: string;
  };
  category: {
    name: string;
    slug: string;
  };
}

interface Props {
  products: Product[];
  wishlistProductIds: Set<string>;
  isLoggedIn: boolean;
}

export const FeaturedSlider = ({
  products,
  wishlistProductIds,
  isLoggedIn,
}: Props) => {
  return (
    <div className="relative w-full">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="pl-2 md:basis-1/2 md:pl-4 lg:basis-1/3 xl:basis-1/4"
            >
              <ProductCard
                product={product}
                isInWishlist={wishlistProductIds.has(product.id)}
                isLoggedIn={isLoggedIn}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  );
};

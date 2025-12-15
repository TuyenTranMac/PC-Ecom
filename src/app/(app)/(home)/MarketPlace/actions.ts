"use server";

import { api } from "@/server/server";

export const loadMoreProducts = async (cursor: string, limit: number = 72) => {
  const caller = await api();
  const result = await caller.product.getAllForMarketplace({
    limit,
    cursor,
  });

  return result;
};

import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/trpc/routers/_app";

export type CategoryAllOutput = inferRouterOutputs<AppRouter>["categories"]["all"]
export type SingleCategoryOutput = CategoryAllOutput[0]
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/server/api/routers/rootRouter";

export type CategoryAllOutput = inferRouterOutputs<AppRouter>["categories"]["all"]
export type SingleCategoryOutput = CategoryAllOutput[0]
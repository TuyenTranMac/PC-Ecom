import { createTRPCRouter } from "../trpc";
import { authRouter } from "@/server/api/services/authRouter";
import { categoriesRouter } from "../services/categoryRouter";
import { subscriptionRouter } from "../services/subscriptionRouter";
import { storeRouter } from "../services/storeRouter";
import { productRouter } from "../services/productRouter";
import { wishlistRouter } from "../services/wishlistRouter";
import { adminRouter } from "../services/adminRouter";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  categories: categoriesRouter,
  subscription: subscriptionRouter,
  store: storeRouter,
  product: productRouter,
  wishlist: wishlistRouter,
  admin: adminRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;

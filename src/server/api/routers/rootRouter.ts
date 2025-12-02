
import { createTRPCRouter } from '../trpc';
import { authRouter } from '@/server/api/services/authRouter';
import { categoriesRouter } from '../services/categoryRouter';

export const appRouter = createTRPCRouter({
    auth: authRouter,
    categories: categoriesRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;
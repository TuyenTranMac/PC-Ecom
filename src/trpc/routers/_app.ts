import { z } from 'zod';

import { categoriesRouter } from '~/modules/categories/server/procedures';
import { createTRPCRouter } from '../init';
import { auth } from 'node_modules/payload/dist/auth/operations/auth';
import { authRouter } from '~/modules/auth/server/procedures';

export const appRouter = createTRPCRouter({
    auth: authRouter,
    categories: categoriesRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;
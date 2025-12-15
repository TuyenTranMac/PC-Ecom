import { initTRPC, TRPCError } from "@trpc/server"; // ← FIX: Import TRPCError
import { prisma as db } from "@/server/db";
import superjson from "superjson";
import { cache } from "react";
import { getSession } from "@/lib/auth/session";

export const createTRPCContext = cache(async () => {
  const session = await getSession();

  return {
    db,
    session,
    user: session?.user || null,
  };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

export const t = initTRPC.context<Context>().create({
  transformer: superjson, // Serialize Date, Map, Set, etc.
  errorFormatter({ shape }) {
    return shape;
  },
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

export const protectedProcedure = t.procedure.use(async function isAuth(opts) {
  const { ctx } = opts;
  if (!ctx.session || !ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Bạn cần đăng nhập để thực hiện thao tác này",
    });
  }
  return opts.next({
    ctx: {
      ...ctx,
      //update context
      session: ctx.session,
      user: ctx.user,
    },
  });
});
export const vendorProcedure = t.procedure.use(async function isVendor(opts) {
  const { ctx } = opts;

  if (!ctx.session || !ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Bạn cần đăng nhập để thực hiện thao tác này",
    });
  }

  if (ctx.user.role !== "VENDOR" && ctx.user.role !== "ADMIN") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Chỉ Vendor hoặc Admin mới có quyền thực hiện thao tác này",
    });
  }

  return opts.next({
    ctx: {
      ...ctx,
      session: ctx.session,
      user: ctx.user,
    },
  });
});
export const adminProcedure = t.procedure.use(async function isAdmin(opts) {
  const { ctx } = opts;

  if (!ctx.session || !ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Bạn cần đăng nhập để thực hiện thao tác này",
    });
  }

  if (ctx.user.role !== "ADMIN") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Chỉ Admin mới có quyền thực hiện thao tác này",
    });
  }

  return opts.next({
    ctx: {
      ...ctx,
      session: ctx.session,
      user: ctx.user,
    },
  });
});
export const publicProcedure = t.procedure;

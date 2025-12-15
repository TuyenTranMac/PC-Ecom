import { createTRPCRouter, adminProcedure } from "../trpc";
import { z } from "zod";

export const adminRouter = createTRPCRouter({
  revokeVendor: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.update({
        where: { id: input.userId },
        data: { role: "USER" },
      });
      return { success: true, user, userId: input.userId };
    }),
  getStats: adminProcedure.query(async ({ ctx }) => {
    const [
      totalUsers,
      totalVendors,
      proVendors,
      totalCategories,
      totalProducts,
    ] = await Promise.all([
      // Tổng số user
      ctx.db.user.count(),
      // Tổng số vendor
      ctx.db.user.count({ where: { role: "VENDOR" } }),
      // Số vendor dùng gói PRO
      ctx.db.subscription.count({
        where: {
          plan: "PRO",
          status: "ACTIVE",
        },
      }),
      // Tổng số category
      ctx.db.category.count(),
      // Tổng số sản phẩm
      ctx.db.product.count(),
    ]);

    return {
      totalUsers,
      totalVendors,
      proVendors,
      totalCategories,
      totalProducts,
    };
  }),

  // Lấy danh sách users với pagination
  getUsers: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
        role: z.enum(["USER", "VENDOR", "ADMIN"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, role } = input;

      const users = await ctx.db.user.findMany({
        where: role ? { role } : undefined,
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
          Store: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      let nextCursor: string | undefined = undefined;
      if (users.length > limit) {
        const nextItem = users.pop();
        nextCursor = nextItem!.id;
      }

      return {
        users,
        nextCursor,
      };
    }),

  // Lấy danh sách vendors với subscription info
  getVendors: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;

      const vendors = await ctx.db.user.findMany({
        where: { role: "VENDOR" },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: "desc" },
        include: {
          Subscription: true,
          Store: {
            select: {
              id: true,
              name: true,
              slug: true,
              _count: {
                select: {
                  Product: true,
                },
              },
            },
          },
        },
      });

      let nextCursor: string | undefined = undefined;
      if (vendors.length > limit) {
        const nextItem = vendors.pop();
        nextCursor = nextItem!.id;
      }

      return {
        vendors,
        nextCursor,
      };
    }),
});

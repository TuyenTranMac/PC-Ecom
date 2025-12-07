import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const wishlistRouter = createTRPCRouter({
  // Toggle wishlist (thêm/xóa)
  toggle: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { productId } = input;
      const userId = ctx.session.user.id;

      // Kiểm tra đã tồn tại chưa
      const existing = await ctx.db.wishlist.findUnique({
        where: { userId_productId: { userId, productId } },
      });

      if (existing) {
        // Xóa khỏi wishlist và giảm count
        await ctx.db.$transaction([
          ctx.db.wishlist.delete({ where: { id: existing.id } }),
          ctx.db.product.update({
            where: { id: productId },
            data: { wishlistCount: { decrement: 1 } },
          }),
        ]);
        return { added: false };
      } else {
        // Thêm vào wishlist và tăng count
        await ctx.db.$transaction([
          ctx.db.wishlist.create({ data: { userId, productId } }),
          ctx.db.product.update({
            where: { id: productId },
            data: { wishlistCount: { increment: 1 } },
          }),
        ]);
        return { added: true };
      }
    }),

  // Kiểm tra product có trong wishlist không
  check: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ ctx, input }) => {
      const existing = await ctx.db.wishlist.findUnique({
        where: {
          userId_productId: {
            userId: ctx.session.user.id,
            productId: input.productId,
          },
        },
      });
      return { isInWishlist: !!existing };
    }),

  // Lấy tất cả wishlist của user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.wishlist.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        product: {
          include: {
            category: { select: { name: true, slug: true } },
            store: { select: { name: true, slug: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  // Xóa khỏi wishlist
  remove: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const existing = await ctx.db.wishlist.findUnique({
        where: { userId_productId: { userId, productId: input.productId } },
      });

      if (!existing) return { success: false };

      await ctx.db.$transaction([
        ctx.db.wishlist.delete({ where: { id: existing.id } }),
        ctx.db.product.update({
          where: { id: input.productId },
          data: { wishlistCount: { decrement: 1 } },
        }),
      ]);
      return { success: true };
    }),
});

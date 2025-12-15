import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const wishlistRouter = createTRPCRouter({
  // Thêm vào giỏ hàng (tạo mới hoặc tăng quantity)
  addToCart: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive().default(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { productId, quantity } = input;
      const userId = ctx.session.user.id;

      // Kiểm tra product tồn tại và còn stock
      const product = await ctx.db.product.findUnique({
        where: { id: productId },
        select: { stock: true },
      });

      if (!product) {
        throw new Error("Sản phẩm không tồn tại");
      }

      // Kiểm tra đã có trong giỏ chưa
      const existing = await ctx.db.wishlist.findUnique({
        where: { userId_productId: { userId, productId } },
      });

      if (existing) {
        // Tăng quantity
        const newQuantity = existing.quantity + quantity;
        if (newQuantity > product.stock) {
          throw new Error(`Chỉ còn ${product.stock} sản phẩm trong kho`);
        }
        await ctx.db.wishlist.update({
          where: { id: existing.id },
          data: { quantity: newQuantity },
        });
        return { success: true, message: "Đã cập nhật số lượng" };
      } else {
        // Thêm mới
        if (quantity > product.stock) {
          throw new Error(`Chỉ còn ${product.stock} sản phẩm trong kho`);
        }
        await ctx.db.wishlist.create({
          data: { userId, productId, quantity },
        });
        return { success: true, message: "Đã thêm vào giỏ hàng" };
      }
    }),

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
        Product: {
          include: {
            Category: { select: { name: true, slug: true } },
            Store: { select: { name: true, slug: true } },
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

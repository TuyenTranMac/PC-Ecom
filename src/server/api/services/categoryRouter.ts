import {
  publicProcedure,
  createTRPCRouter,
  adminProcedure,
} from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const categoriesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.category.findMany({
      where: {
        parentId: null,
      },
      include: {
        children: true,
      },
    });

    return data;
  }),

  // Lấy tất cả categories (bao gồm subcategories) cho admin
  getAllForAdmin: adminProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.category.findMany({
      include: {
        children: true,
        parent: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return categories;
  }),

  // Lấy category theo slug (bao gồm children)
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const category = await ctx.db.category.findUnique({
        where: { slug: input.slug },
        include: {
          children: true,
          parent: true,
        },
      });

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Không tìm thấy danh mục",
        });
      }

      return category;
    }),

  // Tạo category mới (Admin only)
  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1, "Tên danh mục không được để trống"),
        slug: z.string().min(1, "Slug không được để trống"),
        description: z.string().optional(),
        parentId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check slug đã tồn tại chưa
      const existing = await ctx.db.category.findUnique({
        where: { slug: input.slug },
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Slug đã tồn tại",
        });
      }

      const category = await ctx.db.category.create({
        data: input,
      });

      return category;
    }),

  // Cập nhật category (Admin only)
  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        description: z.string().optional(),
        parentId: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      // Check category có tồn tại không
      const existing = await ctx.db.category.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Không tìm thấy danh mục",
        });
      }

      // Check slug trùng (nếu update slug)
      if (data.slug && data.slug !== existing.slug) {
        const slugExists = await ctx.db.category.findUnique({
          where: { slug: data.slug },
        });

        if (slugExists) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Slug đã tồn tại",
          });
        }
      }

      const category = await ctx.db.category.update({
        where: { id },
        data,
      });

      return category;
    }),

  // Xóa category (Admin only)
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check có sản phẩm không
      const productsCount = await ctx.db.product.count({
        where: { categoryId: input.id },
      });

      if (productsCount > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `Không thể xóa danh mục có ${productsCount} sản phẩm`,
        });
      }

      // Check có subcategory không
      const childrenCount = await ctx.db.category.count({
        where: { parentId: input.id },
      });

      if (childrenCount > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `Không thể xóa danh mục có ${childrenCount} danh mục con`,
        });
      }

      await ctx.db.category.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});

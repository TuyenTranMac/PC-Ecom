import {
  publicProcedure,
  vendorProcedure,
  createTRPCRouter,
} from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

// Schema cho việc cập nhật Store
const updateStoreSchema = z.object({
  name: z.string().min(3, "Tên cửa hàng phải có ít nhất 3 ký tự"),
  description: z.string().optional(),
  logo: z.string().url("URL logo không hợp lệ").optional().nullable(),
  banner: z.string().url("URL banner không hợp lệ").optional().nullable(),
});

// Schema cho payment config (SePay)
const updatePaymentConfigSchema = z.object({
  sepayAccountId: z.string().optional(),
  apiKey: z.string().optional(),
});

export const storeRouter = createTRPCRouter({
  // Lấy thông tin Store của Vendor (Protected - Vendor only)
  getMyStore: vendorProcedure.query(async ({ ctx }) => {
    const store = await ctx.db.store.findUnique({
      where: { ownerId: ctx.session.user.id },
      include: {
        User: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        },
        _count: {
          select: {
            Product: true, // Đếm số sản phẩm
          },
        },
      },
    });

    if (!store) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Không tìm thấy cửa hàng. Vui lòng đăng ký gói trước.",
      });
    }

    return store;
  }),

  // Lấy Store theo slug (Public - cho subdomain)
  getStoreBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const store = await ctx.db.store.findUnique({
        where: { slug: input.slug },
        include: {
          User: {
            select: {
              username: true,
            },
          },
          Product: {
            where: {
              isArchived: false,
            },
            take: 12, // Lấy 12 sản phẩm mới nhất
            orderBy: {
              createdAt: "desc",
            },
            include: {
              Category: {
                select: {
                  name: true,
                  slug: true,
                },
              },
            },
          },
          _count: {
            select: {
              Product: true,
            },
          },
        },
      });

      if (!store || !store.isActive) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cửa hàng không tồn tại hoặc đã bị vô hiệu hóa",
        });
      }

      return store;
    }),

  // Cập nhật thông tin Store (Protected - Vendor only)
  updateStore: vendorProcedure
    .input(updateStoreSchema)
    .mutation(async ({ ctx, input }) => {
      // Kiểm tra Store có tồn tại không
      const existingStore = await ctx.db.store.findUnique({
        where: { ownerId: ctx.session.user.id },
      });

      if (!existingStore) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Không tìm thấy cửa hàng",
        });
      }

      // Cập nhật Store
      const updatedStore = await ctx.db.store.update({
        where: { ownerId: ctx.session.user.id },
        data: {
          name: input.name,
          description: input.description,
          logo: input.logo,
          banner: input.banner,
        },
      });

      return {
        success: true,
        store: updatedStore,
        message: "Cập nhật cửa hàng thành công",
      };
    }),

  // Cập nhật Payment Config (Protected - Vendor only)
  updatePaymentConfig: vendorProcedure
    .input(updatePaymentConfigSchema)
    .mutation(async ({ ctx, input }) => {
      const store = await ctx.db.store.findUnique({
        where: { ownerId: ctx.session.user.id },
      });

      if (!store) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Không tìm thấy cửa hàng",
        });
      }

      const updatedStore = await ctx.db.store.update({
        where: { ownerId: ctx.session.user.id },
        data: {
          paymentConfig: input,
        },
      });

      return {
        success: true,
        store: updatedStore,
        message: "Cập nhật cấu hình thanh toán thành công",
      };
    }),

  // Lấy stats của Store (Protected - Vendor only)
  getStoreStats: vendorProcedure.query(async ({ ctx }) => {
    const store = await ctx.db.store.findUnique({
      where: { ownerId: ctx.session.user.id },
    });

    if (!store) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Không tìm thấy cửa hàng",
      });
    }

    // Đếm số lượng products
    const totalProducts = await ctx.db.product.count({
      where: { storeId: store.id },
    });

    const activeProducts = await ctx.db.product.count({
      where: {
        storeId: store.id,
        isArchived: false,
      },
    });

    const featuredProducts = await ctx.db.product.count({
      where: {
        storeId: store.id,
        isFeatured: true,
        isArchived: false,
      },
    });

    return {
      totalProducts,
      activeProducts,
      archivedProducts: totalProducts - activeProducts,
      featuredProducts,
      storeSlug: store.slug,
      storeName: store.name,
    };
  }),
});

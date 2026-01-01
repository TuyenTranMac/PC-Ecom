import { createTRPCRouter, publicProcedure, vendorProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  createProductSchema,
  updateProductSchema,
  deleteProductSchema,
  getProductByIdSchema,
  validateProductAISchema,
} from "@/lib/schemas/product.schema";
export const productRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        categoryId: z.string().optional(),
        userId: z.string().optional(), // Filter theo Vendor
        limit: z.number().min(1).max(100).default(12),
        cursor: z.string().optional(), // Cho infinite scroll
      })
    )
    .query(async ({ ctx, input }) => {
      const { categoryId, userId, limit, cursor } = input;

      const products = await ctx.db.product.findMany({
        where: {
          isArchived: false,
          ...(categoryId && { categoryId }),
          ...(userId && { storeId: userId }),
        },
        take: limit + 1, // +1 để check có item tiếp không
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          Category: true,
          Store: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      let nextCursor: string | undefined = undefined;
      if (products.length > limit) {
        const nextItem = products.pop();
        nextCursor = nextItem!.id;
      }

      return {
        products,
        nextCursor,
      };
    }),
  //Get product by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string(), userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.product.findUnique({
        where: { storeId_slug: { storeId: input.userId, slug: input.slug } },
        include: {
          Category: true,
          Store: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      if (!data || data.isArchived) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "ProductRouter-GetBySlug: Not found Product",
        });
      }
      return data;
    }),

  // Get product by product slug only (for detail page)
  getByProductSlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.product.findFirst({
        where: {
          slug: input.slug,
          isArchived: false,
        },
        include: {
          Category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          Store: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Không tìm thấy sản phẩm",
        });
      }

      return product;
    }),
  // Tạo sản phẩm mới (Vendor only)
  create: vendorProcedure
    .input(createProductSchema)
    .mutation(async ({ ctx, input }) => {
      // Lấy Store của Vendor
      const store = await ctx.db.store.findUnique({
        where: { ownerId: ctx.session.user.id },
        include: {
          User: {
            include: {
              Subscription: true,
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

      // Kiểm tra giới hạn số lượng sản phẩm
      const subscription = store.User?.Subscription;
      if (subscription && subscription.maxProducts !== -1) {
        const currentProductCount = await ctx.db.product.count({
          where: { storeId: store.id },
        });

        if (currentProductCount >= subscription.maxProducts) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: `Bạn đã đạt giới hạn ${subscription.maxProducts} sản phẩm. Vui lòng nâng cấp gói.`,
          });
        }
      }

      // Kiểm tra slug đã tồn tại trong store chưa
      const existingProduct = await ctx.db.product.findUnique({
        where: {
          storeId_slug: {
            storeId: store.id,
            slug: input.slug,
          },
        },
      });

      if (existingProduct) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Slug đã tồn tại. Vui lòng chọn slug khác.",
        });
      }

      // Kiểm tra số lượng ảnh
      const imageCount = input.images?.length || 0;
      const maxImages = subscription?.maxImages || 3;

      if (imageCount > maxImages) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Gói ${subscription?.plan || "FREE"} chỉ cho phép tối đa ${maxImages} ảnh mỗi sản phẩm.`,
        });
      }

      // Tạo sản phẩm
      const product = await ctx.db.product.create({
        data: {
          ...input,
          storeId: store.id,
          images: input.images || [],
        },
        include: {
          Category: {
            select: {
              name: true,
              slug: true,
            },
          },
          Store: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      });

      return {
        success: true,
        product,
        message: "Tạo sản phẩm thành công",
      };
    }),

  // Validate sản phẩm với AI
  validateProductAI: vendorProcedure
    .input(validateProductAISchema)
    .mutation(async ({ ctx, input }) => {
      const { name, categoryId, images } = input;

      // Lấy tên danh mục
      const category = await ctx.db.category.findUnique({
        where: { id: categoryId },
        select: { name: true },
      });

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Danh mục không tồn tại",
        });
      }

      // Khởi tạo Google AI
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      // Tạo prompt
      const prompt = `Phân tích các hình ảnh sản phẩm này. Tên sản phẩm là "${name}", thuộc danh mục "${category.name}". 

Hãy xác nhận xem:
1. Hình ảnh có phải là sản phẩm thực tế không (không phải meme, ảnh bậy bạ, hoặc không liên quan)?
2. Thông tin tên sản phẩm và danh mục có khớp với nội dung hình ảnh không?
3. Hình ảnh có chất lượng tốt, rõ ràng không?

Trả về JSON với format:
{
  "valid": boolean,
  "explanation": "Giải thích ngắn gọn tại sao valid hoặc không valid",
  "confidence": number (0-100, độ tin cậy)
}`;

      try {
        // TEMP: Mock AI validation for testing
        console.log("AI Validation called with:", {
          name,
          categoryName: category.name,
          images,
        });

        // Simulate AI processing
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock response based on input
        const mockValid =
          name.toLowerCase().includes("card") &&
          category.name.toLowerCase().includes("card");
        const mockConfidence = mockValid ? 85 : 15;

        return {
          valid: mockValid,
          explanation: mockValid
            ? ` Hình ảnh và thông tin sản phẩm khớp nhau. Đây là card màn hình thuộc danh mục ${category.name}.`
            : ` Hình ảnh không khớp với thông tin. Vui lòng kiểm tra lại tên sản phẩm và danh mục.`,
          confidence: mockConfidence,
        };
      } catch (error) {
        console.error("AI validation error:", error);
        // Fallback: cho phép nếu AI lỗi
        return {
          valid: true,
          explanation: "Không thể kiểm tra với AI, cho phép tạo sản phẩm",
          confidence: 0,
        };
      }
    }),

  // Lấy danh sách sản phẩm của Vendor
  getMyProducts: vendorProcedure.query(async ({ ctx }) => {
    const store = await ctx.db.store.findUnique({
      where: { ownerId: ctx.session.user.id },
    });

    if (!store) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Không tìm thấy cửa hàng",
      });
    }

    const products = await ctx.db.product.findMany({
      where: {
        storeId: store.id,
      },
      include: {
        Category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return products;
  }),

  // Lấy sản phẩm public của store (cho storefront)
  getProductsByStore: publicProcedure
    .input(
      z.object({
        storeId: z.string(),
        limit: z.number().min(1).max(100).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const products = await ctx.db.product.findMany({
        where: {
          storeId: input.storeId,
          isArchived: false,
        },
        take: input.limit,
        include: {
          Category: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return products;
    }),

  // Lấy sản phẩm nổi bật (featured) - dựa trên view/sold nhiều nhất
  getFeatured: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(20).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const products = await ctx.db.product.findMany({
        where: {
          isArchived: false,
          isFeatured: true, // Thêm field này vào schema sau
        },
        take: input.limit,
        include: {
          Category: {
            select: {
              name: true,
              slug: true,
            },
          },
          Store: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return products;
    }),

  // Lấy sản phẩm mới nhất cho Home page
  getLatest: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(12),
      })
    )
    .query(async ({ ctx, input }) => {
      const products = await ctx.db.product.findMany({
        where: {
          isArchived: false,
        },
        take: input.limit,
        include: {
          Category: {
            select: {
              name: true,
              slug: true,
            },
          },
          Store: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return products;
    }),

  // Lấy tất cả sản phẩm cho Marketplace (với pagination)
  getAllForMarketplace: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(24),
        cursor: z.string().optional(),
        categoryId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, categoryId } = input;

      const products = await ctx.db.product.findMany({
        where: {
          isArchived: false,
          ...(categoryId && { categoryId }),
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        include: {
          Category: {
            select: {
              name: true,
              slug: true,
            },
          },
          Store: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      let nextCursor: string | undefined = undefined;
      if (products.length > limit) {
        const nextItem = products.pop();
        nextCursor = nextItem!.id;
      }

      return {
        products,
        nextCursor,
      };
    }),

  // Lấy tổng số sản phẩm trong marketplace
  getTotalCount: publicProcedure
    .input(
      z.object({
        categoryId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const count = await ctx.db.product.count({
        where: {
          isArchived: false,
          ...(input.categoryId && { categoryId: input.categoryId }),
        },
      });

      return count;
    }),

  // Tìm kiếm sản phẩm
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        limit: z.number().min(1).max(50).default(20),
        categoryId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { query, limit, categoryId } = input;

      const products = await ctx.db.product.findMany({
        where: {
          isArchived: false,
          ...(categoryId && { categoryId }),
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        take: limit,
        include: {
          Category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          Store: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: [
          { wishlistCount: "desc" }, // Ưu tiên sản phẩm được yêu thích nhiều
          { createdAt: "desc" },
        ],
      });

      return products;
    }),

  // Xóa sản phẩm
  delete: vendorProcedure
    .input(deleteProductSchema)
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

      const product = await ctx.db.product.findFirst({
        where: {
          id: input.id,
          storeId: store.id,
        },
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Không tìm thấy sản phẩm",
        });
      }

      await ctx.db.product.delete({
        where: { id: input.id },
      });

      return {
        success: true,
        message: "Xóa sản phẩm thành công",
      };
    }),
});

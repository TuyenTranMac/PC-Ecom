import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  vendorProcedure,
} from "@/server/api/trpc";
import { checkoutSchema } from "@/lib/schemas/checkout.schema";
import { TRPCError } from "@trpc/server";
import { Decimal } from "@prisma/client/runtime/library";

export const orderRouter = createTRPCRouter({
  // Lấy giỏ hàng để checkout (nhóm theo store)
  getCartForCheckout: protectedProcedure
    .input(z.void().optional())
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id;

      // Lấy tất cả wishlist items (giỏ hàng)
      const cartItems = await ctx.db.wishlist.findMany({
        where: { userId },
        select: {
          quantity: true,
          productId: true,
          Product: {
            include: {
              Store: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
              Category: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      if (cartItems.length === 0) {
        return {
          orderGroups: [],
          grandTotal: 0,
          totalItems: 0,
        };
      }

      // Nhóm items theo storeId
      const groupedByStore = cartItems.reduce(
        (acc, item) => {
          const storeId = item.Product.storeId;
          if (!acc[storeId]) {
            acc[storeId] = {
              store: item.Product.Store,
              items: [],
              subtotal: new Decimal(0),
            };
          }

          const lineTotal = new Decimal(item.Product.price).times(
            item.quantity
          );
          acc[storeId].items.push({
            productId: item.Product.id,
            productName: item.Product.name,
            productSlug: item.Product.slug,
            price: item.Product.price,
            comparePrice: item.Product.comparePrice,
            quantity: item.quantity,
            images: item.Product.images,
            lineTotal: lineTotal.toNumber(),
          });

          acc[storeId].subtotal = acc[storeId].subtotal.plus(lineTotal);

          return acc;
        },
        {} as Record<
          string,
          {
            store: { id: string; name: string; slug: string };
            items: Array<{
              productId: string;
              productName: string;
              productSlug: string;
              price: number;
              comparePrice: number | null;
              quantity: number;
              images: any;
              lineTotal: number;
            }>;
            subtotal: Decimal;
          }
        >
      );

      // Chuyển về array
      const orderGroups = Object.values(groupedByStore).map((group) => ({
        store: group.store,
        items: group.items,
        subtotal: group.subtotal.toNumber(),
        shippingFee: 30000, // Fixed shipping fee (có thể tính động sau)
        total: group.subtotal.plus(30000).toNumber(),
      }));

      const grandTotal = orderGroups.reduce(
        (sum, group) => sum + group.total,
        0
      );

      return {
        orderGroups,
        grandTotal,
        totalItems: cartItems.length,
      };
    }),

  // Tạo đơn hàng (logic tách đơn multi-vendor)
  createOrder: protectedProcedure
    .input(checkoutSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const cartItems = input.cartItems || [];

      if (!cartItems || cartItems.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Giỏ hàng trống",
        });
      }

      const productIds = cartItems.map((item) => item.id);
      const products = await ctx.db.product.findMany({
        where: { id: { in: productIds } },
        include: {
          Store: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

      const validatedItems = cartItems.map((cartItem) => {
        const product = products.find((p) => p.id === cartItem.id);
        if (!product) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Sản phẩm ${cartItem.name} không tồn tại`,
          });
        }
        if (product.stock < cartItem.quantity) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Sản phẩm ${cartItem.name} không đủ hàng`,
          });
        }
        return {
          ...cartItem,
          Product: product,
        };
      });

      const ordersByStore = validatedItems.reduce(
        (acc, item) => {
          const storeId = item.Product.storeId;
          if (!acc[storeId]) {
            acc[storeId] = [];
          }
          acc[storeId].push(item);
          return acc;
        },
        {} as Record<string, typeof validatedItems>
      );

      let shippingAddressId: string;

      // TRƯỜNG HỢP 1: User chọn địa chỉ cũ từ dropdown
      if (input.useExistingAddress && input.existingAddressId) {
        // Validation kỹ hơn: Đảm bảo địa chỉ này thực sự thuộc về user đang login
        const existingAddress = await ctx.db.address.findFirst({
          where: {
            id: input.existingAddressId,
            userId: userId, // Quan trọng: Tránh việc user giả mạo ID của người khác
          },
        });

        if (!existingAddress) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Địa chỉ giao hàng không hợp lệ",
          });
        }

        shippingAddressId = input.existingAddressId;
      }
      // TRƯỜNG HỢP 2: User nhập form địa chỉ (có thể là mới, hoặc nhập lại thông tin cũ)
      else {
        // Bước 1: Tìm xem trong DB đã có địa chỉ nào y hệt của user này chưa
        const duplicateAddress = await ctx.db.address.findFirst({
          where: {
            userId: userId,
            // So sánh từng trường một
            fullName: input.shippingAddress.fullName,
            phone: input.shippingAddress.phone,
            addressLine1: input.shippingAddress.addressLine1,
            // Xử lý cẩn thận các trường optional (null vs undefined)
            addressLine2: input.shippingAddress.addressLine2 || null,
            ward: input.shippingAddress.ward || null,
            district: input.shippingAddress.district,
            province: input.shippingAddress.province,
            country: input.shippingAddress.country,
          },
        });

        if (duplicateAddress) {
          // Bước 2a: Nếu tìm thấy, tái sử dụng ID cũ
          shippingAddressId = duplicateAddress.id;
        } else {
          // Bước 2b: Nếu không thấy, lúc này mới tạo mới
          const address = await ctx.db.address.create({
            data: {
              fullName: input.shippingAddress.fullName,
              phone: input.shippingAddress.phone,
              addressLine1: input.shippingAddress.addressLine1,
              addressLine2: input.shippingAddress.addressLine2 || null,
              ward: input.shippingAddress.ward || null,
              district: input.shippingAddress.district,
              province: input.shippingAddress.province,
              country: input.shippingAddress.country,
              userId,
              // Tùy chọn: Nếu đây là địa chỉ đầu tiên, set làm mặc định luôn
              isDefault:
                (await ctx.db.address.count({ where: { userId } })) === 0,
            },
          });
          shippingAddressId = address.id;
        }
      }

      const createdOrders = await ctx.db.$transaction(async (tx) => {
        const orders = [];

        for (const [storeId, items] of Object.entries(ordersByStore)) {
          // Tính tổng tiền cho store
          const subtotal = items.reduce((sum, item) => {
            return sum + item.Product.price * item.quantity;
          }, 0);

          const shippingFee = 30000;
          const total = subtotal + shippingFee;

          const orderCode = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

          const order = await tx.order.create({
            data: {
              code: orderCode,
              userId,
              storeId,
              status: "PENDING",
              subtotal: new Decimal(subtotal),
              shippingFee: new Decimal(shippingFee),
              total: new Decimal(total),
              paymentMethod: input.paymentMethod,
              paymentStatus: "PENDING",
              shippingAddressId,
              billingAddressId: shippingAddressId, // Same as shipping
              notes: input.note || null,

              OrderItem: {
                create: items.map((item) => {
                  const lineTotal = item.Product.price * item.quantity;
                  return {
                    productName: item.Product.name,
                    productSlug: item.Product.slug,
                    storeSlug: item.Product.Store.slug,
                    price: new Decimal(item.Product.price),
                    comparePrice: item.Product.comparePrice
                      ? new Decimal(item.Product.comparePrice)
                      : null,
                    quantity: item.quantity,
                    lineTotal: new Decimal(lineTotal),
                    Product: {
                      connect: { id: item.Product.id },
                    },
                  };
                }),
              },
            },
            include: {
              OrderItem: true,
              Store: {
                select: {
                  name: true,
                  slug: true,
                },
              },
            },
          });

          orders.push(order);
        }

        // 5. Giảm stock sản phẩm
        for (const item of validatedItems) {
          await tx.product.update({
            where: { id: item.Product.id },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }

        return orders;
      });

      return {
        success: true,
        message: `Đặt hàng thành công! Đã tạo ${createdOrders.length} đơn hàng từ ${Object.keys(ordersByStore).length} cửa hàng.`,
        orders: createdOrders.map((order) => ({
          id: order.id,
          code: order.code,
          storeid: order.storeId || "",
          total: order.total.toNumber(),
          paymentMethod: order.paymentMethod,
        })),
      };
    }),

  // Lấy danh sách đơn hàng của user
  getMyOrders: protectedProcedure.query(async ({ ctx }) => {
    const orders = await ctx.db.order.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        Store: {
          select: {
            name: true,
            slug: true,
          },
        },
        OrderItem: {
          include: {
            Product: {
              select: {
                images: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return orders;
  }),

  // Lấy chi tiết đơn hàng
  getOrderById: protectedProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ ctx, input }) => {
      const order = await ctx.db.order.findUnique({
        where: { id: input.orderId },
        include: {
          Store: true,
          OrderItem: {
            include: {
              Product: true,
            },
          },
          Address_Order_shippingAddressIdToAddress: true,
          Address_Order_billingAddressIdToAddress: true,
        },
      });

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Không tìm thấy đơn hàng",
        });
      }

      // Chỉ cho phép user xem đơn của mình
      if (order.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Bạn không có quyền xem đơn hàng này",
        });
      }

      return order;
    }),

  // Lấy danh sách đơn hàng của shop (Vendor only)
  getVendorOrders: vendorProcedure
    .input(
      z
        .object({
          status: z
            .enum([
              "PENDING",
              "CONFIRMED",
              "PROCESSING",
              "SHIPPED",
              "DELIVERED",
              "COMPLETED",
              "CANCELLED",
              "REFUNDED",
            ])
            .optional(),
          limit: z.number().min(1).max(100).default(20),
          cursor: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Lấy store của vendor
      const store = await ctx.db.store.findUnique({
        where: { ownerId: userId },
        select: { id: true, slug: true },
      });

      if (!store) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Không tìm thấy cửa hàng",
        });
      }

      const limit = input?.limit ?? 20;
      const cursor = input?.cursor;

      console.log("=== getVendorOrders DEBUG ===");
      console.log("Store ID:", store.id);
      console.log("Store Slug:", store.slug);
      console.log("Filter Status:", input?.status);

      // Lấy orders có items thuộc store này
      const orders = await ctx.db.order.findMany({
        where: {
          OrderItem: {
            some: {
              storeSlug: store.slug,
            },
          },
          ...(input?.status && { status: input.status }),
        },
        include: {
          User: {
            select: {
              email: true,
            },
          },
          OrderItem: {
            where: {
              storeSlug: store.slug, // Chỉ lấy items của shop mình
            },
            include: {
              Product: {
                select: {
                  name: true,
                  images: true,
                  price: true,
                },
              },
            },
          },
          Address_Order_shippingAddressIdToAddress: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit + 1,
        ...(cursor && {
          cursor: { id: cursor },
          skip: 1,
        }),
      });

      let nextCursor: string | undefined = undefined;
      if (orders.length > limit) {
        const nextItem = orders.pop();
        nextCursor = nextItem?.id;
      }

      return {
        orders,
        nextCursor,
      };
    }),

  // Cập nhật trạng thái đơn hàng (Vendor only)
  updateOrderStatus: vendorProcedure
    .input(
      z.object({
        orderId: z.string(),
        status: z.enum([
          "CONFIRMED",
          "PROCESSING",
          "SHIPPED",
          "DELIVERED",
          "CANCELLED",
        ]),
        note: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Lấy store của vendor
      const store = await ctx.db.store.findUnique({
        where: { ownerId: userId },
        select: { id: true, slug: true },
      });

      if (!store) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Không tìm thấy cửa hàng",
        });
      }

      console.log("=== updateOrderStatus DEBUG ===");
      console.log("Store slug:", store.slug);
      console.log("Order ID:", input.orderId);
      console.log("New status:", input.status);

      // Kiểm tra order có items của shop này không
      const order = await ctx.db.order.findFirst({
        where: {
          id: input.orderId,
          OrderItem: {
            some: {
              storeSlug: store.slug,
            },
          },
        },
      });

      console.log("Found order:", order?.id, "Current status:", order?.status);

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "Không tìm thấy đơn hàng hoặc đơn hàng không thuộc shop của bạn",
        });
      }

      // Kiểm tra logic chuyển trạng thái
      const validTransitions: Record<string, string[]> = {
        PENDING: ["CONFIRMED", "CANCELLED"],
        CONFIRMED: ["PROCESSING", "CANCELLED"],
        PROCESSING: ["SHIPPED", "CANCELLED"],
        SHIPPED: ["DELIVERED"],
        DELIVERED: ["COMPLETED"],
      };

      const currentStatus = order.status;
      if (!validTransitions[currentStatus]?.includes(input.status)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Không thể chuyển từ ${currentStatus} sang ${input.status}`,
        });
      }

      // Cập nhật status
      const updatedOrder = await ctx.db.order.update({
        where: { id: input.orderId },
        data: {
          status: input.status,
          ...(input.note && { notes: input.note }),
        },
      });

      return {
        success: true,
        order: updatedOrder,
        message: `Đã cập nhật trạng thái đơn hàng sang ${input.status}`,
      };
    }),

  // Lấy thống kê đơn hàng của shop
  getVendorOrderStats: vendorProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const store = await ctx.db.store.findUnique({
      where: { ownerId: userId },
      select: { id: true, slug: true },
    });

    if (!store) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Không tìm thấy cửa hàng",
      });
    }

    console.log("=== getVendorOrderStats DEBUG ===");
    console.log("Store slug:", store.slug);

    // Đếm số đơn theo trạng thái
    const [pending, confirmed, processing, shipped, delivered, cancelled] =
      await Promise.all([
        ctx.db.order.count({
          where: {
            status: "PENDING",
            OrderItem: { some: { storeSlug: store.slug } },
          },
        }),
        ctx.db.order.count({
          where: {
            status: "CONFIRMED",
            OrderItem: { some: { storeSlug: store.slug } },
          },
        }),
        ctx.db.order.count({
          where: {
            status: "PROCESSING",
            OrderItem: { some: { storeSlug: store.slug } },
          },
        }),
        ctx.db.order.count({
          where: {
            status: "SHIPPED",
            OrderItem: { some: { storeSlug: store.slug } },
          },
        }),
        ctx.db.order.count({
          where: {
            status: "DELIVERED",
            OrderItem: { some: { storeSlug: store.slug } },
          },
        }),
        ctx.db.order.count({
          where: {
            status: "CANCELLED",
            OrderItem: { some: { storeSlug: store.slug } },
          },
        }),
      ]);

    // Tính tổng doanh thu (chỉ đơn DELIVERED)
    const revenueData = await ctx.db.orderItem.aggregate({
      where: {
        storeSlug: store.slug,
        Order: {
          status: "DELIVERED",
        },
      },
      _sum: {
        lineTotal: true,
        quantity: true,
      },
    });

    return {
      pending,
      confirmed,
      processing,
      shipped,
      delivered,
      cancelled,
      totalOrders:
        pending + confirmed + processing + shipped + delivered + cancelled,
      revenue: revenueData._sum.lineTotal?.toNumber() ?? 0,
      totalItemsSold: revenueData._sum.quantity ?? 0,
    };
  }),

  // Lấy doanh thu theo tháng của vendor
  getVendorRevenueByMonth: vendorProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const store = await ctx.db.store.findUnique({
      where: { ownerId: userId },
      select: { slug: true },
    });

    if (!store) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Không tìm thấy cửa hàng",
      });
    }

    if (!store) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Không tìm thấy cửa hàng",
      });
    }

    // Lấy doanh thu theo tháng trong 12 tháng qua
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    console.log("now:", now, "twelveMonthsAgo:", twelveMonthsAgo);

    const revenueData = await ctx.db.$queryRaw<
      { month: string; revenue: number }[]
    >`
      SELECT
        TO_CHAR(o."createdAt", 'YYYY-MM') as month,
        SUM(oi."lineTotal")::float as revenue
      FROM "Order" o
      JOIN "OrderItem" oi ON o.id = oi."orderId"
      WHERE oi."storeSlug" = ${store.slug}
        AND o.status = 'DELIVERED'
        AND o."createdAt" >= ${twelveMonthsAgo}
      GROUP BY TO_CHAR(o."createdAt", 'YYYY-MM')
      ORDER BY month
    `;

    console.log("Revenue data:", revenueData);

    // Đảm bảo có dữ liệu cho tất cả 12 tháng
    const months = [];
    let current = new Date(twelveMonthsAgo);
    console.log("current initial:", current);
    for (let i = 0; i < 12; i++) {
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, '0');
      const monthStr = `${year}-${month}`;
      months.push(monthStr);
      current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    }

    console.log("Months:", months);

    const finalRevenueMap = new Map(
      revenueData.map((item) => [item.month, item.revenue])
    );

    const result = months.map((month) => ({
      month,
      revenue: finalRevenueMap.get(month) || 0,
    }));

    console.log("Result:", result);

    return result;
  }),
});

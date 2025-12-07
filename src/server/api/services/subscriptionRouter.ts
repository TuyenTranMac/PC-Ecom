import { publicProcedure, protectedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { subscriptionPlanSchema } from "@/lib/schemas/subscription.schema";

export const subscriptionRouter = createTRPCRouter({
  // Lấy danh sách các gói đăng ký (Public - không cần đăng nhập)
  getPlans: publicProcedure.query(async () => {
    return {
      plans: [
        {
          id: "free",
          name: "FREE",
          price: 0,
          currency: "VND",
          interval: "forever",
          features: [
            "Tối đa 10 sản phẩm",
            "3 ảnh mỗi sản phẩm",
            "Subdomain miễn phí (username.gear.org)",
            "Hỗ trợ qua email",
            "Dashboard cơ bản",
          ],
          maxProducts: 10,
          maxImages: 3,
          customDomain: false,
          prioritySupport: false,
        },
        {
          id: "pro",
          name: "PRO",
          price: 199000,
          currency: "VND",
          interval: "month",
          features: [
            "Sản phẩm không giới hạn",
            "10 ảnh mỗi sản phẩm",
            "Custom domain riêng",
            "Hỗ trợ ưu tiên 24/7",
            "Analytics chi tiết",
            "SEO tools nâng cao",
            "Không có logo Gear",
          ],
          maxProducts: -1, // Unlimited
          maxImages: 10,
          customDomain: true,
          prioritySupport: true,
        },
      ],
    };
  }),

  // Lấy thông tin subscription hiện tại của user (Protected)
  getCurrentSubscription: protectedProcedure.query(async ({ ctx }) => {
    const subscription = await ctx.db.subscription.findUnique({
      where: { userId: ctx.session.user.id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        },
      },
    });

    // Nếu chưa có subscription, tự động tạo FREE
    if (!subscription && ctx.session.user.role === "VENDOR") {
      const newSubscription = await ctx.db.subscription.create({
        data: {
          userId: ctx.session.user.id,
          plan: "FREE",
          status: "ACTIVE",
          maxProducts: 10,
          maxImages: 3,
          customDomain: false,
          prioritySupport: false,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              role: true,
            },
          },
        },
      });
      return newSubscription;
    }

    return subscription;
  }),

  // Đăng ký/nâng cấp gói (Protected)
  subscribeToPlan: protectedProcedure
    .input(subscriptionPlanSchema)
    .mutation(async ({ ctx, input }) => {
      const { plan } = input;

      // Tính toán các giới hạn dựa trên gói
      const limits = {
        FREE: {
          maxProducts: 10,
          maxImages: 3,
          customDomain: false,
          prioritySupport: false,
          endDate: null,
        },
        PRO: {
          maxProducts: -1, // Unlimited
          maxImages: 10,
          customDomain: true,
          prioritySupport: true,
          // Thêm 30 ngày từ bây giờ
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      };

      const planLimits = limits[plan];

      // Lấy thông tin user đầy đủ
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        include: { store: true },
      });

      if (!user) {
        throw new Error("Không tìm thấy user");
      }

      // Nếu chưa là VENDOR, tự động nâng role lên VENDOR
      if (user.role !== "VENDOR") {
        await ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: { role: "VENDOR" },
        });
      }

      // Tạo Store nếu chưa có (dùng username làm slug cho subdomain)
      if (!user.store) {
        // Tạo slug từ username (loại bỏ ký tự đặc biệt, chuyển thành lowercase)
        const slug = user.username
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "");

        // Kiểm tra slug đã tồn tại chưa
        const existingStore = await ctx.db.store.findUnique({
          where: { slug },
        });

        if (existingStore) {
          // Nếu slug đã tồn tại, thêm số random
          const randomSuffix = Math.floor(Math.random() * 9999);
          await ctx.db.store.create({
            data: {
              name: `${user.username}'s Store`,
              slug: `${slug}-${randomSuffix}`,
              ownerId: user.id,
              description: `Chào mừng đến với cửa hàng của ${user.username}`,
              isActive: true,
            },
          });
        } else {
          await ctx.db.store.create({
            data: {
              name: `${user.username}'s Store`,
              slug,
              ownerId: user.id,
              description: `Chào mừng đến với cửa hàng của ${user.username}`,
              isActive: true,
            },
          });
        }
      }

      // Upsert subscription (update nếu có, create nếu chưa)
      const subscription = await ctx.db.subscription.upsert({
        where: { userId: ctx.session.user.id },
        update: {
          plan,
          status: "ACTIVE",
          endDate: planLimits.endDate,
          maxProducts: planLimits.maxProducts,
          maxImages: planLimits.maxImages,
          customDomain: planLimits.customDomain,
          prioritySupport: planLimits.prioritySupport,
        },
        create: {
          userId: ctx.session.user.id,
          plan,
          status: "ACTIVE",
          endDate: planLimits.endDate,
          maxProducts: planLimits.maxProducts,
          maxImages: planLimits.maxImages,
          customDomain: planLimits.customDomain,
          prioritySupport: planLimits.prioritySupport,
        },
      });

      return {
        success: true,
        subscription,
        message:
          plan === "PRO"
            ? "Chúc mừng! Bạn đã trở thành Vendor với gói PRO"
            : "Chúc mừng! Bạn đã trở thành Vendor với gói FREE",
      };
    }),

  // Hủy gói PRO (Protected)
  cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    const subscription = await ctx.db.subscription.findUnique({
      where: { userId: ctx.session.user.id },
    });

    if (!subscription) {
      throw new Error("Không tìm thấy subscription");
    }

    if (subscription.plan === "FREE") {
      throw new Error("Không thể hủy gói FREE");
    }

    // Chuyển về FREE
    const updatedSubscription = await ctx.db.subscription.update({
      where: { userId: ctx.session.user.id },
      data: {
        plan: "FREE",
        status: "ACTIVE",
        endDate: null,
        maxProducts: 10,
        maxImages: 3,
        customDomain: false,
        prioritySupport: false,
      },
    });

    return {
      success: true,
      subscription: updatedSubscription,
      message: "Đã chuyển về gói FREE",
    };
  }),
});

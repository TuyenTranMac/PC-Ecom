import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { signUpSchema, updateProfileSchema } from "@/lib/schemas/auth.schema";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";

export const authRouter = createTRPCRouter({
  signUp: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ ctx, input }) => {
      const { email, password, username } = input;

      // 1. Kiểm tra email đã tồn tại
      const existingUser = await ctx.db.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email đã được sử dụng",
        });
      }

      // 2. Hash password (CRITICAL: Không lưu password raw)
      const hashedPassword = await bcrypt.hash(password, 10);

      // 3. Tạo user mới trong DB
      const user = await ctx.db.user.create({
        data: {
          email,
          password: hashedPassword,
          username,
          role: "USER", // Mặc định là USER
        },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
        },
      });

      return {
        success: true,
        message: "Đăng ký thành công! Hãy đăng nhập.",
        user,
      };
    }),

  // Lấy thông tin profile user hiện tại (từ session token)
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        image: true,
        role: true,
        createdAt: true,
        emailVerified: true,
        Subscription: {
          select: {
            id: true,
            plan: true,
            status: true,
            updatedAt: true,
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

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Không tìm thấy thông tin người dùng",
      });
    }

    return user;
  }),

  // Update profile user
  updateProfile: protectedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Kiểm tra username đã tồn tại (nếu đổi username)
      if (input.username) {
        const existingUser = await ctx.db.user.findFirst({
          where: {
            username: input.username,
            NOT: { id: userId },
          },
        });

        if (existingUser) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Username đã được sử dụng",
          });
        }
      }

      // Xử lý đổi mật khẩu
      let hashedPassword: string | undefined;
      if (input.newPassword && input.currentPassword) {
        const user = await ctx.db.user.findUnique({
          where: { id: userId },
          select: { password: true },
        });

        if (!user?.password) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Tài khoản không có mật khẩu (OAuth)",
          });
        }

        // Verify mật khẩu hiện tại
        const isValidPassword = await bcrypt.compare(
          input.currentPassword,
          user.password
        );

        if (!isValidPassword) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Mật khẩu hiện tại không đúng",
          });
        }

        hashedPassword = await bcrypt.hash(input.newPassword, 10);
      }

      // Update user
      const updatedUser = await ctx.db.user.update({
        where: { id: userId },
        data: {
          ...(input.username && { username: input.username }),
          ...(input.image !== undefined && { image: input.image }),
          ...(hashedPassword && { password: hashedPassword }),
        },
        select: {
          id: true,
          email: true,
          username: true,
          image: true,
          role: true,
        },
      });

      return {
        success: true,
        message: "Cập nhật profile thành công",
        user: updatedUser,
      };
    }),
});

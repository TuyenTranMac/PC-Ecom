import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { signUpSchema } from "@/lib/schemas/auth.schema";
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
});
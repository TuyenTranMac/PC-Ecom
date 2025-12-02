import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma as db } from "@/server/db";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "@/lib/schemas/auth.schema";

export const authConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      
      async authorize(credentials) {
        // 1. Validate input bằng Zod
        const parsed = signInSchema.safeParse(credentials);
        if (!parsed.success) {
          return null; // Trả về null = đăng nhập thất bại
        }

        const { email, password } = parsed.data;

        // 2. Tìm user trong DB
        const user = await db.user.findUnique({
          where: { email },
        });

        // 3. Kiểm tra user tồn tại và có password
        if (!user || !user.password) {
          return null;
        }

        // 4. Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return null;
        }

        // 5. Trả về user object (sẽ được lưu vào JWT)
        return {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role, // CRITICAL: Đưa role vào session
        };
      },
    }),
  ],

  callbacks: {
    // Callback 1: Thêm thông tin vào JWT
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    // Callback 2: Đưa thông tin vào Session object
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "USER" | "VENDOR" | "ADMIN";
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth", // Redirect về trang auth của bạn
  },

  session: {
    strategy: "jwt", // Dùng JWT thay vì database sessions
  },
} satisfies NextAuthConfig;
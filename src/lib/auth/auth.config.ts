import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma as db } from "@/server/db";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "@/lib/schemas/auth.schema";

const useSecureCookies = process.env.NODE_ENV === "production";
const cookiePrefix = useSecureCookies ? "__Secure-" : "";
const hostName = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost";

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
    // Callback 1: Thêm thông tin vào JWT (không query DB để tránh Edge Runtime error)
    async jwt({ token, user, trigger }) {
      // Lần đầu login: lưu thông tin user vào token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
      }

      // QUAN TRỌNG: Không query DB ở đây vì middleware chạy trên Edge Runtime
      // Nếu cần refresh role/username, phải làm ở server action/API route riêng
      // và gọi update() từ client

      return token;
    },

    // Callback 2: Đưa thông tin vào Session object
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "USER" | "VENDOR" | "ADMIN";
        session.user.username = token.username as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth",
  },

  session: {
    strategy: "jwt",
  },

  events: {
    async signOut(message) {},
  },
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}authjs.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        // QUAN TRỌNG: Dấu chấm ở đầu (.gear.org) cho phép tất cả subdomain truy cập cookie
        // Với localhost, ta thường để undefined hoặc set trong file hosts,
        // nhưng để đơn giản ta sẽ logic như sau:
        domain: useSecureCookies
          ? `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
          : undefined,
      },
    },
  },
} satisfies NextAuthConfig;

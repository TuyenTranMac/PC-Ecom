import { auth } from "./auth";
import { cache } from "react";

/**
 * Lấy session ở Server Component (RSC)
 * Dùng cache() để tránh gọi lại nhiều lần trong 1 request
 */
export const getSession = cache(async () => {
  return await auth();
});

/**
 * Kiểm tra user đã đăng nhập chưa
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

/**
 * Kiểm tra role
 */
export async function requireRole(role: "ADMIN" | "VENDOR" | "USER") {
  const user = await requireAuth();
  if (user.role !== role) {
    throw new Error("Forbidden");
  }
  return user;
}
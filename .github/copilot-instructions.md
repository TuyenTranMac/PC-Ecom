# Hướng dẫn cho GitHub Copilot - Dự án E-commerce Multi-Vendor (Gear)

Bạn là một trợ lý lập trình AI cao cấp (Senior Engineer), am hiểu sâu về Tech Stack hiện đại (Bleeding Edge) và ngữ cảnh kinh doanh tại Việt Nam.

## 1. Tech Stack & Phiên bản

Dự án sử dụng các phiên bản rất mới (Bleeding Edge):

- **Framework:** Next.js 15.5.3 (App Router).
- **Library:** React 19.1.0.
- **Styling:** Tailwind CSS v4.1.13 (Config trong CSS native `@theme`).
- **Backend/API:** tRPC v11.6.0.
- **Database:** PostgreSQL + Prisma v5.
- **Payment:** SePay.

## 2. Chiến lược Fetching & Render (BẮT BUỘC TUÂN THỦ)

Dự án tuân thủ nghiêm ngặt kiến trúc **Server Components First** để tối ưu tốc độ và SEO.

### Quy tắc Data Fetching:

1.  **Mặc định là Server Component (RSC):** Tất cả các Page (`page.tsx`) và Layout (`layout.tsx`) mặc định là Server Component.
2.  **Cách lấy dữ liệu (Critical):**
    - **KHÔNG** sử dụng `use client` để fetch data.
    - **KHÔNG** dùng tRPC React Hooks (`trpc.example.useQuery`) ở các trang chính.
    - **PHẢI** dùng **tRPC Server Caller** để gọi trực tiếp procedure trong RSC.
    - _Ví dụ đúng:_

      ```tsx
      // page.tsx (Server Component)
      import { api } from "@/trpc/server"; // Import từ server caller

      export default async function Page() {
        const products = await api.product.getAll(); // Gọi trực tiếp như hàm async
        return <ProductList initialData={products} />;
      }
      ```
3.  **Client Component:** Chỉ sử dụng `use client` cho các component nhỏ ở lá (leaf components) cần tương tác (onClick, onChange, Framer Motion, Shadcn UI hooks).

## 3. Ngữ cảnh Nghiệp vụ (Business Logic)

### Roles & Phân quyền:

Hệ thống có 3 role: **Admin**, **Vendor**, **User**.

### Logic Multi-Vendor & Subdomain:

- **Cơ chế:** Username của Vendor là Subdomain.
  - Prod: `tuyentran0604.gear.org`
  - Dev: `tuyentran0604.localhost:3000`
- **Yêu cầu:** Middleware và Routing phải xử lý được cả localhost và domain thật. Nhắc tôi config file `hosts` nếu cần.

### Thanh toán (SePay):

- **Quy trình:** Khi code Webhook/Verify, hãy **yêu cầu tôi cung cấp JSON mẫu** của SePay để parse chính xác.
- **Bảo mật:** Luôn verify signature để chống giả mạo.

## 4. Quy tắc Coding & Bảo mật

- **Validation:** Input qua Zod schema là bắt buộc.
- **Style:** Code giao tiếp và giải thích bằng **Tiếng Việt**.
- **Nhắc nhở:** Nếu thấy tôi dùng `useEffect` hoặc fetch data ở Client Component không cần thiết, hãy cảnh báo: **"Chuyển logic này về Server Component dùng tRPC Caller đi bạn cho nhanh"**.
- **Tailwind v4:** Không suggest config trong `tailwind.config.js`, hãy dùng biến CSS.

---

Hãy cư xử như một Senior Developer, ưu tiên Performance (Server-side) và Bảo mật thực tế.

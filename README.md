<<<<<<< HEAD
# THESIS_PLAN.md

## 🎯 Mục tiêu khóa luận
Xây dựng hệ thống **E-commerce bán gear máy tính** tích hợp **AI gợi ý build PC**.  
- Người dùng: mua sản phẩm lẻ, build PC theo AI, chat hỗ trợ với mod.  
- Admin/Mod: quản lý sản phẩm, đơn hàng, ticket hỗ trợ.  
- Công nghệ: **NestJS + TypeScript**, **React + TypeScript**, **Postgres (Docker)**, **Socket.IO**, **AI API**, **CI/CD với GitHub Actions**.  
- Deploy: staging + production auto-deploy sau mỗi milestone.  

---

## 🗂️ Các module chính
- **Auth**: đăng ký, đăng nhập, phân quyền (admin, mod, user).  
- **Product**: CRUD sản phẩm, tồn kho.  
- **Cart/Order**: giỏ hàng, checkout, lịch sử mua hàng.  
- **Build PC**: người dùng build, AI gợi ý cấu hình.  
- **Ticket/Chat**: gửi ticket, realtime chat với mod.  
- **Admin Panel**: quản lý sản phẩm, đơn hàng, user, ticket.  

---


## 🎯 Mục tiêu 20 ngày chuẩn bị
- Ôn lại kiến thức cốt lõi (JS/TS, NestJS, ReactJS, Docker).
- Chuẩn bị đầy đủ hạ tầng (repo, CI/CD, Docker, base project).
- Chuẩn bị học thuật (outline, tài liệu tham khảo, nhật ký).
- Đảm bảo khi bước vào 3 tháng khóa luận có thể bắt tay làm ngay.

---

## 📚 Nhóm 1: Ôn tập + Làm nóng

### JavaScript / TypeScript
- [ ] Ôn cú pháp ES6+, async/await, promise.
- [ ] Ôn module system (import/export).
- [ ] TypeScript cơ bản: type, interface, generics.
- [ ] Thực hành: viết 3 hàm tiện ích (sort, filter, group) bằng JS → convert sang TS.

### NestJS
- [ ] Tạo mini API CRUD (User).
- [ ] Ôn lại: Controller, Service, Module, DTO, Entity.
- [ ] Thêm validation (class-validator).
- [ ] Kết nối PostgreSQL (TypeORM).
- [ ] Viết unit test cơ bản bằng Jest.

### ReactJS
- [ ] Ôn hook cơ bản: useState, useEffect, useContext, useReducer.
- [ ] Ôn React Router.
- [ ] Tạo mini dashboard: login form, table CRUD demo.
- [ ] Thử kết nối mini API NestJS.

### Docker
- [ ] Ôn Dockerfile (Node app).
- [ ] Tạo Docker Compose (Postgres + pgAdmin).
- [ ] Build & run local stack.
- [ ] Push image lên DockerHub (demo).

---

## 🛠 Nhóm 2: Chuẩn bị hạ tầng dự án

### Repo & Project Base
- [ ] Tạo GitHub repo (public/private).
- [ ] Thêm file: `README.md`, `THESIS_PLAN.md`, `PREP_PLAN.md`, `.gitignore`, `LICENSE`.
- [ ] Tạo folder `backend/` (NestJS) → `nest new backend`.
- [ ] Tạo folder `frontend/` (ReactJS + Vite).
- [ ] Push base code lên repo.

### Database & Docker
- [ ] Viết Docker Compose (Postgres + pgAdmin).
- [ ] Config backend kết nối Postgres qua Docker.
- [ ] Test: tạo bảng User + insert demo.

### CI/CD & Workflow
- [ ] Thiết lập branch strategy: `main` (release), `dev` (integration), `feature/*`.
- [ ] Thêm GitHub Actions: lint + build + test (backend + frontend).
- [ ] Deploy thử backend (Heroku/Render/Railway free tier).
- [ ] Deploy thử frontend (Vercel/Netlify).

---

## 📑 Nhóm 3: Chuẩn bị học thuật

### Đề tài & Outline
- [ ] Viết tóm tắt 1 trang: tên đề tài, mục tiêu, phạm vi.
- [ ] Xác định chức năng chính của hệ thống (Admin, Mod, User).
- [ ] Vẽ sơ đồ use case tổng quan.
- [ ] Soạn outline báo cáo (Mở đầu → Cơ sở lý thuyết → Hệ thống → Demo → Kết quả).

### Tài liệu & Nhật ký
- [ ] Tạo folder `docs/` trong repo.
- [ ] Lưu các reference (bài báo, docs, repo GitHub).
- [ ] Tạo `log.md` → ghi nhanh nhật ký phát triển mỗi ngày.
- [ ] Thêm file `refs.bib` hoặc `refs.md` để cuối ghép vào “Tài liệu tham khảo”.

---

## ✅ Kết quả mong đợi sau 20 ngày
- Thành thạo lại cú pháp & workflow cơ bản JS/TS, NestJS, ReactJS, Docker.
- Repo GitHub sẵn sàng, có base code, CI/CD hoạt động.
- Database & Docker Compose chạy ổn.
- Có outline báo cáo, nhật ký, tài liệu tham khảo.
- Tự tin bước vào 3 tháng khóa luận. 

---

### Week 1 — Project skeleton + Auth
- [ ] NestJS init, Prisma setup, connect Postgres (docker).  
- [ ] Tạo module Auth (register/login, JWT, bcrypt).  
- [ ] Role-based guards (admin/mod/user).  
- [ ] React init, React Router, auth context.  
- [ ] Deploy staging với Auth flow.  

---

### Week 2 — Product CRUD & Admin page
- [ ] API CRUD products (Nest + Prisma).  
- [ ] Image upload (local/S3 mock).  
- [ ] Admin page: thêm/sửa/xoá sản phẩm.  
- [ ] Public product listing trên frontend.  

---

### Week 3 — Cart + Orders
- [ ] API giỏ hàng (add/remove item, view cart).  
- [ ] API checkout order (dummy payment).  
- [ ] Lịch sử đơn hàng (user).  
- [ ] Frontend: giỏ hàng + checkout UI.  
- [ ] Unit test basic cho order flow.  

---

### Week 4 — Build PC (UI & rules)
- [ ] Table compatibility_rules trong DB.  
- [ ] API build (tạo build, lưu component user chọn).  
- [ ] Frontend: UI chọn linh kiện, hiển thị rule cảnh báo.  
- [ ] Deploy build PC basic (chưa AI).  

---

### Week 5 — AI integration (gợi ý build)
- [ ] Service gọi LLM API để gợi ý cấu hình.  
- [ ] Prompt template + logging (ai_prompts_logs).  
- [ ] Queue AI job bằng BullMQ + Redis.  
- [ ] Frontend: hiển thị suggestion.  
- [ ] Demo build PC với AI gợi ý.  

---

### Week 6 — Ticket system + Chat
- [ ] API tickets (CRUD, assign mod).  
- [ ] Socket.IO Gateway: room theo ticket.  
- [ ] Role check (user & mod được join).  
- [ ] Frontend: gửi ticket, chat UI realtime.  
- [ ] Save message history DB.  

---

### Week 7 — Inventory & stock rules
- [ ] DB transaction cho checkout (reserve stock).  
- [ ] Update tồn kho khi order.  
- [ ] Admin page: quản lý stock.  
- [ ] Thêm log thay đổi stock.  

---

### Week 8 — UI polish & testing
- [ ] Responsive UI (React Bootstrap/AntD).  
- [ ] Form validation (class-validator, Yup).  
- [ ] Unit tests backend (Jest).  
- [ ] Integration tests frontend (RTL/Cypress).  
- [ ] Staging deploy với demo full flow.  

---

### Week 9 — Payment sandbox
- [ ] Tích hợp Stripe sandbox (hoặc mock service).  
- [ ] Webhook cập nhật trạng thái order.  
- [ ] Frontend: UI thanh toán.  
- [ ] Email/SMS notification (SendGrid/Twilio sandbox).  

---

### Week 10 — Monitoring & backup
- [ ] Logging (Winston, Morgan).  
- [ ] Error tracking (Sentry).  
- [ ] Metrics Prometheus + basic Grafana dashboard.  
- [ ] Script backup Postgres DB.  

---

### Week 11 — Performance & optimization
- [ ] Redis cache cho products list.  
- [ ] Optimize query (Prisma indexes).  
- [ ] AI prompt tuning.  
- [ ] Load test basic (k6/Artillery).  

---

### Week 12 — Report & Demo
- [ ] Final deploy production.  
- [ ] Chuẩn bị slide báo cáo.  
- [ ] Video demo 5–7 phút (3 scenario: mua hàng, build AI PC, chat support).  
- [ ] Viết docs (README + THESIS_REPORT.md).  
- [ ] Backup DB + export seed.  

---

## 📌 Deliverables
- [ ] Source code (backend + frontend).  
- [ ] Docker setup (docker-compose).  
- [ ] Prisma schema + migration.  
- [ ] Postman collection / OpenAPI docs.  
- [ ] Test coverage report.  
- [ ] Deployment link (staging + prod).  
- [ ] Slide + video demo.  
- [ ] Report (theory + implementation + evaluation).  

---

## 🚀 Lưu ý quan trọng
- Sau mỗi tuần phải merge → CI/CD → deploy staging.  
- Mỗi module phải có migration + seed data.  
- AI prompt & response phải được log để reproducible.  
- Chú ý bảo mật (JWT expiry, bcrypt hash, role guard).  
- Viết log rõ ràng (ai_actions, audit_logs).  
- Backup định kỳ (DB & file).  

=======
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
>>>>>>> 7b4b793 (Initial commit from Create Next App)

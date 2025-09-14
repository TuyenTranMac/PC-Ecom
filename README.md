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

## 📅 Timeline 12 tuần

### Pre-start (20 ngày trước)
- [ ] Chuẩn bị repo GitHub (monorepo hoặc multi-repo).  
- [ ] Docker-compose cho Postgres + Redis.  
- [ ] Khởi tạo NestJS + React skeleton.  
- [ ] Thiết kế ERD + API spec (OpenAPI/Postman).  
- [ ] Tạo CI/CD skeleton (GitHub Actions build + lint + test).  
- [ ] Wireframe giao diện (Figma cơ bản).  

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


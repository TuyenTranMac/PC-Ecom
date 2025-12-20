# 💰 Hướng dẫn tích hợp SePay Payment Gateway

> **SePay Payment Gateway** là cổng thanh toán trung gian, cho phép thanh toán qua QR Banking và Thẻ.
>
> **Luồng:** User checkout → Submit form → Redirect sang SePay → Thanh toán → IPN callback + Redirect về website

## 📋 Tổng quan tính năng

✅ Form checkout tự động redirect sang SePay  
✅ HMAC-SHA256 signature để bảo mật  
✅ IPN (Instant Payment Notification) webhook real-time  
✅ Callback pages (Success/Error/Cancel)  
✅ X-Secret-Key header verification  
✅ Amount matching & duplicate prevention

---

## 🚀 BƯỚC 1: Đăng ký SePay Merchant

### 1.1. Tạo tài khoản

1. Truy cập: **https://my.sepay.vn/register**
2. Đăng ký tài khoản (email + số điện thoại)
3. Xác thực email

### 1.2. Kích hoạt Cổng Thanh Toán

1. Đăng nhập **https://my.sepay.vn**
2. Vào **CỔNG THANH TOÁN** → **"Đăng ký"**
3. Chọn **"Quét mã QR chuyển khoản ngân hàng"**
4. Click **"Bắt đầu ngay"**

### 1.3. Chọn môi trường (Sandbox/Production)

#### **📦 Sandbox (Test):**

- Click **"Bắt đầu với Sandbox"**
- Click **"Bắt đầu hướng dẫn tích hợp"**
- Chọn phương thức: **API (PHP/NodeJS SDK)**
- Click **"Tiếp tục"**

#### **🔑 Lấy thông tin tích hợp:**

Bạn sẽ nhận được màn hình "Thông tin tích hợp" với:

- **MERCHANT_ID**: Mã merchant (VD: `NQD`)
- **SECRET_KEY**: Key bí mật dùng cho HMAC signature (VD: `5c89edb...`)

**⚠️ QUAN TRỌNG:** Sao chép và lưu lại 2 thông tin này!

---

## 🔧 BƯỚC 2: Cấu hình Environment Variables

### 2.1. Tạo file `.env.local`

```bash
cp .env.example .env.local
```

### 2.2. Điền thông tin SePay

Mở file `.env.local` và cập nhật:

```env
# =========================
# SEPAY PAYMENT GATEWAY
# =========================
SEPAY_MERCHANT_ID=NQD                    # Copy từ "Thông tin tích hợp"
SEPAY_SECRET_KEY=5c89edb...              # Copy từ "Thông tin tích hợp"
SEPAY_ENVIRONMENT=sandbox                # sandbox | production
```

**Giải thích:**

- `MERCHANT_ID`: ID merchant của bạn từ SePay
- `SECRET_KEY`: Dùng để tạo HMAC signature và verify IPN
- `ENVIRONMENT`:
  - `sandbox` → Môi trường test (không charge tiền thật)
  - `production` → Môi trường thật (charge tiền thật)

---

## 🌐 BƯỚC 3: Cấu hình IPN Webhook

**IPN (Instant Payment Notification)** là webhook nhận thông báo khi thanh toán thành công.

### 3.1. 🌍 Production (Server có domain)

1. Deploy app lên server (VD: `https://yourdomain.com`)
2. Trong SePay Dashboard, tìm mục **"IPN URL"** hoặc **"Webhook URL"**
3. Nhập URL:
   ```
   https://yourdomain.com/api/webhooks/sepay
   ```
4. Click **"Lưu cấu hình"**

### 3.2. 💻 Development (Test local với ngrok)

Để test webhook trên localhost, cần expose qua ngrok:

```bash
# 1. Cài ngrok
npm install -g ngrok

# 2. Chạy dev server
bun run dev

# 3. Expose port 3000
ngrok http 3000

# 4. Copy URL từ ngrok
# Output: https://abc123.ngrok-free.app

# 5. Config IPN URL trong SePay Dashboard:
https://abc123.ngrok-free.app/api/webhooks/sepay
```

**📝 Lưu ý:**

- IPN URL **PHẢI** là HTTPS
- Endpoint phải trả về HTTP status **200** để xác nhận đã nhận
- Mỗi lần restart ngrok, URL sẽ thay đổi → Phải cập nhật lại trong Dashboard

---

## 🧪 BƯỚC 4: Test tích hợp

### 4.1. Flow test checkout

```bash
# 1. Start dev server
bun run dev
```

**2. Thêm sản phẩm vào giỏ:**

- Browse website → Chọn sản phẩm → Add to cart

**3. Checkout:**

- Vào trang `/checkout`
- Điền thông tin giao hàng
- Chọn phương thức thanh toán: **"Chuyển khoản ngân hàng (SePay)"**
- Click **"Đặt hàng"**

**4. Redirect sang SePay:**

- Form tự động submit (có thể thấy flash 1 form HTML)
- Redirect sang trang thanh toán SePay
- Hiển thị QR code hoặc form nhập thẻ

**5. Thanh toán (Sandbox mode):**

- Sandbox không charge tiền thật
- Có thể dùng test QR/Card do SePay cung cấp
- Hoặc cancel để test cancel flow

**6. Callback:**

- Sau khi thanh toán thành công → Redirect về `/payment/success`
- Sau 5 giây tự động redirect về `/orders`

### 4.2. Verify IPN webhook

Mở terminal backend, bạn sẽ thấy logs:

```
=== SEPAY IPN RECEIVED ===
Payload: {
  "timestamp": 1759134682,
  "notification_type": "ORDER_PAID",
  "order": {
    "order_invoice_number": "ORDER123",
    "order_amount": "100000.00",
    "order_status": "CAPTURED"
  },
  "transaction": {
    "transaction_status": "APPROVED",
    "transaction_id": "68da43..."
  }
}
✅ Order ORDER123 payment confirmed
```

**Kiểm tra database:**

```sql
SELECT * FROM "Order" WHERE code = 'ORDER123';
-- paymentStatus should be 'PAID'
-- status should be 'CONFIRMED'

SELECT * FROM "Payment" WHERE orderId = '...';
-- status should be 'PAID'
-- transactionId should match IPN payload
```

---

## 📂 Cấu trúc code

```
src/
├── lib/payment/
│   ├── sepay.config.ts              # MERCHANT_ID, SECRET_KEY, constants
│   └── sepay-gateway.service.ts     # Generate form, HMAC signature
│
├── app/api/webhooks/sepay/
│   └── route.ts                     # IPN webhook endpoint
│
├── app/payment/
│   ├── success/page.tsx             # Success callback
│   ├── error/page.tsx               # Error callback
│   └── cancel/page.tsx              # Cancel callback
│
└── modules/checkout/ui/
    └── CheckoutForm.tsx             # Form checkout (auto-submit)
```

---

## 🔄 Luồng hoạt động chi tiết

```
┌────────────┐
│    USER    │
│  Checkout  │
└─────┬──────┘
      │
      │ 1. Submit form
      ▼
┌────────────┐
│  BACKEND   │
│Create Order│─────┐
└─────┬──────┘     │ 2. Generate checkout form
      │            │    with HMAC signature
      │            │
      │ 3. Return  │
      │    HTML    │
      ▼            ▼
┌────────────────────┐
│   Auto-submit      │
│   Form to SePay    │
└─────┬──────────────┘
      │
      │ 4. Redirect (POST)
      ▼
┌────────────┐
│   SEPAY    │
│  Gateway   │
└─────┬──────┘
      │
      │ 5. Show payment page
      │    (QR/Card)
      │
      │ 6. User pays
      ▼
┌────────────┐
│Transaction │
│ Processing │
└─────┬──────┘
      │
      ├──────────────────┐
      │                  │
      │ 7a. IPN (POST)   │ 7b. Redirect (GET)
      ▼                  ▼
┌─────────────┐    ┌──────────────┐
│  WEBHOOK    │    │   CALLBACK   │
│   /api/     │    │   /payment/  │
│  webhooks/  │    │    success   │
│   sepay     │    └──────────────┘
└─────────────┘
      │
      │ 8. Verify signature
      │ 9. Update order status
      │ 10. Return 200 OK
      ▼
   [DONE]
```

**Chi tiết:**

1. **User submit checkout** → Backend tạo order
2. **Backend generate form** với HMAC signature
3. **Return HTML form** tới browser
4. **Form tự động submit** (redirect POST) sang SePay
5. **SePay show payment page** (QR code hoặc form card)
6. **User thanh toán**
7. **SePay xử lý transaction** → 2 hành động song song:
   - **7a. IPN:** POST request tới backend webhook (background)
   - **7b. Redirect:** GET request redirect user về callback URL
8. **Backend verify signature** từ IPN
9. **Update order status** trong database
10. **Return 200 OK** cho SePay

---

## 🔐 Bảo mật

### 1. HMAC Signature (Form checkout)

Khi generate form, backend tạo signature:

```typescript
// sepay-gateway.service.ts
const generateCheckoutSignature = (data, secretKey) => {
  // 1. Sort keys alphabetically
  const sortedKeys = Object.keys(data).sort();

  // 2. Join với format: key1=value1|key2=value2|...
  const signatureString = sortedKeys
    .map((key) => `${key}=${data[key]}`)
    .join("|");

  // 3. HMAC-SHA256
  return crypto
    .createHmac("sha256", secretKey)
    .update(signatureString)
    .digest("hex");
};
```

### 2. IPN Verification

Backend verify X-Secret-Key header:

```typescript
// webhook/route.ts
const secretKeyHeader = req.headers.get("x-secret-key");

if (secretKeyHeader !== process.env.SEPAY_SECRET_KEY) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

### 3. Amount Matching

```typescript
const orderAmount = parseFloat(order.total.toString());
const paidAmount = parseFloat(payload.order.order_amount);

if (paidAmount < orderAmount) {
  // Log error, create failed payment record
  // Không update order status
}
```

### 4. Duplicate Prevention

```typescript
if (order.paymentStatus === "PAID") {
  // Already paid, skip processing
  return NextResponse.json({ message: "Already paid" });
}
```

---

## 🐛 Khắc phục lỗi

### ❌ "Missing signature"

**Nguyên nhân:** Form không có signature field

**Fix:**

```typescript
// Check generateCheckoutForm() có return signature không
console.log("Signature:", signature);
```

### ❌ "Unauthorized" (IPN)

**Nguyên nhân:** X-Secret-Key không khớp

**Fix:**

1. Check `.env.local` có `SEPAY_SECRET_KEY` chưa
2. So sánh với SECRET_KEY trong SePay Dashboard
3. Log header:
   ```typescript
   console.log("Received:", req.headers.get("x-secret-key"));
   console.log("Expected:", process.env.SEPAY_SECRET_KEY);
   ```

### ❌ "Order not found"

**Nguyên nhân:** Order chưa được tạo hoặc code không khớp

**Fix:**

1. Check `createOrder` mutation có lỗi không
2. Verify `order_invoice_number` trong IPN:
   ```typescript
   console.log("Looking for order:", payload.order.order_invoice_number);
   ```
3. Check database:
   ```sql
   SELECT * FROM "Order" WHERE code = 'ORDER123';
   ```

### ❌ Redirect không hoạt động

**Nguyên nhân:** JavaScript bị block hoặc form không submit

**Fix:**

1. Check browser console có errors không
2. Test form HTML manual (thêm visible button)
3. Verify form được inject vào DOM:
   ```typescript
   console.log(
     "Form injected:",
     document.querySelector("#sepay-checkout-form")
   );
   ```

### ❌ IPN không nhận được

**Nguyên nhân:** URL không accessible

**Fix:**

1. **Development:** Check ngrok còn chạy không
2. **Production:** Test webhook URL với curl:
   ```bash
   curl -X POST https://yourdomain.com/api/webhooks/sepay \
     -H "Content-Type: application/json" \
     -H "x-secret-key: your_secret" \
     -d '{"test": true}'
   ```
3. Check firewall/security groups
4. Verify endpoint return status 200

---

## 📚 Tài liệu tham khảo

- [SePay Payment Gateway - Bắt đầu](https://developer.sepay.vn/vi/cong-thanh-toan/bat-dau)
- [SePay IPN Documentation](https://developer.sepay.vn/vi/cong-thanh-toan/IPN)
- [SePay Dashboard](https://my.sepay.vn)
- [VietQR Standard](https://www.vietqr.io/)

---

## ✅ Checklist triển khai

### 📦 Sandbox Testing:

- [ ] Config `SEPAY_MERCHANT_ID` + `SEPAY_SECRET_KEY` (sandbox)
- [ ] Config IPN URL với ngrok
- [ ] Test checkout flow end-to-end
- [ ] Verify IPN webhook nhận được và update order
- [ ] Test 3 callback URLs (success/error/cancel)
- [ ] Test amount matching logic
- [ ] Test duplicate payment prevention
- [ ] Test timeout scenario

### 🚀 Production:

- [ ] Liên hệ SePay chuyển sang Production
- [ ] Lấy `MERCHANT_ID` + `SECRET_KEY` production
- [ ] Update `.env`: `SEPAY_ENVIRONMENT=production`
- [ ] Update IPN URL: `https://yourdomain.com/api/webhooks/sepay`
- [ ] Deploy lên production server
- [ ] Test với số tiền nhỏ (10,000 VND)
- [ ] Verify IPN logs
- [ ] Setup monitoring (Sentry/DataDog)
- [ ] Document production credentials an toàn
- [ ] Train team về troubleshooting

---

## 💡 Tips & Best Practices

### 1. Logging

Log tất cả IPN payloads để debug:

```typescript
console.log("=== IPN RECEIVED ===", JSON.stringify(payload, null, 2));
```

### 2. Error handling

Luôn return 200 OK cho SePay ngay cả khi có lỗi internal:

```typescript
try {
  // Process payment
} catch (error) {
  // Log error nhưng vẫn return 200
  console.error(error);
  return NextResponse.json({ success: true }); // ⚠️
}
```

### 3. Idempotency

Dùng transaction ID để prevent duplicate processing:

```typescript
const existingPayment = await prisma.payment.findFirst({
  where: { transactionId: payload.transaction.transaction_id },
});

if (existingPayment) {
  return NextResponse.json({ message: "Already processed" });
}
```

### 4. Monitoring

Setup alerts cho:

- IPN webhook failures
- Amount mismatches
- Unauthorized access attempts
- Slow response times (>3s)

---

**🎉 Hoàn tất! Hệ thống đã sẵn sàng nhận thanh toán qua SePay!**

Nếu cần hỗ trợ, check:

1. Browser console (frontend errors)
2. Terminal logs (backend errors)
3. SePay Dashboard logs
4. Database records (Order + Payment tables)

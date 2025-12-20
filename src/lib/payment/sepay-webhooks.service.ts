/**
 * SePay Webhooks API Service (Bank Transfer QR)
 *
 * Docs: https://developer.sepay.vn/sepay-webhooks/tich-hop-webhook
 * Flow: Generate QR → User scan → Bank transfer → SePay webhook → Verify
 */

import crypto from "crypto";

// ===========================
// 🔐 CONFIG
// ===========================
export const SEPAY_WEBHOOKS_CONFIG = {
  API_KEY: process.env.SEPAY_API_KEY!,
  ACCOUNT_NUMBER: process.env.SEPAY_ACCOUNT_NUMBER!,
  ACCOUNT_NAME: process.env.SEPAY_ACCOUNT_NAME!,
  BANK_CODE: process.env.SEPAY_BANK_CODE!,
  BANK_NAME: process.env.SEPAY_BANK_NAME!,
  WEBHOOK_SECRET: process.env.SEPAY_WEBHOOK_SECRET!,
} as const;

// Validate config
if (
  !SEPAY_WEBHOOKS_CONFIG.API_KEY ||
  !SEPAY_WEBHOOKS_CONFIG.ACCOUNT_NUMBER ||
  !SEPAY_WEBHOOKS_CONFIG.WEBHOOK_SECRET
) {
  throw new Error(
    "Missing SePay Webhooks config. Check .env.local variables: SEPAY_API_KEY, SEPAY_ACCOUNT_NUMBER, SEPAY_WEBHOOK_SECRET"
  );
}

// ===========================
// 📦 TYPES
// ===========================
export interface PaymentQRData {
  accountNumber: string;
  accountName: string;
  bankCode: string;
  bankName: string;
  amount: number;
  content: string; // Transfer description (order code)
  qrCodeUrl: string; // VietQR URL
}

export interface WebhookPayload {
  id: string;
  gateway: string;
  transactionDate: string;
  accountNumber: string;
  subAccount: string | null;
  transferType: string;
  transferAmount: number;
  accumulated: number;
  code: string | null;
  content: string; // Contains order code
  referenceCode: string;
  description: string;
  bankBrandName: string;
  bankName: string | null;
  bankNumber: string | null;
  bankAccount: string | null;
}

// ===========================
// 🎨 GENERATE QR CODE DATA
// ===========================
/**
 * Tạo dữ liệu để hiển thị QR code thanh toán
 *
 * @param orderCode - Mã đơn hàng (VD: ORD-123456)
 * @param amount - Số tiền (VND)
 * @returns PaymentQRData
 */
export const generatePaymentQR = (
  orderCode: string,
  amount: number
): PaymentQRData => {
  // Format transfer content theo chuẩn: TT <orderCode> hoặc chỉ orderCode
  const content = orderCode.toUpperCase();

  // VietQR API URL (Napas standard)
  const qrCodeUrl = `https://img.vietqr.io/image/${SEPAY_WEBHOOKS_CONFIG.BANK_CODE}-${SEPAY_WEBHOOKS_CONFIG.ACCOUNT_NUMBER}-compact2.jpg?amount=${amount}&addInfo=${encodeURIComponent(content)}&accountName=${encodeURIComponent(SEPAY_WEBHOOKS_CONFIG.ACCOUNT_NAME)}`;

  return {
    accountNumber: SEPAY_WEBHOOKS_CONFIG.ACCOUNT_NUMBER,
    accountName: SEPAY_WEBHOOKS_CONFIG.ACCOUNT_NAME,
    bankCode: SEPAY_WEBHOOKS_CONFIG.BANK_CODE,
    bankName: SEPAY_WEBHOOKS_CONFIG.BANK_NAME,
    amount,
    content,
    qrCodeUrl,
  };
};

// ===========================
// 🔐 VERIFY WEBHOOK SIGNATURE
// ===========================
/**
 * Xác thực webhook từ SePay
 *
 * SePay gửi signature trong header: X-Signature hoặc trong body
 * Signature = HMAC-SHA256(webhook_payload, WEBHOOK_SECRET)
 *
 * @param payload - Webhook payload từ SePay
 * @param receivedSignature - Signature từ header/body
 * @returns true nếu hợp lệ
 */
export const verifyWebhookSignature = (
  payload: string | object,
  receivedSignature: string
): boolean => {
  const payloadString =
    typeof payload === "string" ? payload : JSON.stringify(payload);

  const expectedSignature = crypto
    .createHmac("sha256", SEPAY_WEBHOOKS_CONFIG.WEBHOOK_SECRET)
    .update(payloadString)
    .digest("hex");

  return expectedSignature === receivedSignature;
};

// ===========================
// 🔍 EXTRACT ORDER CODE FROM CONTENT
// ===========================
/**
 * Trích xuất order code từ transfer content
 *
 * Content format: "TT ORD-123456" hoặc "ORD-123456" hoặc "thanh toan ORD-123456"
 *
 * @param content - Nội dung chuyển khoản
 * @returns Order code hoặc null
 */
export const extractOrderCode = (content: string): string | null => {
  if (!content) return null;

  // Regex để tìm pattern ORD-xxxxxx
  const regex = /ORD-[A-Z0-9]+/i;
  const match = content.match(regex);

  return match ? match[0].toUpperCase() : null;
};

// ===========================
// ✅ VALIDATE PAYMENT
// ===========================
/**
 * Validate webhook payment data
 *
 * @param webhook - Webhook payload
 * @param expectedOrderCode - Order code mong đợi
 * @param expectedAmount - Số tiền mong đợi
 * @returns true nếu hợp lệ
 */
export const validatePayment = (
  webhook: WebhookPayload,
  expectedOrderCode: string,
  expectedAmount: number
): {
  valid: boolean;
  reason?: string;
} => {
  // 1. Check account number match
  if (webhook.accountNumber !== SEPAY_WEBHOOKS_CONFIG.ACCOUNT_NUMBER) {
    return {
      valid: false,
      reason: "Account number mismatch",
    };
  }

  // 2. Extract order code from content
  const orderCode = extractOrderCode(webhook.content);
  if (!orderCode) {
    return {
      valid: false,
      reason: "Order code not found in transfer content",
    };
  }

  // 3. Check order code match
  if (orderCode !== expectedOrderCode.toUpperCase()) {
    return {
      valid: false,
      reason: `Order code mismatch. Expected: ${expectedOrderCode}, Got: ${orderCode}`,
    };
  }

  // 4. Check amount match (allow ±1000 VND tolerance)
  const amountDiff = Math.abs(webhook.transferAmount - expectedAmount);
  if (amountDiff > 1000) {
    return {
      valid: false,
      reason: `Amount mismatch. Expected: ${expectedAmount}, Got: ${webhook.transferAmount}`,
    };
  }

  return { valid: true };
};

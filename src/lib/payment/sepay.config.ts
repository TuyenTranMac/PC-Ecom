/**
 * SePay Payment Gateway Configuration & Constants
 *
 * Docs: https://developer.sepay.vn/vi/cong-thanh-toan/bat-dau
 * Dashboard: https://my.sepay.vn/pg/payment-methods
 */

// ===========================
// 🔐 ENVIRONMENT VARIABLES
// ===========================
export const SEPAY_CONFIG = {
  // Merchant Authentication
  MERCHANT_ID: process.env.SEPAY_MERCHANT_ID!,
  SECRET_KEY: process.env.SEPAY_SECRET_KEY!,

  // Environment
  ENVIRONMENT: (process.env.SEPAY_ENVIRONMENT || "sandbox") as
    | "sandbox"
    | "production",

  // Endpoints
  SANDBOX_URL: "https://sandbox.sepay.vn/v1/checkout/init",
  PRODUCTION_URL: "https://pay.sepay.vn/v1/checkout/init",

  // Transaction timeout (phút)
  TRANSACTION_TIMEOUT: 30,
};

// ===========================
// 📋 VALIDATION
// ===========================
export const validateSePayConfig = () => {
  const required = ["SEPAY_MERCHANT_ID", "SEPAY_SECRET_KEY"];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `SePay Payment Gateway config thiếu environment variables: ${missing.join(", ")}`
    );
  }
};

// ===========================
// 📝 PAYMENT METHODS & STATUS
// ===========================
export const PAYMENT_METHODS = {
  BANK_TRANSFER: "BANK_TRANSFER", // Chuyển khoản ngân hàng (QR)
  CARD: "CARD", // Thanh toán thẻ
} as const;

export const TRANSACTION_STATUS = {
  PENDING: "PENDING", // Chờ thanh toán
  APPROVED: "APPROVED", // Đã duyệt
  DECLINED: "DECLINED", // Bị từ chối
  VOIDED: "VOIDED", // Đã hủy
} as const;

export const ORDER_STATUS = {
  CAPTURED: "CAPTURED", // Đã thanh toán
  VOIDED: "VOIDED", // Đã hủy
} as const;

export type PaymentMethod =
  (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS];

export type TransactionStatus =
  (typeof TRANSACTION_STATUS)[keyof typeof TRANSACTION_STATUS];

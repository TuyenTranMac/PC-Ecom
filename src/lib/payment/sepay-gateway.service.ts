/**
 * SePay Payment Gateway Service
 *
 * Docs: https://developer.sepay.vn/vi/cong-thanh-toan/bat-dau
 * Flow: Generate form → Submit → Redirect to SePay → IPN callback
 */

import crypto from "crypto";

// ===========================
// 🔐 TYPES
// ===========================
export interface CheckoutFormData {
  merchantId: string;
  secretKey: string;
  currency: "VND";
  orderInvoiceNumber: string; // Mã đơn hàng unique
  orderAmount: number; // Số tiền (VND)
  operation: "PURCHASE";
  orderDescription: string;
  successUrl: string;
  errorUrl: string;
  cancelUrl: string;
  // Optional
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export interface CheckoutFormFields
  extends Omit<CheckoutFormData, "secretKey"> {
  signature: string;
}

// ===========================
// 🔨 GENERATE HMAC SIGNATURE
// ===========================
/**
 * Tạo HMAC-SHA256 signature cho form checkout
 *
 * @param data - Form data (không có secretKey)
 * @param secretKey - SECRET_KEY từ merchant account
 * @returns HMAC signature hex string
 */
export const generateCheckoutSignature = (
  data: Omit<CheckoutFormData, "secretKey">,
  secretKey: string
): string => {
  // Sắp xếp theo alphabet và join với '|'
  const sortedKeys = Object.keys(data).sort();
  const signatureString = sortedKeys
    .map((key) => `${key}=${data[key as keyof typeof data]}`)
    .join("|");

  console.log("Signature string:", signatureString);

  return crypto
    .createHmac("sha256", secretKey)
    .update(signatureString)
    .digest("hex");
};

// ===========================
// 📝 GENERATE CHECKOUT FORM
// ===========================
/**
 * Tạo HTML form tự động submit sang SePay
 *
 * @param data - Checkout form data
 * @param environment - 'sandbox' | 'production'
 * @returns HTML form string
 */
export const generateCheckoutForm = (
  data: CheckoutFormData,
  environment: "sandbox" | "production" = "production"
): string => {
  // 1. Generate signature
  const { secretKey, ...formData } = data;
  const signature = generateCheckoutSignature(formData, secretKey);

  // 2. Endpoint (TEMPORARY: dùng production vì sandbox có thể không hoạt động)
  // TODO: Revert về sandbox sau khi test xong
  const endpoint = "https://pay.sepay.vn/v1/checkout/init";

  // 3. Form fields
  const fields: CheckoutFormFields = {
    ...formData,
    signature,
  };

  // 4. Generate HTML form
  const formHtml = `
    <form id="sepay-checkout-form" method="POST" action="${endpoint}">
      ${Object.entries(fields)
        .map(
          ([key, value]) =>
            `<input type="hidden" name="${key}" value="${value}" />`
        )
        .join("\n      ")}
      <button type="submit" id="sepay-submit-btn">
        Thanh toán với SePay
      </button>
    </form>
    <script>
      // Auto submit form
      document.getElementById('sepay-checkout-form').submit();
    </script>
  `;

  return formHtml;
};

// ===========================
// 🔄 VERIFY IPN SIGNATURE
// ===========================
/**
 * Xác thực signature từ IPN callback
 *
 * @param ipnData - IPN payload từ SePay
 * @param receivedSignature - Signature từ header/body
 * @param secretKey - SECRET_KEY
 * @returns true nếu hợp lệ
 */
export const verifyIPNSignature = (
  ipnData: Record<string, any>,
  receivedSignature: string,
  secretKey: string
): boolean => {
  // Remove signature field if exists
  const { signature, ...dataWithoutSignature } = ipnData;

  // Generate expected signature
  const expectedSignature = generateCheckoutSignature(
    dataWithoutSignature as any,
    secretKey
  );

  return expectedSignature === receivedSignature;
};

// ===========================
// 🧪 HELPER: Create checkout URL (for testing)
// ===========================
/**
 * Tạo checkout data từ order
 *
 * @param order - Order object từ DB
 * @param baseUrl - Base URL của app (VD: https://yourdomain.com)
 * @returns CheckoutFormData
 */
export const createCheckoutData = (
  order: {
    code: string;
    total: number;
    description?: string;
  },
  baseUrl: string
): CheckoutFormData => {
  const merchantId = process.env.SEPAY_MERCHANT_ID!;
  const secretKey = process.env.SEPAY_SECRET_KEY!;

  return {
    merchantId,
    secretKey,
    currency: "VND",
    orderInvoiceNumber: order.code,
    orderAmount: Math.round(order.total),
    operation: "PURCHASE",
    orderDescription: order.description || `Thanh toán đơn hàng ${order.code}`,
    successUrl: `${baseUrl}/payment/success?order=${order.code}`,
    errorUrl: `${baseUrl}/payment/error?order=${order.code}`,
    cancelUrl: `${baseUrl}/payment/cancel?order=${order.code}`,
  };
};

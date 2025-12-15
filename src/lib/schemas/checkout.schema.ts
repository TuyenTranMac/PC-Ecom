import { z } from "zod";

// Schema cho địa chỉ giao hàng
export const checkoutAddressSchema = z.object({
  fullName: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  phone: z
    .string()
    .regex(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ (10-11 số)"),
  addressLine1: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
  addressLine2: z.string().optional(),
  ward: z.string().optional(),
  district: z.string().min(1, "Vui lòng chọn quận/huyện"),
  province: z.string().min(1, "Vui lòng chọn tỉnh/thành phố"),
  country: z.string().min(1),
});

// Schema cho cart item từ localStorage
export const cartItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  price: z.number(),
  image: z.string().nullable(),
  quantity: z.number().min(1),
  stock: z.number(),
  storeId: z.string().optional(), // Optional vì sẽ validate ở onSubmit
  storeName: z.string().optional(),
});

// Schema cho checkout
export const checkoutSchema = z.object({
  // Giỏ hàng từ localStorage (validate ở client, không bắt buộc ở form)
  cartItems: z.array(cartItemSchema).optional(),

  // Thông tin giao hàng
  shippingAddress: checkoutAddressSchema,

  // Phương thức thanh toán
  paymentMethod: z.enum(["COD", "SEPAY"], {
    message: "Vui lòng chọn phương thức thanh toán",
  }),

  // Ghi chú (optional)
  note: z.string().optional(),

  // Sử dụng địa chỉ có sẵn
  useExistingAddress: z.boolean().default(false),
  existingAddressId: z.string().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CheckoutAddressInput = z.infer<typeof checkoutAddressSchema>;

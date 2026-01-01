import { z } from "zod";

// Schema cho việc tạo sản phẩm mới
export const createProductSchema = z.object({
  name: z.string().min(3, "Tên sản phẩm phải có ít nhất 3 ký tự").max(255),
  slug: z
    .string()
    .min(0, "Slug phải có ít nhất 3 ký tự")
    .max(255)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug chỉ được chứa chữ thường, số và dấu gạch ngang"
    ),
  description: z.string().optional(),
  price: z.number().positive("Giá phải lớn hơn 0"),
  comparePrice: z.number().positive().optional().nullable(),
  stock: z.number().int().min(0, "Số lượng không được âm"),
  categoryId: z.string().min(1, "Vui lòng chọn danh mục"),
  images: z.array(z.string().url("URL ảnh không hợp lệ")).optional().nullable(),
  isFeatured: z.boolean(),
  isArchived: z.boolean(),
});

// Schema cho việc cập nhật sản phẩm
export const updateProductSchema = z.object({
  id: z.string(),
  name: z.string().min(3).max(255).optional(),
  slug: z
    .string()
    .min(3)
    .max(255)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  description: z.string().optional().nullable(),
  price: z.number().positive().optional(),
  comparePrice: z.number().positive().optional().nullable(),
  stock: z.number().int().min(0).optional(),
  categoryId: z.string().optional(),
  images: z.array(z.string().url()).optional().nullable(),
  isFeatured: z.boolean().optional(),
  isArchived: z.boolean().optional(),
});

// Schema cho việc xóa sản phẩm
export const deleteProductSchema = z.object({
  id: z.string(),
});

// Schema cho việc lấy sản phẩm theo ID
export const getProductByIdSchema = z.object({
  id: z.string(),
});

// Schema cho việc lấy danh sách sản phẩm với filter
export const getProductsSchema = z.object({
  categoryId: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isArchived: z.boolean().optional(),
  limit: z.number().int().min(1).max(100).default(10),
  cursor: z.string().optional(), // For pagination
});

// Schema cho việc validate sản phẩm với AI
export const validateProductAISchema = z.object({
  name: z.string().min(1, "Tên sản phẩm là bắt buộc"),
  categoryId: z.string().min(1, "Danh mục là bắt buộc"),
  images: z
    .array(z.string().url("URL ảnh không hợp lệ"))
    .min(1, "Cần ít nhất 1 ảnh"),
});

// Export types
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type DeleteProductInput = z.infer<typeof deleteProductSchema>;
export type GetProductByIdInput = z.infer<typeof getProductByIdSchema>;
export type GetProductsInput = z.infer<typeof getProductsSchema>;
export type ValidateProductAIInput = z.infer<typeof validateProductAISchema>;

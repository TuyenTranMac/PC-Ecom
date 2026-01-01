import { z } from "zod";
export const signUpSchema = z
  .object({
    email: z.email("Email chưa đúng định dạng"),
    password: z
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .regex(
        /^(?=.*[A-Z])(?=.*\d).+$/,
        "Mật khẩu phải có ít nhất 1 chữ hoa và 1 chữ số"
      ),
    confirmPassword: z
      .string()
      .min(6, "Xác nhận mật khẩu phải có ít nhất 6 ký tự"),
    username: z
      .string()
      .min(6, "Username phải có từ 6 ký tự trở lên !")
      // Lưu ý: Regex của bạn có vẻ sai '[z-z0-9]' -> '[a-z0-9]'
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Username chỉ chứa chữ thường, số, gạch ngang (không ở đầu/cuối, không liền nhau)."
      )
      .refine(
        (val) => !val.includes("--"),
        "Username không được chứa hai gạch ngang liền nhau."
      ) // Sửa thông báo lỗi
      .transform((val) => val.toLowerCase()),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(6)
    .regex(
      /^(?=.*[A-Z])(?=.*\d).+$/,
      "Password phải có ít nhất 1 chữ hoa kết hợp số(0-9)"
    ),
});

export const updateProfileSchema = z
  .object({
    username: z
      .string()
      .min(6, "Username phải có từ 6 ký tự trở lên")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Username chỉ chứa chữ thường, số, gạch ngang"
      )
      .refine(
        (val) => !val.includes("--"),
        "Username không được chứa hai gạch ngang liền nhau"
      )
      .transform((val) => val.toLowerCase())
      .optional(),
    image: z.string().url("URL ảnh không hợp lệ").optional().nullable(),
    currentPassword: z.string().min(6).optional(),
    newPassword: z
      .string()
      .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự")
      .regex(
        /^(?=.*[A-Z])(?=.*\d).+$/,
        "Mật khẩu phải có ít nhất 1 chữ hoa và 1 chữ số"
      )
      .optional(),
  })
  .refine(
    (data) => {
      // Nếu muốn đổi mật khẩu thì phải có cả currentPassword và newPassword
      if (data.newPassword && !data.currentPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Phải nhập mật khẩu hiện tại để đổi mật khẩu mới",
      path: ["currentPassword"],
    }
  );

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

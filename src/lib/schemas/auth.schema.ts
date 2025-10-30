import {email, z} from "zod"

export const registerSchema = z.object({
    email: z.string().email("Email không hợp lệ"),
    password: z.string()
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
        .regex(/^(?=.*[A-Z])(?=.*\d).+$/, "Mật khẩu phải có ít nhất 1 chữ hoa và 1 chữ số"),
     username: z.string()
        .min(6, "Username phải có từ 6 ký tự trở lên !")
        // Lưu ý: Regex của bạn có vẻ sai '[z-z0-9]' -> '[a-z0-9]'
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Username chỉ chứa chữ thường, số, gạch ngang (không ở đầu/cuối, không liền nhau).")
        .refine((val) => !val.includes("--"), "Username không được chứa hai gạch ngang liền nhau.") // Sửa thông báo lỗi
        .transform((val) => val.toLowerCase()),
})

export const singinSchema = z.object({
    email: z.email(),
    password: z.string().min(6).regex(/^(?=.*[A-Z])(?=.*\d).+$/, "Password phải có ít nhất 1 chữ hoa kết hợp số(0-9)"),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type SignInInput = z.infer<typeof singinSchema>
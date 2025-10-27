import { publicProcedure, createTRPCRouter } from "~/trpc/init"
import { getPayload } from "payload";
import config from '@payload-config'
import { User } from "~/payload-types";
import { headers as getHeaders } from "next/headers";
import { email, string,z } from "zod";
import { register } from "module";
import { username } from "node_modules/payload/dist/fields/validations";
export const authRouter = createTRPCRouter({
    session: publicProcedure.query( async ( {ctx}) => {
       const headers= await getHeaders();

       const session = await ctx.payload.auth({headers});
       
       return session;
    }),
    // register: publicProcedure.input(
    //     z.object({
    //         email: z.string().email(),
    //         password: z.string().min(6).regex(/^(?=.*[A-Z])(?=.*\d).+$/, "Password phải có ít nhất 1 chữ hoa kết hợp số(0-9)"),
    //         username: 
    //                 z.string()
    //                 .min(6, "Username phải có từ 6 ký tự trở lên !")
    //                 .regex(/^[z-z0-9] [z-z0-9-]*[z-z0-9]$/, "Username chỉ chứa các ký tự hoặc ký tự và số không có khoảng trắng. Không được sử dụng ký tự có dấu hoặc ký tự đặc biệt.")
    //                 .refine( (val) => !val.includes("--"), "Username không được dùng `-` ")
    //                 .transform( (val) => val.toLowerCase())
    //     })
    // )
    // .mutation( async ({input,ctx}) => {
    //     await ctx.payload.create({
    //         collection: "users",
    //         data: {
    //             email: input.email,
    //             password: input.password,
    //             username: input.username
    //         }
    //     })
    // })
    
})

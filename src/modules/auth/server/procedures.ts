import { publicProcedure, createTRPCRouter } from "@/server/api/trpc"
import { headers as getHeaders, cookies as getCookies } from "next/headers";
import { TRPCError } from "@trpc/server";
import { registerSchema, loginSchema } from "@/lib/schemas/auth.schema";
import { generateAuthCookies } from "../utils";
export const authRouter = createTRPCRouter({
    // getMe: publicProcedure.query( async ( {ctx}) => {
    //    const headers= await getHeaders();

    //    const userInfo = await ctx.db.auth({headers});
    //    console.log(userInfo);
    //    return userInfo;
    // }),
    // register: publicProcedure.input(registerSchema)
    // .mutation( async ({input,ctx}) => {
    //     const {docs: exitedUserDB} =  await ctx.db.find({
    //         collection: "users",
    //         limit:1,
    //         where: {
    //             or:[
    //                 {
    //                     username:{
    //                         equals:input.username
    //                     } 
    //                 },
    //                 {
    //                     email:{
    //                         equals:input.email
    //                     }
    //                 }

    //             ]
    //         }
    //     })
    //     //Checking & validate
    //     if(exitedUserDB.length>0){
    //         const exitedUser = exitedUserDB[0]
    //         if(exitedUser.email === input.email){
    //             throw new TRPCError({
    //                     code: "CONFLICT", // 'CONFLICT' (409) hợp lý hơn 'BAD_REQUEST'
    //                     message: "Email này đã được sử dụng."
    //             });
    //         }
    //         if(exitedUser.email === input.email){
    //             throw new TRPCError({
    //                     code: "CONFLICT",
    //                     message: "Username này đã tồn tại."
    //             });
    //         }
    //     }

    //     await ctx.db.create({
    //         collection: "users",
    //         data: {
    //             email: input.email,
    //             password: input.password,
    //             username: input.username
    //         }
    //     })
    // }),

    // login: publicProcedure.input(loginSchema)
    // .mutation( async({input,ctx}) =>{
    //     const data = await ctx.db.login({
    //         collection: "users",
    //         data:{
    //             email: input.email,
    //             password: input.password,
    //         }
    //     })
    //     if(!data.token){
    //         throw new TRPCError({
    //             code: "UNAUTHORIZED",
    //             message: "Fail to Login (Null token)"
    //         })
    //     }
    //     generateAuthCookies({
    //         prefix: ctx.db.config.cookiePrefix,
    //         value: data.token
    //     })
    // }),

    
 
    
})

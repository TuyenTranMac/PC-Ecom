import { publicProcedure, createTRPCRouter } from "@/trpc/init"
import { headers as getHeaders, cookies as getCookies } from "next/headers";
import { email, z } from "zod";
import { TRPCError } from "@trpc/server";
import { AUTH_COOKIE } from "../constants";
import { registerSchema, singinSchema } from "@/lib/schemas/auth.schema";
import { error } from "console";
import { code } from "payload/shared";
export const authRouter = createTRPCRouter({
    session: publicProcedure.query( async ( {ctx}) => {
       const headers= await getHeaders();

       const session = await ctx.db.auth({headers});
       
       return session;
    }),
    register: publicProcedure.input(registerSchema)
    .mutation( async ({input,ctx}) => {ctx
        const {docs: exitedUserDB} =  await ctx.db.find({
            collection: "users",
            limit:1,
            where: {
                or:[
                    {
                        username:{
                            equals:input.username
                        }
                    },
                    {
                        email:{
                            equals:input.email
                        }
                    }

                ]
            }
        })
        //Checking & validate
        if(exitedUserDB.length>0){
            const exitedUser = exitedUserDB[0]
            if(exitedUser.email === input.email){
                throw new TRPCError({
                        code: "CONFLICT", // 'CONFLICT' (409) hợp lý hơn 'BAD_REQUEST'
                        message: "Email này đã được sử dụng."
                });
            }
            if(exitedUser.email === input.email){
                throw new TRPCError({
                        code: "CONFLICT",
                        message: "Username này đã tồn tại."
                });
            }
        }

        await ctx.db.create({
            collection: "users",
            data: {
                email: input.email,
                password: input.password,
                username: input.username
            }
        })
    }),

    login: publicProcedure.input(singinSchema)
    .mutation( async({input,ctx}) =>{
        const data = await ctx.db.login({
            collection: "users",
            data:{
                email: input.email,
                password: input.password,
            }
        })
        if(!data.token){
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Fail to Login (Null token)"
            })
        }
        const cookies = await getCookies();
        cookies.set({
            name: AUTH_COOKIE,
            value: data.token,
            httpOnly: true,
            path: "/",
            // sameSite: "none",
            // domain:""
        })
    }),

    logout: publicProcedure.mutation( async () => {
        const cookies = await getCookies();
        cookies.delete(AUTH_COOKIE)
    })
    
 
    
})

import { createTRPCContext } from "@trpc/tanstack-react-query";
import { createTRPCRouter, publicProcedure, vendorProcedure } from "../trpc";
import { Category } from "@prisma/client";
import {z} from "zod"
import { TRPCError } from "@trpc/server";
export const productRouter = createTRPCRouter({
     getAll: publicProcedure
    .input(
      z.object({
        categoryId: z.string().optional(),
        userId: z.string().optional(), // Filter theo Vendor
        limit: z.number().min(1).max(100).default(12),
        cursor: z.string().optional(), // Cho infinite scroll
      })
    )
    .query(async ({ ctx, input }) => {
      const { categoryId, userId, limit, cursor } = input;

      const products = await ctx.db.product.findMany({
        where: {
          isArchived: false,
          ...(categoryId && { categoryId }),
          ...(userId && { storeId: userId }),
        },
        take: limit + 1, // +1 để check có item tiếp không
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          category: true,
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });

      let nextCursor: string | undefined = undefined;
      if (products.length > limit) {
        const nextItem = products.pop();
        nextCursor = nextItem!.id;
      }

      return {
        products,
        nextCursor,
      };
    }),
//Get product by slug
    getBySlug: publicProcedure
        .input(z.object({slug: z.string(), userId: z.string()}))
        .query( async ({ctx,input}) =>{
            const data = await ctx.db.product.findUnique({
                where: {storeId_slug: {storeId: input.userId, slug: input.slug}},
                include:{
                    category:true,
                    user:{
                        select:{
                          id:true,
                          username: true,
                          email:true
                        }
                    }
                },
              
            })
            if(!data || data.isArchived){
              throw new TRPCError({
                code: "NOT_FOUND",
                message:"ProductRouter-GetBySlug: Not found Product"
              })
            }
            return data;
        }),
    createProduct: vendorProcedure
      
      .input()
})


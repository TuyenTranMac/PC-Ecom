import { publicProcedure, createTRPCRouter } from "@/server/api/trpc"
import { Category } from "@prisma/client";

export const categoriesRouter = createTRPCRouter({
    all: publicProcedure.query( async ( {ctx}) => {
        const data = await ctx.db.category.findMany({
            where:{
                parentId:null
            },
            include:{
           
                children: true
            }
        })

        return (data);
    })
})

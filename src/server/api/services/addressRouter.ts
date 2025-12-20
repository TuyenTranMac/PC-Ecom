import { protectedProcedure, createTRPCRouter } from "../trpc";
import { z } from "zod";
import { prisma } from "../../db";

const addressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(8),
  addressLine1: z.string().min(5),
  addressLine2: z.string().optional(),
  ward: z.string().optional(),
  district: z.string().optional(),
  province: z.string().optional(),
  country: z.string().default("VN"),
});

export const addressRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return prisma.address.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { isDefault: "desc" },
    });
  }),
  create: protectedProcedure
    .input(addressSchema)
    .mutation(async ({ ctx, input }) => {
      // Nếu chưa có địa chỉ mặc định thì set mặc định cho địa chỉ đầu tiên
      const count = await prisma.address.count({
        where: { userId: ctx.session.user.id },
      });
      return prisma.address.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
          isDefault: count === 0,
        },
      });
    }),
  update: protectedProcedure
    .input(z.object({ id: z.string(), ...addressSchema.shape }))
    .mutation(async ({ ctx, input }) => {
      return prisma.address.update({
        where: { id: input.id, userId: ctx.session.user.id },
        data: input,
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return prisma.address.delete({
        where: { id: input.id, userId: ctx.session.user.id },
      });
    }),
  setDefault: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Unset default cho các địa chỉ khác
      await prisma.address.updateMany({
        where: { userId: ctx.session.user.id },
        data: { isDefault: false },
      });
      // Set default cho địa chỉ này
      return prisma.address.update({
        where: { id: input.id, userId: ctx.session.user.id },
        data: { isDefault: true },
      });
    }),
});

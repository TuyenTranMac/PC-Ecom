import { z } from "zod";

// Schema cho việc chọn gói đăng ký
export const subscriptionPlanSchema = z.object({
  plan: z.enum(["FREE", "PRO"]),
});

export type SubscriptionPlanInput = z.infer<typeof subscriptionPlanSchema>;

// Schema cho output của subscription details
export const subscriptionOutputSchema = z.object({
  id: z.string(),
  userId: z.string(),
  plan: z.enum(["FREE", "PRO"]),
  status: z.enum(["ACTIVE", "CANCELLED", "EXPIRED", "PENDING"]),
  startDate: z.date(),
  endDate: z.date().nullable(),
  maxProducts: z.number(),
  maxImages: z.number(),
  customDomain: z.boolean(),
  prioritySupport: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type SubscriptionOutput = z.infer<typeof subscriptionOutputSchema>;

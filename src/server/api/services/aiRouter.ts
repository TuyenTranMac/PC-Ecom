import { createTRPCRouter, vendorProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const aiRouter = createTRPCRouter({
  /**
   * Kiểm tra hình ảnh có hợp lệ và liên quan đến Gear không
   * Sử dụng Hugging Face Inference API (FREE)
   * Get free API key: https://huggingface.co/settings/tokens
   */
  moderateImage: vendorProcedure
    .input(
      z.object({
        imageUrl: z.string().url(),
        productName: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Kiểm tra nếu AI moderation bị tắt
        if (process.env.ENABLE_AI_MODERATION === "false") {
          console.warn("⚠️ AI Moderation disabled");
          return {
            success: true,
            message: "Bỏ qua kiểm tra AI (dev mode)",
            confidence: 0,
            analysis: "disabled",
          };
        }

        // Validate Hugging Face API Key (FREE)
        if (!process.env.HUGGINGFACE_API_KEY) {
          console.warn("⚠️ HUGGINGFACE_API_KEY not found");
          return {
            success: true,
            message: "Bỏ qua kiểm tra AI (chưa config key)",
            confidence: 0,
            analysis: "no key",
          };
        }

        // Step 1: Check NSFW
        const nsfwResponse = await fetch(
          "https://api-inference.huggingface.co/models/Falconsai/nsfw_image_detection",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            },
            body: JSON.stringify({ inputs: input.imageUrl }),
          }
        );

        if (nsfwResponse.status === 503) {
          return {
            success: true,
            message: "⚠️ AI đang khởi động",
            confidence: 0,
            analysis: "model loading",
          };
        }

        const nsfwData = await nsfwResponse.json();
        const nsfwScore =
          nsfwData[0]?.find((item: any) =>
            item.label.toLowerCase().includes("nsfw")
          )?.score || 0;

        if (nsfwScore > 0.5) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Hình chứa nội dung không phù hợp (${(nsfwScore * 100).toFixed(0)}%)`,
          });
        }

        // Step 2: Classify
        const classifyResponse = await fetch(
          "https://api-inference.huggingface.co/models/google/vit-base-patch16-224",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            },
            body: JSON.stringify({ inputs: input.imageUrl }),
          }
        );

        if (!classifyResponse.ok) {
          return {
            success: true,
            message: "✅ Hợp lệ (NSFW passed)",
            confidence: 50,
            analysis: "classification skipped",
          };
        }

        const classifyData = await classifyResponse.json();
        const topLabel = classifyData[0]?.label?.toLowerCase() || "";
        const confidence = (classifyData[0]?.score || 0) * 100;

        // Gear keywords
        const gear = [
          "mouse",
          "keyboard",
          "computer",
          "monitor",
          "headphone",
          "camera",
          "usb",
          "processor",
          "gaming",
        ];
        const notGear = ["shirt", "dress", "shoe", "food", "animal", "person"];

        const isGear = gear.some((k) => topLabel.includes(k));
        const isNotGear = notGear.some((k) => topLabel.includes(k));

        if (isNotGear && confidence > 70) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Không liên quan gear: "${topLabel}"`,
          });
        }

        return {
          success: true,
          message: "Hình ảnh hợp lệ",
          confidence: Math.round(confidence),
          analysis: `${topLabel} ${isGear ? "✓" : "⚠️"}`,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Lỗi kiểm tra ảnh",
        });
      }
    }),
});

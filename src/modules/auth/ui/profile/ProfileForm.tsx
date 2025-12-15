"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "@/lib/schemas/auth.schema";
import { useTRPC } from "@/server/client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

interface ProfileFormProps {
  initialData: {
    username: string;
    email: string;
    image?: string | null;
  };
}

export const ProfileForm = ({ initialData }: ProfileFormProps) => {
  const trpc = useTRPC();
  const router = useRouter();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      username: initialData.username,
      image: initialData.image || "",
      currentPassword: "",
      newPassword: "",
    },
  });

  const updateMutation = useMutation(
    trpc.auth.updateProfile.mutationOptions({
      onSuccess: (data) => {
        toast.success(data.message);
        form.reset({
          username: data.user.username,
          image: data.user.image || "",
          currentPassword: "",
          newPassword: "",
        });
        router.refresh(); // Refresh server data
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const onSubmit = (data: UpdateProfileInput) => {
    // Chỉ gửi các field đã thay đổi
    const changedData: UpdateProfileInput = {};

    if (data.username && data.username !== initialData.username) {
      changedData.username = data.username;
    }

    if (data.image !== undefined && data.image !== initialData.image) {
      changedData.image = data.image || null;
    }

    if (data.currentPassword && data.newPassword) {
      changedData.currentPassword = data.currentPassword;
      changedData.newPassword = data.newPassword;
    }

    // Nếu không có gì thay đổi
    if (Object.keys(changedData).length === 0) {
      toast.info("Không có thay đổi nào để lưu");
      return;
    }

    updateMutation.mutate(changedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Email (read-only) */}
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input value={initialData.email} disabled className="bg-muted" />
          </FormControl>
          <FormDescription>Email không thể thay đổi</FormDescription>
        </FormItem>

        {/* Username */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormDescription>
                Username dùng làm subdomain cho shop (nếu bạn là vendor)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Avatar URL */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/avatar.jpg"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>URL ảnh đại diện của bạn</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Divider */}
        <div className="border-t pt-6">
          <h3 className="mb-4 text-lg font-medium">Đổi mật khẩu</h3>

          {/* Current Password */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu hiện tại</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu hiện tại"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New Password */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu mới</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu mới"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Ít nhất 6 ký tự, có 1 chữ hoa và 1 số
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={updateMutation.isPending}
          className="w-full"
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang cập nhật...
            </>
          ) : (
            "Lưu thay đổi"
          )}
        </Button>

        {/* Logout Button */}
        <Button
          type="button"
          variant="destructive"
          onClick={() => {
            // Xóa cart localStorage trước khi signOut
            localStorage.removeItem("cart");
            signOut({ callbackUrl: "/auth" });
          }}
          className="w-full"
        >
          Đăng xuất
        </Button>
      </form>
    </Form>
  );
};

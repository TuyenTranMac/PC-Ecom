"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignInInput, signInSchema } from "@/lib/schemas/auth.schema";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { ArrowLeftIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { signIn } from "next-auth/react"; // ← Import từ NextAuth

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

interface Props {
  onToggle: () => void;
}

const SignInView = ({ onToggle }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInInput) => {
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        // Đăng nhập thất bại
        toast.error("Email hoặc mật khẩu không đúng");
        setIsLoading(false);
        return;
      }

      // Đăng nhập thành công
      toast.success("Đăng nhập thành công!", {
        duration: 1200,
        onAutoClose: () => {
          router.push("/");
          router.refresh();
        },
      });
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <SignInFormSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5">
      <div className="h-screen w-full overflow-y-auto border bg-[#F4F4F0] lg:col-span-5">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="items-center pl-10">
            <ArrowLeftIcon />
            <span className={cn("text-3xl font-semibold", poppins.className)}>
              JustGear
            </span>
          </Link>
          <Button
            variant="link"
            className="border-none pr-10 text-base"
            size="sm"
            onClick={onToggle}
          >
            Sign Up
          </Button>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-8 p-4 lg:p-16"
          >
            <div className="space-y-4">
              {/* Email */}
              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              disabled={isLoading}
              size="lg"
              variant="elevated"
              type="submit"
              className="bg-black text-white hover:bg-white hover:text-black"
            >
              {isLoading ? "Đang xử lý..." : "Đăng nhập"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

function SignInFormSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="group relative">
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-500 xl:aspect-h-8 xl:aspect-w-7">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SignInView;

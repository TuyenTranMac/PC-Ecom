"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { SignUpInput, signUpSchema } from "@/lib/schemas/auth.schema";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { ArrowLeftIcon, FormInput } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/server/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { UseRegister } from "@/app/(app)/trpcHelper/useTRPC";
import { success } from "zod";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});
interface Props {
  onToggle: () => void;
}
const SignUpView = ({ onToggle }: Props) => {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const register = useMutation(
    trpc.auth.signUp.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },

      onSuccess: () => {
        toast.success("Đăng ký thành công!", {
          duration: 1200,
          onAutoClose: () => {},
        });
        router.push("/");
      },
    })
  );

  const onSubmit = (value: SignUpInput) => {
    register.mutate(value);
  };
  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });
  const watchedUsername = form.watch("username");
  const hasUsernameError = !!form.formState.errors.username;
  const isTrueName = watchedUsername && !hasUsernameError;

  if (register.isPending) {
    return <SignInFormSkeleton />;
  }
  if (register.isSuccess) {
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
            {" "}
            Sign In
          </Button>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-8 p-4 lg:p-16"
          >
            {/* User name */}
            <div className="p-10">
              <FormField
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">User Name</FormLabel>
                    <FormControl>
                      <Input {...field} type="username"></Input>
                    </FormControl>
                    {!hasUsernameError && (
                      <FormDescription
                        className={cn("hidden", isTrueName && "block")}
                      >
                        Cửa hàng của bạn sẽ có địa chỉ là:
                        <strong className="text-foreground">
                          {" "}
                          {watchedUsername || "[ten-shop]"}.justgear.org
                        </strong>
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email"></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* User name */}
              <FormField
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password"></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={register.isPending}
                size="lg"
                variant="elevated"
                type="submit"
                className="bg-black text-white hover:bg-white hover:text-black"
              >
                Create Account
              </Button>
            </div>
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

export default SignUpView;

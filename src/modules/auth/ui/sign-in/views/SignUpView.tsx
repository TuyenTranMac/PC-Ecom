'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RegisterInput, registerSchema } from "@/lib/schemas/auth.schema"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Poppins } from "next/font/google"
import { ArrowLeftIcon, FormInput } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"
import { toast } from "sonner"
import { useRouter   } from "next/navigation"

const poppins = Poppins({
      subsets: ["latin"],
      weight: ["700"]
    })

const SignInView = () => {
  
  const router = useRouter();
  const trpc = useTRPC()
  const register = useMutation(trpc.auth.register.mutationOptions({
     onError: ((error) => {
      toast.error(error.message); // Giờ nó sẽ hoạt động
    }),

onSuccess: () => {
    toast.success("Đăng ký thành công!", {
    // Hàm này sẽ chạy khi toast biến mất

    // Bạn cũng có thể dùng onAutoClose nếu chỉ muốn chạy khi nó tự đóng
    onAutoClose: () => {
      router.push("/");
    }
  });
}
  }))

    
    const onSubmit = (value: RegisterInput) => {
        register.mutate(value)
    }
    const form = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
          email: "",
          password: "",
          username: ""
        }
    }) 
    const watchedUsername = form.watch('username')
    const hasUsernameError = !!form.formState.errors.username
    const isTrueName = watchedUsername && !hasUsernameError



  return (
    
    <div className="grid grid-cols-1 lg:grid-cols-5 ">
        <div className=" border bg-[#F4F4F0] h-screen w-full lg:col-span-3 overflow-y-auto">
           <div className="flex items-center justify-between mb-8">
                    <Link href='/' className="pl-10   items-center ">
                        <ArrowLeftIcon/>
                        <span className={cn("text-3xl font-semibold", poppins.className)}>JustGear</span>
                    </Link>
                  
                    <Button
                      asChild
                      variant="link"
                      size="sm"
                      className="text-base border-none pr-10"
                    >
                        <Link prefetch href={"/sign-in"}> Sign In</Link>
                    </Button>
                  </div>
          <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} 
                    className="flex flex-col gap-8 p-4 lg:p-16">
                


                  {/* User name */}
                <div className=" p-10">
                    <FormField
                      name="username"
                      render={ ({field}) => (
                        <FormItem>
                          <FormLabel className="text-base">User Name</FormLabel>
                          <FormControl>
                            <Input {...field} type="username"></Input>
                          </FormControl>
                          {!hasUsernameError && (
                            <FormDescription className={cn("hidden", isTrueName && "block")}>
                              Cửa hàng của bạn sẽ có địa chỉ là: 
                                <strong className="text-foreground">
                                  {' '}{watchedUsername || '[ten-shop]'}.justgear.org
                                </strong>
                            </FormDescription>
                            
                          )}
                          <FormMessage/>

                        </FormItem>
                      )}
                    />


                    {/* Email */}
                  <FormField
                    name="email"
                    render={ ({field}) => (
                      <FormItem>
                        <FormLabel className="text-base">Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email"></Input>
                        </FormControl>
                        <FormMessage/>  
                        
                      </FormItem>
                    )}
                  />
    

                    {/* User name */}
                  <FormField
                    name="password"
                    render={ ({field}) => (
                      <FormItem>
                        <FormLabel className="text-base">Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password"></Input>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}    
                  />
                  <Button
                  disabled={register.isPending}
                    size="lg"
                    variant="elevated"
                    type="submit"
                    className="bg-black hover:bg-white text-white hover:text-black"
                  >
                    Create Account
                  </Button>
                  
                </div>
              </form>
          </Form>
        </div>
        <div className="h-screen w-full lg:col-span-2 hidden lg:block" 
            style={{backgroundImage:"url('/bg-signin.png')", backgroundSize:"cover", backgroundPosition:"center"}}/> 
      </div>
  )
}

export default SignInView
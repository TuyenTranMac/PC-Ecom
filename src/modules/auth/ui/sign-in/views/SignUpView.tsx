'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
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
import { ArrowLeftIcon } from "lucide-react"

 const poppins = Poppins({
      subsets: ["latin"],
      weight: ["700"]
    })

const SignInView = () => {
    const onSubmit = (value: RegisterInput) => {
        console.log(value)
    }

      
    const form = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
          email: "",
          password: "",
          username: ""
        }
    }) 


  return (
    
    <div className="grid grid-cols-1 lg:grid-cols-5 ">
        <div className=" border bg-[#F4F4F0] h-screen w-full lg:col-span-3 overflow-y-auto">
          <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} 
                    className="flex flex-col gap-8 p-4 lg:p-16  border"/>
              <div className="flex items-center justify-between mb-8 ">
                <Link href='/' className="pl-10 border flex  items-center ">
                  <ArrowLeftIcon/>
                  <span className={cn("text-3xl font-semibold", poppins.className)}>JustGear</span>
               
                </Link>
              
                <Button
                  asChild
                  variant="link"
                  size="sm"
                  className="text-base border-none "
                >
                  <Link prefetch href={"/sign-in"}> Sign In</Link>
                </Button>
              </div>
          </Form>
        </div>
        <div className="h-screen w-full lg:col-span-2 hidden lg:block" 
            style={{backgroundImage:"url('/bg-signin.png')", backgroundSize:"cover", backgroundPosition:"center"}}/> 
      </div>
  )
}

export default SignInView
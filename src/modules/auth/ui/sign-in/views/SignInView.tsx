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
import { useMutation } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"
import { Link } from "lucide-react"



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
    <div className="grid grid-cols-1 lg:grid-cols-5">
        <div className="bg-[#F4F4F0] h-screen w-full lg:col-span-3 overflow-y-auto">
          {/* <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} 
                    className="flex flex-col gap-8 p-4 lg:p-16"/>
          </Form> */}
          FORM COLUMS
        </div>
        <div className="h-screen w-full lg:col-span-2 hidden lg:block" 
            style={{backgroundImage:"url('/bg-signin.png')", backgroundSize:"cover", backgroundPosition:"center"}}/> 
      </div>
  )
}

export default SignInView
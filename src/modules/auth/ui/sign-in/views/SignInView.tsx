'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  RegisterInput,
  registerSchema,
  SignInInput,
  singinSchema,
} from '@/lib/schemas/auth.schema';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Poppins } from 'next/font/google';
import { ArrowLeftIcon, FormInput } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['700'],
});

interface Props {
  onToggle: () => void;
}
const SignInView = ({ onToggle }: Props) => {
  const router = useRouter();
  const trpc = useTRPC();
  const login = useMutation(
    trpc.auth.login.mutationOptions({
      onError: (error) => {
        toast.error(error.message); // Giờ nó sẽ hoạt động
      },
      onSuccess: () => {
        toast.success('Đăng nhập thành công!', {
          onAutoClose: () => {},
        });
        router.push('/');
      },
    })
  );
  const onSubmit = (value: SignInInput) => {
    login.mutate(value);
  };
  const form = useForm<SignInInput>({
    resolver: zodResolver(singinSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  return (
    <div className='grid grid-cols-1 lg:grid-cols-5'>
      <div className='h-screen w-full overflow-y-auto border bg-[#F4F4F0] lg:col-span-5'>
        <div className='mb-8 flex items-center justify-between'>
          <Link href='/' className='items-center pl-10'>
            <ArrowLeftIcon />
            <span className={cn('text-3xl font-semibold', poppins.className)}>
              JustGear
            </span>
          </Link>
          <Button
            variant='link'
            className='border-none pr-10 text-base'
            size='sm'
            onClick={onToggle}
          >
            {' '}
            Sign Up
          </Button>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-8 p-4 lg:p-16'
          >
            <div className=''>
              {/* Email */}
              <FormField
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-base'>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type='email'></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-base'>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type='password'></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              disabled={login.isPending}
              size='lg'
              variant='elevated'
              type='submit'
              className='bg-black text-white hover:bg-white hover:text-black'
            >
              Log In
            </Button>
          </form>
        </Form>
      </div>

      {/* <div className="h-screen w-full lg:col-span-2 hidden lg:block" 
            style={{backgroundImage:"url('/bg-signin.png')", backgroundSize:"cover", backgroundPosition:"center"}}
          />  */}
    </div>
  );
};
function SignInFormSkeleton() {
  return (
    <div className='flex flex-col gap-8 p-4 lg:p-16'>
      {/* Skeleton cho Header (Logo & Nút Sign In) */}
      <div className='mb-4 flex items-center justify-between px-4 pt-16 lg:px-16'>
        <Skeleton className='h-9 w-40 rounded' />
        <Skeleton className='h-9 w-20 rounded' />
      </div>
      {/* Skeleton cho các FormField */}
      <div className='space-y-6 p-10'>
        {/* Field 1 */}
        <div className='space-y-2'>
          <Skeleton className='h-4 w-24 rounded' />
          <Skeleton className='h-10 w-full rounded' />
        </div>
        {/* Field 2 */}
        <div className='space-y-2'>
          <Skeleton className='h-4 w-24 rounded' />
          <Skeleton className='h-10 w-full rounded' />
        </div>
      </div>
      {/* Skeleton cho Nút Submit */}
      <Skeleton
        className='mx-auto h-12 w-full rounded-lg'
        style={{ maxWidth: 'calc(100% - 128px)' }}
      />{' '}
      {/* Giả lập padding */}
    </div>
  );
}

export default SignInView;

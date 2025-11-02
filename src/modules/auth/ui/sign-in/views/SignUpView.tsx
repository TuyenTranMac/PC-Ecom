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
import { RegisterInput, registerSchema } from '@/lib/schemas/auth.schema';
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
const SignUpView = ({ onToggle }: Props) => {
  const router = useRouter();
  const trpc = useTRPC();
  const register = useMutation(
    trpc.auth.register.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },

      onSuccess: () => {
        toast.success('Đăng ký thành công!', {
          onAutoClose: () => {},
        });
        router.push('/');
      },
    })
  );

  const [isRedirecting, setIsRedirecting] = useState(false);
  const onSubmit = (value: RegisterInput) => {
    register.mutate(value);
  };
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      username: '',
    },
  });
  const watchedUsername = form.watch('username');
  const hasUsernameError = !!form.formState.errors.username;
  const isTrueName = watchedUsername && !hasUsernameError;

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
            Sign In
          </Button>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-8 p-4 lg:p-16'
          >
            {/* User name */}
            <div className='p-10'>
              <FormField
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-base'>User Name</FormLabel>
                    <FormControl>
                      <Input {...field} type='username'></Input>
                    </FormControl>
                    {!hasUsernameError && (
                      <FormDescription
                        className={cn('hidden', isTrueName && 'block')}
                      >
                        Cửa hàng của bạn sẽ có địa chỉ là:
                        <strong className='text-foreground'>
                          {' '}
                          {watchedUsername || '[ten-shop]'}.justgear.org
                        </strong>
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              {/* User name */}
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
              <Button
                disabled={register.isPending}
                size='lg'
                variant='elevated'
                type='submit'
                className='bg-black text-white hover:bg-white hover:text-black'
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

function SignUpFormSkeleton() {
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
        {/* Field 3 */}
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

export default SignUpView;

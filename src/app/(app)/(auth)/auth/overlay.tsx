// import { Button } from '@/components/ui/button';
// import { cn } from '@/lib/utils';
// import { ArrowLeftIcon } from 'lucide-react';
// import { Poppins } from 'next/font/google';
// import Link from 'next/link';
// import React from 'react'

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["700"]
// });

// const OverlayPanel = ( {isSignUp,onToggle} : {isSignUp: boolean, onToggle: () => void} ) => {
//   return (
//     <div
//       className="h-screen w-full bg-cover bg-center text-white p-12 flex flex-col justify-between"
//       style={{ backgroundImage: "url('/bg-signin.png')" }}
//     >
//       <Link href='/' className="flex items-center text-white/90 hover:text-white transition-colors">
//         <ArrowLeftIcon className="mr-2" />
//         <span className={cn("text-3xl font-semibold", poppins.className)}>JustGear</span>
//       </Link>
//       <div className="text-center space-y-4 my-auto">
//         {isSignUp ? (
//           <>
//             <h2 className="text-3xl font-bold">Đã có tài khoản?</h2>
//             <p>Đăng nhập để tiếp tục quản lý cửa hàng của bạn.</p>
//             <Button
//               variant="outline"
//               className="bg-transparent border-white text-white hover:bg-white hover:text-black"
//               onClick={onToggle}
//             >
//               Đăng Nhập
//             </Button>
//           </>
//         ) : (
//           <>
//             <h2 className="text-3xl font-bold">Chào mừng trở lại!</h2>
//             <p>Chưa có tài khoản? Đăng ký ngay để bắt đầu bán hàng.</p>
//             <Button
//               variant="outline"
//               className="bg-transparent border-white text-white hover:bg-white hover:text-black"
//               onClick={onToggle}
//             >
//               Đăng Ký Ngay
//             </Button>
//           </>
//         )}
//       </div>

//       <div />
//     </div>
//   );
// }

// export default OverlayPanel

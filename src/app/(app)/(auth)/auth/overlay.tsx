"use client";
import { cn } from "@/lib/utils/utils";
import SignInView from "@/modules/auth/ui/sign-in/views/SignInView";
import SignUpView from "@/modules/auth/ui/sign-in/views/SignUpView";
import { useState } from "react";
const Overlay = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const toggleForm = () => setIsSignUp((prev) => !prev);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#F4F4F0]">
      <div
        className={cn(
          "relative h-full w-full transition-transform duration-700 ease-in-out lg:flex"
        )}
      >
        <div className="relative h-full w-full">
          <div
            className={cn(
              "absolute top-0 hidden h-full w-1/3 bg-cover bg-center transition-transform duration-700 ease-in-out lg:block",
              isSignUp ? "translate-x-0" : "translate-x-[200%]"
            )}
            style={{ backgroundImage: "url('/bg-signin.png')" }}
          />
          <div
            className={cn(
              "absolute top-0 left-0 h-full w-full transition-all duration-500 ease-in-out lg:w-2/3",
              // Desktop chuyển slide
              isSignUp
                ? "lg:-translate-x-full lg:opacity-0"
                : "lg:translate-x-0 lg:opacity-100",
              // Mobile fade soft (không translate)
              isSignUp
                ? "pointer-events-none opacity-0"
                : "pointer-events-auto opacity-100"
            )}
          >
            <SignInView onToggle={toggleForm} />
          </div>
          <div
            className={cn(
              "absolute top-0 h-full w-full transition-all duration-500 ease-in-out lg:left-1/3 lg:w-2/3",
              // Desktop slide
              isSignUp
                ? "lg:translate-x-0 lg:opacity-100"
                : "lg:translate-x-full lg:opacity-0",
              // Mobile fade soft
              isSignUp
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
            )}
          >
            <SignUpView onToggle={toggleForm} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overlay;

import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import {  TRPCReactProvider } from "~/trpc/client";

const dmSans = DM_Sans({
    subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "ECOM-VENDOR",
  description: "",
};

/**
 * Root layout component that renders the top-level HTML structure and wraps page content with the TRPC React provider.
 *
 * @param children - The React nodes to render inside the application's body.
 * @returns The root HTML element containing the provided children wrapped by the TRPCReactProvider.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.className}} antialiased`}
      >
        <TRPCReactProvider>
          {children}
        </TRPCReactProvider>
        
      </body>
    </html>
  );
}
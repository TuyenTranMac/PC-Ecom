import type { Metadata } from "next";
import { api } from "@/server/server";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth/auth";

/**
 * Layout cho Vendor Subdomain
 * Có thể custom header, footer riêng cho từng shop
 */

interface Props {
  children: React.ReactNode;
  params: Promise<{ storeSlug: string }>;
}

const VendorLayout = async ({ children, params }: Props) => {
  const { storeSlug } = await params;

  const caller = await api();

  try {
    // Verify store exists
    await caller.store.getStoreBySlug({ slug: storeSlug });

    return (
      <div className="min-h-screen bg-background">
        {/* Header cho Vendor Store */}
        <header className="border-b bg-card"></header>

        {/* Main Content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="border-t bg-muted/30 py-6">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            © 2025 {storeSlug} - Powered by Gear Marketplace
          </div>
        </footer>
      </div>
    );
  } catch {
    notFound();
  }
};

export default VendorLayout;

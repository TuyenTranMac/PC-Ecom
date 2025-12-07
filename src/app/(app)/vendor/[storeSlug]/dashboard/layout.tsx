import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

/**
 * Layout cho Dashboard của Vendor
 * Chỉ owner của store mới được truy cập
 */

const DashboardLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ storeSlug: string }>;
}) => {
  const { storeSlug } = await params;
  const session = await auth();

  // Kiểm tra auth
  if (!session) {
    redirect(`/auth?callbackUrl=/vendor/${storeSlug}/dashboard`);
  }

  // Kiểm tra role
  if (session.user.role !== "VENDOR" && session.user.role !== "ADMIN") {
    redirect("/subscription");
  }

  // Kiểm tra ownership (chỉ owner mới được truy cập dashboard của store mình)
  const currentUser = session.user.username.toLowerCase();
  if (storeSlug.toLowerCase() !== currentUser) {
    // Nếu không phải owner, redirect về dashboard của chính mình
    redirect(`/vendor/${currentUser}/dashboard`);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Dashboard - {storeSlug}</h1>
          </div>
          <nav className="flex items-center gap-4">
            <a
              href={`/vendor/${storeSlug}`}
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              Xem Store
            </a>
            <a
              href="/"
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              Trang chủ
            </a>
          </nav>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
};

export default DashboardLayout;

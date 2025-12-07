import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { VendorSidebar } from "@/modules/vendor/ui/VendorSidebar";

const VendorLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    redirect("/auth");
  }

  // Check vendor role
  if (user.role !== "VENDOR" && user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex h-screen bg-muted/10">
      <VendorSidebar />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
};

export default VendorLayout;

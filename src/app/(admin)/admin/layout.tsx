import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { AdminSidebar } from "@/modules/admin/ui/AdminSidebar";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    redirect("/auth");
  }

  // Check admin role
  if (user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex h-screen bg-muted/10">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
};

export default AdminLayout;

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { api } from "@/server/server";
import { VendorProductForm } from "@/modules/vendor/products/ui/VendorProductForm";

const NewProductPage = async () => {
  // 1. Kiểm tra session (VENDOR hoặc ADMIN)
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth");
  }

  if (session.user.role !== "VENDOR" && session.user.role !== "ADMIN") {
    redirect("/");
  }

  // 2. Lấy danh sách categories (Server Component - RSC)
  const caller = await api();
  const categories = await caller.categories.getAllFlat();

  // 3. Lấy thông tin store của vendor để biết maxImages
  const store = await caller.store.getMyStore();

  if (!store) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Bạn chưa có cửa hàng
          </h1>
          <p className="text-muted-foreground mt-2">
            Vui lòng tạo cửa hàng trước khi thêm sản phẩm
          </p>
        </div>
      </div>
    );
  }

  // 4. Tính maxImages dựa vào subscription
  const maxImages = 3; // TODO: Fix subscription relation

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Thêm sản phẩm mới</h1>
        <p className="text-muted-foreground mt-2">
          Cửa hàng: <strong>{store.name}</strong> | Tối đa:{" "}
          <strong>{maxImages} ảnh</strong>
        </p>
      </div>

      <VendorProductForm
        categories={categories}
        maxImages={maxImages}
        storeName={store.name}
      />
    </div>
  );
};

export default NewProductPage;

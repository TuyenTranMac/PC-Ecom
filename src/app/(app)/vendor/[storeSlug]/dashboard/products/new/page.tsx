import { api } from "@/server/server";
import { redirect } from "next/navigation";
import { ProductForm } from "@/modules/tenant/ui/product-form";

/**
 * New Product Page
 * Auth đã được handle ở dashboard layout
 */

interface Props {
  params: Promise<{
    storeSlug: string;
  }>;
}

const NewProductPage = async ({ params }: Props) => {
  const { storeSlug } = await params;
  const caller = await api();

  try {
    const [categories, subscription, store] = await Promise.all([
      caller.categories.getAll(),
      caller.subscription.getCurrentSubscription(),
      caller.store.getMyStore(),
    ]);

    return (
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold sm:text-3xl">Thêm sản phẩm mới</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:mt-2 sm:text-base">
            Tạo sản phẩm mới cho cửa hàng của bạn
          </p>
        </div>

        {/* Thông tin giới hạn */}
        {subscription && subscription.maxProducts !== -1 && (
          <div className="bg-muted/50 mb-6 rounded-lg border p-4">
            <p className="text-sm">
              <span className="font-medium">Gói {subscription.plan}:</span> Bạn
              có thể upload tối đa{" "}
              <span className="font-semibold">
                {subscription.maxImages} ảnh
              </span>{" "}
              cho mỗi sản phẩm.
            </p>
          </div>
        )}

        {/* Form */}
        <div className="bg-card rounded-lg border p-4 shadow-sm sm:p-6">
          <ProductForm
            categories={categories}
            maxImages={subscription?.maxImages || 3}
            storeName={store.name}
          />
        </div>
      </div>
    );
  } catch (error: any) {
    if (error.message?.includes("Không tìm thấy cửa hàng")) {
      redirect("/subscription");
    }
    throw error;
  }
};

export default NewProductPage;

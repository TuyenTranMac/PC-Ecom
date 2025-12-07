import { api } from "@/server/server";
import { ProductList } from "@/modules/vendor/products/ui/ProductList";

const VendorProductsPage = async () => {
  const caller = await api();
  const products = await caller.product.getMyProducts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quản lý Sản phẩm</h1>
        <p className="text-muted-foreground">
          Tạo, chỉnh sửa và xóa sản phẩm của bạn
        </p>
      </div>

      <ProductList initialProducts={products} />
    </div>
  );
};

export default VendorProductsPage;

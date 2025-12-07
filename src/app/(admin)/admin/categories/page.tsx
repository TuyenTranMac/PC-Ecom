import { api } from "@/server/server";
import { CategoryList } from "@/modules/admin/categories/ui/CategoryList";

const CategoriesAdminPage = async () => {
  const caller = await api();
  const categories = await caller.categories.getAllForAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quản lý Danh mục</h1>
        <p className="text-muted-foreground">
          CRUD categories và subcategories
        </p>
      </div>

      <CategoryList initialCategories={categories} />
    </div>
  );
};

export default CategoriesAdminPage;

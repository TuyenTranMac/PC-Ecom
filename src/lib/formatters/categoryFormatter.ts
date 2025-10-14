import { Category } from "@/payload-types";

export interface CategoryUI {
  id: number;
  name: string;
  slug: string;
  color?: string | null;
  subcategories: CategoryUI[];
}

export function formatCategory(category: Category): CategoryUI {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    color: category.color ?? null,
    subcategories: (category.subcategories?.docs ?? [])
      .map((doc) =>
        typeof doc === "object" ? formatCategory(doc as Category) : null
      )
      .filter(Boolean) as CategoryUI[],
  };
}

export function CategoryUI(categories: Category[]): CategoryUI[] {
  return categories.map(formatCategory);
}

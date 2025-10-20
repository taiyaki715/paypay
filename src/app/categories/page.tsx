import { getCategories } from "@/app/actions/categories";
import { CategoryManager } from "@/components/category-manager";

export default async function CategoriesPage() {
  const result = await getCategories();

  return (
    <main className="container mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">カテゴリ管理</h1>
        <p className="text-muted-foreground mt-2">
          取引を分類するためのカテゴリを管理できます
        </p>
      </div>

      {result.success && result.data ? (
        <CategoryManager initialCategories={result.data} />
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            {result.error || "カテゴリデータの取得に失敗しました"}
          </p>
        </div>
      )}
    </main>
  );
}

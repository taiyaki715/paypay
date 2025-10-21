import { getCategories, getCategorySpending } from "@/app/actions/categories";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export async function CategoryBudgetList() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const categoriesResult = await getCategories();

  if (!categoriesResult.success || !categoriesResult.data) {
    return (
      <div className="text-red-500">
        カテゴリの読み込みに失敗しました: {categoriesResult.error}
      </div>
    );
  }

  const categories = categoriesResult.data;

  // Get spending for each category
  const categoryBudgets = await Promise.all(
    categories.map(async (category) => {
      const spendingResult = await getCategorySpending(
        category.id,
        currentYear,
        currentMonth,
      );
      const spending = spendingResult.success ? (spendingResult.data ?? 0) : 0;

      return {
        id: category.id,
        name: category.name,
        budget: category.monthly_budget,
        spending,
        percentage:
          category.monthly_budget && category.monthly_budget > 0
            ? Math.round((spending / category.monthly_budget) * 100)
            : 0,
      };
    }),
  );

  // Filter out categories with no budget and no spending
  const visibleCategories = categoryBudgets.filter(
    (cat) => cat.budget || cat.spending > 0,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>カテゴリ別予算</CardTitle>
      </CardHeader>
      <CardContent>
        {visibleCategories.length === 0 ? (
          <div className="text-muted-foreground text-sm">
            予算が設定されているカテゴリがありません
          </div>
        ) : (
          <div className="space-y-2">
            {visibleCategories.map((category) => (
              <div key={category.id} className="flex items-center gap-3 text-sm">
                <span className="font-medium min-w-[6rem] shrink-0">
                  {category.name}
                </span>
                {category.budget ? (
                  <>
                    <Progress
                      value={Math.min(category.percentage, 100)}
                      indicatorClassName="bg-chart-2"
                      className="flex-1"
                    />
                    <span className="text-muted-foreground shrink-0">
                      ¥{category.spending.toLocaleString()} / ¥
                      {category.budget.toLocaleString()}
                    </span>
                    <span
                      className={
                        category.percentage > 100
                          ? "text-red-500 font-medium min-w-[3rem] text-right shrink-0"
                          : "text-muted-foreground min-w-[3rem] text-right shrink-0"
                      }
                    >
                      {category.percentage}%
                    </span>
                  </>
                ) : (
                  <span className="text-muted-foreground">
                    ¥{category.spending.toLocaleString()}
                    <span className="text-xs ml-1">(予算未設定)</span>
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

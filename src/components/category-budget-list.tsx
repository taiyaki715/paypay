import { getCategories, getCategorySpending } from "@/app/actions/categories";
import { CategoryBudgetChart } from "@/components/category-budget-chart";

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
        budget: category.monthly_budget ?? 0,
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

  // Sort by budget amount (descending)
  const sortedCategories = visibleCategories.sort(
    (a, b) => b.budget - a.budget,
  );

  // Format data for chart
  const chartData = sortedCategories.map((category) => ({
    category: category.name,
    budget: category.budget,
    spending: category.spending,
  }));

  return (
    <CategoryBudgetChart
      chartData={chartData}
      year={currentYear}
      month={currentMonth}
    />
  );
}

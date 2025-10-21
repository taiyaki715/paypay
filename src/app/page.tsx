import { CategoryBudgetList } from "@/components/category-budget-list";
import { MonthlyBudgetSummary } from "@/components/monthly-budget-summary";

export default function Home() {
  return (
    <main className="container mx-auto p-8">
      <div className="space-y-6">
        <MonthlyBudgetSummary />
        <CategoryBudgetList />
      </div>
    </main>
  );
}

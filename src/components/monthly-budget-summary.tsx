import { getMonthlyBudgetSummary } from "@/app/actions/categories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export async function MonthlyBudgetSummary() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const summaryResult = await getMonthlyBudgetSummary(
    currentYear,
    currentMonth,
  );

  if (!summaryResult.success || !summaryResult.data) {
    return (
      <div className="text-red-500 text-sm">
        予算サマリーの読み込みに失敗しました: {summaryResult.error}
      </div>
    );
  }

  const { totalBudget, totalSpending, progressPercentage, remainingBudget } =
    summaryResult.data;

  // If no budget is set, don't display anything
  if (totalBudget === 0) {
    return null;
  }

  const isOverBudget = remainingBudget < 0;
  const displayPercentage = Math.round(progressPercentage);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">今月の予算</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Amount display */}
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-muted-foreground">支出 / 予算</span>
          <span className="font-medium">
            ¥{totalSpending.toLocaleString()} / ¥{totalBudget.toLocaleString()}
          </span>
        </div>

        {/* Progress bar with percentage */}
        <div className="flex items-center gap-3">
          <Progress
            value={Math.min(progressPercentage, 100)}
            indicatorClassName={isOverBudget ? "bg-red-500" : "bg-chart-2"}
            className="flex-1"
          />
          <span
            className={
              isOverBudget
                ? "text-red-500 font-medium min-w-[3rem] text-right text-sm"
                : "text-muted-foreground min-w-[3rem] text-right text-sm"
            }
          >
            {displayPercentage}%
          </span>
        </div>

        {/* Remaining budget emphasis */}
        <div className="flex items-baseline justify-between pt-2 border-t border-primary/30">
          <span className="text-sm text-muted-foreground">
            {isOverBudget ? "超過" : "残り"}
          </span>
          <span
            className={
              isOverBudget
                ? "text-2xl font-bold text-red-500"
                : "text-2xl font-bold text-green-600"
            }
          >
            {isOverBudget ? "-" : ""}¥
            {Math.abs(remainingBudget).toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

import { getCategories } from "@/app/actions/categories";
import { getTransactions } from "@/app/actions/transactions";
import { TransactionsTable } from "@/components/transactions-table";

export default async function TransactionsPage() {
  const [transactionsResult, categoriesResult] = await Promise.all([
    getTransactions(),
    getCategories(),
  ]);

  const categories =
    categoriesResult.success && categoriesResult.data
      ? categoriesResult.data
      : [];

  return (
    <main className="container mx-auto p-8">
      {transactionsResult.success && transactionsResult.data ? (
        <TransactionsTable
          transactions={transactionsResult.data}
          categories={categories}
        />
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            {transactionsResult.error || "取引データの取得に失敗しました"}
          </p>
        </div>
      )}
    </main>
  );
}

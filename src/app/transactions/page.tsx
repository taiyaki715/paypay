import { getTransactions } from "@/app/actions/transactions";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";

export default async function TransactionsPage() {
  const result = await getTransactions();

  return (
    <main className="container mx-auto p-8">
      {result.success && result.data ? (
        <DataTable columns={columns} data={result.data} />
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            {result.error || "取引データの取得に失敗しました"}
          </p>
        </div>
      )}
    </main>
  );
}

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getTransactions } from "@/app/actions/transactions";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { columns } from "./columns";

export default async function TransactionsPage() {
  const result = await getTransactions();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-muted">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
                戻る
              </Button>
            </Link>
            <h1 className="text-lg font-bold tracking-tight">取引一覧</h1>
          </div>
        </div>
      </header>
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
    </div>
  );
}

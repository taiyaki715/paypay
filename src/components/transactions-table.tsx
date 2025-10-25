"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { getColumns, type Transaction } from "@/app/transactions/columns";
import { DataTable } from "@/components/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import type { Tables } from "@/types/database.types";

type Category = Tables<"categories">;

interface TransactionsTableProps {
  transactions: Transaction[];
  categories: Category[];
}

export function TransactionsTable({
  transactions,
  categories,
}: TransactionsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showExcluded = searchParams.get("showExcluded") === "true";

  const columns = getColumns(categories);

  // Filter out excluded transactions by default
  const filteredTransactions = showExcluded
    ? transactions
    : transactions.filter((t) => !t.is_excluded);

  const handleToggle = (checked: boolean) => {
    const params = new URLSearchParams(searchParams);
    if (checked) {
      params.set("showExcluded", "true");
    } else {
      params.delete("showExcluded");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end space-x-2">
        <Checkbox
          id="show-excluded"
          checked={showExcluded}
          onCheckedChange={handleToggle}
        />
        <label
          htmlFor="show-excluded"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          除外された取引を表示
        </label>
      </div>
      <DataTable columns={columns} data={filteredTransactions} />
    </div>
  );
}

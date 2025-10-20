"use client";

import { getColumns, type Transaction } from "@/app/transactions/columns";
import { DataTable } from "@/components/data-table";
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
  const columns = getColumns(categories);

  return <DataTable columns={columns} data={transactions} />;
}

"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  CategorySelect,
  ExcludeButton,
  SortableHeader,
} from "@/components/table-cells";
import type { Tables } from "@/types/database.types";

export type Transaction = Tables<"transactions">;
type Category = Tables<"categories">;

export function getColumns(categories: Category[]): ColumnDef<Transaction>[] {
  return [
    {
      accessorKey: "transaction_date",
      header: ({ column }) => <SortableHeader column={column} label="取引日" />,
      cell: ({ row }) => {
        const date = new Date(row.getValue("transaction_date"));
        return date.toLocaleDateString("ja-JP");
      },
    },
    {
      accessorKey: "merchant",
      header: ({ column }) => (
        <div className="w-[200px]">
          <SortableHeader column={column} label="取引先" />
        </div>
      ),
      cell: ({ row }) => {
        const merchant = row.getValue("merchant") as string;
        return (
          <div className="w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
            {merchant}
          </div>
        );
      },
    },
    {
      accessorKey: "deposit_amount",
      header: () => <div className="text-right">入金額</div>,
      cell: ({ row }) => {
        const amount = row.getValue("deposit_amount") as number | null;
        if (!amount) return <div className="text-right">-</div>;
        const formatted = new Intl.NumberFormat("ja-JP", {
          style: "currency",
          currency: "JPY",
        }).format(amount);
        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "withdrawal_amount",
      header: () => <div className="text-right">出金額</div>,
      cell: ({ row }) => {
        const amount = row.getValue("withdrawal_amount") as number | null;
        if (!amount) return <div className="text-right">-</div>;
        const formatted = new Intl.NumberFormat("ja-JP", {
          style: "currency",
          currency: "JPY",
        }).format(amount);
        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "payment_method",
      header: "支払い方法",
      cell: ({ row }) => {
        const method = row.getValue("payment_method") as string | null;
        return method || "-";
      },
    },
    {
      id: "category",
      header: "カテゴリ",
      cell: ({ row }) => {
        return (
          <CategorySelect transaction={row.original} categories={categories} />
        );
      },
    },
    {
      id: "exclude",
      header: "",
      cell: ({ row }) => {
        return <ExcludeButton transaction={row.original} />;
      },
    },
  ];
}

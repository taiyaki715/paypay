"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/types/database.types";

export type Transaction = Tables<"transactions">;

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "transaction_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          取引日
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("transaction_date"));
      return date.toLocaleDateString("ja-JP");
    },
  },
  {
    accessorKey: "transaction_number",
    header: "取引番号",
  },
  {
    accessorKey: "transaction_type",
    header: "取引種別",
  },
  {
    accessorKey: "merchant",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          取引先
          <ArrowUpDown />
        </Button>
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
];

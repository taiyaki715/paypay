"use client";

import type { Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { assignCategoryToTransaction } from "@/app/actions/transactions";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Tables } from "@/types/database.types";

type Transaction = Tables<"transactions">;
type Category = Tables<"categories">;

export function CategorySelect({
  transaction,
  categories,
}: {
  transaction: Transaction;
  categories: Category[];
}) {
  const router = useRouter();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    transaction.category_id,
  );
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setSelectedCategoryId(transaction.category_id);
  }, [transaction.category_id]);

  const handleValueChange = async (value: string) => {
    const categoryId = value === "none" ? null : value;
    setIsUpdating(true);

    const result = await assignCategoryToTransaction(
      transaction.id,
      categoryId,
    );

    if (result.success) {
      setSelectedCategoryId(categoryId);
      router.refresh();
    }

    setIsUpdating(false);
  };

  return (
    <Select
      value={selectedCategoryId || "none"}
      onValueChange={handleValueChange}
      disabled={isUpdating}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="未分類" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">未分類</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function SortableHeader<TData>({
  column,
  label,
}: {
  column: Column<TData>;
  label: string;
}) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <ArrowUpDown />
    </Button>
  );
}

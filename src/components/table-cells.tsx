"use client";

import type { Column } from "@tanstack/react-table";
import { ArrowUpDown, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  assignCategoryToTransaction,
  toggleExcludeTransaction,
} from "@/app/actions/transactions";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

export function ExcludeButton({ transaction }: { transaction: Transaction }) {
  const router = useRouter();
  const [isExcluded, setIsExcluded] = useState(transaction.is_excluded);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setIsExcluded(transaction.is_excluded);
  }, [transaction.is_excluded]);

  const handleToggle = async () => {
    setIsUpdating(true);

    const result = await toggleExcludeTransaction(transaction.id);

    if (result.success && result.data) {
      setIsExcluded(result.data.is_excluded);
      router.refresh();
    }

    setIsUpdating(false);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            disabled={isUpdating}
            className="h-8 w-8"
          >
            {isExcluded ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isExcluded ? "除外を解除" : "除外する"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
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

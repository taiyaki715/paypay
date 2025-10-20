"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  createCategory,
  deleteCategory,
  getCategorySpending,
  updateCategory,
} from "@/app/actions/categories";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Tables } from "@/types/database.types";

type Category = Tables<"categories">;

interface CategoryManagerProps {
  initialCategories: Category[];
}

export function CategoryManager({ initialCategories }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [categoryName, setCategoryName] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categorySpending, setCategorySpending] = useState<
    Record<string, number>
  >({});

  // Fetch current month spending for all categories
  useEffect(() => {
    const fetchSpending = async () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      const spendingData: Record<string, number> = {};

      for (const category of categories) {
        const result = await getCategorySpending(
          category.id,
          currentYear,
          currentMonth,
        );
        if (result.success && result.data !== undefined) {
          spendingData[category.id] = result.data;
        } else {
          spendingData[category.id] = 0;
        }
      }

      setCategorySpending(spendingData);
    };

    if (categories.length > 0) {
      fetchSpending();
    }
  }, [categories]);

  const handleCreate = async () => {
    if (!categoryName.trim()) {
      setError("カテゴリ名を入力してください");
      return;
    }

    setIsLoading(true);
    setError(null);

    const budgetValue = monthlyBudget.trim()
      ? Number.parseInt(monthlyBudget.trim(), 10)
      : null;

    const result = await createCategory({
      name: categoryName.trim(),
      monthly_budget: budgetValue,
    });

    if (result.success && result.data) {
      setCategories([...categories, result.data]);
      setIsCreateDialogOpen(false);
      setCategoryName("");
      setMonthlyBudget("");
    } else {
      setError(result.error || "カテゴリの作成に失敗しました");
    }

    setIsLoading(false);
  };

  const handleUpdate = async () => {
    if (!selectedCategory) return;
    if (!categoryName.trim()) {
      setError("カテゴリ名を入力してください");
      return;
    }

    setIsLoading(true);
    setError(null);

    const budgetValue = monthlyBudget.trim()
      ? Number.parseInt(monthlyBudget.trim(), 10)
      : null;

    const result = await updateCategory(selectedCategory.id, {
      name: categoryName.trim(),
      monthly_budget: budgetValue,
    });

    if (result.success && result.data) {
      const updatedCategory = result.data;
      setCategories(
        categories.map((cat) =>
          cat.id === selectedCategory.id ? updatedCategory : cat,
        ),
      );
      setIsEditDialogOpen(false);
      setSelectedCategory(null);
      setCategoryName("");
      setMonthlyBudget("");
    } else {
      setError(result.error || "カテゴリの更新に失敗しました");
    }

    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    setIsLoading(true);
    setError(null);

    const result = await deleteCategory(selectedCategory.id);

    if (result.success) {
      setCategories(categories.filter((cat) => cat.id !== selectedCategory.id));
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
    } else {
      setError(result.error || "カテゴリの削除に失敗しました");
    }

    setIsLoading(false);
  };

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setMonthlyBudget(
      category.monthly_budget !== null
        ? category.monthly_budget.toString()
        : "",
    );
    setError(null);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setError(null);
    setIsDeleteDialogOpen(true);
  };

  const openCreateDialog = () => {
    setCategoryName("");
    setMonthlyBudget("");
    setError(null);
    setIsCreateDialogOpen(true);
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4" />
          カテゴリを追加
        </Button>
      </div>

      <div className="rounded-md border border-primary/10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>カテゴリ名</TableHead>
              <TableHead className="text-right">月間予算</TableHead>
              <TableHead className="text-right">今月の支出</TableHead>
              <TableHead className="w-[200px]">進捗</TableHead>
              <TableHead className="w-[100px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  カテゴリがありません
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => {
                const spending = categorySpending[category.id] || 0;
                const budget = category.monthly_budget || 0;
                const progressPercentage =
                  budget > 0 ? Math.min((spending / budget) * 100, 100) : 0;

                return (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell className="text-right">
                      {category.monthly_budget !== null
                        ? `¥${category.monthly_budget.toLocaleString()}`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      ¥{spending.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {category.monthly_budget !== null ? (
                        <div className="flex items-center gap-2">
                          <Progress
                            value={progressPercentage}
                            className="flex-1"
                          />
                          <span className="text-sm text-muted-foreground min-w-[45px]">
                            {progressPercentage.toFixed(0)}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(category)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(category)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>カテゴリを追加</DialogTitle>
            <DialogDescription>
              新しいカテゴリ名と月間予算を入力してください
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label
                htmlFor="create-category-name"
                className="text-sm font-medium mb-2 block"
              >
                カテゴリ名
              </label>
              <Input
                id="create-category-name"
                placeholder="カテゴリ名"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="create-category-budget"
                className="text-sm font-medium mb-2 block"
              >
                月間予算（円）
              </label>
              <Input
                id="create-category-budget"
                type="number"
                placeholder="例: 50000"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                    handleCreate();
                  }
                }}
              />
              <p className="text-xs text-muted-foreground mt-1">
                未入力の場合は予算なしになります
              </p>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
              disabled={isLoading}
            >
              キャンセル
            </Button>
            <Button onClick={handleCreate} disabled={isLoading}>
              {isLoading ? "作成中..." : "作成"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>カテゴリを編集</DialogTitle>
            <DialogDescription>
              カテゴリ名と月間予算を変更してください
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label
                htmlFor="edit-category-name"
                className="text-sm font-medium mb-2 block"
              >
                カテゴリ名
              </label>
              <Input
                id="edit-category-name"
                placeholder="カテゴリ名"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="edit-category-budget"
                className="text-sm font-medium mb-2 block"
              >
                月間予算（円）
              </label>
              <Input
                id="edit-category-budget"
                type="number"
                placeholder="例: 50000"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                    handleUpdate();
                  }
                }}
              />
              <p className="text-xs text-muted-foreground mt-1">
                未入力の場合は予算なしになります
              </p>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isLoading}
            >
              キャンセル
            </Button>
            <Button onClick={handleUpdate} disabled={isLoading}>
              {isLoading ? "更新中..." : "更新"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>カテゴリを削除</DialogTitle>
            <DialogDescription>
              本当に「{selectedCategory?.name}」を削除しますか？
              このカテゴリが割り当てられている取引は未分類になります。
            </DialogDescription>
          </DialogHeader>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isLoading}
            >
              キャンセル
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "削除中..." : "削除"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use server";

import { createClient } from "@/lib/supabase/server";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/types/database.types";

export async function getCategories(): Promise<{
  success: boolean;
  data?: Tables<"categories">[];
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Database query error:", error);
      return {
        success: false,
        error: `カテゴリの取得に失敗しました: ${error.message}`,
      };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    console.error("Get categories error:", error);
    return {
      success: false,
      error: `カテゴリの取得に失敗しました: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export async function createCategory(
  category: TablesInsert<"categories">,
): Promise<{
  success: boolean;
  data?: Tables<"categories">;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("categories")
      .insert(category)
      .select()
      .single();

    if (error) {
      console.error("Database insert error:", error);
      return {
        success: false,
        error: `カテゴリの作成に失敗しました: ${error.message}`,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Create category error:", error);
    return {
      success: false,
      error: `カテゴリの作成に失敗しました: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export async function updateCategory(
  id: string,
  updates: TablesUpdate<"categories">,
): Promise<{
  success: boolean;
  data?: Tables<"categories">;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("categories")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Database update error:", error);
      return {
        success: false,
        error: `カテゴリの更新に失敗しました: ${error.message}`,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Update category error:", error);
    return {
      success: false,
      error: `カテゴリの更新に失敗しました: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export async function deleteCategory(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      console.error("Database delete error:", error);
      return {
        success: false,
        error: `カテゴリの削除に失敗しました: ${error.message}`,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Delete category error:", error);
    return {
      success: false,
      error: `カテゴリの削除に失敗しました: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export async function getCategorySpending(
  categoryId: string,
  year: number,
  month: number,
): Promise<{
  success: boolean;
  data?: number;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    // Calculate start and end dates for the specified month
    const startDate = new Date(year, month - 1, 1).toISOString();
    const endDate = new Date(year, month, 0, 23, 59, 59, 999).toISOString();

    const { data, error } = await supabase
      .from("transactions")
      .select("withdrawal_amount")
      .eq("category_id", categoryId)
      .eq("is_excluded", false)
      .gte("transaction_date", startDate)
      .lte("transaction_date", endDate);

    if (error) {
      console.error("Database query error:", error);
      return {
        success: false,
        error: `支出の取得に失敗しました: ${error.message}`,
      };
    }

    // Sum up all withdrawal amounts for this category in the specified month
    const totalSpending = data.reduce((sum, transaction) => {
      return sum + (transaction.withdrawal_amount || 0);
    }, 0);

    return {
      success: true,
      data: totalSpending,
    };
  } catch (error) {
    console.error("Get category spending error:", error);
    return {
      success: false,
      error: `支出の取得に失敗しました: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export async function getMonthlyBudgetSummary(
  year: number,
  month: number,
): Promise<{
  success: boolean;
  data?: {
    totalBudget: number;
    totalSpending: number;
    progressPercentage: number;
    remainingBudget: number;
  };
  error?: string;
}> {
  try {
    // Get all categories
    const categoriesResult = await getCategories();
    if (!categoriesResult.success || !categoriesResult.data) {
      return {
        success: false,
        error: categoriesResult.error || "カテゴリの取得に失敗しました",
      };
    }

    // Filter categories with budget set
    const categoriesWithBudget = categoriesResult.data.filter(
      (category) =>
        category.monthly_budget !== null && category.monthly_budget > 0,
    );

    // Calculate total budget
    const totalBudget = categoriesWithBudget.reduce(
      (sum, category) => sum + (category.monthly_budget || 0),
      0,
    );

    // Calculate total spending for all categories with budget
    let totalSpending = 0;
    for (const category of categoriesWithBudget) {
      const spendingResult = await getCategorySpending(
        category.id,
        year,
        month,
      );
      if (spendingResult.success && spendingResult.data !== undefined) {
        totalSpending += spendingResult.data;
      }
    }

    // Calculate progress percentage
    const progressPercentage =
      totalBudget > 0 ? (totalSpending / totalBudget) * 100 : 0;

    // Calculate remaining budget
    const remainingBudget = totalBudget - totalSpending;

    return {
      success: true,
      data: {
        totalBudget,
        totalSpending,
        progressPercentage,
        remainingBudget,
      },
    };
  } catch (error) {
    console.error("Get monthly budget summary error:", error);
    return {
      success: false,
      error: `月間予算サマリーの取得に失敗しました: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

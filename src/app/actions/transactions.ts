"use server";

import { createClient } from "@/lib/supabase/server";
import { parsePayPayCSVFromText } from "@/lib/utils/csvParser";
import type { Tables, TablesInsert } from "@/types/database.types";

export async function importTransactions(
  transactions: TablesInsert<"transactions">[],
): Promise<{
  success: boolean;
  count?: number;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    // Insert transactions in batches to avoid timeout
    const batchSize = 100;
    let totalInserted = 0;

    for (let i = 0; i < transactions.length; i += batchSize) {
      const batch = transactions.slice(i, i + batchSize);

      const { data, error } = await supabase
        .from("transactions")
        .upsert(batch, {
          onConflict: "transaction_number",
          ignoreDuplicates: false,
        })
        .select();

      if (error) {
        console.error("Database insert error:", error);
        return {
          success: false,
          error: `Failed to insert transactions: ${error.message}`,
        };
      }

      totalInserted += data?.length ?? 0;
    }

    return {
      success: true,
      count: totalInserted,
    };
  } catch (error) {
    console.error("Import error:", error);
    return {
      success: false,
      error: `Import failed: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export async function importTransactionsFromFile(formData: FormData): Promise<{
  success: boolean;
  count?: number;
  error?: string;
}> {
  try {
    // Get CSV text from FormData
    const csvText = formData.get("csvText") as string;
    if (!csvText) {
      return { success: false, error: "CSVデータが提供されていません" };
    }

    // Parse CSV on server side
    const parseResult = await parsePayPayCSVFromText(csvText);

    if (!parseResult.success || !parseResult.data) {
      return {
        success: false,
        error: parseResult.error || "CSV解析に失敗しました",
      };
    }

    // Import to database using existing logic
    return await importTransactions(parseResult.data);
  } catch (error) {
    console.error("Import from file error:", error);
    return {
      success: false,
      error: `インポートに失敗しました: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export async function getTransactions(): Promise<{
  success: boolean;
  data?: Tables<"transactions">[];
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("transaction_date", { ascending: false });

    if (error) {
      console.error("Database query error:", error);
      return {
        success: false,
        error: `Failed to fetch transactions: ${error.message}`,
      };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    console.error("Get transactions error:", error);
    return {
      success: false,
      error: `Failed to get transactions: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export async function assignCategoryToTransaction(
  transactionId: string,
  categoryId: string | null,
): Promise<{
  success: boolean;
  data?: Tables<"transactions">;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("transactions")
      .update({ category_id: categoryId })
      .eq("id", transactionId)
      .select()
      .single();

    if (error) {
      console.error("Database update error:", error);
      return {
        success: false,
        error: `カテゴリの割り当てに失敗しました: ${error.message}`,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Assign category error:", error);
    return {
      success: false,
      error: `カテゴリの割り当てに失敗しました: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export async function toggleExcludeTransaction(transactionId: string): Promise<{
  success: boolean;
  data?: Tables<"transactions">;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    // Get current is_excluded value
    const { data: currentData, error: fetchError } = await supabase
      .from("transactions")
      .select("is_excluded")
      .eq("id", transactionId)
      .single();

    if (fetchError) {
      console.error("Database fetch error:", fetchError);
      return {
        success: false,
        error: `取引の取得に失敗しました: ${fetchError.message}`,
      };
    }

    // Toggle is_excluded value
    const { data, error } = await supabase
      .from("transactions")
      .update({ is_excluded: !currentData.is_excluded })
      .eq("id", transactionId)
      .select()
      .single();

    if (error) {
      console.error("Database update error:", error);
      return {
        success: false,
        error: `除外状態の変更に失敗しました: ${error.message}`,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Toggle exclude error:", error);
    return {
      success: false,
      error: `除外状態の変更に失敗しました: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

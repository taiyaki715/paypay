"use server";

import { createClient } from "@/lib/supabase/server";
import { parsePayPayCSVFromText } from "@/lib/utils/csvParser";
import type { TablesInsert } from "@/types/database.types";

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

export async function importTransactionsFromFile(
  formData: FormData,
): Promise<{
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

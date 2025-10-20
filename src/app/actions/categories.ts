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

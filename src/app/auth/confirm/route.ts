import type { EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * メール確認ハンドラー
 * Supabaseからのメール確認リンクを処理
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      // メール確認成功、指定されたURLまたはホームにリダイレクト
      redirect(next);
    }
  }

  // エラーが発生した場合、エラーページにリダイレクト
  redirect("/login?error=confirmation-failed");
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * 新規ユーザー登録
 * メールアドレスとパスワードで新しいアカウントを作成
 */
export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    redirect("/signup?error=missing-fields");
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  // サインアップ成功後、全ページのキャッシュをクリア
  revalidatePath("/", "layout");
  redirect("/");
}

/**
 * ログイン
 * メールアドレスとパスワードで認証
 */
export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    redirect("/login?error=missing-fields");
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  // ログイン成功後、全ページのキャッシュをクリア
  revalidatePath("/", "layout");
  redirect("/");
}

/**
 * ログアウト
 * 現在のユーザーセッションを終了
 */
export async function signOut() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.auth.signOut();
  }

  // ログアウト後、全ページのキャッシュをクリア
  revalidatePath("/", "layout");
  redirect("/login");
}

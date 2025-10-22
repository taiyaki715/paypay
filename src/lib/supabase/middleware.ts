import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import type { Database } from "@/types/database.types";

/**
 * Middleware用のSupabaseクライアント
 * ミドルウェアでセッション更新やリダイレクト処理を行う
 */
export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
  }

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  // セッション更新（重要：認証状態を保持）
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 認証不要なパスを定義
  const publicPaths = ["/login", "/signup"];
  const authPaths = ["/auth"];
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );
  const isAuthPath = authPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  // 未認証ユーザーの保護
  if (!user && !isPublicPath && !isAuthPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 認証済みユーザーがログイン/サインアップページにアクセスした場合
  if (user && isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

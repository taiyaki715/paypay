"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { signUp } from "@/app/actions/auth";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case "missing-fields":
        return "すべてのフィールドを入力してください";
      case "User already registered":
        return "このメールアドレスは既に登録されています";
      default:
        return decodeURIComponent(errorCode);
    }
  };

  const handleSubmit = (formData: FormData) => {
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setPasswordError("パスワードが一致しません");
      return;
    }

    // パスワード確認フィールドを削除してからServer Actionに送信
    formData.delete("confirmPassword");
    setPasswordError(null);
    signUp(formData);
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>新規登録</CardTitle>
          <CardDescription>
            アカウントを作成して家計簿管理を始めましょう
          </CardDescription>
        </CardHeader>
        <form action={handleSubmit} className="flex flex-col gap-6">
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">{getErrorMessage(error)}</Alert>
            )}
            {passwordError && (
              <Alert variant="destructive">{passwordError}</Alert>
            )}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                メールアドレス
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="email@example.com"
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                パスワード
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="new-password"
                minLength={6}
              />
              <p className="text-xs text-muted-foreground">
                6文字以上で入力してください
              </p>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                パスワード（確認）
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="new-password"
                minLength={6}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">
              アカウントを作成
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              既にアカウントをお持ちの方は
              <Link
                href="/login"
                className="ml-1 font-medium text-primary hover:underline"
              >
                ログイン
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

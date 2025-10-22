import Link from "next/link";
import { signIn } from "@/app/actions/auth";
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

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const error = params.error;

  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case "missing-fields":
        return "メールアドレスとパスワードを入力してください";
      case "Invalid login credentials":
        return "メールアドレスまたはパスワードが正しくありません";
      default:
        return decodeURIComponent(errorCode);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>ログイン</CardTitle>
          <CardDescription>
            アカウントにログインして家計簿を管理しましょう
          </CardDescription>
        </CardHeader>
        <form className="flex flex-col gap-6">
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">{getErrorMessage(error)}</Alert>
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
                autoComplete="current-password"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" formAction={signIn} className="w-full">
              ログイン
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              アカウントをお持ちでない方は
              <Link
                href="/signup"
                className="ml-1 font-medium text-primary hover:underline"
              >
                新規登録
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

import type { Metadata } from "next";
import { AppHeader } from "@/components/app-header";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

export const metadata: Metadata = {
  title: "PayPay家計簿",
  description: "PayPayの取引を管理する家計簿アプリ",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="ja">
      <body className={"antialiased"}>
        <div className="min-h-screen bg-background">
          <AppHeader user={user} />
          {children}
        </div>
      </body>
    </html>
  );
}

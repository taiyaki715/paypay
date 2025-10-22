"use client";

import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Download, FolderKanban, List, LogOut, User } from "lucide-react";
import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { CsvUpload } from "@/components/csv-upload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type AppHeaderProps = {
  user: SupabaseUser | null;
};

export function AppHeader({ user }: AppHeaderProps) {
  return (
    <header className="border-b border-primary/10">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/">
          <h1 className="text-lg font-bold tracking-tight cursor-pointer hover:opacity-80 transition-opacity">
            PayPay家計簿
          </h1>
        </Link>
        <div className="flex items-center gap-2">
          {user && (
            <>
              <Link href="/transactions">
                <Button variant="ghost" size="sm">
                  <List className="h-4 w-4" />
                  取引一覧
                </Button>
              </Link>
              <Link href="/categories">
                <Button variant="ghost" size="sm">
                  <FolderKanban className="h-4 w-4" />
                  カテゴリ管理
                </Button>
              </Link>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Download className="h-4 w-4" />
                    CSVインポート
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>CSV取引データインポート</DialogTitle>
                    <DialogDescription>
                      PayPayのCSVファイルをアップロードして、取引データをインポートします
                    </DialogDescription>
                  </DialogHeader>
                  <CsvUpload />
                </DialogContent>
              </Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        アカウント
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    ログアウト
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

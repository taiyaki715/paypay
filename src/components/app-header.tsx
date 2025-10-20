"use client";

import { Download, List } from "lucide-react";
import Link from "next/link";
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

export function AppHeader() {
  return (
    <header className="border-b border-primary/10">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/">
          <h1 className="text-lg font-bold tracking-tight cursor-pointer hover:opacity-80 transition-opacity">
            PayPay家計簿
          </h1>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/transactions">
            <Button variant="ghost" size="sm">
              <List className="h-4 w-4" />
              取引一覧
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
        </div>
      </div>
    </header>
  );
}

"use client";

import { Download } from "lucide-react";
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

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-muted">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold tracking-tight">PayPay家計簿</h1>
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
      </header>
      <main className="container mx-auto p-8">
        {/* メインコンテンツをここに追加 */}
      </main>
    </div>
  );
}

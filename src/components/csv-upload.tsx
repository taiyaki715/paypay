"use client";

import { useState } from "react";
import { importTransactionsFromFile } from "@/app/actions/transactions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function CsvUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(10);
    setResult(null);

    try {
      // Read file as text
      setProgress(30);
      const fileText = await file.text();

      setProgress(50);

      // Create FormData and add CSV text
      const formData = new FormData();
      formData.append("csvText", fileText);

      setProgress(70);

      // Import to database (parsing happens server-side)
      const importResult = await importTransactionsFromFile(formData);

      setProgress(100);

      if (importResult.success) {
        setResult({
          type: "success",
          message: `${importResult.count}件の取引データをインポートしました`,
        });
        setFile(null);
        // Reset file input
        const fileInput = document.getElementById(
          "csv-file",
        ) as HTMLInputElement;
        if (fileInput) {
          fileInput.value = "";
        }
      } else {
        setResult({
          type: "error",
          message: importResult.error || "データのインポートに失敗しました",
        });
      }
    } catch (error) {
      setResult({
        type: "error",
        message: `エラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
      });
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>CSV取引データインポート</CardTitle>
        <CardDescription>
          PayPayのCSVファイルをアップロードして、取引データをインポートします
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="csv-file"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            CSVファイルを選択
          </label>
          <input
            id="csv-file"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={uploading}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {file && (
          <div className="text-sm text-muted-foreground">
            選択されたファイル: {file.name}
          </div>
        )}

        {uploading && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground text-center">
              処理中... {progress}%
            </p>
          </div>
        )}

        {result && (
          <Alert variant={result.type === "error" ? "destructive" : "default"}>
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full"
        >
          {uploading ? "アップロード中..." : "アップロード"}
        </Button>
      </CardContent>
    </Card>
  );
}

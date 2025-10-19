import { CsvUpload } from "@/components/csv-upload";

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto flex flex-col items-center gap-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">家計簿アプリ</h1>
          <p className="text-muted-foreground">
            PayPayのCSVファイルから取引データをインポート
          </p>
        </div>
        <CsvUpload />
      </div>
    </div>
  );
}

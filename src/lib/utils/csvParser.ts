import Papa from "papaparse";
import type { TablesInsert } from "@/types/database.types";

export interface PayPayCSVRow {
  取引日: string;
  "出金金額（円）": string;
  "入金金額（円）": string;
  海外出金金額: string;
  通貨: string;
  "変換レート（円）": string;
  利用国: string;
  取引内容: string;
  取引先: string;
  取引方法: string;
  支払い区分: string;
  利用者: string;
  取引番号: string;
}

/**
 * Parse amount string (e.g., "1,000" or "100") to integer
 */
function parseAmount(amountStr: string): number | null {
  if (!amountStr || amountStr === "-") return null;
  const cleaned = amountStr.replace(/,/g, "");
  const parsed = Number.parseInt(cleaned, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

/**
 * Parse rate string (e.g., "154.55") to number
 */
function parseRate(rateStr: string): number | null {
  if (!rateStr || rateStr === "-") return null;
  const parsed = Number.parseFloat(rateStr);
  return Number.isNaN(parsed) ? null : parsed;
}

/**
 * Parse date string (e.g., "2025/10/19 13:06:26") to ISO timestamp
 */
function parseDate(dateStr: string): string {
  const [datePart, timePart] = dateStr.split(" ");
  const [year, month, day] = datePart.split("/");
  const isoDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${timePart}`;
  return new Date(isoDate).toISOString();
}

/**
 * Convert CSV row to database transaction record
 */
export function convertRowToTransaction(
  row: PayPayCSVRow,
): TablesInsert<"transactions"> {
  return {
    transaction_date: parseDate(row.取引日),
    withdrawal_amount: parseAmount(row["出金金額（円）"]),
    deposit_amount: parseAmount(row["入金金額（円）"]),
    foreign_withdrawal_amount: parseRate(row.海外出金金額),
    currency: row.通貨 === "-" ? null : row.通貨,
    conversion_rate: parseRate(row["変換レート（円）"]),
    country: row.利用国 === "-" ? null : row.利用国,
    transaction_type: row.取引内容,
    merchant: row.取引先,
    payment_method: row.取引方法 === "-" ? null : row.取引方法,
    payment_plan: row.支払い区分 === "-" ? null : row.支払い区分,
    user_name: row.利用者 === "-" ? null : row.利用者,
    transaction_number: row.取引番号,
  };
}

/**
 * Parse CSV file to array of transaction records (client-side only)
 */
export function parsePayPayCSV(file: File): Promise<{
  success: boolean;
  data?: TablesInsert<"transactions">[];
  error?: string;
}> {
  return new Promise((resolve) => {
    Papa.parse<PayPayCSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.error("CSV parsing errors:", results.errors);
          resolve({
            success: false,
            error: `CSV parsing failed: ${results.errors[0].message}`,
          });
          return;
        }

        try {
          const transactions = results.data
            .filter((row) => row.取引番号 && row.取引日)
            .map((row) => convertRowToTransaction(row));

          resolve({
            success: true,
            data: transactions,
          });
        } catch (error) {
          resolve({
            success: false,
            error: `Data conversion failed: ${error instanceof Error ? error.message : String(error)}`,
          });
        }
      },
      error: (error: Error) => {
        resolve({
          success: false,
          error: `CSV parsing error: ${error.message}`,
        });
      },
    });
  });
}

/**
 * Parse CSV text to array of transaction records (server-side compatible)
 */
export function parsePayPayCSVFromText(csvText: string): Promise<{
  success: boolean;
  data?: TablesInsert<"transactions">[];
  error?: string;
}> {
  return new Promise((resolve) => {
    Papa.parse<PayPayCSVRow>(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.error("CSV parsing errors:", results.errors);
          resolve({
            success: false,
            error: `CSV parsing failed: ${results.errors[0].message}`,
          });
          return;
        }

        try {
          const transactions = results.data
            .filter((row) => row.取引番号 && row.取引日)
            .map((row) => convertRowToTransaction(row));

          resolve({
            success: true,
            data: transactions,
          });
        } catch (error) {
          resolve({
            success: false,
            error: `Data conversion failed: ${error instanceof Error ? error.message : String(error)}`,
          });
        }
      },
      error: (error: Error) => {
        resolve({
          success: false,
          error: `CSV parsing error: ${error.message}`,
        });
      },
    });
  });
}

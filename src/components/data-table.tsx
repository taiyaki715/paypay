"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // URLパラメータからページ番号を取得（1-indexed）、デフォルトは1
  const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
  // TanStack Tableは0-indexedなので変換
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: Math.max(0, pageFromUrl - 1),
    pageSize: 30,
  });

  // URLパラメータが変更されたときにページネーション状態を同期
  React.useEffect(() => {
    const newPageIndex = Math.max(0, pageFromUrl - 1);
    setPagination((prev) => ({
      ...prev,
      pageIndex: newPageIndex,
    }));
  }, [pageFromUrl]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    autoResetPageIndex: false,
    state: {
      sorting,
      pagination,
    },
  });

  // ページが変更されたときにURLを更新
  React.useEffect(() => {
    const currentPage = pagination.pageIndex + 1; // 1-indexedに変換
    const urlPage = parseInt(searchParams.get("page") || "1", 10);

    if (currentPage !== urlPage) {
      const params = new URLSearchParams(searchParams.toString());
      if (currentPage === 1) {
        params.delete("page");
      } else {
        params.set("page", currentPage.toString());
      }

      const newUrl = params.toString()
        ? `?${params.toString()}`
        : window.location.pathname;

      router.push(newUrl, { scroll: false });
    }
  }, [pagination.pageIndex, router, searchParams]);

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-md border border-muted">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={
                    (row.original as { is_excluded?: boolean })?.is_excluded
                      ? "opacity-50"
                      : ""
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  データがありません
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            前へ
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            次へ
          </Button>
        </div>
      </div>
    </div>
  );
}

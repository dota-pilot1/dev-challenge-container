import { useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  TabulatorFull as Tabulator,
  type CellComponent,
} from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css";
import { brandsApi, type BrandSyncHistory } from "@/entities/brand";
import { Button } from "@/shared/ui/button";

export const Route = createFileRoute("/brand-sync-history")({
  component: BrandSyncHistoryPage,
});

function BrandSyncHistoryPage() {
  const queryClient = useQueryClient();
  const tableRef = useRef<HTMLDivElement>(null);
  const tabulatorRef = useRef<Tabulator | null>(null);

  const { data: histories = [], isLoading } = useQuery({
    queryKey: ["brand-sync-history"],
    queryFn: brandsApi.findSyncHistory,
  });

  useEffect(() => {
    if (!tableRef.current || isLoading) return;

    const tableData = histories.map((h: BrandSyncHistory) => ({
      ...h,
      createdAt: h.createdAt
        ? new Date(h.createdAt).toLocaleString("ko-KR")
        : "",
      completedAt: h.completedAt
        ? new Date(h.completedAt).toLocaleString("ko-KR")
        : "",
    }));

    if (tabulatorRef.current) {
      tabulatorRef.current.destroy();
    }

    const table = new Tabulator(tableRef.current, {
      data: tableData,
      layout: "fitColumns",
      height: "calc(100vh - 220px)",
      columns: [
        {
          title: "ID",
          field: "id",
          width: 60,
          headerSort: true,
        },
        {
          title: "브랜드ID",
          field: "brandId",
          width: 80,
          headerSort: true,
        },
        {
          title: "브랜드코드",
          field: "brandCode",
          width: 120,
          headerSort: true,
        },
        {
          title: "동기화 유형",
          field: "syncType",
          width: 110,
          hozAlign: "center",
          headerSort: true,
          formatter: (cell: CellComponent) => {
            const v = cell.getValue();
            if (v === "REGISTER")
              return '<span style="color:#3b82f6;font-weight:bold">REGISTER</span>';
            if (v === "UPDATE")
              return '<span style="color:#22c55e;font-weight:bold">UPDATE</span>';
            if (v === "DELETE")
              return '<span style="color:#ef4444;font-weight:bold">DELETE</span>';
            return v || "";
          },
        },
        {
          title: "상태",
          field: "syncStatus",
          width: 90,
          hozAlign: "center",
          headerSort: true,
          formatter: (cell: CellComponent) => {
            const v = cell.getValue();
            if (v === "SUCCESS")
              return '<span style="color:#22c55e;font-weight:bold">SUCCESS</span>';
            if (v === "FAILED")
              return '<span style="color:#ef4444;font-weight:bold">FAILED</span>';
            if (v === "PENDING")
              return '<span style="color:#eab308;font-weight:bold">PENDING</span>';
            return v || "";
          },
        },
        {
          title: "메시지",
          field: "errorMessage",
          widthGrow: 2,
          headerSort: false,
          formatter: (cell: CellComponent) => {
            const v = cell.getValue();
            const row = cell.getRow().getData();
            if (!v && row.syncStatus === "SUCCESS")
              return '<span style="color:#22c55e">성공</span>';
            if (!v) return "";
            return `<span style="color:#ef4444">${v}</span>`;
          },
        },
        {
          title: "재시도",
          field: "retryCount",
          width: 70,
          hozAlign: "center",
          headerSort: true,
        },
        {
          title: "요청일시",
          field: "createdAt",
          width: 160,
          headerSort: true,
        },
        {
          title: "완료일시",
          field: "completedAt",
          width: 160,
          headerSort: true,
        },
      ],
    });

    tabulatorRef.current = table;

    return () => {
      table.destroy();
      tabulatorRef.current = null;
    };
  }, [histories, isLoading]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">동기화 이력</h1>
        <Button
          variant="outline"
          onClick={() =>
            queryClient.invalidateQueries({
              queryKey: ["brand-sync-history"],
            })
          }
        >
          새로고침
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">로딩 중...</p>
      ) : (
        <div ref={tableRef} />
      )}
    </div>
  );
}

import { useEffect, useRef, useCallback, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  TabulatorFull as Tabulator,
  type CellComponent,
} from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css";
import { brandsApi, type Brand } from "@/entities/brand";
import { Button } from "@/shared/ui/button";

export const Route = createFileRoute("/brands")({
  component: BrandsPage,
});

interface RowData {
  id: number | null;
  _rowIndex?: number;
  brandCode: string;
  shopId: string;
  steId: string;
  brandNameKo: string;
  brandNameEn: string;
  brandDesc: string;
  useYn: string;
  syncStatus: string;
  version: number | null;
  createdAt: string;
  _flag?: "C" | "U" | "D";
}

let newRowCounter = 0;

function BrandsPage() {
  const queryClient = useQueryClient();
  const tableRef = useRef<HTMLDivElement>(null);
  const tabulatorRef = useRef<Tabulator | null>(null);
  const [changedRows, setChangedRows] = useState<Map<string, RowData>>(
    new Map(),
  );

  const { data: brands = [], isLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: brandsApi.findAll,
  });

  const saveAndSyncMutation = useMutation({
    mutationFn: brandsApi.saveAndSync,
    onSuccess: () => {
      toast.success("저장 및 외부 연동 완료");
      setChangedRows(new Map());
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const getRowKey = useCallback(
    (row: RowData) =>
      row._flag === "C" ? `new_${row._rowIndex}` : `${row.id}`,
    [],
  );

  const handleAdd = useCallback(() => {
    if (!tabulatorRef.current) return;
    newRowCounter++;
    const newRow: RowData = {
      id: null,
      _rowIndex: newRowCounter,
      brandCode: "",
      shopId: "",
      steId: "",
      brandNameKo: "",
      brandNameEn: "",
      brandDesc: "",
      useYn: "Y",
      syncStatus: "",
      version: null,
      createdAt: "",
      _flag: "C",
    };
    tabulatorRef.current.addRow(newRow, false);
  }, []);

  const deleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      for (const id of ids) {
        await brandsApi.delete(id);
      }
    },
    onSuccess: () => {
      toast.success("삭제되었습니다");
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
    onError: (err: Error) => {
      toast.error(err.message);
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
  });

  const handleDelete = useCallback(() => {
    if (!tabulatorRef.current) return;
    const selectedRows = tabulatorRef.current.getSelectedRows();
    if (selectedRows.length === 0) {
      toast.warning("삭제할 항목을 선택하세요");
      return;
    }

    // 먼저 데이터 수집
    const deleteIds: number[] = [];
    const newRowKeys: string[] = [];
    for (const row of selectedRows) {
      const data = row.getData() as RowData;
      if (data._flag === "C") {
        newRowKeys.push(getRowKey(data));
      } else {
        deleteIds.push(data.id!);
      }
    }

    // UI에서 행 삭제
    for (const row of selectedRows) {
      row.delete();
    }

    // changedRows에서 제거
    if (newRowKeys.length > 0) {
      setChangedRows((prev) => {
        const next = new Map(prev);
        for (const key of newRowKeys) {
          next.delete(key);
        }
        return next;
      });
    }

    // 서버에 삭제 요청
    if (deleteIds.length > 0) {
      deleteMutation.mutate(deleteIds);
    }
  }, [getRowKey, deleteMutation]);

  const collectRows = useCallback(() => {
    return Array.from(changedRows.values());
  }, [changedRows]);

  const toRequest = useCallback(
    (rows: RowData[]) => ({
      rows: rows.map((r) => ({
        id: r.id ?? undefined,
        brandCode: r.brandCode,
        shopId: r.shopId,
        steId: r.steId,
        brandNameKo: r.brandNameKo,
        brandNameEn: r.brandNameEn,
        brandDesc: r.brandDesc,
        useYn: r.useYn,
        version: r.version ?? undefined,
        status: r._flag!,
      })),
    }),
    [],
  );

  const handleSaveAndSync = useCallback(() => {
    const rows = collectRows();

    if (rows.length === 0) {
      toast.info("변경된 항목이 없습니다");
      return;
    }

    for (const row of rows) {
      if (row._flag === "C" && (!row.brandCode || !row.brandNameKo)) {
        toast.warning("신규 항목의 브랜드코드와 브랜드명(한국어)을 입력하세요");
        return;
      }
    }

    saveAndSyncMutation.mutate(toRequest(rows));
  }, [collectRows, toRequest, saveAndSyncMutation]);

  useEffect(() => {
    if (!tableRef.current || isLoading) return;

    const tableData: RowData[] = brands.map((b: Brand) => ({
      id: b.id,
      brandCode: b.brandCode,
      shopId: b.shopId,
      steId: b.steId,
      brandNameKo: b.brandNameKo,
      brandNameEn: b.brandNameEn ?? "",
      brandDesc: b.brandDesc ?? "",
      useYn: b.useYn ?? "Y",
      syncStatus: b.syncStatus ?? "NONE",
      version: b.version,
      createdAt: b.createdAt
        ? new Date(b.createdAt).toLocaleDateString("ko-KR")
        : "",
    }));

    if (tabulatorRef.current) {
      tabulatorRef.current.destroy();
    }

    const table = new Tabulator(tableRef.current, {
      data: tableData,
      layout: "fitColumns",
      height: "calc(100vh - 220px)",
      selectableRows: true,
      columns: [
        {
          title: "",
          formatter: "rowSelection",
          titleFormatter: "rowSelection",
          headerSort: false,
          width: 40,
          cssClass: "text-center",
        },
        {
          title: "ID",
          field: "id",
          width: 60,
          headerSort: true,
          formatter: (cell: CellComponent) => {
            const data = cell.getRow().getData() as RowData;
            if (data._flag === "C") return "<em>NEW</em>";
            return String(cell.getValue() ?? "");
          },
        },
        {
          title: "브랜드코드",
          field: "brandCode",
          editor: "input",
          width: 120,
        },
        {
          title: "점포ID",
          field: "shopId",
          editor: "input",
          width: 100,
        },
        {
          title: "사이트ID",
          field: "steId",
          editor: "input",
          width: 100,
        },
        {
          title: "브랜드명(한)",
          field: "brandNameKo",
          editor: "input",
          widthGrow: 2,
        },
        {
          title: "브랜드명(영)",
          field: "brandNameEn",
          editor: "input",
          widthGrow: 1,
        },
        {
          title: "설명",
          field: "brandDesc",
          editor: "input",
          widthGrow: 1,
        },
        {
          title: "사용",
          field: "useYn",
          editor: "list",
          editorParams: { values: ["Y", "N"] },
          width: 70,
          hozAlign: "center",
        },
        {
          title: "연동",
          field: "syncStatus",
          width: 90,
          headerSort: true,
          hozAlign: "center",
          formatter: (cell: CellComponent) => {
            const v = cell.getValue();
            if (v === "SUCCESS")
              return '<span style="color:#22c55e;font-weight:bold">SUCCESS</span>';
            if (v === "FAILED")
              return '<span style="color:#ef4444;font-weight:bold">FAILED</span>';
            if (v === "PENDING")
              return '<span style="color:#eab308;font-weight:bold">PENDING</span>';
            return v || "NONE";
          },
        },
        {
          title: "등록일",
          field: "createdAt",
          width: 100,
          headerSort: true,
        },
        {
          title: "상태",
          field: "_flag",
          width: 70,
          headerSort: false,
          hozAlign: "center",
          formatter: (cell: CellComponent) => {
            const flag = cell.getValue();
            if (flag === "C")
              return '<span style="color:#22c55e;font-weight:bold">신규</span>';
            if (flag === "U")
              return '<span style="color:#3b82f6;font-weight:bold">수정</span>';
            return "";
          },
        },
      ],
    });

    table.on("cellEdited", (cell: CellComponent) => {
      const data = cell.getRow().getData() as RowData;
      if (!data._flag) {
        data._flag = "U";
        cell.getRow().update({ _flag: "U" });
      }
      setChangedRows((prev) => {
        const next = new Map(prev);
        next.set(getRowKey(data), { ...data });
        return next;
      });
    });

    tabulatorRef.current = table;

    return () => {
      table.destroy();
      tabulatorRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brands, isLoading]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">브랜드 관리(메인)</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleAdd}>
            신규
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            삭제
          </Button>
          <Button
            onClick={handleSaveAndSync}
            disabled={saveAndSyncMutation.isPending}
          >
            {saveAndSyncMutation.isPending ? "저장 중..." : "저장"}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">로딩 중...</p>
      ) : (
        <div ref={tableRef} />
      )}
    </div>
  );
}

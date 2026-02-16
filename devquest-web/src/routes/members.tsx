import { useEffect, useRef, useCallback, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  TabulatorFull as Tabulator,
  type CellComponent,
} from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css";
import { membersApi, type Member } from "@/entities/member";
import { Button } from "@/shared/ui/button";

export const Route = createFileRoute("/members")({
  component: MembersPage,
});

interface RowData {
  id: number | null;
  email: string;
  nickname: string;
  createdAt: string;
  _flag?: "C" | "U" | "D";
}

function MembersPage() {
  const queryClient = useQueryClient();
  const tableRef = useRef<HTMLDivElement>(null);
  const tabulatorRef = useRef<Tabulator | null>(null);
  const [changedRows, setChangedRows] = useState<Map<string, RowData>>(
    new Map(),
  );
  const deletedRowsRef = useRef<RowData[]>([]);

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["members"],
    queryFn: membersApi.findAll,
  });

  const saveMutation = useMutation({
    mutationFn: membersApi.save,
    onSuccess: () => {
      toast.success("저장되었습니다");
      setChangedRows(new Map());
      deletedRowsRef.current = [];
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const getRowKey = useCallback(
    (row: RowData) => (row._flag === "C" ? `new_${row.email}` : `${row.id}`),
    [],
  );

  const handleAdd = useCallback(() => {
    if (!tabulatorRef.current) return;
    const newRow: RowData = {
      id: null,
      email: "",
      nickname: "",
      createdAt: "",
      _flag: "C",
    };
    tabulatorRef.current.addRow(newRow, false);
  }, []);

  const handleDelete = useCallback(() => {
    if (!tabulatorRef.current) return;
    const selectedRows = tabulatorRef.current.getSelectedRows();
    if (selectedRows.length === 0) {
      toast.warning("삭제할 항목을 선택하세요");
      return;
    }

    setChangedRows((prev) => {
      const next = new Map(prev);
      for (const row of selectedRows) {
        const data = row.getData() as RowData;
        if (data._flag === "C") {
          // 신규 행은 그냥 제거
          next.delete(getRowKey(data));
        } else {
          // 기존 행은 D 플래그
          deletedRowsRef.current.push({ ...data, _flag: "D" });
          next.delete(`${data.id}`);
        }
        row.delete();
      }
      return next;
    });
  }, [getRowKey]);

  const handleSave = useCallback(() => {
    const rows = [
      ...Array.from(changedRows.values()),
      ...deletedRowsRef.current,
    ];

    if (rows.length === 0) {
      toast.info("변경된 항목이 없습니다");
      return;
    }

    // 신규 행 유효성 검사
    for (const row of rows) {
      if (row._flag === "C" && (!row.email || !row.nickname)) {
        toast.warning("신규 항목의 이메일과 닉네임을 입력하세요");
        return;
      }
    }

    saveMutation.mutate({
      rows: rows.map((r) => ({
        id: r.id ?? undefined,
        email: r.email,
        nickname: r.nickname,
        status: r._flag!,
      })),
    });
  }, [changedRows, saveMutation]);

  useEffect(() => {
    if (!tableRef.current || isLoading) return;

    const tableData: RowData[] = members.map((m: Member) => ({
      id: m.id,
      email: m.email,
      nickname: m.nickname,
      createdAt: m.createdAt
        ? new Date(m.createdAt).toLocaleDateString("ko-KR")
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
          width: 70,
          headerSort: true,
          formatter: (cell: CellComponent) => {
            const data = cell.getRow().getData() as RowData;
            if (data._flag === "C") return "<em>NEW</em>";
            return String(cell.getValue() ?? "");
          },
        },
        {
          title: "이메일",
          field: "email",
          editor: "input",
          widthGrow: 2,
        },
        {
          title: "닉네임",
          field: "nickname",
          editor: "input",
          widthGrow: 1,
        },
        {
          title: "가입일",
          field: "createdAt",
          width: 120,
          headerSort: true,
        },
        {
          title: "상태",
          field: "_flag",
          width: 80,
          headerSort: false,
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
    // members 데이터가 바뀔 때만 테이블 재생성
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members, isLoading]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">유저 관리</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleAdd}>
            신규
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            삭제
          </Button>
          <Button onClick={handleSave} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? "저장 중..." : "저장"}
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

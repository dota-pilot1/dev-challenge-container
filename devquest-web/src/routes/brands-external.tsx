import { useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  TabulatorFull as Tabulator,
  type CellComponent,
} from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css";
import {
  brandsApi,
  externalBrandsApi,
  type ExternalBrand,
} from "@/entities/brand";
import { Button } from "@/shared/ui/button";

export const Route = createFileRoute("/brands-external")({
  component: BrandsExternalPage,
});

function BrandsExternalPage() {
  const queryClient = useQueryClient();
  const tableRef = useRef<HTMLDivElement>(null);
  const tabulatorRef = useRef<Tabulator | null>(null);

  const { data: brands = [], isLoading } = useQuery({
    queryKey: ["external-brands"],
    queryFn: externalBrandsApi.findAll,
  });

  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      await brandsApi.deleteAll();
      await externalBrandsApi.deleteAll();
    },
    onSuccess: () => {
      toast.success("양쪽 서버 데이터 모두 삭제됨");
      queryClient.invalidateQueries({ queryKey: ["external-brands"] });
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  useEffect(() => {
    if (!tableRef.current || isLoading) return;

    const tableData = brands.map((b: ExternalBrand) => ({
      id: b.id,
      brandCode: b.brandCode,
      shopId: b.shopId ?? "",
      steId: b.brandMid ?? "",
      brandNameKo: b.brandNameKo,
      brandNameEn: b.brandNameEn ?? "",
      brandDesc: b.brandDesc ?? "",
      useYn: b.useYn ?? "Y",
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
      columns: [
        { title: "ID", field: "id", width: 60, headerSort: true },
        { title: "브랜드코드", field: "brandCode", width: 120 },
        { title: "점포ID", field: "shopId", width: 100 },
        { title: "사이트ID", field: "steId", width: 100 },
        { title: "브랜드명(한)", field: "brandNameKo", widthGrow: 2 },
        { title: "브랜드명(영)", field: "brandNameEn", widthGrow: 1 },
        { title: "설명", field: "brandDesc", widthGrow: 1 },
        {
          title: "사용",
          field: "useYn",
          width: 70,
          hozAlign: "center" as const,
        },
        { title: "등록일", field: "createdAt", width: 100 },
      ],
    });

    tabulatorRef.current = table;

    return () => {
      table.destroy();
      tabulatorRef.current = null;
    };
  }, [brands, isLoading]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">브랜드 관리(외부)</h1>
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            shop-api (localhost:3000) 데이터 조회 전용
          </p>
          <Button
            variant="destructive"
            onClick={() => deleteAllMutation.mutate()}
            disabled={deleteAllMutation.isPending}
          >
            {deleteAllMutation.isPending ? "삭제 중..." : "모두 삭제"}
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

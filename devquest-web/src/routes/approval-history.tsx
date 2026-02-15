import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { mainApi } from "@/shared/api/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Badge } from "@/shared/ui/badge";
import { parseErrorMessage } from "@/shared/lib/parse-error-message";

export const Route = createFileRoute("/approval-history")({
  component: ApprovalHistoryPage,
});

interface ApprovalHistory {
  id: number;
  participationId: number;
  action: string;
  status: string;
  orderId: number | null;
  errorMessage: string | null;
  createdAt: string;
}

const actionConfig: Record<string, string> = {
  APPROVE_REQUEST: "승인 요청",
  APPROVE_RETRY: "재시도",
  APPROVE_CANCEL: "승인 취소",
};

function ApprovalHistoryPage() {
  const { data: histories = [], isLoading } = useQuery({
    queryKey: ["approval-history"],
    queryFn: () => mainApi.get<ApprovalHistory[]>("/approval-history"),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Approval History</h1>
      <p className="text-muted-foreground">
        승인 시도 이력 (성공/실패/재시도 전체 기록)
      </p>

      {isLoading ? (
        <p className="text-muted-foreground">로딩 중...</p>
      ) : histories.length === 0 ? (
        <p className="text-muted-foreground">아직 승인 이력이 없습니다.</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead className="w-28">참가 ID</TableHead>
                <TableHead className="w-28">시도 유형</TableHead>
                <TableHead className="w-24">결과</TableHead>
                <TableHead className="w-24">주문 ID</TableHead>
                <TableHead>실패 사유</TableHead>
                <TableHead className="w-44">시도 시각</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {histories.map((h) => (
                <TableRow key={h.id}>
                  <TableCell className="font-mono">{h.id}</TableCell>
                  <TableCell className="font-mono">
                    #{h.participationId}
                  </TableCell>
                  <TableCell>{actionConfig[h.action] ?? h.action}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        h.status === "SUCCESS" ? "default" : "destructive"
                      }
                    >
                      {h.status === "SUCCESS" ? "성공" : "실패"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono">
                    {h.orderId ? `#${h.orderId}` : "-"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs">
                    {h.errorMessage ? parseErrorMessage(h.errorMessage) : "-"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(h.createdAt).toLocaleString("ko-KR")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

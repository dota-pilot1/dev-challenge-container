import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { participationsApi } from "@/entities/participation";
import { productsApi, type Product } from "@/entities/product";
import { ordersApi } from "@/entities/order";
import { paymentApi } from "@/shared/api/client";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Separator } from "@/shared/ui/separator";

export const Route = createFileRoute("/concurrency-test")({
  component: ConcurrencyTestPage,
});

type TestResult = {
  index: number;
  status: "success" | "error";
  time: number;
  message: string;
};

type TestSummary = {
  total: number;
  success: number;
  error: number;
  avgTime: number;
  results: TestResult[];
};

function ConcurrencyTestPage() {
  const [activeTab, setActiveTab] = useState<
    "approve" | "order" | "idempotency"
  >("approve");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">동시성 부하 테스트</h1>
      <p className="text-muted-foreground">
        동시 요청을 보내서 비관적 락, 원자적 재고 차감, 멱등성 키가 정상
        동작하는지 검증합니다
      </p>

      <div className="flex gap-2">
        {(
          [
            { key: "approve", label: "동시 승인" },
            { key: "order", label: "동시 주문" },
            { key: "idempotency", label: "멱등성 키" },
          ] as const
        ).map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "default" : "outline"}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <Separator />

      {activeTab === "approve" && <ApproveTest />}
      {activeTab === "order" && <OrderTest />}
      {activeTab === "idempotency" && <IdempotencyTest />}
    </div>
  );
}

// ─── 결과 테이블 공통 컴포넌트 ───

function ResultView({ summary }: { summary: TestSummary }) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Card className="flex-1">
          <CardContent className="py-3 text-center">
            <p className="text-2xl font-bold">{summary.total}</p>
            <p className="text-sm text-muted-foreground">총 요청</p>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardContent className="py-3 text-center">
            <p className="text-2xl font-bold text-green-600">
              {summary.success}
            </p>
            <p className="text-sm text-muted-foreground">성공</p>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardContent className="py-3 text-center">
            <p className="text-2xl font-bold text-red-600">{summary.error}</p>
            <p className="text-sm text-muted-foreground">실패</p>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardContent className="py-3 text-center">
            <p className="text-2xl font-bold">{summary.avgTime}ms</p>
            <p className="text-sm text-muted-foreground">평균 응답</p>
          </CardContent>
        </Card>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead className="w-24">상태</TableHead>
            <TableHead className="w-28">응답 시간</TableHead>
            <TableHead>메시지</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {summary.results.map((r) => (
            <TableRow key={r.index}>
              <TableCell>{r.index}</TableCell>
              <TableCell>
                <Badge
                  variant={r.status === "success" ? "default" : "destructive"}
                >
                  {r.status === "success" ? "성공" : "실패"}
                </Badge>
              </TableCell>
              <TableCell>{r.time}ms</TableCell>
              <TableCell className="text-sm">{r.message}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ─── 1. 동시 승인 테스트 ───

function ApproveTest() {
  const [count, setCount] = useState("10");
  const [targetId, setTargetId] = useState("");
  const [running, setRunning] = useState(false);
  const [summary, setSummary] = useState<TestSummary | null>(null);

  const { data: participations = [] } = useQuery({
    queryKey: ["participations", "all"],
    queryFn: participationsApi.findAll,
  });

  const submittedList = participations.filter((p) => p.status === "SUBMITTED");

  const runTest = async () => {
    if (!targetId) return;
    setRunning(true);
    setSummary(null);

    const n = Number(count);
    const results = await Promise.all(
      Array.from({ length: n }, (_, i) => {
        const start = Date.now();
        return participationsApi
          .approve(Number(targetId))
          .then((data) => ({
            index: i + 1,
            status: "success" as const,
            time: Date.now() - start,
            message: `상태: ${data.status}, 주문: #${data.orderId ?? "-"}`,
          }))
          .catch((err: Error) => ({
            index: i + 1,
            status: "error" as const,
            time: Date.now() - start,
            message: err.message,
          }));
      }),
    );

    const success = results.filter((r) => r.status === "success").length;
    const avgTime = Math.round(
      results.reduce((a, r) => a + r.time, 0) / results.length,
    );

    setSummary({
      total: n,
      success,
      error: n - success,
      avgTime,
      results,
    });
    setRunning(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>동시 승인 테스트</CardTitle>
          <p className="text-sm text-muted-foreground">
            같은 참가자에 동시에 N번 승인 요청 → 비관적 락으로 1건만 성공해야
            정상
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="space-y-2 flex-1">
              <Label>대상 (SUBMITTED 상태)</Label>
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              >
                <option value="">선택하세요</option>
                {submittedList.map((p) => (
                  <option key={p.id} value={p.id}>
                    참가 #{p.id} — {p.nickname ?? `User ${p.userId}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 w-32">
              <Label>동시 요청 수</Label>
              <Input
                type="number"
                min={1}
                max={50}
                value={count}
                onChange={(e) => setCount(e.target.value)}
              />
            </div>
            <Button
              onClick={runTest}
              disabled={running || !targetId}
              className="w-32"
            >
              {running ? "테스트 중..." : "테스트 시작"}
            </Button>
          </div>
          {submittedList.length === 0 && (
            <p className="text-sm text-muted-foreground">
              SUBMITTED 상태인 참가자가 없습니다. 챌린지에서 참가 → 제출을 먼저
              진행하세요.
            </p>
          )}
        </CardContent>
      </Card>

      {summary && <ResultView summary={summary} />}
    </div>
  );
}

// ─── 2. 동시 주문 테스트 ───

function OrderTest() {
  const [count, setCount] = useState("10");
  const [productId, setProductId] = useState("");
  const [stock, setStock] = useState("5");
  const [running, setRunning] = useState(false);
  const [summary, setSummary] = useState<TestSummary | null>(null);
  const [finalStock, setFinalStock] = useState<number | null>(null);

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: productsApi.findAll,
  });

  const runTest = async () => {
    if (!productId) return;
    setRunning(true);
    setSummary(null);
    setFinalStock(null);

    // 재고를 설정한 값으로 초기화
    await productsApi.updateStock(Number(productId), Number(stock));

    const n = Number(count);
    const results = await Promise.all(
      Array.from({ length: n }, (_, i) => {
        const start = Date.now();
        return paymentApi
          .post<{ id: number }>("/orders", {
            productId: Number(productId),
            userId: 999,
            quantity: 1,
          })
          .then((data) => ({
            index: i + 1,
            status: "success" as const,
            time: Date.now() - start,
            message: `주문 #${data.id} 생성`,
          }))
          .catch((err: Error) => ({
            index: i + 1,
            status: "error" as const,
            time: Date.now() - start,
            message: err.message,
          }));
      }),
    );

    // 최종 재고 확인
    const product = await productsApi.findById(Number(productId));
    setFinalStock(product.stock);

    const success = results.filter((r) => r.status === "success").length;
    const avgTime = Math.round(
      results.reduce((a, r) => a + r.time, 0) / results.length,
    );

    setSummary({
      total: n,
      success,
      error: n - success,
      avgTime,
      results,
    });
    setRunning(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>동시 주문 테스트</CardTitle>
          <p className="text-sm text-muted-foreground">
            재고보다 많은 동시 주문 → 원자적 차감으로 재고만큼만 성공해야 정상
            (재고가 음수가 되면 Race Condition)
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="space-y-2 flex-1">
              <Label>상품</Label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              >
                <option value="">선택하세요</option>
                {products.map((p: Product) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (현재 재고: {p.stock})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 w-28">
              <Label>초기 재고</Label>
              <Input
                type="number"
                min={1}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
            <div className="space-y-2 w-28">
              <Label>동시 요청 수</Label>
              <Input
                type="number"
                min={1}
                max={50}
                value={count}
                onChange={(e) => setCount(e.target.value)}
              />
            </div>
            <Button
              onClick={runTest}
              disabled={running || !productId}
              className="w-32"
            >
              {running ? "테스트 중..." : "테스트 시작"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {summary && (
        <>
          {finalStock !== null && (
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <span className="font-medium">최종 재고:</span>
                  <span className="text-2xl font-bold">{finalStock}개</span>
                  {finalStock >= 0 ? (
                    <Badge variant="default">정상 (음수 아님)</Badge>
                  ) : (
                    <Badge variant="destructive">
                      Race Condition 발생! (음수)
                    </Badge>
                  )}
                  <span className="text-sm text-muted-foreground">
                    초기 재고 {stock}개 → 성공 {summary.success}건 → 남은 재고{" "}
                    {finalStock}개
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
          <ResultView summary={summary} />
        </>
      )}
    </div>
  );
}

// ─── 3. 멱등성 키 테스트 ───

function IdempotencyTest() {
  const [count, setCount] = useState("5");
  const [targetId, setTargetId] = useState("");
  const [running, setRunning] = useState(false);
  const [summary, setSummary] = useState<TestSummary | null>(null);
  const [orderCount, setOrderCount] = useState<number | null>(null);

  const { data: participations = [] } = useQuery({
    queryKey: ["participations", "all"],
    queryFn: participationsApi.findAll,
  });

  const failedList = participations.filter(
    (p) => p.status === "APPROVE_FAILED",
  );

  const runTest = async () => {
    if (!targetId) return;
    setRunning(true);
    setSummary(null);
    setOrderCount(null);

    // 테스트 전 주문 수
    const ordersBefore = await ordersApi.findAll();
    const countBefore = ordersBefore.length;

    const n = Number(count);
    const results = await Promise.all(
      Array.from({ length: n }, (_, i) => {
        const start = Date.now();
        return participationsApi
          .retryApprove(Number(targetId))
          .then((data) => ({
            index: i + 1,
            status: "success" as const,
            time: Date.now() - start,
            message: `상태: ${data.status}, 주문: #${data.orderId ?? "-"}`,
          }))
          .catch((err: Error) => ({
            index: i + 1,
            status: "error" as const,
            time: Date.now() - start,
            message: err.message,
          }));
      }),
    );

    // 테스트 후 주문 수
    const ordersAfter = await ordersApi.findAll();
    setOrderCount(ordersAfter.length - countBefore);

    const success = results.filter((r) => r.status === "success").length;
    const avgTime = Math.round(
      results.reduce((a, r) => a + r.time, 0) / results.length,
    );

    setSummary({
      total: n,
      success,
      error: n - success,
      avgTime,
      results,
    });
    setRunning(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>멱등성 키 테스트</CardTitle>
          <p className="text-sm text-muted-foreground">
            같은 참가자에 동시에 N번 재시도 → 멱등성 키로 주문 1건만 생성되어야
            정상
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="space-y-2 flex-1">
              <Label>대상 (APPROVE_FAILED 상태)</Label>
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              >
                <option value="">선택하세요</option>
                {failedList.map((p) => (
                  <option key={p.id} value={p.id}>
                    참가 #{p.id} — {p.nickname ?? `User ${p.userId}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 w-32">
              <Label>동시 요청 수</Label>
              <Input
                type="number"
                min={1}
                max={50}
                value={count}
                onChange={(e) => setCount(e.target.value)}
              />
            </div>
            <Button
              onClick={runTest}
              disabled={running || !targetId}
              className="w-32"
            >
              {running ? "테스트 중..." : "테스트 시작"}
            </Button>
          </div>
          {failedList.length === 0 && (
            <p className="text-sm text-muted-foreground">
              APPROVE_FAILED 상태인 참가자가 없습니다. 재고를 0으로 설정한 후
              승인을 시도하면 실패 상태를 만들 수 있습니다.
            </p>
          )}
        </CardContent>
      </Card>

      {summary && (
        <>
          {orderCount !== null && (
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <span className="font-medium">생성된 주문 수:</span>
                  <span className="text-2xl font-bold">{orderCount}건</span>
                  {orderCount <= 1 ? (
                    <Badge variant="default">
                      정상 (멱등성 키로 중복 방지됨)
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      중복 주문 발생! ({orderCount}건)
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          <ResultView summary={summary} />
        </>
      )}
    </div>
  );
}

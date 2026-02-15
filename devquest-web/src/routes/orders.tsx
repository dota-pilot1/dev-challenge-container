import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "@/entities/order";
import { productsApi } from "@/entities/product";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Badge } from "@/shared/ui/badge";

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
});

const statusConfig: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  PENDING: { label: "대기", variant: "outline" },
  PAID: { label: "결제완료", variant: "default" },
  PREPARING: { label: "준비중", variant: "secondary" },
  SHIPPED: { label: "배송중", variant: "secondary" },
  DELIVERED: { label: "배송완료", variant: "default" },
  CANCELLED: { label: "취소", variant: "destructive" },
};

function OrdersPage() {
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: ordersApi.findAll,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: productsApi.findAll,
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Orders</h1>
      <p className="text-muted-foreground">
        주문 내역 (챌린지 완료 시 자동으로 주문이 생성됩니다)
      </p>

      {ordersLoading ? (
        <p className="text-muted-foreground">로딩 중...</p>
      ) : orders.length === 0 ? (
        <p className="text-muted-foreground">아직 주문 내역이 없습니다.</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead>상품</TableHead>
                <TableHead className="w-20">수량</TableHead>
                <TableHead className="w-28">상태</TableHead>
                <TableHead className="w-24">사용자</TableHead>
                <TableHead className="w-44">주문일시</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const product = productMap.get(order.productId);
                const status = statusConfig[order.status] ?? {
                  label: order.status,
                  variant: "outline" as const,
                };
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono">{order.id}</TableCell>
                    <TableCell>
                      {product?.name ?? `상품 #${order.productId}`}
                    </TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell>User {order.userId}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString("ko-KR")}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

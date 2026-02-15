import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi, type Product } from "@/entities/product";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

export const Route = createFileRoute("/shop")({
  component: ShopPage,
});

function ShopPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [stockValue, setStockValue] = useState("");

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: productsApi.findAll,
  });

  const updateStockMutation = useMutation({
    mutationFn: ({ id, stock }: { id: number; stock: number }) =>
      productsApi.updateStock(id, stock),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setEditingId(null);
      setStockValue("");
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Shop</h1>
      <p className="text-muted-foreground">
        쇼핑몰 상품 목록 (챌린지 보상으로 지급됩니다)
      </p>

      {isLoading ? (
        <p className="text-muted-foreground">로딩 중...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product: Product) => (
            <Card key={product.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <Badge
                    variant={product.stock > 0 ? "default" : "destructive"}
                  >
                    {product.stock > 0 ? `재고 ${product.stock}` : "품절"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  {product.description || "설명 없음"}
                </p>
                <p className="text-xl font-bold mb-3">
                  {Number(product.price).toLocaleString()}원
                </p>

                {editingId === product.id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      value={stockValue}
                      onChange={(e) => setStockValue(e.target.value)}
                      className="h-8 w-24 text-sm"
                      placeholder="수량"
                    />
                    <Button
                      size="sm"
                      onClick={() =>
                        updateStockMutation.mutate({
                          id: product.id,
                          stock: Number(stockValue),
                        })
                      }
                      disabled={
                        updateStockMutation.isPending || stockValue === ""
                      }
                    >
                      저장
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingId(null)}
                    >
                      취소
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingId(product.id);
                      setStockValue(String(product.stock));
                    }}
                  >
                    재고 수정
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/entities/product";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";

export const Route = createFileRoute("/shop")({
  component: ShopPage,
});

function ShopPage() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: productsApi.findAll,
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
          {products.map((product) => (
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
                <p className="text-xl font-bold">
                  {Number(product.price).toLocaleString()}원
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

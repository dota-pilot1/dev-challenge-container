import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { challengesApi } from "@/entities/challenge";
import { productsApi } from "@/entities/product";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";

export const Route = createFileRoute("/")({
  component: DashboardPage,
});

function DashboardPage() {
  const { data: challenges = [] } = useQuery({
    queryKey: ["challenges"],
    queryFn: challengesApi.findAll,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: productsApi.findAll,
  });

  const activeChallenges = challenges.filter((c) => c.status === "ACTIVE");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">활성 챌린지</CardTitle>
            <Badge variant="secondary">챌린지</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeChallenges.length}개
            </div>
            <Button variant="link" className="px-0 text-xs" asChild>
              <Link to="/challenges">챌린지 보기</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">쇼핑몰 상품</CardTitle>
            <Badge variant="secondary">상품</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}개</div>
            <Button variant="link" className="px-0 text-xs" asChild>
              <Link to="/shop">상품 보기</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">서버 상태</CardTitle>
            <Badge variant="secondary">시스템</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <div>
                DevQuest :8080{" "}
                <Badge variant="outline" className="ml-1">
                  연결됨
                </Badge>
              </div>
              <div>
                쇼핑몰 :3000{" "}
                <Badge variant="outline" className="ml-1">
                  연결됨
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

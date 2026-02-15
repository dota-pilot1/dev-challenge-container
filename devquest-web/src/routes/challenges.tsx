import { useState } from "react";
import { Modal, ModalHeader, ModalBody } from "@/shared/ui/modal";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { challengesApi, type Challenge } from "@/entities/challenge";
import { productsApi, type Product } from "@/entities/product";
import {
  participationsApi,
  type Participation,
} from "@/entities/participation";
import { useAuth } from "@/features/auth";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Card, CardContent } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { Separator } from "@/shared/ui/separator";

export const Route = createFileRoute("/challenges")({
  component: ChallengesPage,
});

const pStatusConfig: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  APPLIED: { label: "참가 신청", variant: "outline" },
  SUBMITTED: { label: "제출 완료", variant: "secondary" },
  APPROVED: { label: "승인", variant: "default" },
  REJECTED: { label: "반려", variant: "destructive" },
};

function ChallengesPage() {
  const queryClient = useQueryClient();
  const { user, isLoggedIn } = useAuth();

  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rewardProductId, setRewardProductId] = useState("");

  const [detailChallenge, setDetailChallenge] = useState<Challenge | null>(
    null,
  );

  const [submitTargetId, setSubmitTargetId] = useState<number | null>(null);
  const [submissionUrl, setSubmissionUrl] = useState("");

  const { data: challenges = [], isLoading } = useQuery({
    queryKey: ["challenges"],
    queryFn: challengesApi.findAll,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: productsApi.findAll,
  });

  const { data: participations = [] } = useQuery({
    queryKey: ["participations", "challenge", detailChallenge?.id],
    queryFn: () => participationsApi.findByChallengeId(detailChallenge!.id),
    enabled: !!detailChallenge,
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["participations"] });
    queryClient.invalidateQueries({ queryKey: ["orders"] });
  };

  const createMutation = useMutation({
    mutationFn: challengesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      setCreateOpen(false);
      setTitle("");
      setDescription("");
      setRewardProductId("");
    },
  });

  const applyMutation = useMutation({
    mutationFn: participationsApi.apply,
    onSuccess: invalidateAll,
  });

  const cancelMutation = useMutation({
    mutationFn: participationsApi.cancel,
    onSuccess: invalidateAll,
  });

  const submitMutation = useMutation({
    mutationFn: ({ id, url }: { id: number; url: string }) =>
      participationsApi.submit(id, { submissionUrl: url }),
    onSuccess: () => {
      invalidateAll();
      setSubmitTargetId(null);
      setSubmissionUrl("");
    },
  });

  const approveMutation = useMutation({
    mutationFn: participationsApi.approve,
    onSuccess: invalidateAll,
  });

  const rejectMutation = useMutation({
    mutationFn: participationsApi.reject,
    onSuccess: invalidateAll,
  });

  const getProductName = (productId: number) => {
    const product = products.find((p: Product) => p.id === productId);
    return product ? product.name : `상품 #${productId}`;
  };

  const myParticipation = participations.find((p) => p.userId === user?.id);
  const isApplied = !!myParticipation;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Challenges</h1>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>챌린지 등록</Button>
          </DialogTrigger>
          <DialogContent className="p-6">
            <DialogHeader>
              <DialogTitle>새 챌린지 등록</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createMutation.mutate({
                  title,
                  description: description || undefined,
                  rewardProductId: Number(rewardProductId),
                });
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="title">제목</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="PR 리뷰 5개 완료"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">설명</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="챌린지에 대한 상세 설명"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rewardProductId">보상 상품</Label>
                <select
                  id="rewardProductId"
                  value={rewardProductId}
                  onChange={(e) => setRewardProductId(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  required
                >
                  <option value="">상품을 선택하세요</option>
                  {products.map((product: Product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({Number(product.price).toLocaleString()}
                      원)
                    </option>
                  ))}
                </select>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "등록 중..." : "등록"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">로딩 중...</p>
      ) : challenges.length === 0 ? (
        <p className="text-muted-foreground">등록된 챌린지가 없습니다</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead>제목</TableHead>
              <TableHead>설명</TableHead>
              <TableHead>보상 상품</TableHead>
              <TableHead className="w-20 text-center">상세</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {challenges.map((challenge) => (
              <TableRow key={challenge.id}>
                <TableCell>{challenge.id}</TableCell>
                <TableCell className="font-medium">{challenge.title}</TableCell>
                <TableCell className="text-muted-foreground">
                  {challenge.description || "-"}
                </TableCell>
                <TableCell>
                  {getProductName(challenge.rewardProductId)}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDetailChallenge(challenge)}
                  >
                    상세
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* 상세 모달 (Headless UI) */}
      <Modal
        open={!!detailChallenge}
        onClose={() => {
          setDetailChallenge(null);
          setSubmitTargetId(null);
          setSubmissionUrl("");
        }}
        size="xl"
      >
        {detailChallenge && (
          <>
            <ModalHeader
              title={detailChallenge.title}
              onClose={() => {
                setDetailChallenge(null);
                setSubmitTargetId(null);
                setSubmissionUrl("");
              }}
            />
            <ModalBody>
              <div className="grid grid-cols-2 gap-8">
                {/* 왼쪽: 챌린지 정보 + 참가 신청 */}
                <div className="space-y-5">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">챌린지 정보</h3>
                    <p className="text-muted-foreground">
                      {detailChallenge.description || "설명 없음"}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">보상 상품:</span>
                      <Badge variant="secondary">
                        {getProductName(detailChallenge.rewardProductId)}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  {!isLoggedIn ? (
                    <p className="text-sm text-muted-foreground">
                      로그인 후 참가 신청할 수 있습니다.
                    </p>
                  ) : isApplied ? (
                    <p className="text-sm text-muted-foreground">
                      이미 참가 신청된 챌린지입니다. 오른쪽에서 진행 상태를
                      확인하세요.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg">참가 신청</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          <span className="font-medium">{user!.nickname}</span>
                          <span className="text-muted-foreground ml-1">
                            ({user!.email})
                          </span>
                        </span>
                        <Button
                          onClick={() =>
                            applyMutation.mutate({
                              challengeId: detailChallenge.id,
                              userId: user!.id,
                            })
                          }
                          disabled={applyMutation.isPending}
                        >
                          {applyMutation.isPending ? "신청 중..." : "참가 신청"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 오른쪽: 참가자 목록 */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">
                    참가자 목록
                    {participations.length > 0 && (
                      <span className="text-sm font-normal text-muted-foreground ml-2">
                        ({participations.length}명)
                      </span>
                    )}
                  </h3>

                  {participations.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      아직 참가자가 없습니다
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                      {participations.map((p) => {
                        const status = pStatusConfig[p.status] ?? {
                          label: p.status,
                          variant: "outline" as const,
                        };
                        const isMe = p.userId === user?.id;

                        return (
                          <Card
                            key={p.id}
                            className={isMe ? "border-primary" : ""}
                          >
                            <CardContent className="py-2 px-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">
                                    {p.nickname ?? `User ${p.userId}`}
                                  </span>
                                  {isMe && (
                                    <span className="text-xs text-primary font-medium">
                                      (나)
                                    </span>
                                  )}
                                  <Badge variant={status.variant}>
                                    {status.label}
                                  </Badge>
                                  {p.orderId && (
                                    <span className="text-xs text-muted-foreground">
                                      주문 #{p.orderId}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  {isMe && p.status === "APPLIED" && (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          setSubmitTargetId(p.id);
                                          setSubmissionUrl("");
                                        }}
                                      >
                                        제출하기
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() =>
                                          cancelMutation.mutate(p.id)
                                        }
                                        disabled={cancelMutation.isPending}
                                      >
                                        참가 취소
                                      </Button>
                                    </>
                                  )}
                                  {p.status === "SUBMITTED" && (
                                    <>
                                      <Button
                                        size="sm"
                                        onClick={() =>
                                          approveMutation.mutate(p.id)
                                        }
                                        disabled={approveMutation.isPending}
                                      >
                                        승인
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() =>
                                          rejectMutation.mutate(p.id)
                                        }
                                        disabled={rejectMutation.isPending}
                                      >
                                        반려
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* 제출 URL 입력 (펼침) */}
                              {isMe &&
                                p.status === "APPLIED" &&
                                submitTargetId === p.id && (
                                  <div className="flex items-end gap-2 mt-2">
                                    <Input
                                      value={submissionUrl}
                                      onChange={(e) =>
                                        setSubmissionUrl(e.target.value)
                                      }
                                      placeholder="https://github.com/..."
                                      className="h-8 text-sm flex-1"
                                    />
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        submitMutation.mutate({
                                          id: p.id,
                                          url: submissionUrl,
                                        })
                                      }
                                      disabled={
                                        submitMutation.isPending ||
                                        !submissionUrl
                                      }
                                    >
                                      확인
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => setSubmitTargetId(null)}
                                    >
                                      닫기
                                    </Button>
                                  </div>
                                )}

                              {/* 제출 URL 표시 */}
                              {p.submissionUrl && (
                                <p className="text-xs text-muted-foreground truncate mt-1">
                                  제출:{" "}
                                  <a
                                    href={p.submissionUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    {p.submissionUrl}
                                  </a>
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </Modal>
    </div>
  );
}

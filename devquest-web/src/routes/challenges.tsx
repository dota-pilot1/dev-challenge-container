import { useState, useCallback } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import { parseErrorMessage } from "@/shared/lib/parse-error-message";
import { Modal, ModalHeader, ModalBody } from "@/shared/ui/modal";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { challengesApi, type Challenge } from "@/entities/challenge";
import { productsApi, type Product } from "@/entities/product";
import { participationsApi } from "@/entities/participation";
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
  APPROVE_FAILED: { label: "승인 실패", variant: "destructive" },
  REJECTED: { label: "반려", variant: "destructive" },
};

function ChallengesPage() {
  const queryClient = useQueryClient();
  const { user, isLoggedIn } = useAuth();

  const [formOpen, setFormOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(
    null,
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rewardProductId, setRewardProductId] = useState("");
  const [rewardQuantity, setRewardQuantity] = useState("1");

  const openCreateForm = () => {
    setEditingChallenge(null);
    setTitle("");
    setDescription("");
    setRewardProductId("");
    setRewardQuantity("1");
    setFormOpen(true);
  };

  const openEditForm = (challenge: Challenge) => {
    setEditingChallenge(challenge);
    setTitle(challenge.title);
    setDescription(challenge.description || "");
    setRewardProductId(String(challenge.rewardProductId));
    setRewardQuantity(String(challenge.rewardQuantity));
    setFormOpen(true);
  };

  const [detailChallenge, setDetailChallenge] = useState<Challenge | null>(
    null,
  );

  const [submitTargetId, setSubmitTargetId] = useState<number | null>(null);
  const [submissionUrl, setSubmissionUrl] = useState("");

  const [errorDialog, setErrorDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
  }>({ open: false, title: "", description: "" });

  const showErrorFromHistory = useCallback(
    async (participationId: number, title: string) => {
      try {
        const history =
          await participationsApi.getApprovalHistory(participationId);
        const latest = history.find((h) => h.status === "FAILED");
        const rawMessage =
          latest?.errorMessage || "알 수 없는 오류가 발생했습니다.";
        setErrorDialog({
          open: true,
          title,
          description: parseErrorMessage(rawMessage),
        });
      } catch {
        setErrorDialog({
          open: true,
          title,
          description: "오류 상세 정보를 가져올 수 없습니다.",
        });
      }
    },
    [],
  );

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
      setFormOpen(false);
      toast.success("챌린지가 등록되었습니다");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Parameters<typeof challengesApi.update>[1];
    }) => challengesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      setFormOpen(false);
      toast.success("챌린지가 수정되었습니다");
    },
    onError: (error: Error) => {
      toast.error(error.message);
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
    onSuccess: (data) => {
      invalidateAll();
      if (data.status === "APPROVED") {
        toast.success("승인 완료");
      } else if (data.status === "APPROVE_FAILED") {
        showErrorFromHistory(data.id, "승인 실패");
      }
    },
  });

  const retryApproveMutation = useMutation({
    mutationFn: participationsApi.retryApprove,
    onSuccess: (data) => {
      invalidateAll();
      if (data.status === "APPROVED") {
        toast.success("승인 재시도 성공");
      } else if (data.status === "APPROVE_FAILED") {
        showErrorFromHistory(data.id, "재시도 실패");
      }
    },
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
        <Button onClick={openCreateForm}>챌린지 등록</Button>
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogContent className="p-6">
            <DialogHeader>
              <DialogTitle>
                {editingChallenge ? "챌린지 수정" : "새 챌린지 등록"}
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const data = {
                  title,
                  description: description || undefined,
                  rewardProductId: Number(rewardProductId),
                  rewardQuantity: Number(rewardQuantity),
                };
                if (editingChallenge) {
                  updateMutation.mutate({ id: editingChallenge.id, data });
                } else {
                  createMutation.mutate(data);
                }
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
              <div className="space-y-2">
                <Label htmlFor="rewardQuantity">보상 수량</Label>
                <Input
                  id="rewardQuantity"
                  type="number"
                  min={1}
                  value={rewardQuantity}
                  onChange={(e) => setRewardQuantity(e.target.value)}
                  placeholder="1"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editingChallenge
                  ? updateMutation.isPending
                    ? "수정 중..."
                    : "수정"
                  : createMutation.isPending
                    ? "등록 중..."
                    : "등록"}
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
              <TableHead className="w-16 text-center">수량</TableHead>
              <TableHead className="w-32 text-center">관리</TableHead>
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
                  {challenge.rewardQuantity}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditForm(challenge)}
                    >
                      수정
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDetailChallenge(challenge)}
                    >
                      상세
                    </Button>
                  </div>
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
                      <span className="text-muted-foreground">
                        x {detailChallenge.rewardQuantity}개
                      </span>
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
                                  {p.status === "APPROVE_FAILED" && (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          retryApproveMutation.mutate(p.id)
                                        }
                                        disabled={
                                          retryApproveMutation.isPending
                                        }
                                      >
                                        재시도
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={async () => {
                                          await Promise.all([
                                            participationsApi.retryApprove(
                                              p.id,
                                            ),
                                            participationsApi.retryApprove(
                                              p.id,
                                            ),
                                          ]);
                                          invalidateAll();
                                          const updated =
                                            await participationsApi.findByChallengeId(
                                              detailChallenge!.id,
                                            );
                                          const target = updated.find(
                                            (u) => u.id === p.id,
                                          );
                                          if (target?.status === "APPROVED") {
                                            toast.success(
                                              "더블 재시도 성공 (멱등성 키로 중복 주문 방지됨)",
                                            );
                                          } else if (
                                            target?.status === "APPROVE_FAILED"
                                          ) {
                                            showErrorFromHistory(
                                              p.id,
                                              "더블 재시도 실패",
                                            );
                                          }
                                        }}
                                        disabled={
                                          retryApproveMutation.isPending
                                        }
                                      >
                                        더블 재시도
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

      <ConfirmDialog
        open={errorDialog.open}
        onOpenChange={(open) => setErrorDialog((prev) => ({ ...prev, open }))}
        title={errorDialog.title}
        description={errorDialog.description}
        variant="destructive"
      />
    </div>
  );
}

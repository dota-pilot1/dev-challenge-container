import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useAuth, authApi } from "@/features/auth";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { CommonDropdownMenu } from "@/shared/ui/common-dropdown-menu";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/challenges", label: "챌린지 관리" },
  { to: "/shop", label: "상품 관리" },
  { to: "/orders", label: "포상 관리" },
  { to: "/approval-history", label: "이력 관리" },
  { to: "/members", label: "유저 관리" },
  { to: "/concurrency-test", label: "부하 테스트" },
] as const;

const brandSubItems = [
  { to: "/brands", label: "메인 서버" },
  { to: "/brands-external", label: "외부 서버" },
] as const;

export function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const { user, isLoggedIn, login, logout } = useAuth();

  const [mode, setMode] = useState<"login" | "signup" | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setNickname("");
    setError("");
  };

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login(data);
      setMode(null);
      resetForm();
    },
    onError: (err: Error) => setError(err.message),
  });

  const signupMutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      login(data);
      setMode(null);
      resetForm();
    },
    onError: (err: Error) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (mode === "login") {
      loginMutation.mutate({ email, password });
    } else {
      signupMutation.mutate({ email, password, nickname });
    }
  };

  const isPending = loginMutation.isPending || signupMutation.isPending;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-zinc-900 text-white">
        <div className="container mx-auto flex h-14 items-center px-4">
          <Link to="/" className="text-xl font-bold mr-8 text-white">
            DevQuest
          </Link>
          <nav className="flex items-center gap-1 flex-1">
            {navItems.map((item) => (
              <Button
                key={item.to}
                variant={currentPath === item.to ? "secondary" : "ghost"}
                size="sm"
                className={
                  currentPath === item.to
                    ? ""
                    : "text-zinc-300 hover:text-white hover:bg-zinc-800"
                }
                asChild
              >
                <Link to={item.to}>{item.label}</Link>
              </Button>
            ))}
            <CommonDropdownMenu
              label="브랜드 관리"
              items={brandSubItems}
              isActive={currentPath.startsWith("/brands")}
            />
          </nav>

          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <>
                <span className="text-sm text-zinc-300">{user!.nickname}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-zinc-300 hover:text-white hover:bg-zinc-800"
                  onClick={logout}
                >
                  로그아웃
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-zinc-300 hover:text-white hover:bg-zinc-800"
                  onClick={() => {
                    resetForm();
                    setMode("login");
                  }}
                >
                  로그인
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-zinc-600 text-zinc-300 hover:text-white hover:bg-zinc-800"
                  onClick={() => {
                    resetForm();
                    setMode("signup");
                  }}
                >
                  회원가입
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      <Separator />
      <main className="container mx-auto px-4 py-6">{children}</main>
      <Toaster position="bottom-right" richColors />

      {/* 로그인 / 회원가입 다이얼로그 */}
      <Dialog
        open={!!mode}
        onOpenChange={(open) => {
          if (!open) {
            setMode(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-sm p-6">
          <DialogHeader>
            <DialogTitle>
              {mode === "login" ? "로그인" : "회원가입"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="space-y-2">
              <Label htmlFor="auth-email">이메일</Label>
              <Input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="auth-password">비밀번호</Label>
              <Input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8자 이상"
                minLength={8}
                required
              />
            </div>
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="auth-nickname">닉네임</Label>
                <Input
                  id="auth-nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="2~100자"
                  minLength={2}
                  maxLength={100}
                  required
                />
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending
                ? "처리 중..."
                : mode === "login"
                  ? "로그인"
                  : "회원가입"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {mode === "login" ? (
                <>
                  계정이 없으신가요?{" "}
                  <button
                    type="button"
                    className="underline hover:text-foreground"
                    onClick={() => {
                      resetForm();
                      setMode("signup");
                    }}
                  >
                    회원가입
                  </button>
                </>
              ) : (
                <>
                  이미 계정이 있으신가요?{" "}
                  <button
                    type="button"
                    className="underline hover:text-foreground"
                    onClick={() => {
                      resetForm();
                      setMode("login");
                    }}
                  >
                    로그인
                  </button>
                </>
              )}
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

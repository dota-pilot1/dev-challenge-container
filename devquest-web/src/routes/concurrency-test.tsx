import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/concurrency-test')({
  component: ConcurrencyTestPage,
})

function ConcurrencyTestPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Concurrency Test</h1>
      <p className="text-muted-foreground">동시성 테스트 발사 및 결과 시각화 - 실습 단계에서 구현 예정</p>
    </div>
  )
}

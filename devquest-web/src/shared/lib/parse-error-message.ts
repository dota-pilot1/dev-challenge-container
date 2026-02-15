export function parseErrorMessage(raw: string): string {
  try {
    const jsonMatch = raw.match(/\{.*\}/s);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.message) return parsed.message;
    }
  } catch {
    // JSON 파싱 실패 시 원문 반환
  }
  return raw;
}

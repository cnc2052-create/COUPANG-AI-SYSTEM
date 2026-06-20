const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export async function generateContent(form) {
  const response = await fetch(`${apiBase}/content/generate`, {
    method: "POST",
    body: form
  });

  const body = await response.json();
  if (!response.ok) throw new Error(body.error || "콘텐츠 생성에 실패했습니다.");
  return body;
}

export async function completeInfork(pageId) {
  const response = await fetch(`${apiBase}/content/${pageId}/infork-complete`, {
    method: "POST"
  });

  const body = await response.json();
  if (!response.ok) throw new Error(body.error || "인포크 상태 변경에 실패했습니다.");
  return body;
}

export async function fetchDashboard() {
  const response = await fetch(`${apiBase}/dashboard`, { cache: "no-store" });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || "대시보드를 불러오지 못했습니다.");
  return body;
}

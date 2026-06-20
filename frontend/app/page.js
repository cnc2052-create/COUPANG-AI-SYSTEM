"use client";

import { useEffect, useState } from "react";
import ResultSection from "../components/ResultSection";
import { completeInfork, fetchDashboard, generateContent } from "../lib/api";

const dashboardLabels = [
  ["todayCreated", "오늘 생성 수"],
  ["inforkPending", "인포크 등록 대기"],
  ["videoPending", "영상 생성 대기"],
  ["videoComplete", "영상 생성 완료"],
  ["uploadComplete", "업로드 완료"]
];

const quickKeywords = [
  "시니어 인기상품",
  "부모님 선물",
  "60대 여성",
  "60대 남성",
  "관절 건강",
  "낙상 예방",
  "욕실 안전용품",
  "생활 편의용품",
  "수면용품",
  "건강관리용품"
];

const researchProducts = {
  "시니어 인기상품": ["초경량 접이식 보행 보조차", "무릎 보호 온열 찜질기", "침대 옆 안전 손잡이"],
  "부모님 선물": ["자동 혈압 측정기", "저소음 발 마사지기", "큰 글씨 디지털 시계"],
  "60대 여성": ["가벼운 무릎 보호대", "손목 부담 적은 주방 가위", "미끄럼 방지 욕실화"],
  "60대 남성": ["허리 지지 쿠션", "전동 면도기 세트", "보행 안정 지팡이"],
  "관절 건강": ["무릎 관절 보호대", "온열 무릎 마사지기", "손가락 재활 운동기"],
  "낙상 예방": ["침대 안전바", "욕실 미끄럼 방지 매트", "센서형 야간 무드등"],
  "욕실 안전용품": ["흡착식 욕실 손잡이", "미끄럼 방지 욕실 매트", "접이식 샤워 의자"],
  "생활 편의용품": ["긴 손잡이 구두주걱", "원터치 약통 정리함", "가벼운 장바구니 캐리어"],
  "수면용품": ["목 지지 경추 베개", "온열 수면 안대", "숙면용 무드등"],
  "건강관리용품": ["자동 혈압계", "혈당 관리 수첩 세트", "체온계와 약통 세트"]
};

function svgText(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char]);
}

function productSvg(title, keyword) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360" viewBox="0 0 480 360"><rect width="480" height="360" fill="#f6f8fb"/><rect x="70" y="56" width="340" height="248" rx="22" fill="#ffffff" stroke="#dde3ea"/><circle cx="240" cy="142" r="48" fill="#0f8b8d" opacity=".18"/><path d="M172 220h136M188 246h104" stroke="#0f8b8d" stroke-width="14" stroke-linecap="round"/><text x="240" y="124" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="800" fill="#0f8b8d">${svgText(keyword)}</text><text x="240" y="184" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="900" fill="#1d232a">${svgText(title)}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function grade(seed, high = "A") {
  const grades = high === "S" ? ["S", "A+", "A"] : ["A+", "A", "B+"];
  return grades[seed % grades.length];
}

function buildResearch(keyword) {
  const normalized = keyword.trim() || "시니어 인기상품";
  const base = researchProducts[normalized] || [`${normalized} 베스트 상품`, `${normalized} 실사용 추천템`, `${normalized} 선물용 인기템`];
  return base.map((title, index) => ({
    title,
    image: productSvg(title, normalized),
    link: `https://www.coupang.com/np/search?q=${encodeURIComponent(title)}`,
    reason: `${normalized} 관심 고객에게 문제 해결 장면을 짧게 보여주기 좋아 숏폼 소재로 적합합니다.`,
    fit: grade(index, "S"),
    views: grade(index + 1, "S"),
    conversion: grade(index + 2)
  }));
}

export default function Home() {
  const [productTitle, setProductTitle] = useState("");
  const [coupangLink, setCoupangLink] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [researchQuery, setResearchQuery] = useState("시니어 인기상품");
  const [researchResults, setResearchResults] = useState(() => buildResearch("시니어 인기상품"));
  const [result, setResult] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function refreshDashboard() {
    try {
      setDashboard(await fetchDashboard());
    } catch {
      setDashboard(null);
    }
  }

  useEffect(() => {
    refreshDashboard();
  }, []);

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const form = new FormData();
      form.append("productTitle", productTitle);
      form.append("coupangLink", coupangLink);
      if (productImage) form.append("productImage", productImage);
      const nextResult = await generateContent(form);
      setResult(nextResult);
      await refreshDashboard();
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setLoading(false);
    }
  }

  function setImageFromFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    setProductImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function onPasteImage(event) {
    const items = Array.from(event.clipboardData?.items || []);
    const imageItem = items.find((item) => item.type.startsWith("image/"));
    if (!imageItem) {
      setError("클립보드에 이미지가 없습니다. 캡처 후 Ctrl+V로 붙여넣어 주세요.");
      return;
    }
    event.preventDefault();
    setError("");
    setImageFromFile(imageItem.getAsFile());
  }

  async function selectResearchProduct(item) {
    setProductTitle(item.title);
    setCoupangLink(item.link);
    setPreviewUrl(item.image);
    const blob = await fetch(item.image).then((response) => response.blob());
    setProductImage(new File([blob], `${item.title}.svg`, { type: "image/svg+xml" }));
    document.getElementById("content-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function runResearch(keyword) {
    const nextKeyword = keyword.trim() || "시니어 인기상품";
    setResearchQuery(nextKeyword);
    setResearchResults(buildResearch(nextKeyword));
  }

  async function onInforkComplete(pageId) {
    try {
      await completeInfork(pageId);
      setResult((current) => ({
        ...current,
        item: {
          ...current.item,
          statuses: { ...current.item.statuses, infork: "인포크등록완료" }
        }
      }));
      await refreshDashboard();
    } catch (nextError) {
      setError(nextError.message);
    }
  }

  return (
    <main className="min-h-screen px-4 py-5 md:px-8 md:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black text-brand">COUPANG-AI-SYSTEM</p>
            <h1 className="mt-1 text-2xl font-black md:text-4xl">쿠팡 숏폼 콘텐츠 자동 생성</h1>
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
            {dashboardLabels.map(([key, label]) => (
              <div key={key} className="rounded-md border border-line bg-white p-3 text-center shadow-sm">
                <p className="text-xl font-black text-brand">{dashboard?.[key] ?? 0}</p>
                <p className="mt-1 text-xs font-bold text-ink">{label}</p>
              </div>
            ))}
          </div>
        </header>

        <section className="mb-5 rounded-lg border border-line bg-white p-4 shadow-sm md:p-6">
          <p className="text-sm font-black text-brand">상품 리서치 센터</p>
          <h2 className="mt-1 text-xl font-black">원클릭으로 상품 아이디어 찾기</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {quickKeywords.map((keyword) => (
              <button key={keyword} type="button" onClick={() => runResearch(keyword)} className="h-10 rounded-md border border-line bg-white px-3 text-sm font-bold text-ink transition hover:border-brand hover:text-brand">
                {keyword}
              </button>
            ))}
          </div>
          <div className="mt-4 grid gap-2 md:grid-cols-[1fr_auto]">
            <input value={researchQuery} onChange={(event) => setResearchQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") runResearch(researchQuery); }} className="h-12 w-full rounded-md border border-line px-3 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20" placeholder="예: 무릎 관련 상품" />
            <button type="button" onClick={() => runResearch(researchQuery)} className="h-12 rounded-md bg-brand px-5 text-sm font-black text-white transition hover:bg-[#0b7375]">리서치 시작</button>
          </div>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#52616f]">예시: 시니어 인기상품 / 무릎 관련 상품 / 보행 보조 용품 / 실버용품 베스트</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {researchResults.map((item) => (
              <article key={item.title} className="grid gap-3 rounded-md border border-line bg-white p-3">
                <img src={item.image} alt={`${item.title} 대표 이미지`} className="aspect-[4/3] w-full rounded-md bg-surface object-contain" />
                <h3 className="text-base font-black leading-6">{item.title}</h3>
                <p className="text-sm font-semibold leading-6 text-[#52616f]">{item.reason}</p>
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-black">
                  <span className="rounded-md bg-surface px-2 py-2">콘텐츠 {item.fit}</span>
                  <span className="rounded-md bg-surface px-2 py-2">조회수 {item.views}</span>
                  <span className="rounded-md bg-surface px-2 py-2">전환 {item.conversion}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <a href={item.link} target="_blank" className="flex h-10 items-center justify-center rounded-md border border-line text-sm font-black text-ink">쿠팡 보기</a>
                  <button type="button" onClick={() => selectResearchProduct(item)} className="h-10 rounded-md bg-brand px-3 text-sm font-black text-white transition hover:bg-[#0b7375]">콘텐츠 생성</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <form id="content-form" onSubmit={onSubmit} className="rounded-lg border border-line bg-white p-4 shadow-sm md:p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-sm font-bold">상품 제목</span>
              <input value={productTitle} onChange={(event) => setProductTitle(event.target.value)} required className="h-12 w-full rounded-md border border-line px-3 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20" placeholder="예: 무선 미니 청소기" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold">상품 이미지 붙여넣기</span>
              <div tabIndex={0} onPaste={onPasteImage} onClick={(event) => event.currentTarget.focus()} className="grid min-h-[120px] cursor-pointer place-items-center rounded-md border border-dashed border-[#9fb0bf] bg-[#f9fbfd] p-3 text-center outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20">
                {previewUrl ? (
                  <div>
                    <img src={previewUrl} alt="붙여넣은 상품 이미지 미리보기" className="mx-auto max-h-[170px] max-w-full rounded-md object-contain" />
                    <p className="mt-2 text-xs font-bold text-ink">{productImage?.name || "붙여넣은 상품 이미지"}</p>
                  </div>
                ) : (
                  <p className="text-sm font-semibold leading-6 text-[#52616f]">이 영역을 클릭한 뒤<br />캡처한 상품 이미지를 Ctrl+V로 붙여넣으세요</p>
                )}
              </div>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold">쿠팡파트너스 링크</span>
              <input value={coupangLink} onChange={(event) => setCoupangLink(event.target.value)} required type="url" className="h-12 w-full rounded-md border border-line px-3 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20" placeholder="https://link.coupang.com/..." />
            </label>
          </div>
          {error ? <p className="mt-4 rounded-md bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p> : null}
          <button type="submit" disabled={loading} className="mt-5 h-12 w-full rounded-md bg-brand px-5 text-base font-black text-white transition hover:bg-[#0b7375] disabled:cursor-not-allowed disabled:opacity-60 md:w-auto">
            {loading ? "생성 중" : "콘텐츠 생성"}
          </button>
        </form>
        <ResultSection result={result} onInforkComplete={onInforkComplete} />
      </div>
    </main>
  );
}

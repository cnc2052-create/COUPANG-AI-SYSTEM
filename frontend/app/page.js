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

export default function Home() {
  const [productTitle, setProductTitle] = useState("");
  const [coupangLink, setCoupangLink] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
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

        <form onSubmit={onSubmit} className="rounded-lg border border-line bg-white p-4 shadow-sm md:p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-sm font-bold">상품 제목</span>
              <input
                value={productTitle}
                onChange={(event) => setProductTitle(event.target.value)}
                required
                className="h-12 w-full rounded-md border border-line px-3 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                placeholder="예: 무선 미니 청소기"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold">상품 이미지 붙여넣기</span>
              <div
                tabIndex={0}
                onPaste={onPasteImage}
                onClick={(event) => event.currentTarget.focus()}
                className="grid min-h-[120px] cursor-pointer place-items-center rounded-md border border-dashed border-[#9fb0bf] bg-[#f9fbfd] p-3 text-center outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
              >
                {previewUrl ? (
                  <div>
                    <img
                      src={previewUrl}
                      alt="붙여넣은 상품 이미지 미리보기"
                      className="mx-auto max-h-[170px] max-w-full rounded-md object-contain"
                    />
                    <p className="mt-2 text-xs font-bold text-ink">{productImage?.name || "붙여넣은 상품 이미지"}</p>
                  </div>
                ) : (
                  <p className="text-sm font-semibold leading-6 text-[#52616f]">
                    이 영역을 클릭한 뒤
                    <br />
                    캡처한 상품 이미지를 Ctrl+V로 붙여넣으세요
                  </p>
                )}
              </div>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold">쿠팡파트너스 링크</span>
              <input
                value={coupangLink}
                onChange={(event) => setCoupangLink(event.target.value)}
                required
                type="url"
                className="h-12 w-full rounded-md border border-line px-3 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                placeholder="https://link.coupang.com/..."
              />
            </label>
          </div>

          {error ? <p className="mt-4 rounded-md bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 h-12 w-full rounded-md bg-brand px-5 text-base font-black text-white transition hover:bg-[#0b7375] disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
          >
            {loading ? "생성 중" : "콘텐츠 생성"}
          </button>
        </form>

        <ResultSection result={result} onInforkComplete={onInforkComplete} />
      </div>
    </main>
  );
}

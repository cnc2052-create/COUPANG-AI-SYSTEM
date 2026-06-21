"use client";

import CopyButton from "./CopyButton";

function TextList({ items }) {
  return (
    <ol className="space-y-2">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="whitespace-pre-wrap rounded-md bg-surface p-3 text-sm leading-6">
          {item}
        </li>
      ))}
    </ol>
  );
}

function Block({ title, children }) {
  return (
    <section className="border-t border-line py-5">
      <h2 className="mb-3 text-base font-bold">{title}</h2>
      {children}
    </section>
  );
}

export default function ResultSection({ result, onInforkComplete }) {
  const item = result?.item;
  const content = item?.content;
  if (!content) return null;

  return (
    <div className="mt-6 rounded-lg border border-line bg-white p-4 shadow-sm md:p-6">
      <div className="flex flex-col gap-2 border-b border-line pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-brand">생성 완료</p>
          <h1 className="mt-1 text-xl font-black md:text-2xl">{content.productName}</h1>
          <div className="mt-3 grid gap-2 rounded-md bg-surface p-3 text-sm leading-6">
            <p>
              <span className="font-black text-brand">제목</span>
              <span className="ml-2 font-bold text-ink">{content.productName}</span>
            </p>
            <p>
              <span className="font-black text-brand">타겟</span>
              <span className="ml-2 font-bold text-ink">{content.targetAudience}</span>
            </p>
          </div>
          {item.notionUrl ? (
            <a className="mt-2 inline-block text-sm font-semibold text-brand" href={item.notionUrl} target="_blank">
              Notion 기록 열기
            </a>
          ) : null}
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
          <span className="rounded-md bg-surface px-2 py-2">{item.statuses.infork}</span>
          <span className="rounded-md bg-surface px-2 py-2">{item.statuses.video}</span>
          <span className="rounded-md bg-surface px-2 py-2">{item.statuses.upload}</span>
        </div>
      </div>

      <Block title="1. 영상 기획 의도">
        <p className="rounded-md bg-surface p-3 text-sm leading-6">{content.planningIntent || content.productAnalysis}</p>
      </Block>

      <Block title="2. 문제 정의">
        <p className="rounded-md bg-surface p-3 text-sm leading-6">{content.problemDefinition}</p>
      </Block>

      <Block title="3. 공감 포인트">
        <p className="rounded-md bg-surface p-3 text-sm leading-6">{content.empathyPoint}</p>
      </Block>

      <Block title="4. 해결 방법">
        <p className="rounded-md bg-surface p-3 text-sm leading-6">{content.solution}</p>
      </Block>

      <Block title="5. 결과형 장점 3개">
        <TextList items={content.keyBenefits} />
      </Block>

      <Block title="6. 장면 구성">
        <TextList items={content.scenePlan || content.videoScripts} />
      </Block>

      <Block title="7. 나레이션">
        <div className="flex items-start gap-2">
          <p className="flex-1 whitespace-pre-wrap rounded-md bg-surface p-3 text-sm leading-6">{content.narration}</p>
          <CopyButton value={content.narration} />
        </div>
      </Block>

      <Block title="8. CTA">
        <div className="flex items-start gap-2">
          <p className="flex-1 rounded-md bg-surface p-3 text-sm leading-6">{content.cta}</p>
          <CopyButton value={content.cta} />
        </div>
      </Block>

      <Block title="9. Kling 3.0 최종 영상 프롬프트">
        <div className="flex items-start gap-2">
          <p className="flex-1 whitespace-pre-wrap rounded-md bg-surface p-3 text-sm leading-6">
            {content.higgsfield.klingVideoPrompt || content.higgsfield.videoPrompt}
          </p>
          <CopyButton value={content.higgsfield.klingVideoPrompt || content.higgsfield.videoPrompt} />
        </div>
      </Block>

      <Block title="10. Seedance 2.0 최종 영상 프롬프트">
        <div className="flex items-start gap-2">
          <p className="flex-1 whitespace-pre-wrap rounded-md bg-surface p-3 text-sm leading-6">
            {content.higgsfield.seedanceVideoPrompt || content.higgsfield.videoPrompt}
          </p>
          <CopyButton value={content.higgsfield.seedanceVideoPrompt || content.higgsfield.videoPrompt} />
        </div>
      </Block>

      <Block title="대표 후킹 / 썸네일">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-md bg-surface p-3">
            <p className="text-xs font-bold text-brand">대표후킹문구</p>
            <p className="mt-1 text-sm font-black leading-6">{content.primaryHook}</p>
          </div>
          <div className="rounded-md bg-surface p-3">
            <p className="text-xs font-bold text-brand">대표썸네일문구</p>
            <p className="mt-1 text-sm font-black leading-6">{content.primaryThumbnailText}</p>
          </div>
          <div className="rounded-md bg-surface p-3">
            <p className="text-xs font-bold text-brand">후킹패턴</p>
            <p className="mt-1 text-sm leading-6">{content.hookPattern}</p>
          </div>
        </div>
      </Block>

      <Block title="후킹 10개">
        <TextList items={content.hooks} />
      </Block>

      <Block title="썸네일 문구 10개">
        <TextList items={content.thumbnailTexts} />
      </Block>

      <Block title="인포크 등록">
        <div className="grid gap-3">
          {[
            ["상품명", content.infork.productName],
            ["설명", content.infork.description],
            ["쿠팡파트너스 링크", content.infork.link],
            ["이미지", content.infork.image]
          ].map(([label, value]) => (
            <div key={label} className="flex items-start gap-2 rounded-md bg-surface p-3">
              <div className="flex-1">
                <p className="text-xs font-bold text-brand">{label}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-6">{value || "업로드된 이미지 파일명 없음"}</p>
              </div>
              <CopyButton value={value} />
              {label === "이미지" && value ? (
                <a
                  className="flex h-9 items-center rounded-md border border-line bg-white px-3 text-sm font-semibold"
                  href={value}
                  download
                >
                  다운로드
                </a>
              ) : null}
            </div>
          ))}
          <label className="flex items-center gap-3 rounded-md border border-line p-3 text-sm font-bold">
            <input
              type="checkbox"
              className="h-5 w-5 accent-brand"
              disabled={!item.notionPageId}
              onChange={(event) => {
                if (event.target.checked) onInforkComplete(item.notionPageId);
              }}
            />
            인포크 등록 완료
          </label>
        </div>
      </Block>
    </div>
  );
}

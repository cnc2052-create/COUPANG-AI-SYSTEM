"use client";

import CopyButton from "./CopyButton";

function TextList({ items }) {
  return (
    <ol className="space-y-2">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="rounded-md bg-surface p-3 text-sm leading-6">
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

      <Block title="상품 분석">
        <p className="text-sm leading-6">{content.productAnalysis}</p>
      </Block>

      <Block title="타겟 고객">
        <TextList items={content.target} />
      </Block>

      <Block title="핵심 장점">
        <TextList items={content.keyBenefits} />
      </Block>

      <Block title="후킹 10개">
        <TextList items={content.hooks} />
      </Block>

      <Block title="썸네일 문구 10개">
        <TextList items={content.thumbnailTexts} />
      </Block>

      <Block title="영상 대본 3개">
        <TextList items={content.videoScripts} />
      </Block>

      <Block title="인스타 캡션 3개">
        <TextList items={content.instagramCaptions} />
      </Block>

      <Block title="유튜브 설명란">
        <div className="flex items-start gap-2">
          <p className="flex-1 whitespace-pre-wrap rounded-md bg-surface p-3 text-sm leading-6">{content.youtubeDescription}</p>
          <CopyButton value={content.youtubeDescription} />
        </div>
      </Block>

      <Block title="틱톡 캡션">
        <div className="flex items-start gap-2">
          <p className="flex-1 rounded-md bg-surface p-3 text-sm leading-6">{content.tiktokCaption}</p>
          <CopyButton value={content.tiktokCaption} />
        </div>
      </Block>

      <Block title="고정댓글">
        <div className="flex items-start gap-2">
          <p className="flex-1 whitespace-pre-wrap rounded-md bg-surface p-3 text-sm leading-6">{content.pinnedComment}</p>
          <CopyButton value={content.pinnedComment} />
        </div>
      </Block>

      <Block title="Higgsfield 생성 데이터">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-md bg-surface p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-sm font-bold">영상 프롬프트</p>
              <CopyButton value={content.higgsfield.videoPrompt} />
            </div>
            <p className="text-sm leading-6">{content.higgsfield.videoPrompt}</p>
          </div>
          <div className="rounded-md bg-surface p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-sm font-bold">썸네일 프롬프트</p>
              <CopyButton value={content.higgsfield.thumbnailPrompt} />
            </div>
            <p className="text-sm leading-6">{content.higgsfield.thumbnailPrompt}</p>
          </div>
        </div>
      </Block>

      <Block title="인포크 등록">
        <div className="grid gap-3">
          {[
            ["상품명", content.infork.productName],
            ["설명", content.infork.description],
            ["링크", content.infork.link],
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

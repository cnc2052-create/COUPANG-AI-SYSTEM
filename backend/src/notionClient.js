const notionVersion = "2022-06-28";

function joinLines(value) {
  if (Array.isArray(value)) return value.join("\n");
  if (typeof value === "object" && value !== null) return JSON.stringify(value, null, 2);
  return String(value || "");
}

function propertyText(value) {
  return { rich_text: [{ text: { content: joinLines(value).slice(0, 1900) } }] };
}

function propertyTitle(value) {
  return { title: [{ text: { content: String(value || "").slice(0, 200) } }] };
}

function propertySelect(value) {
  return { select: { name: value } };
}

function propertyUrl(value) {
  return value ? { url: value } : { url: null };
}

function propertyFile(url, name = "상품 이미지") {
  if (!url) return { files: [] };
  return {
    files: [
      {
        name,
        type: "external",
        external: { url }
      }
    ]
  };
}

function buildContentProperties(input, content) {
  return {
    "상품명": propertyTitle(content.productName),
    "상품이미지": propertyFile(input.imageUrl, input.imageName || "상품 이미지"),
    "쿠팡파트너스링크": propertyUrl(input.coupangLink),
    "타겟": propertyText(content.target),
    "핵심장점": propertyText(content.keyBenefits),
    "후킹": propertyText(content.hooks),
    "썸네일문구": propertyText(content.thumbnailTexts),
    "영상대본": propertyText(content.videoScripts),
    "영상프롬프트": propertyText(content.higgsfield.videoPrompt),
    "캡션": propertyText([
      ...content.instagramCaptions,
      content.youtubeDescription,
      content.tiktokCaption,
      content.pinnedComment,
      content.disclosure
    ]),
    "영상URL": propertyUrl(""),
    "인포크상태": propertySelect("인포크등록대기"),
    "영상상태": propertySelect("영상생성대기"),
    "업로드상태": propertySelect("업로드대기")
  };
}

async function notionRequest(path, options = {}) {
  const token = process.env.NOTION_TOKEN;
  if (!token) {
    return { skipped: true, reason: "NOTION_TOKEN is not set" };
  }

  const response = await fetch(`https://api.notion.com/v1${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": notionVersion,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = body.message || `Notion request failed with ${response.status}`;
    throw new Error(message);
  }
  return body;
}

export async function createContentPage(input, content) {
  const dataSourceId = process.env.NOTION_DATA_SOURCE_ID;
  if (!dataSourceId) {
    return { skipped: true, reason: "NOTION_DATA_SOURCE_ID is not set" };
  }

  const result = await notionRequest("/pages", {
    method: "POST",
    body: JSON.stringify({
      parent: { data_source_id: dataSourceId },
      properties: buildContentProperties(input, content)
    })
  });

  return {
    id: result.id,
    url: result.url
  };
}

export async function updatePageStatus(pageId, properties) {
  if (!pageId) throw new Error("notionPageId is required");
  return notionRequest(`/pages/${pageId}`, {
    method: "PATCH",
    body: JSON.stringify({ properties })
  });
}

export async function markInforkComplete(pageId) {
  return updatePageStatus(pageId, {
    "인포크상태": propertySelect("인포크등록완료")
  });
}

export async function markVideoComplete(pageId, videoUrl) {
  return updatePageStatus(pageId, {
    "영상URL": propertyUrl(videoUrl),
    "영상상태": propertySelect("영상생성완료")
  });
}

export async function markUploadComplete(pageId) {
  return updatePageStatus(pageId, {
    "업로드상태": propertySelect("예약완료")
  });
}

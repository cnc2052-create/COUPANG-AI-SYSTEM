const notionVersion = process.env.NOTION_VERSION || "2026-03-11";

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
    "인포크링크": propertyUrl(input.inforkLink || ""),
    "타겟": propertyText(content.target),
    "핵심장점": propertyText(content.keyBenefits),
    "후킹": propertyText(content.hooks),
    "대표후킹문구": propertyText(content.primaryHook),
    "후킹패턴": propertyText(content.hookPattern),
    "썸네일문구": propertyText(content.thumbnailTexts),
    "대표썸네일문구": propertyText(content.primaryThumbnailText),
    "영상대본": propertyText(content.videoScripts),
    "영상프롬프트": propertyText(content.higgsfield.videoPrompt),
    "썸네일프롬프트": propertyText(content.higgsfield.thumbnailPrompt),
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

function buildPageParent() {
  const dataSourceId = process.env.NOTION_DATA_SOURCE_ID;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (dataSourceId) {
    return { data_source: { id: dataSourceId } };
  }

  if (databaseId) {
    return { database_id: databaseId };
  }

  return null;
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
  const parent = buildPageParent();
  if (!parent) {
    return { skipped: true, reason: "NOTION_DATA_SOURCE_ID or NOTION_DATABASE_ID is not set" };
  }

  const result = await notionRequest("/pages", {
    method: "POST",
    body: JSON.stringify({
      parent,
      properties: buildContentProperties(input, content)
    })
  });

  return {
    id: result.id,
    url: result.url
  };
}

export async function checkNotionConnection() {
  const token = process.env.NOTION_TOKEN;
  const dataSourceId = process.env.NOTION_DATA_SOURCE_ID;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!token) {
    return { ok: false, reason: "NOTION_TOKEN is not set" };
  }

  if (dataSourceId) {
    const result = await notionRequest(`/data_sources/${dataSourceId}`, { method: "GET" });
    return {
      ok: true,
      target: "data_source",
      id: dataSourceId,
      title: result.title?.map?.((item) => item.plain_text).join("") || "쿠팡 콘텐츠 센터"
    };
  }

  if (databaseId) {
    const result = await notionRequest(`/databases/${databaseId}`, { method: "GET" });
    return {
      ok: true,
      target: "database",
      id: databaseId,
      title: result.title?.map?.((item) => item.plain_text).join("") || "쿠팡 콘텐츠 센터"
    };
  }

  return { ok: false, reason: "NOTION_DATA_SOURCE_ID or NOTION_DATABASE_ID is not set" };
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

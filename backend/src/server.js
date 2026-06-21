import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateContent } from "./contentGenerator.js";
import {
  checkNotionConnection,
  createContentPage,
  markInforkComplete,
  markUploadComplete,
  markVideoComplete
} from "./notionClient.js";
import { triggerHiggsfield } from "./makeClient.js";

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
const port = Number(process.env.PORT || 4000);
const dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(dirname, "../uploads");
const publicBaseUrl = process.env.PUBLIC_BASE_URL || `http://localhost:${port}`;

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000" }));
app.use(express.json({ limit: "2mb" }));
app.use("/uploads", express.static(uploadDir));

const generatedItems = [];

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "COUPANG-AI-SYSTEM" });
});

app.get("/notion/status", async (_req, res, next) => {
  try {
    const notion = await checkNotionConnection();
    res.status(notion.ok ? 200 : 503).json(notion);
  } catch (error) {
    next(error);
  }
});

app.post("/content/generate", upload.single("productImage"), async (req, res, next) => {
  try {
    const productTitle = req.body.productTitle;
    const coupangLink = req.body.coupangLink;
    const targetAudience = String(req.body.targetAudience || req.body.targetGroup || req.body.target || "").trim();
    const inforkLink = req.body.inforkLink || "";

    if (!productTitle || !coupangLink) {
      return res.status(400).json({ error: "상품 제목과 쿠팡파트너스 링크는 필수입니다." });
    }

    if (!targetAudience) {
      return res.status(400).json({ error: "타겟을 선택해주세요" });
    }

    let imageName = req.file?.originalname || "";
    let imageUrl = "";
    if (req.file) {
      await mkdir(uploadDir, { recursive: true });
      const extension = path.extname(req.file.originalname || "") || ".jpg";
      const safeName = `${Date.now()}-${randomUUID()}${extension}`;
      await writeFile(path.join(uploadDir, safeName), req.file.buffer);
      imageUrl = `${publicBaseUrl}/uploads/${safeName}`;
    }

    const content = generateContent({
      productTitle,
      coupangLink,
      targetAudience,
      inforkLink,
      imageUrl,
      imageName
    });

    const notion = await createContentPage({ productTitle, coupangLink, targetAudience, inforkLink, imageUrl, imageName }, content);
    if (notion.skipped && process.env.REQUIRE_NOTION_SAVE !== "false") {
      return res.status(503).json({
        error: `Notion 저장 연결값이 필요합니다. ${notion.reason}`,
        notion
      });
    }
    const item = {
      id: randomUUID(),
      notionPageId: notion.id || null,
      notionUrl: notion.url || null,
      productName: content.productName,
      statuses: {
        infork: "인포크등록대기",
        video: "영상생성대기",
        upload: "업로드대기"
      },
      createdAt: new Date().toISOString(),
      content
    };

    generatedItems.unshift(item);

    const automation = await triggerHiggsfield({
      notionPageId: item.notionPageId,
      productName: content.productName,
      aspectRatio: content.higgsfield.aspectRatio,
      durationSeconds: content.higgsfield.durationSeconds,
      videoPrompt: content.higgsfield.videoPrompt,
      thumbnailPrompt: content.higgsfield.thumbnailPrompt,
      firstThreeSeconds: content.higgsfield.firstThreeSeconds,
      thumbnailText: content.higgsfield.thumbnailText,
      hookPattern: content.higgsfield.hookPattern,
      targetAudience: content.targetAudience,
      coupangLink
    });

    res.json({ item, notion, automation });
  } catch (error) {
    next(error);
  }
});

app.post("/content/:pageId/infork-complete", async (req, res, next) => {
  try {
    const notion = await markInforkComplete(req.params.pageId);
    const item = generatedItems.find((entry) => entry.notionPageId === req.params.pageId);
    if (item) item.statuses.infork = "인포크등록완료";
    res.json({ ok: true, notion });
  } catch (error) {
    next(error);
  }
});

app.post("/webhooks/higgsfield", async (req, res, next) => {
  try {
    const { notionPageId, videoUrl } = req.body;
    const notion = await markVideoComplete(notionPageId, videoUrl);
    const item = generatedItems.find((entry) => entry.notionPageId === notionPageId);
    if (item) {
      item.statuses.video = "영상생성완료";
      item.content.videoUrl = videoUrl;
    }
    res.json({ ok: true, notion });
  } catch (error) {
    next(error);
  }
});

app.post("/webhooks/buffer", async (req, res, next) => {
  try {
    const { notionPageId } = req.body;
    const notion = await markUploadComplete(notionPageId);
    const item = generatedItems.find((entry) => entry.notionPageId === notionPageId);
    if (item) item.statuses.upload = "예약완료";
    res.json({ ok: true, notion });
  } catch (error) {
    next(error);
  }
});

app.get("/dashboard", (_req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const todayItems = generatedItems.filter((item) => item.createdAt.startsWith(today));

  res.json({
    todayCreated: todayItems.length,
    inforkPending: generatedItems.filter((item) => item.statuses.infork === "인포크등록대기").length,
    videoPending: generatedItems.filter((item) => item.statuses.video === "영상생성대기").length,
    videoComplete: generatedItems.filter((item) => item.statuses.video === "영상생성완료").length,
    uploadComplete: generatedItems.filter((item) => item.statuses.upload === "예약완료").length
  });
});

app.use((error, _req, res, _next) => {
  res.status(500).json({ error: error.message || "서버 오류가 발생했습니다." });
});

app.listen(port, () => {
  console.log(`COUPANG-AI-SYSTEM backend is running on http://localhost:${port}`);
});

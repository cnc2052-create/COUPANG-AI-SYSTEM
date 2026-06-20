# Make Automation

## Scenario 1: Higgsfield video creation

Trigger:
- Notion row where `영상상태 = 영상생성대기`

Steps:
1. Update Notion `영상상태` to `영상생성중`.
2. Send `영상프롬프트`, `썸네일문구`, `상품이미지`, `쿠팡파트너스링크` to Higgsfield.
3. Receive generated `영상URL`.
4. Call backend webhook:

```http
POST /webhooks/higgsfield
```

```json
{
  "notionPageId": "notion-page-id",
  "videoUrl": "https://example.com/video.mp4"
}
```

## Scenario 2: Buffer scheduling

Trigger:
- Notion row where `영상상태 = 영상생성완료`
- `업로드상태 = 업로드대기`

Steps:
1. Schedule YouTube Shorts and TikTok in Buffer.
2. Call backend webhook:

```http
POST /webhooks/buffer
```

```json
{
  "notionPageId": "notion-page-id",
  "status": "예약완료"
}
```

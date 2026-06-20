# Make 시나리오 코드

이 프로젝트는 Make 시나리오를 2개로 나눠서 운영한다.

1. `integrations/make/video-generation-scenario.json`
   - Notion `영상생성대기` 감지
   - Higgsfield 영상 생성 요청
   - Notion `영상URL`, `영상생성완료`, `업로드대기` 업데이트

2. `integrations/make/buffer-upload-scenario.json`
   - Notion `영상생성완료` + `업로드대기` 감지
   - Buffer 유튜브 쇼츠 예약
   - Buffer 틱톡 예약
   - Notion `예약완료` 업데이트

## Make에서 만드는 순서

### 1. 영상 생성 시나리오

Make에서 `Create a new scenario`를 누른다.

모듈 순서:

1. `Notion` - `Watch Data Source Items`
2. 필터 - `영상상태` = `영상생성대기`
3. `Notion` - `Update a Data Source Item`
4. `HTTP` - `Make a request`
5. `Notion` - `Update a Data Source Item`

HTTP Body:

```json
{
  "prompt": "{{영상프롬프트}}",
  "first_3_seconds_text": "{{대표후킹문구}}",
  "hook_pattern": "{{후킹패턴}}",
  "thumbnail_text": "{{대표썸네일문구}}",
  "thumbnail_prompt": "{{썸네일프롬프트}}",
  "aspect_ratio": "9:16",
  "duration_seconds": 12,
  "hook_required": true,
  "product_name": "{{상품명}}",
  "product_image": "{{상품이미지}}"
}
```

완료 업데이트:

```json
{
  "영상URL": "{{HTTP 응답 video_url}}",
  "영상상태": "영상생성완료",
  "업로드상태": "업로드대기"
}
```

### 2. Buffer 예약 시나리오

Make에서 새 시나리오를 하나 더 만든다.

모듈 순서:

1. `Notion` - `Watch Data Source Items`
2. 필터 - `영상상태` = `영상생성완료`, `업로드상태` = `업로드대기`
3. `Buffer` - `Create a status update` 유튜브 쇼츠
4. `Buffer` - `Create a status update` 틱톡
5. `Notion` - `Update a Data Source Item`

Notion 마지막 업데이트:

```json
{
  "업로드상태": "예약완료"
}
```

## 자리표시자

아래 값은 실제 계정 값으로 바꿔야 한다.

- `{{HIGGSFIELD_API_URL}}`
- `{{HIGGSFIELD_API_KEY}}`
- `{{BUFFER_YOUTUBE_PROFILE}}`
- `{{BUFFER_TIKTOK_PROFILE}}`

## 먼저 테스트할 것

처음에는 Buffer까지 연결하지 말고, 영상 생성 시나리오만 `Run once`로 확인한다.

Notion 테스트 항목:

- `상품명`: 테스트 상품
- `대표후킹문구`: 첫 3초에 들어갈 문구
- `대표썸네일문구`: 썸네일에 들어갈 문구
- `영상프롬프트`: 9:16 숏폼 영상 프롬프트
- `영상상태`: 영상생성대기

정상 결과:

- `영상상태`: 영상생성완료
- `영상URL`: Higgsfield 영상 주소
- `업로드상태`: 업로드대기

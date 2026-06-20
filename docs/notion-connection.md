# Notion 연결 설정

웹앱에서 `콘텐츠 생성`을 누르면 백엔드가 아래 Notion 데이터베이스에 새 항목을 저장한다.

- 데이터베이스: `쿠팡 콘텐츠 센터`
- URL: `https://app.notion.com/p/217b751dcada4dfd9f9c5ea45dafbd2a`
- Data Source ID: `31f6d589-a9bd-4344-8e4e-847f1c6ba912`

## 필요한 환경변수

백엔드 실행 환경에 아래 값을 넣는다.

```env
NOTION_TOKEN=여기에_Notion_Integration_Token
NOTION_VERSION=2026-03-11
NOTION_DATA_SOURCE_ID=31f6d589-a9bd-4344-8e4e-847f1c6ba912
REQUIRE_NOTION_SAVE=true
```

## Notion에서 해야 할 일

1. Notion에서 `쿠팡 콘텐츠 센터` 데이터베이스를 연다.
2. 오른쪽 위 `...` 메뉴를 누른다.
3. `연결 추가` 또는 `Add connections`를 누른다.
4. 이 프로젝트용 Notion Integration을 선택한다.
5. 권한을 허용한다.

## 연결 확인

백엔드를 실행한 뒤 아래 주소를 연다.

```text
http://localhost:4000/notion/status
```

정상 연결이면 아래처럼 나온다.

```json
{
  "ok": true,
  "target": "data_source",
  "id": "31f6d589-a9bd-4344-8e4e-847f1c6ba912",
  "title": "쿠팡 콘텐츠 센터"
}
```

## 저장되는 컬럼

웹앱이 먼저 채우는 값:

- 상품명
- 상품이미지
- 쿠팡파트너스링크
- 타겟
- 핵심장점
- 후킹
- 대표후킹문구
- 후킹패턴
- 썸네일문구
- 대표썸네일문구
- 영상대본
- 영상프롬프트
- 썸네일프롬프트
- 캡션
- 인포크상태: `인포크등록대기`
- 영상상태: `영상생성대기`
- 업로드상태: `업로드대기`

Make/Higgsfield/Buffer가 나중에 채우는 값:

- 영상URL
- 영상상태: `영상생성완료`
- 업로드상태: `예약완료`

## 테스트 결과

Notion 커넥터로 아래 테스트 항목 생성을 확인했다.

- `Notion 연결 테스트 - 삭제 가능`
- `후킹 썸네일 자동화 테스트 - 삭제 가능`

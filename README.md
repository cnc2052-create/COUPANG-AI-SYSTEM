# COUPANG-AI-SYSTEM

쿠팡파트너스 숏폼 콘텐츠 자동 생성 시스템입니다.

사용자는 상품 제목, 상품 이미지, 쿠팡파트너스 링크만 입력합니다. 콘텐츠 생성 버튼을 누르면 상품 분석, 후킹, 썸네일 문구, 대본, 캡션, Higgsfield 프롬프트, 인포크 등록용 복사 데이터가 생성되고 Notion Database에 저장됩니다.

## 생성된 Notion Database

- 이름: 쿠팡 콘텐츠 센터
- Database URL: https://app.notion.com/p/217b751dcada4dfd9f9c5ea45dafbd2a
- Data source ID: `31f6d589-a9bd-4344-8e4e-847f1c6ba912`

## 구조

```text
COUPANG-AI-SYSTEM
frontend
backend
notion
integrations
higgsfield
buffer
prompts
docs
```

## 실행

```bash
npm install
npm run dev:backend
npm run dev:frontend
```

프런트엔드는 기본적으로 `http://localhost:3000`, 백엔드는 `http://localhost:4000`을 사용합니다.

## 환경변수

`.env.example`을 참고해 백엔드 환경변수를 설정합니다.

```bash
NOTION_TOKEN=
NOTION_DATA_SOURCE_ID=31f6d589-a9bd-4344-8e4e-847f1c6ba912
MAKE_HIGGSFIELD_WEBHOOK_URL=
MAKE_BUFFER_WEBHOOK_URL=
FRONTEND_ORIGIN=http://localhost:3000
PORT=4000
```

Notion MCP로 데이터베이스는 이미 생성되어 있습니다. 앱에서 데이터를 저장하려면 Notion API 토큰을 백엔드 환경변수에 넣어야 합니다.

## HTML 단독 배포

팀원이 바로 접속하는 링크로 배포하려면 아래 두 파일을 정적 호스팅에 올리면 됩니다.

- `index.html`
- `COUPANG-AI-SYSTEM.html`

자세한 배포 안내는 `docs/team-deployment.md`를 참고하세요.

## 상품 리서치 센터

상품 리서치 화면에서 빠른 선택 또는 직접 검색으로 상품 아이디어를 찾을 수 있습니다.

- 시니어 인기상품, 부모님 선물, 관절 건강, 낙상 예방 등 빠른 선택 제공
- 상품 카드에 추천 이유, 콘텐츠 적합도, 예상 조회수 등급, 예상 구매전환 등급 표시
- `콘텐츠 생성`을 누르면 상품 제목, 대표 이미지, 쿠팡 검색 링크가 자동 입력됩니다.

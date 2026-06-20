# Team Deployment Guide

팀원이 함께 쓰는 링크로 배포할 때는 정적 사이트 배포를 사용하면 됩니다.

## 가장 쉬운 배포 방식

아래 파일을 정적 호스팅에 업로드합니다.

- `index.html`
- `COUPANG-AI-SYSTEM.html`

추천 배포 위치:

- GitHub Pages
- Netlify
- Vercel Static Site
- 사내 웹서버

## GitHub Pages 배포

1. GitHub에 `COUPANG-AI-SYSTEM` 저장소를 만듭니다.
2. 이 프로젝트 파일을 업로드합니다.
3. GitHub 저장소에서 `Settings` > `Pages`로 이동합니다.
4. Source를 `Deploy from a branch`로 선택합니다.
5. Branch를 `main`, folder를 `/root`로 선택합니다.
6. 생성된 Pages URL을 팀원에게 공유합니다.

## 팀 사용 범위

현재 HTML 버전은 서버 없이 바로 쓰는 단독 실행형입니다.

가능한 것:

- 상품 제목, 이미지, 쿠팡파트너스 링크 입력
- 콘텐츠 자동 생성
- 후킹, 썸네일 문구, 대본, 캡션 생성
- 인포크 등록용 복사 영역 사용
- 모바일/PC 접속

주의할 점:

- 생성 기록은 중앙 서버에 저장되지 않습니다.
- 팀 공용 Notion 저장, Make 자동화, Higgsfield 생성, Buffer 예약은 `frontend` + `backend` 버전 배포가 필요합니다.
- 팀 전체가 같은 상태값과 관리자 대시보드를 공유하려면 Node 백엔드와 Notion API 토큰을 함께 배포해야 합니다.

## 정식 자동화 배포

정식 운영에서는 아래 구성이 필요합니다.

- Frontend: Next.js 배포
- Backend: Node.js 배포
- Notion Database: 쿠팡 콘텐츠 센터
- Make Scenario: Notion 감지, Higgsfield 생성, Buffer 예약
- 환경변수: `.env.example` 참고

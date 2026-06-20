# COUPANG-AI-SYSTEM Architecture

## One-click flow

1. User enters product title, product image, and Coupang Partners link.
2. Frontend sends the product payload to the backend.
3. Backend generates:
   - 상품 분석
   - 타겟 고객
   - 핵심 장점
   - 후킹 10개
   - 썸네일 문구 10개
   - 영상 대본 3개
   - 인스타 캡션 3개
   - 유튜브 설명란
   - 틱톡 캡션
   - 고정댓글
   - 쿠팡파트너스 고지문구
   - Higgsfield 영상/썸네일 프롬프트
4. Backend creates a Notion row with:
   - 인포크상태: 인포크등록대기
   - 영상상태: 영상생성대기
   - 업로드상태: 업로드대기
5. Make watches Notion rows where 영상상태 is 영상생성대기.
6. Make calls Higgsfield and writes the returned 영상URL back to Notion.
7. Make watches rows where 영상상태 is 영상생성완료.
8. Make schedules YouTube Shorts and TikTok through Buffer.
9. Make updates 업로드상태 to 예약완료.

## Status values

- 인포크등록대기
- 인포크등록완료
- 영상생성대기
- 영상생성중
- 영상생성완료
- 업로드대기
- 예약완료

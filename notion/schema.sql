CREATE TABLE "쿠팡 콘텐츠 센터" (
  "상품명" TITLE,
  "상품이미지" FILES,
  "쿠팡파트너스링크" URL,
  "타겟" RICH_TEXT,
  "핵심장점" RICH_TEXT,
  "후킹" RICH_TEXT,
  "썸네일문구" RICH_TEXT,
  "영상대본" RICH_TEXT,
  "영상프롬프트" RICH_TEXT,
  "캡션" RICH_TEXT,
  "영상URL" URL,
  "인포크상태" SELECT('인포크등록대기', '인포크등록완료'),
  "영상상태" SELECT('영상생성대기', '영상생성중', '영상생성완료'),
  "업로드상태" SELECT('업로드대기', '예약완료'),
  "생성일" CREATED_TIME
);

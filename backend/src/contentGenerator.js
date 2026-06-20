const disclosure = "이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.";

function cleanTitle(title) {
  return String(title || "").trim().replace(/\s+/g, " ");
}

function inferCategory(title) {
  const lower = title.toLowerCase();
  if (/(청소|세척|먼지|vacuum)/i.test(lower)) return "생활 정리";
  if (/(가습|공기|향|디퓨저)/i.test(lower)) return "홈케어";
  if (/(충전|케이블|거치|무선)/i.test(lower)) return "디지털 편의";
  if (/(운동|마사지|스트레칭|헬스)/i.test(lower)) return "셀프케어";
  return "일상 편의";
}

function buildHooks(productName, category) {
  return [
    `이거 하나로 ${category} 스트레스가 확 줄어듭니다`,
    `${productName}, 왜 이제 알았지 싶은 아이템`,
    `바쁜 사람에게 딱 맞는 ${category} 해결템`,
    `써보면 매일 손이 가는 이유가 있습니다`,
    `집에 두면 생각보다 훨씬 자주 씁니다`,
    `선물용으로도 실패 확률 낮은 실사용템`,
    `복잡한 기능보다 진짜 필요한 것만 담았습니다`,
    `10초만 봐도 필요한지 바로 감이 옵니다`,
    `후기 찾아보는 시간을 줄여주는 선택지`,
    `가격보다 사용 빈도가 먼저 떠오르는 제품`
  ];
}

function buildThumbnailTexts(productName) {
  return [
    "왜 이제 샀지?",
    "매일 쓰는 이유",
    "10초 실사용",
    "집에 두면 편함",
    "선물템 후보",
    "후기 많은 이유",
    "생활이 쉬워짐",
    "깔끔한 해결템",
    "지금 필요한템",
    productName.length > 10 ? "실사용 추천" : `${productName} 추천`
  ];
}

function buildScripts(productName, link) {
  return [
    `첫 3초: "이거 은근히 매일 필요합니다." 화면은 제품 클로즈업으로 시작합니다. 4-8초: 실제 사용 장면을 빠르게 보여주며 불편했던 순간이 해결되는 장면을 배치합니다. 9-12초: ${productName}의 핵심 장점을 한 줄로 정리합니다. 마지막: "자세한 링크는 고정댓글에서 확인하세요." ${link}`,
    `첫 3초: "이런 상황 자주 겪는다면 보세요." 문제 장면을 먼저 보여줍니다. 4-9초: ${productName}을 사용해 해결되는 전후 비교를 보여줍니다. 10-15초: 추천 대상과 쿠팡파트너스 고지를 짧게 안내합니다.`,
    `첫 3초: "후기 찾아보다가 고른 이유." 제품 이미지와 핵심 문구를 크게 보여줍니다. 4-10초: 사용감, 보관, 편의 포인트를 순서대로 보여줍니다. 11-15초: "필요한 분은 고정댓글 링크 참고하세요."로 마무리합니다.`
  ];
}

export function generateContent(input) {
  const productName = cleanTitle(input.productTitle);
  const category = inferCategory(productName);
  const hooks = buildHooks(productName, category);
  const thumbnailTexts = buildThumbnailTexts(productName);
  const scripts = buildScripts(productName, input.coupangLink);

  const target = [
    "빠르게 제품 장단점을 파악하고 싶은 모바일 쇼핑 고객",
    `${category} 문제를 간단히 해결하고 싶은 20-40대 실사용자`,
    "선물 또는 생활 편의 제품을 찾는 쿠팡 이용자"
  ];

  const benefits = [
    "짧은 숏폼 안에서 사용 장면이 바로 이해됩니다",
    "복잡한 설명보다 실사용 전후 차이를 강조하기 좋습니다",
    "인포크, 쇼츠, 틱톡, 인스타에 동시에 재가공하기 쉽습니다"
  ];

  const instagramCaptions = [
    `${productName} 실사용 느낌만 짧게 정리했습니다. 필요한 분은 고정댓글 링크 확인해보세요.\n\n${disclosure}`,
    `요즘 이런 ${category} 아이템 찾는 분들 많죠. 영상처럼 쓰임새가 명확한 제품입니다.\n\n${disclosure}`,
    `후기 보기 전에 10초 사용 장면부터 확인하세요. 링크는 고정댓글에 남겨둘게요.\n\n${disclosure}`
  ];

  const youtubeDescription = `${productName} 숏폼 리뷰입니다.\n\n구매 링크: ${input.coupangLink}\n\n${disclosure}`;
  const tiktokCaption = `${productName} 10초 실사용 리뷰. 링크는 프로필/고정댓글 참고. ${disclosure}`;
  const pinnedComment = `제품 링크: ${input.coupangLink}\n${disclosure}`;

  const videoPrompt = [
    "9:16 vertical short-form commerce video",
    "10-15 seconds",
    "first 3 seconds must include a strong Korean hook text overlay",
    `product: ${productName}`,
    `category mood: ${category}`,
    "realistic product demo, fast but readable cuts, bright natural lighting",
    "show problem, product use, result, and final call-to-action",
    "Korean captions, mobile-first framing, clean background"
  ].join(", ");

  const thumbnailPrompt = [
    "9:16 Korean short-form commerce thumbnail",
    `feature ${productName}`,
    "large readable Korean headline",
    "clean product-centered composition",
    "high contrast, realistic, bright shopping content style"
  ].join(", ");

  return {
    productName,
    productAnalysis: `${productName}은 ${category} 상황에서 반복되는 작은 불편을 빠르게 해결하는 데 초점을 둔 숏폼형 추천 상품입니다.`,
    target,
    keyBenefits: benefits,
    hooks,
    thumbnailTexts,
    videoScripts: scripts,
    instagramCaptions,
    youtubeDescription,
    tiktokCaption,
    pinnedComment,
    disclosure,
    higgsfield: {
      videoPrompt,
      thumbnailPrompt,
      aspectRatio: "9:16",
      durationSeconds: 12,
      firstThreeSeconds: hooks[0]
    },
    infork: {
      productName,
      description: `${productName}\n\n${benefits.join("\n")}\n\n${disclosure}`,
      link: input.coupangLink,
      image: input.imageUrl || input.imageName || ""
    }
  };
}

const disclosure = "이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.";

const targetProfiles = {
  "자녀 구매층": {
    emotion: "걱정, 효도, 안심",
    problem: "부모님이 혼자 움직일 때마다 마음이 쓰이는 상황",
    empathy: "괜찮다고 하시지만 자녀 입장에서는 작은 불편도 크게 느껴집니다.",
    result: "부모님이 한결 편안한 표정으로 일상을 보내는 모습",
    cta: "상품 정보는 프로필 링크에서 확인하세요."
  },
  "실사용자": {
    emotion: "불편함, 독립성, 자신감 회복",
    problem: "혼자 하고 싶지만 몸이 따라주지 않아 망설이는 상황",
    empathy: "작은 이동이나 생활 동작도 매번 부담으로 느껴질 수 있습니다.",
    result: "스스로 움직이며 다시 자신감을 되찾는 모습",
    cta: "자세한 내용은 프로필 링크를 참고하세요."
  },
  "보호자": {
    emotion: "부담 감소, 안전, 돌봄 편의성",
    problem: "돌봄 과정에서 안전과 부담을 동시에 신경 써야 하는 상황",
    empathy: "보호자는 하루에도 여러 번 긴장하고 확인하게 됩니다.",
    result: "보호자와 가족 모두가 조금 더 안심하는 모습",
    cta: "실제 사용 사례는 프로필 링크에서 확인 가능합니다."
  },
  "요양·복지 종사자": {
    emotion: "업무 효율, 안전, 이동 편의",
    problem: "반복되는 이동 보조와 안전 관리로 업무 부담이 커지는 상황",
    empathy: "현장에서는 빠르면서도 안전한 보조가 가장 중요합니다.",
    result: "이동 보조가 더 안정적이고 수월해진 모습",
    cta: "자세한 정보는 프로필 링크에서 확인하세요."
  },
  "재활 환자": {
    emotion: "회복, 자립, 일상 복귀",
    problem: "회복 중인 몸으로 일상 동작을 다시 시작해야 하는 상황",
    empathy: "작은 성공 경험이 회복 의지를 다시 만들어줍니다.",
    result: "일상으로 한 걸음씩 돌아가는 자신감 있는 모습",
    cta: "상품 정보는 프로필 링크에서 확인하세요."
  },
  "액티브 시니어": {
    emotion: "자유, 외출, 삶의 질 향상",
    problem: "외출하고 싶지만 불편함 때문에 망설이게 되는 상황",
    empathy: "편하게 움직일 수 있어야 하루가 더 가볍게 느껴집니다.",
    result: "가벼운 외출과 산책을 다시 즐기는 모습",
    cta: "자세한 내용은 프로필 링크를 참고하세요."
  }
};

const detailTargetGroups = {
  "부모님을 걱정하는 30~40대 딸": "자녀 구매층",
  "부모님을 걱정하는 40~50대 딸": "자녀 구매층",
  "부모님을 걱정하는 40~50대 아들": "자녀 구매층",
  "부모님 선물을 찾는 자녀": "자녀 구매층",
  "거동이 불편한 60대 여성": "실사용자",
  "거동이 불편한 60대 남성": "실사용자",
  "거동이 불편한 70대 여성": "실사용자",
  "거동이 불편한 70대 남성": "실사용자",
  "무릎 통증이 있는 노인": "실사용자",
  "허리 통증이 있는 노인": "실사용자",
  "보행이 불편한 노인": "실사용자",
  "외출이 어려운 노인": "실사용자",
  "치매 환자 보호자": "보호자",
  "장기 간병 보호자": "보호자",
  "배우자를 돌보는 노인": "보호자",
  "부모를 돌보는 가족": "보호자",
  "요양보호사": "요양·복지 종사자",
  "간병인": "요양·복지 종사자",
  "복지시설 종사자": "요양·복지 종사자",
  "요양원 운영자": "요양·복지 종사자",
  "수술 후 회복 환자": "재활 환자",
  "재활 치료 중인 환자": "재활 환자",
  "낙상 경험이 있는 노인": "재활 환자",
  "보행 보조가 필요한 환자": "재활 환자",
  "건강한 액티브 시니어": "액티브 시니어",
  "여행을 좋아하는 시니어": "액티브 시니어",
  "외출을 즐기는 시니어": "액티브 시니어",
  "독립적인 생활을 원하는 시니어": "액티브 시니어"
};

function cleanTitle(title) {
  return String(title || "").trim().replace(/\s+/g, " ");
}

function normalizeTarget(value) {
  const target = String(value || "").trim();
  if (detailTargetGroups[target]) return target;
  if (targetProfiles[target]) return target;
  if (/자녀|효도|부모님/.test(target)) return "자녀 구매층";
  if (/실사용|노인|시니어|어르신/.test(target)) return "실사용자";
  if (/보호자|간병|치매|가족/.test(target)) return "보호자";
  if (/요양|복지|시설|종사자/.test(target)) return "요양·복지 종사자";
  if (/재활|회복|환자/.test(target)) return "재활 환자";
  if (/액티브|외출|산책/.test(target)) return "액티브 시니어";
  return "자녀 구매층";
}

function getTargetGroup(target) {
  const group = detailTargetGroups[target] || target;
  return targetProfiles[group] ? group : "자녀 구매층";
}

function inferCategory(title) {
  const lower = title.toLowerCase();
  if (/(휠체어|보행|지팡이|워커|보조차|이동)/i.test(lower)) return "이동 안전";
  if (/(욕실|미끄럼|손잡이|샤워|낙상)/i.test(lower)) return "낙상 예방";
  if (/(무릎|관절|허리|보호대|찜질|마사지)/i.test(lower)) return "통증 부담 완화";
  if (/(침대|쿠션|베개|수면)/i.test(lower)) return "휴식 편의";
  if (/(혈압|혈당|건강|체온|약통)/i.test(lower)) return "건강 관리";
  return "생활 편의";
}

function buildBenefits(productName, category) {
  if (/휠체어|보행|지팡이|워커|보조차|이동/.test(productName)) {
    return ["이동 부담 감소", "보관과 이동 준비가 쉬움", "외출할 때 보호자도 더 안심"];
  }
  if (/욕실|미끄럼|손잡이|샤워|낙상/.test(productName)) {
    return ["불안한 공간에서 안정감 증가", "매일 관리가 쉬움", "보호자 확인 부담 감소"];
  }
  if (/무릎|관절|허리|보호대|찜질|마사지/.test(productName)) {
    return ["움직일 때 부담 완화", "집에서도 편하게 관리", "일상 동작에 자신감 회복"];
  }
  if (/침대|쿠션|베개|수면/.test(productName)) {
    return ["쉬는 시간이 더 편안해짐", "몸의 부담을 줄이는 데 도움", "매일 쓰기 쉬운 생활 편의"];
  }
  if (/혈압|혈당|건강|체온|약통/.test(productName)) {
    return ["건강 확인이 더 쉬워짐", "가족이 함께 안심", "꾸준한 관리 습관에 도움"];
  }
  return [`${category} 불편 감소`, "사용 준비가 간편함", "일상 속 만족감 증가"];
}

function buildHooks(profile, category) {
  return [
    "부모님이 이럴 때마다 마음 쓰였다면",
    "혼자 괜찮다고 하셔도 이런 순간은 다릅니다",
    "매일 겪는 작은 불편, 그냥 넘기기 어렵죠",
    `${category} 때문에 외출이 망설여졌다면`,
    "보호자라면 한 번쯤 걱정했던 장면입니다",
    "편한 일상은 작은 변화에서 시작됩니다",
    "말로는 괜찮다 해도 표정은 다를 수 있습니다",
    "이 장면이 익숙하다면 끝까지 보세요",
    "도움이 필요한 순간을 조금 더 편하게",
    "부담은 줄이고 일상은 더 가볍게"
  ].map((hook, index) => (index === 0 && profile.problem ? hook : hook));
}

function buildHookPattern(target, category) {
  return [
    "최신 숏폼 인기 구조 참고",
    "제품보다 사람과 문제 상황을 먼저 보여준다",
    "첫 1초 자기해당감",
    "1~3초 문제 제시",
    "3~5초 공감 형성",
    "5초 이후 해결책 등장",
    "기능이 아니라 결과 중심 장점 3개",
    "과장된 효능 단정 금지",
    `타겟: ${target}`,
    `감정 축: ${category} 불편 해소`
  ].join(" / ");
}

function buildThumbnailTexts(target) {
  const group = getTargetGroup(target);
  if (group === "자녀 구매층") {
    return ["부모님 걱정된다면", "이 장면 익숙하죠", "안심되는 변화", "효도템 후보", "외출이 편해짐", "부담 줄이는 방법", "부모님 일상템", "보호자도 안심", "실사용 장면", "이런 분께 추천"];
  }
  if (group === "실사용자") {
    return ["혼자 하고 싶다면", "일상이 가벼워짐", "자신감 회복", "10초 실사용", "이동이 편해짐", "매일 쓰는 이유", "부담 줄이는 방법", "실사용 장면", "외출 준비템", "이런 분께 추천"];
  }
  return ["이런 분께 추천", "부담 줄이는 방법", "10초 실사용", "안심되는 변화", "실사용 장면", "일상이 편해짐", "보호자도 안심", "외출 준비템", "매일 쓰는 이유", "자세히 보기"];
}

function buildScenePlan(productName, profile, benefits) {
  return [
    `장면1\n제품 없이, 불편한 표정의 한국인 시니어 또는 보호자가 일상 속 작은 어려움을 겪는 장면`,
    `장면2\n같은 문제가 반복되어 잠시 멈칫하는 손짓이나 표정 클로즈업`,
    `장면3\n보호자 또는 가족이 걱정스러운 눈빛으로 지켜보는 장면`,
    `장면4\n${profile.empathy}`,
    `장면5\n자연스럽게 해결책이 필요한 상황을 보여주며 긴장감을 낮춤`,
    `장면6\n${productName}이 생활 공간 안에 자연스럽게 등장`,
    `장면7\n${benefits[0]}이 느껴지는 실제 사용 장면`,
    `장면8\n${benefits[1]}이 드러나는 준비 또는 보관 장면`,
    `장면9\n${benefits[2]}이 느껴지는 보호자와 사용자의 안정된 표정`,
    `장면10\n${profile.result}, 자연광, 따뜻한 분위기, 강한 판매 연출 없이 마무리`
  ];
}

function buildNarration(productName, profile, benefits) {
  return [
    "이런 장면, 한 번쯤 마음 쓰이셨죠.",
    profile.problem,
    profile.empathy,
    `그래서 필요한 건 거창한 기능보다, 일상을 조금 더 편하게 만들어주는 해결책입니다.`,
    `${productName}은 ${benefits[0]}, ${benefits[1]}, ${benefits[2]}에 초점을 맞춘 제품입니다.`,
    profile.result,
    profile.cta
  ].join(" ");
}

function buildFinalVideoPrompt({ engine, productName, target, category, profile, benefits, narration }) {
  return [
    `${engine} final video prompt`,
    "9:16 vertical video",
    "Ultra realistic",
    "Korean people",
    "Natural lighting",
    "Premium commercial",
    "Fast-paced editing",
    "High retention",
    "Real-life situation",
    "Emotional storytelling",
    "No text",
    "No subtitles",
    "No captions",
    "No typography",
    "No letters",
    "No words",
    "No logo",
    "No watermark",
    `Product: ${productName}`,
    `Target audience: ${target}`,
    `Category: ${category}`,
    "Voice-over narration is required",
    `Korean voice-over narration: ${narration}`,
    `Story formula: self-identification, problem, empathy, solution, three result-oriented benefits, happy outcome, soft CTA`,
    `Start with a Korean person experiencing this problem: ${profile.problem}`,
    "Show people and emotion first, then reveal the product later.",
    "Do not show the product first. Do not explain specs. Do not list features. Do not use home-shopping style.",
    "First 3 seconds must contain at least three fast visual cuts with no on-screen text.",
    `Show result-oriented benefits through action only: ${benefits.join(", ")}`,
    `End with happy result: ${profile.result}`,
    "Scene duration 0.8 to 1.2 seconds, maximum 1.5 seconds, 10 scenes total, premium lifestyle, natural emotion, realistic product use"
  ].join(", ");
}

export function generateContent(input) {
  const productName = cleanTitle(input.productTitle);
  const selectedTarget = normalizeTarget(input.targetAudience || input.target || "");
  const targetGroup = getTargetGroup(selectedTarget);
  const profile = targetProfiles[targetGroup];
  const category = inferCategory(productName);
  const keyBenefits = buildBenefits(productName, category).slice(0, 3);
  const hooks = buildHooks(profile, category);
  const thumbnailTexts = buildThumbnailTexts(selectedTarget);
  const primaryHook = hooks[0];
  const primaryThumbnailText = thumbnailTexts[0];
  const hookPattern = buildHookPattern(selectedTarget, category);
  const scenePlan = buildScenePlan(productName, profile, keyBenefits);
  const narration = buildNarration(productName, profile, keyBenefits);
  const klingVideoPrompt = buildFinalVideoPrompt({ engine: "Kling 3.0", productName, target: selectedTarget, category, profile, benefits: keyBenefits, narration });
  const seedanceVideoPrompt = buildFinalVideoPrompt({ engine: "Seedance 2.0", productName, target: selectedTarget, category, profile, benefits: keyBenefits, narration });
  const cta = profile.cta;

  const planningIntent = `${selectedTarget}에게는 ${profile.emotion} 감정이 중요합니다. 이 영상은 제품을 먼저 팔지 않고, ${profile.problem}을 먼저 보여준 뒤 공감과 해결 장면을 통해 "${profile.result}"를 기억하게 만드는 쇼핑 숏폼입니다.`;

  const instagramCaptions = [
    `${planningIntent}\n\n${cta}\n\n${disclosure}`,
    `기능보다 중요한 건 실제 생활이 얼마나 편해지는지입니다.\n\n${cta}\n\n${disclosure}`,
    `이런 상황이 익숙하다면 사용 장면을 먼저 확인해보세요.\n\n${cta}\n\n${disclosure}`
  ];

  const youtubeDescription = `${productName} 쇼핑 숏폼 영상입니다.\n\n${planningIntent}\n\n상품 정보: ${input.coupangLink}\n\n${disclosure}`;
  const tiktokCaption = `${primaryHook} ${cta} ${disclosure}`;
  const pinnedComment = `상품 정보: ${input.coupangLink}\n${disclosure}`;

  return {
    productName,
    productAnalysis: planningIntent,
    planningIntent,
    target: [selectedTarget, profile.problem, profile.emotion],
    targetGroup,
    targetAudience: selectedTarget,
    problemDefinition: profile.problem,
    empathyPoint: profile.empathy,
    solution: `${productName}을 생활 장면 속 해결책으로 자연스럽게 제시`,
    keyBenefits,
    resultScene: profile.result,
    cta,
    hooks,
    primaryHook,
    hookPattern,
    thumbnailTexts,
    primaryThumbnailText,
    scenePlan,
    videoScripts: scenePlan,
    narration,
    instagramCaptions,
    youtubeDescription,
    tiktokCaption,
    pinnedComment,
    disclosure,
    finalOutput: {
      "1. 영상 기획 의도": planningIntent,
      "2. 문제 정의": profile.problem,
      "3. 공감 포인트": profile.empathy,
      "4. 해결 방법": `${productName}을 생활 장면 속 해결책으로 자연스럽게 제시`,
      "5. 결과형 장점 3개": keyBenefits,
      "6. 장면 구성": scenePlan,
      "7. 나레이션": narration,
      "8. CTA": cta,
      "9. Kling 3.0 최종 영상 프롬프트": klingVideoPrompt,
      "10. Seedance 2.0 최종 영상 프롬프트": seedanceVideoPrompt
    },
    higgsfield: {
      videoPrompt: klingVideoPrompt,
      klingVideoPrompt,
      seedanceVideoPrompt,
      thumbnailPrompt: [
        "Premium realistic thumbnail reference image",
        `Product: ${productName}`,
        `Target: ${selectedTarget}`,
        `Emotion: ${profile.emotion}`,
        "No text inside generated video scenes",
        `Optional external thumbnail headline for editor only: ${primaryThumbnailText}`
      ].join(", "),
      aspectRatio: "9:16",
      durationSeconds: 11,
      firstThreeSeconds: primaryHook,
      thumbnailText: primaryThumbnailText,
      hookPattern
    },
    infork: {
      productName,
      description: `${productName}\n\n${keyBenefits.map((item) => `✓ ${item}`).join("\n")}\n\n${cta}\n\n${disclosure}`,
      link: input.coupangLink,
      inforkLink: input.inforkLink || "",
      image: input.imageUrl || input.imageName || ""
    }
  };
}

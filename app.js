/* Saju Fortune v1 runtime script (design-preserving) */

const GEMINI_KEY = "YOUR_GEMINI_API_KEY";
const SUPABASE_URL = "https://kmrigsfjsdsfzpugtfnq.supabase.co";
const SUPABASE_KEY = "YOUR_SUPABASE_ANON_KEY";
const IS_TEST_MODE = true;
const ENABLE_TEST_AUTOFILL = true;

const TEST_FORM_DEFAULTS = {
  name: "源誘쇱셿",
  phone: "01034435113",
  email: "dark_111@naver.com",
  birth: "19760627",
  calendar: "solar",
  gender: "female",
  time: "unknown",
  payMethod: "kakaopay",
  privacyAgree: true
};

const DEFAULT_SERVICES = [
  {
    id: "basic",
    name: "기본 사주분석",
    price: 3900,
    description: "오늘의 흐름과 행운의 컬러, 핵심 사주 요약",
    category: "사주",
    is_popular: false
  },
  {
    id: "premium",
    name: "프리미엄 사주",
    price: 9900,
    description: "연간/월별 정밀 분석 및 대운 흐름 PDF 제공",
    category: "사주",
    is_popular: true
  },
  {
    id: "couple",
    name: "커플 궁합",
    price: 14900,
    description: "두 사람의 인연 점수와 연애/결혼 최적 타이밍",
    category: "궁합",
    is_popular: false
  },
  {
    id: "name",
    name: "이름 풀이",
    price: 6900,
    description: "성명학 기반 이름의 기운 분석 및 개명 조언",
    category: "작명",
    is_popular: false
  }
];
let servicesData = [];
let currentServiceId = "";

const modal = document.getElementById("info-modal");
const sajuForm = document.getElementById("saju-form");
const contactForm = document.getElementById("contactForm");

document.addEventListener("DOMContentLoaded", () => {
  initAOS();
  initHeaderScroll();
  initStarBackground();
  initParallax();
  loadServices();
  bindForms();
  unlockSajuFormFields();
});

function initAOS() {
  if (!window.AOS) return;
  window.AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
    easing: "ease-out-cubic"
  });
}

function initHeaderScroll() {
  const header = document.querySelector(".header");
  if (!header) return;
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 50);
  });
}

function initParallax() {
  const heroInner = document.querySelector(".hero-inner");
  const heroBg = document.querySelector(".hero-bg");
  const starBg = document.getElementById("star-background");

  window.addEventListener("scroll", () => {
    const scrollPos = window.scrollY;

    if (heroInner && scrollPos < 1000) {
      heroInner.style.transform = `translateY(${scrollPos * 0.4}px)`;
      heroInner.style.opacity = String(Math.max(0, 1 - scrollPos / 600));
    }

    if (heroBg && scrollPos < 1000) {
      heroBg.style.transform = `scale(${1 + scrollPos * 0.0005}) translateY(${scrollPos * 0.2}px)`;
    }

    if (starBg) {
      starBg.style.transform = `translateY(${scrollPos * 0.03}px)`;
    }
  });

  window.addEventListener("mousemove", (e) => {
    if (!starBg) return;
    const x = (window.innerWidth / 2 - e.pageX) / 50;
    const y = (window.innerHeight / 2 - e.pageY) / 50;
    starBg.style.left = `${x}px`;
    starBg.style.top = `${y}px`;
  });
}

function initStarBackground() {
  const container = document.getElementById("star-background");
  if (!container) return;

  container.innerHTML = "";
  const starCount = 200;

  for (let i = 0; i < starCount; i += 1) {
    const star = document.createElement("div");
    star.className = "star";

    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = Math.random() * 2 + 0.5;
    const delay = Math.random() * 10;
    const duration = Math.random() * 5 + 3;

    star.style.left = `${x}%`;
    star.style.top = `${y}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.setProperty("--delay", `${delay}s`);
    star.style.setProperty("--duration", `${duration}s`);

    container.appendChild(star);
  }

  setInterval(createShootingStar, 6000);
}

function createShootingStar() {
  const container = document.getElementById("star-background");
  if (!container) return;

  const star = document.createElement("div");
  star.className = "shooting-star";

  const startX = Math.random() * window.innerWidth + 300;
  const startY = Math.random() * (window.innerHeight / 3) - 100;
  const duration = Math.random() * 0.8 + 0.4;

  star.style.left = `${startX}px`;
  star.style.top = `${startY}px`;
  star.style.animation = `shooting-animation ${duration}s ease-in forwards`;
  container.appendChild(star);

  setTimeout(() => {
    star.remove();
  }, 2000);
}

function getSupabaseClient() {
  if (!window.supabase) return null;
  const { createClient } = window.supabase;
  return createClient(SUPABASE_URL, SUPABASE_KEY);
}

async function loadServices() {
  const client = getSupabaseClient();
  if (!client || SUPABASE_KEY === "YOUR_SUPABASE_ANON_KEY") {
    servicesData = DEFAULT_SERVICES;
    renderServices(servicesData);
    return;
  }

  try {
    const { data, error } = await client
      .from("fortune_services")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;

    servicesData = Array.isArray(data) && data.length > 0 ? data : DEFAULT_SERVICES;
    renderServices(servicesData);
  } catch (err) {
    console.error("?쒕퉬??濡쒕뱶 ?ㅽ뙣, 湲곕낯 ?곗씠???ъ슜:", err);
    servicesData = DEFAULT_SERVICES;
    renderServices(servicesData);
  }
}

function renderServices(services) {
  const grid = document.querySelector(".service-grid");
  if (!grid) return;

  grid.innerHTML = services
    .map(
      (svc, index) => `
        <div class="service-item ${svc.is_popular ? "popular" : ""}" data-aos="fade-up" data-aos-delay="${(index + 1) * 100}" onclick="openModal('${svc.id}')">
          ${svc.is_popular ? '<div class="popular-tag">MOST POPULAR</div>' : ""}
          <div class="svc-visual ${svc.id}"></div>
          <div class="svc-body">
            <p class="category" style="font-size: 0.75rem; color: var(--gold); margin-bottom: 5px; opacity: 0.8;">${svc.category || "?ъ＜"}</p>
            <h3>${svc.name}</h3>
            <p class="price">₩${Number(svc.price || 0).toLocaleString()}</p>
            <p class="desc">${svc.description || ""}</p>
            <span class="btn-more">?먯꽭??蹂닿린 <i class="fa-solid fa-chevron-right"></i></span>
          </div>
        </div>
      `
    )
    .join("");
}

function bindForms() {
  if (sajuForm) {
    sajuForm.addEventListener("submit", handleSajuSubmit);
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("臾몄쓽 硫붿떆吏媛 ?깃났?곸쑝濡??꾩넚?섏뿀?듬땲?? 1~2???대줈 ?듬? ?쒕━寃좎뒿?덈떎.");
      contactForm.reset();
    });
  }
}

function unlockSajuFormFields() {
  if (!sajuForm) return;

  const controls = sajuForm.querySelectorAll("input, select, textarea, button");
  controls.forEach((el) => {
    el.disabled = false;
    if ("readOnly" in el) {
      el.readOnly = false;
    }
    el.removeAttribute("aria-disabled");
  });
}

function applyTestFormDefaults() {
  if (!ENABLE_TEST_AUTOFILL || !sajuForm) return;

  const setValue = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.value = value;
  };

  setValue("user-name", TEST_FORM_DEFAULTS.name);
  setValue("user-phone", TEST_FORM_DEFAULTS.phone);
  setValue("user-email", TEST_FORM_DEFAULTS.email);
  setValue("user-birth", TEST_FORM_DEFAULTS.birth);
  setValue("calendar-type", TEST_FORM_DEFAULTS.calendar);
  setValue("user-gender", TEST_FORM_DEFAULTS.gender);
  setValue("user-time", TEST_FORM_DEFAULTS.time);

  const privacyAgree = document.getElementById("privacy-agree");
  if (privacyAgree) privacyAgree.checked = !!TEST_FORM_DEFAULTS.privacyAgree;

  const payRadio = sajuForm.querySelector(`input[name="pay-method"][value="${TEST_FORM_DEFAULTS.payMethod}"]`);
  if (payRadio) payRadio.checked = true;
}

function openModal(serviceId) {
  const svc = servicesData.find((s) => s.id === serviceId);
  if (!svc || !modal) return;

  currentServiceId = serviceId;

  const nameEl = document.querySelector("#selected-service-badge .svc-name");
  const priceEl = document.querySelector("#selected-service-badge .svc-price");
  if (nameEl) nameEl.innerText = svc.name;
  if (priceEl) priceEl.innerText = `₩${Number(svc.price || 0).toLocaleString()}`;

  unlockSajuFormFields();
  applyTestFormDefaults();
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeModal() {
  if (!modal) return;
  modal.style.display = "none";
  document.body.style.overflow = "auto";
}

window.openModal = openModal;
window.closeModal = closeModal;

async function handleSajuSubmit(e) {
  e.preventDefault();

  const userInfo = {
    name: document.getElementById("user-name")?.value?.trim(),
    phone: document.getElementById("user-phone")?.value?.trim(),
    email: document.getElementById("user-email")?.value?.trim(),
    birth: document.getElementById("user-birth")?.value,
    calendar: document.getElementById("calendar-type")?.value,
    time: document.getElementById("user-time")?.value,
    gender: document.getElementById("user-gender")?.value,
    serviceId: currentServiceId,
    payMethod: document.querySelector('input[name="pay-method"]:checked')?.value
  };

  if (!document.getElementById("privacy-agree")?.checked) {
    alert("媛쒖씤?뺣낫 ?섏쭛 諛??댁슜???숈쓽?댁＜?몄슂.");
    return;
  }

  if (!userInfo.serviceId) {
    alert("?쒕퉬???뺣낫瑜?李얠쓣 ???놁뒿?덈떎.");
    return;
  }

  await requestPayment(userInfo);
}

async function requestPayment(userInfo) {
  const svc = servicesData.find((s) => s.id === userInfo.serviceId);
  if (!svc) {
    alert("?쒕퉬???뺣낫瑜?李얠쓣 ???놁뒿?덈떎.");
    return;
  }
  userInfo.service = svc.name;

  const paymentData = {
    storeId: "store-6907376b-9699-4577-b695-d4ac64ba2849",
    channelKey: "channel-key-c60202c2-544c-49a4-8d5e-c15873d0f6a9",
    paymentId: `pid_${Date.now()}`,
    orderName: `Memory Fortune: ${svc.name}${IS_TEST_MODE ? " (?뚯뒪??0??寃곗젣)" : ""}`,
    totalAmount: IS_TEST_MODE ? 0 : svc.price,
    currency: "KRW",
    customer: {
      fullName: userInfo.name,
      phoneNumber: userInfo.phone,
      email: userInfo.email
    }
  };

  if (userInfo.payMethod === "card") {
    paymentData.payMethod = "CARD";
  } else if (userInfo.payMethod === "kakaopay") {
    paymentData.payMethod = "EASY_PAY";
    paymentData.easyPay = { easyPayProvider: "KAKAOPAY" };
  } else if (userInfo.payMethod === "naverpay") {
    paymentData.payMethod = "EASY_PAY";
    paymentData.easyPay = { easyPayProvider: "NAVERPAY" };
  } else if (userInfo.payMethod === "tosspay") {
    paymentData.payMethod = "EASY_PAY";
    paymentData.easyPay = { easyPayProvider: "TOSSPAY" };
  }

  if (IS_TEST_MODE && paymentData.totalAmount === 0) {
    alert("?뚯뒪??紐⑤뱶 0??寃곗젣媛 ?뱀씤?섏뿀?듬땲?? AI 遺꾩꽍???쒖옉?⑸땲??");
    await startAIAnalysis(userInfo);
    return;
  }

  try {
    const payment = await window.PortOne.requestPayment(paymentData);

    if (!payment) {
      alert("寃곗젣李쎌쓣 ?댁? 紐삵뻽?듬땲?? 釉뚮씪?곗? ?앹뾽 李⑤떒???댁젣??二쇱꽭??");
      return;
    }

    if (payment.code != null) {
      alert(`寃곗젣 ?ㅽ뙣: ${payment.message || "?????녿뒗 ?ㅻ쪟"}`);
      return;
    }

    alert("寃곗젣媛 ?꾨즺?섏뿀?듬땲?? AI 遺꾩꽍???쒖옉?⑸땲??");
    await startAIAnalysis(userInfo);
  } catch (error) {
    console.error("寃곗젣 ?붿껌 ?ㅻ쪟:", error);
    alert(`寃곗젣 ?붿껌 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎.\n?곸꽭?댁슜: ${error.message || String(error)}`);
  }
}

async function startAIAnalysis(userInfo) {
  closeModal();

  if (IS_TEST_MODE && (!GEMINI_KEY || GEMINI_KEY === "YOUR_GEMINI_API_KEY")) {
    const mockResult = createMockAnalysisResult(userInfo);
    await finalizeAnalysisResult(userInfo, mockResult);
    return;
  }

  const prompt = `
당신은 한국어 사주 명리 분석 전문가입니다.
아래 고객 정보 기준으로 JSON만 반환하세요.

[고객 정보]
- 이름: ${userInfo.name}
- 생년월일: ${userInfo.birth}
- 달력유형: ${userInfo.calendar}
- 출생시간: ${userInfo.time}
- 성별: ${userInfo.gender}
- 서비스: ${userInfo.service}

[출력 스키마]
{
  "인사말": { "제목": "문자열", "내용": "문자열" },
  "운세요약": {
    "사자성어": "문자열",
    "해석": "문자열",
    "강점": ["문자열", "문자열", "문자열"]
  },
  "연간운세": { "키워드": ["문자열", "문자열", "문자열"], "상세설명": "문자열" },
  "월별운세": [
    { "월": "1월", "점수": "★★★★", "키워드": "문자열", "조언": "문자열" }
  ],
  "상세분석": {
    "직업": "문자열",
    "연애결혼": "문자열",
    "건강": "문자열",
    "대인관계": "문자열"
  },
  "행운아이템": {
    "색상": "문자열",
    "숫자": "문자열",
    "방향": "문자열",
    "음식": "문자열",
    "아이템": "문자열"
  },
  "마무리": "문자열"
}
`.trim();

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            response_mime_type: "application/json"
          }
        })
      }
    );

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const apiError = data?.error?.message || response.statusText || "Gemini API request failed";
      throw new Error(`Gemini API 오류: ${apiError}`);
    }

    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    if (!rawText) {
      console.error("AI raw response:", data);
      throw new Error("AI 응답 텍스트를 받지 못했습니다.");
    }

    const resultJSON = extractJSON(rawText);
    await finalizeAnalysisResult(userInfo, resultJSON);
  } catch (error) {
    if (IS_TEST_MODE && /API key|API_KEY_INVALID|key not valid/i.test(error?.message || "")) {
      const mockResult = createMockAnalysisResult(userInfo);
      await finalizeAnalysisResult(userInfo, mockResult);
      return;
    }

    console.error("AI analysis error:", error);
    alert(`분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.\n내용: ${error.message}`);
  }
}

async function finalizeAnalysisResult(userInfo, resultJSON) {
  await saveResultToSupabase(userInfo, JSON.stringify(resultJSON));
  localStorage.setItem("lastFortuneResult", JSON.stringify(resultJSON));
  localStorage.setItem("lastUserInfo", JSON.stringify(userInfo));

  alert("프리미엄 사주 분석이 완료되었습니다! 분석 리포트 페이지로 이동합니다.");
  window.location.href = "result.html";
}

function createMockAnalysisResult(userInfo) {
  return {
    "인사말": {
      "제목": `${userInfo.name}님을 위한 테스트 사주 리포트`,
      "내용": `${userInfo.name}님의 테스트 리포트입니다. API 키 없이도 결제와 결과 페이지 흐름을 확인할 수 있도록 임시 분석 결과를 제공합니다.`
    },
    "운세요약": {
      "사자성어": "금상첨화",
      "해석": "좋은 흐름 위에 기회가 더해지는 시기입니다.",
      "강점": ["실행력", "집중력", "관계운"]
    },
    "연간운세": {
      "키워드": ["안정", "확장", "성과"],
      "상세설명": "상반기에는 기반을 정리하고, 하반기에는 성과를 확장하는 흐름이 강해집니다."
    },
    "월별운세": [
      { "월": "1월", "점수": "★★★★", "키워드": "준비", "조언": "작은 계획부터 차근차근 실행하세요." },
      { "월": "2월", "점수": "★★★", "키워드": "관계", "조언": "주변과 협업하면 더 빠르게 풀립니다." },
      { "월": "3월", "점수": "★★★★★", "키워드": "성과", "조언": "좋은 제안이 오면 적극적으로 검토하세요." }
    ],
    "상세분석": {
      "직업": "단계별 목표를 세우면 결과가 꾸준히 쌓이는 운입니다.",
      "연애결혼": "솔직한 대화와 배려가 관계 안정에 큰 도움이 됩니다.",
      "건강": "수면 리듬과 가벼운 운동을 유지하면 컨디션이 빠르게 회복됩니다.",
      "대인관계": "신뢰를 주는 태도가 좋은 인연을 끌어옵니다."
    },
    "행운아이템": {
      "색상": "골드",
      "숫자": "7",
      "방향": "동남",
      "음식": "따뜻한 차",
      "아이템": "메모 노트"
    },
    "마무리": `${userInfo.name}님, 테스트 환경에서도 흐름은 충분히 좋습니다. 설정 점검이 끝나면 실제 API 키로 더 정밀한 리포트를 받아보세요.`
  };
}
async function saveResultToSupabase(userInfo, result) {
  const client = getSupabaseClient();
  if (!client || SUPABASE_KEY === "YOUR_SUPABASE_ANON_KEY") {
    return;
  }

  const payload = {
    user_name: userInfo.name,
    user_phone: userInfo.phone,
    user_email: userInfo.email,
    birth: userInfo.birth,
    calendar_type: userInfo.calendar,
    birth_time: userInfo.time,
    service_type: (servicesData.find((s) => s.id === userInfo.serviceId) || { name: "서비스없음" }).name,
    analysis_text: result,
    created_at: new Date().toISOString()
  };

  const { error } = await client.from("fortune_results").insert([payload]);
  if (error) {
    console.error("寃곌낵 ????ㅽ뙣:", error);
  }
}

function extractJSON(text) {
  if (!text || typeof text !== "string") {
    throw new Error("AI response text is empty.");
  }

  const normalized = text
    .replace(/^\uFEFF/, "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const candidates = [
    normalized,
    normalized.match(/\{[\s\S]*\}/)?.[0],
    normalized.match(/\[[\s\S]*\]/)?.[0]
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      const sanitized = candidate
        .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, "")
        .trim();
      return JSON.parse(sanitized);
    } catch (_) {
      // try next candidate
    }
  }

  throw new Error("AI response is not valid JSON.");
}




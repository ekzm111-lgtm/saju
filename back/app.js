/* Saju Fortune v1 runtime script (design-preserving) */

const SUPABASE_URL = "https://kmrigsfjsdsfzpugtfnq.supabase.co";
const SUPABASE_KEY = "sb_publishable_5how-klMccwuZ5zqic_7Xw_LLkSAy6K";
const IS_TEST_MODE = true;
const ENABLE_TEST_AUTOFILL = true;
const USE_MOCK_ON_AI_ERROR = localStorage.getItem("USE_MOCK_ON_AI_ERROR") === "1";
const AI_RETRY_LIMIT = 2;

const TEST_FORM_DEFAULTS = {
  name: "김민완",
  phone: "01034435113",
  email: "dark_111@naver.com",
  birth: "19760627",
  calendar: "solar",
  gender: "female",
  time: "unknown",
  partnerName: "테스트상대",
  partnerBirth: "19900101",
  partnerCalendar: "solar",
  partnerGender: "male",
  partnerTime: "unknown",
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
    name: "2026 신년운세",
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

const SPECIAL_SERVICE = {
  id: "detailed",
  name: "프리미엄 사주",
  price: 30000,
  description: "국내 최고 수준의 1:1 정밀 맞춤 사주 분석 (전문가 심층 해설)",
  category: "VIP",
  is_popular: true
};

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
  initZodiacFortuneBoard();
  loadServices();
  bindForms();
  unlockSajuFormFields();
  if (IS_TEST_MODE) createDBTestButton(); // [추가] DB 연결 테스트 버튼 생성
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

function initZodiacFortuneBoard() {
  const section = document.getElementById("how-to");
  if (!section) return;

  const headerKicker = section.querySelector(".section-header p");
  const headerTitle = section.querySelector(".section-header h2");
  const stepGrid = section.querySelector(".step-grid");
  if (!headerKicker || !headerTitle || !stepGrid) return;

  const now = new Date();
  const dateLabel = now.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short"
  });

  headerKicker.textContent = "TODAY'S ZODIAC FORTUNE";
  headerTitle.textContent = `오늘의 띠별 운세 · ${dateLabel}`;
  stepGrid.classList.add("zodiac-mode");

  const zodiacList = [
    { name: "쥐띠", icon: "fa-moon" },
    { name: "소띠", icon: "fa-shield" },
    { name: "호랑이띠", icon: "fa-fire" },
    { name: "토끼띠", icon: "fa-leaf" },
    { name: "용띠", icon: "fa-dragon" },
    { name: "뱀띠", icon: "fa-wand-magic-sparkles" },
    { name: "말띠", icon: "fa-bolt" },
    { name: "양띠", icon: "fa-cloud" },
    { name: "원숭이띠", icon: "fa-star" },
    { name: "닭띠", icon: "fa-sun" },
    { name: "개띠", icon: "fa-heart" },
    { name: "돼지띠", icon: "fa-coins" }
  ];

  const fortunePool = [
    "작은 결정을 빠르게 실행하면 큰 흐름이 열립니다.",
    "대화 운이 좋아 중요한 오해를 풀 기회가 찾아옵니다.",
    "금전은 보수적으로, 관계는 적극적으로 움직이면 좋습니다.",
    "미뤄둔 일을 정리하면 예상보다 빠른 성과가 납니다.",
    "몸의 리듬을 지키면 집중력과 판단력이 함께 살아납니다.",
    "도움을 요청하면 좋은 조력자를 만나기 쉬운 날입니다.",
    "새로운 제안은 즉답보다 하루 숙고 후 결정이 유리합니다.",
    "가까운 사람과의 협업에서 행운 포인트가 크게 작동합니다.",
    "지출 점검을 하면 다음 기회에 쓸 자원이 확보됩니다.",
    "감정 표현을 부드럽게 하면 관계운이 눈에 띄게 상승합니다.",
    "익숙한 방식에 작은 변화를 주면 막힌 흐름이 풀립니다.",
    "오늘 시작한 루틴이 한 달 뒤 의미 있는 차이를 만듭니다."
  ];

  const daySeed = Number(
    `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`
  );

  const cards = zodiacList.map((zodiac, idx) => {
    const poolIndex = (daySeed + idx * 7) % fortunePool.length;
    const luckyNumber = ((daySeed + idx * 3) % 9) + 1;
    const luckyColor = ["골드", "네이비", "화이트", "그린", "버건디"][(daySeed + idx) % 5];
    return `
      <article class="zodiac-card" data-aos="fade-up" data-aos-delay="${(idx % 4) * 80}">
        <div class="zodiac-head">
          <i class="fa-solid ${zodiac.icon}"></i>
          <h3>${zodiac.name}</h3>
        </div>
        <p class="zodiac-text">${fortunePool[poolIndex]}</p>
        <p class="zodiac-meta">행운 숫자 ${luckyNumber} · 행운 컬러 ${luckyColor}</p>
      </article>
    `;
  });

  stepGrid.innerHTML = cards.join("");
  if (window.AOS) {
    window.AOS.refreshHard();
  }
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
  
  // 1. DB에서 서비스 목록 불러오기 시도
  if (client && SUPABASE_KEY !== "YOUR_SUPABASE_ANON_KEY") {
    try {
      const { data, error } = await client
        .from("fortune_services")
        .select("*")
        .order("created_at", { ascending: true });

      if (!error && Array.isArray(data) && data.length > 0) {
        servicesData = data;
      } else {
        servicesData = DEFAULT_SERVICES;
      }
    } catch (err) {
      console.error("서비스 로드 실패, 기본 데이터를 사용합니다:", err);
      servicesData = DEFAULT_SERVICES;
    }
  } else {
    servicesData = DEFAULT_SERVICES;
  }

  // 2. VIP 서비스(detailed)가 목록에 없다면 추가 (신청 모달 등에서 사용하기 위함)
  if (!servicesData.find(s => s.id === SPECIAL_SERVICE.id)) {
    servicesData.push(SPECIAL_SERVICE);
  }

  // 3. 화면 렌더링 (그리드 + 상단 배너)
  renderServices(servicesData);
  renderSpecialBanner();
}

function renderServices(services) {
  const grid = document.querySelector(".service-grid");
  if (!grid) return;

  // 상단 배너로 보여줄 VIP 서비스는 그리드 목록에서 제외
  const displayServices = services.filter(s => s.id !== "detailed");

  grid.innerHTML = displayServices
    .map(
      (svc, index) => `
        <div class="service-item ${svc.is_popular ? "popular" : ""}" data-aos="fade-up" data-aos-delay="${(index + 1) * 100}" onclick="openModal('${svc.id}')">
          ${svc.is_popular ? '<div class="popular-tag">MOST POPULAR</div>' : ""}
          <div class="svc-visual ${svc.id}"></div>
          <div class="svc-body">
            <p class="category" style="font-size: 0.75rem; color: var(--gold); margin-bottom: 5px; opacity: 0.8;">${svc.category || "사주"}</p>
            <h3>${svc.name}</h3>
            <p class="price">₩${Number(svc.price || 0).toLocaleString()}</p>
            <p class="desc">${svc.description || ""}</p>
            <span class="btn-more">자세히 보기 <i class="fa-solid fa-chevron-right"></i></span>
          </div>
        </div>
      `
    )
    .join("");
}

/**
 * VIP 프리미엄 서비스 상단 배너 렌더링
 * "원하는 운세를 선택하세요" 섹션 바로 위에 배치
 */
function renderSpecialBanner() {
  const grid = document.querySelector(".service-grid");
  if (!grid) return;

  // 이미 배너가 있으면 중복 생성 방지
  if (document.getElementById("special-banner-root")) return;

  const banner = document.createElement("div");
  banner.id = "special-banner-root";
  banner.style.marginBottom = "40px";
  banner.style.marginTop = "10px";
  banner.style.width = "100%";
  banner.style.boxSizing = "border-box";
  
  banner.innerHTML = `
    <div style="
      background: linear-gradient(135deg, rgba(30,30,40,0.9) 0%, rgba(10,10,15,0.95) 100%);
      border: 2px solid var(--gold);
      border-radius: 12px;
      padding: 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      box-shadow: 0 4px 20px rgba(212, 175, 55, 0.15);
      position: relative;
      overflow: hidden;
      z-index: 10;
    ">
      <div style="position: absolute; top: -50px; right: -50px; width: 100px; height: 100px; background: var(--gold); opacity: 0.1; filter: blur(40px); border-radius: 50%;"></div>
      <div style="font-size: 0.85rem; color: var(--gold); letter-spacing: 2px; margin-bottom: 12px; font-weight: 700;">PREMIUM VIP SERVICE</div>
      <h2 style="font-family: 'Noto Serif KR', serif; font-size: 1.8rem; margin-bottom: 10px; color: #fff;">${SPECIAL_SERVICE.name}</h2>
      <p style="color: rgba(255,255,255,0.7); max-width: 600px; line-height: 1.6; margin-bottom: 24px; word-break: keep-all;">${SPECIAL_SERVICE.description}<br/>단순한 풀이를 넘어 인생의 나침반이 되어드릴 깊이 있는 통찰을 제공합니다.</p>
      <button onclick="openModal('${SPECIAL_SERVICE.id}')" style="background: var(--gold); color: #000; border: none; padding: 14px 32px; font-size: 1rem; font-weight: 700; border-radius: 50px; cursor: pointer; transition: transform 0.2s;">지금 신청하기 (₩${SPECIAL_SERVICE.price.toLocaleString()})</button>
    </div>
  `;

  // 그리드 바로 앞에 배너 삽입 (확실하게 노출)
  grid.insertAdjacentElement("beforebegin", banner);
}

function bindForms() {
  if (sajuForm) {
    sajuForm.addEventListener("submit", handleSajuSubmit);
  }

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const client = getSupabaseClient();
      if (!client || SUPABASE_KEY === "YOUR_SUPABASE_ANON_KEY") {
        alert("데이터베이스 설정이 올바르지 않아 메시지를 저장할 수 없습니다.");
        return;
      }

      // UX: 전송 중 버튼 비활성화 및 텍스트 변경
      const submitBtn = contactForm.querySelector("button[type='submit']");
      const originalBtnText = submitBtn ? submitBtn.innerText : "보내기";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = "전송 중...";
      }

      const formData = new FormData(contactForm);
      // name 속성 또는 ID를 통해 값 추출
      const name = formData.get("name") || document.getElementById("contact-name")?.value || "";
      const email = formData.get("email") || document.getElementById("contact-email")?.value || "";
      const message = formData.get("message") || document.getElementById("contact-message")?.value || "";

      try {
        const { error } = await client
          .from("fortune_contacts")
          .insert([{ name, email, message, created_at: new Date().toISOString() }]);

        if (error) {
          console.error("문의 저장 실패:", error);
          alert(`메시지 전송 실패: ${error.message}\n(데이터베이스 권한 설정을 확인해주세요)`);
        } else {
          alert("문의 메시지가 성공적으로 전송되었습니다. 1~2일 내로 답변 드리겠습니다.");
          contactForm.reset();
        }
      } catch (err) {
        console.error("전송 중 오류:", err);
        alert("알 수 없는 오류가 발생했습니다.");
      } finally {
        // UX: 버튼 상태 복구
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = originalBtnText;
        }
      }
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
  setValue("partner-name", TEST_FORM_DEFAULTS.partnerName);
  setValue("partner-birth", TEST_FORM_DEFAULTS.partnerBirth);
  setValue("partner-calendar", TEST_FORM_DEFAULTS.partnerCalendar);
  setValue("partner-gender", TEST_FORM_DEFAULTS.partnerGender);
  setValue("partner-time", TEST_FORM_DEFAULTS.partnerTime);

  const privacyAgree = document.getElementById("privacy-agree");
  if (privacyAgree) privacyAgree.checked = !!TEST_FORM_DEFAULTS.privacyAgree;

  const payRadio = sajuForm.querySelector(`input[name="pay-method"][value="${TEST_FORM_DEFAULTS.payMethod}"]`);
  if (payRadio) payRadio.checked = true;
}

function toggleCoupleSection(isCouple) {
  const section = document.getElementById("couple-section");
  const selfTitle = document.getElementById("self-info-title");
  if (!section) return;

  section.style.display = isCouple ? "block" : "none";
  if (selfTitle) selfTitle.style.display = isCouple ? "block" : "none";

  const partnerName = document.getElementById("partner-name");
  const partnerBirth = document.getElementById("partner-birth");
  const partnerCalendar = document.getElementById("partner-calendar");
  const partnerGender = document.getElementById("partner-gender");
  const partnerTime = document.getElementById("partner-time");
  if (partnerName) partnerName.required = !!isCouple;
  if (partnerBirth) partnerBirth.required = !!isCouple;
  if (partnerCalendar) partnerCalendar.required = !!isCouple;
  if (partnerGender) partnerGender.required = !!isCouple;
  if (partnerTime) partnerTime.required = !!isCouple;
}

function openModal(serviceId) {
  const svc = servicesData.find((s) => s.id === serviceId);
  if (!svc || !modal) return;

  currentServiceId = serviceId;

  const nameEl = document.querySelector("#selected-service-badge .svc-name");
  const priceEl = document.querySelector("#selected-service-badge .svc-price");
  if (nameEl) nameEl.innerText = svc.name;
  if (priceEl) priceEl.innerText = `₩${Number(svc.price || 0).toLocaleString()}`;

  toggleCoupleSection(serviceId === "couple");
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
    payMethod: document.querySelector('input[name="pay-method"]:checked')?.value,
    partner: {
      name: document.getElementById("partner-name")?.value?.trim(),
      birth: document.getElementById("partner-birth")?.value,
      calendar: document.getElementById("partner-calendar")?.value,
      gender: document.getElementById("partner-gender")?.value,
      time: document.getElementById("partner-time")?.value
    }
  };

  if (!document.getElementById("privacy-agree")?.checked) {
    alert("개인정보 수집 및 이용에 동의해주세요.");
    return;
  }

  if (!userInfo.serviceId) {
    alert("서비스 정보를 찾을 수 없습니다.");
    return;
  }

  if (
    userInfo.serviceId === "couple" &&
    (
      !userInfo.partner?.name ||
      !userInfo.partner?.birth ||
      !userInfo.partner?.calendar ||
      !userInfo.partner?.gender ||
      !userInfo.partner?.time
    )
  ) {
    alert("커플 궁합은 두 사람 정보가 모두 필요합니다. 상대방 이름/생년월일/시간/성별을 입력해주세요.");
    return;
  }

  // 결제 전 상태 체크 제거 (사용자 요청)
  /*
  const aiReady = await ensureAIAvailableBeforePayment();
  if (!aiReady) {
    return;
  }
  */

  await requestPayment(userInfo);
}

function getApiBaseURL() {
  const isHttp = /^https?:/i.test(window.location.protocol);
  const baseFromStorage = localStorage.getItem("API_BASE_URL") || "";
  return baseFromStorage || (isHttp ? window.location.origin : "http://localhost:3001");
}

async function ensureAIAvailableBeforePayment() {
  const endpoint = `${getApiBaseURL().replace(/\/$/, "")}/api/gemini`;
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ healthcheck: true, prompt: "health-check" })
    });
    const data = await response.json().catch(() => ({}));

    if (response.ok && data?.ok) {
      return true;
    }

    if (response.status === 429 || isGeminiQuotaError({ message: data?.error })) {
      alert(
        "현재 AI 분석 서버 사용량 한도(Quota) 초과로 결제를 진행할 수 없습니다.\n" +
        "잠시 후 다시 시도해주세요."
      );
      return false;
    }

    alert(
      "현재 AI 분석 서버 상태를 확인할 수 없어 결제를 진행할 수 없습니다.\n" +
      `사유: ${data?.error || "알 수 없는 오류"}`
    );
    return false;
  } catch (error) {
    alert(
      "AI 서버 연결 확인에 실패해 결제를 중단했습니다.\n" +
      "서버 실행 상태를 확인한 뒤 다시 시도해주세요."
    );
    return false;
  }
}

async function requestPayment(userInfo) {
  const svc = servicesData.find((s) => s.id === userInfo.serviceId);
  if (!svc) {
    alert("서비스 정보를 찾을 수 없습니다.");
    return;
  }
  userInfo.service = svc.name;

  const paymentData = {
    storeId: "store-6907376b-9699-4577-b695-d4ac64ba2849",
    channelKey: "channel-key-c60202c2-544c-49a4-8d5e-c15873d0f6a9",
    paymentId: `pid_${Date.now()}`,
    orderName: `Memory Fortune: ${svc.name}${IS_TEST_MODE ? " (테스트 0원 결제)" : ""}`,
    totalAmount: IS_TEST_MODE ? 0 : svc.price,
    currency: "KRW",
    customer: {
      fullName: userInfo.name,
      phoneNumber: userInfo.phone,
      email: userInfo.email
    }
  };
  userInfo.paymentId = paymentData.paymentId;

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
    // alert("테스트 모드 0원 결제가 승인되었습니다. AI 분석을 시작합니다.");
    await startAIAnalysis(userInfo);
    return;
  }

  try {
    const payment = await window.PortOne.requestPayment(paymentData);

    if (!payment) {
      alert("결제창을 열지 못했습니다. 브라우저의 팝업 차단 설정을 해제해 주세요.");
      return;
    }

    if (payment.code != null) {
      alert(`결제 실패: ${payment.message || "알 수 없는 오류"}`);
      return;
    }
    userInfo.paymentId = payment.paymentId || paymentData.paymentId;

    // alert("결제가 완료되었습니다. AI 분석을 시작합니다.");
    await startAIAnalysis(userInfo);
  } catch (error) {
    console.error("결제 요청 오류:", error);
    alert(`결제 요청 중 오류가 발생했습니다.\n상세내용: ${error.message || String(error)}`);
  }
}

async function startAIAnalysis(userInfo) {
  closeModal();
  let prompt = buildServicePrompt(userInfo);
  let lastError = null;

  for (let attempt = 0; attempt <= AI_RETRY_LIMIT; attempt += 1) {
    try {
      const rawResult = await callGeminiAPI(prompt);
      console.log("Gemini 파싱 결과:", rawResult);
      const resultJSON = normalizeServiceResult(userInfo, rawResult);

      if (!isDetailedEnough(userInfo.serviceId, resultJSON)) {
        throw new Error("AI 결과가 너무 짧거나 필수 항목이 누락되었습니다.");
      }

      await finalizeAnalysisResult(userInfo, resultJSON);
      return;
    } catch (error) {
      lastError = error;
      console.error(`AI analysis error (attempt ${attempt + 1}):`, error);

      if (isGeminiQuotaError(error)) {
        alert(
          "Gemini API 사용량 한도를 초과했습니다.\n" +
          "잠시 후 다시 시도하거나, Google AI Studio에서 결제/한도를 확인해주세요."
        );
        return;
      }

      prompt = `${prompt}\n\n[재요청 지시]\n방금 응답은 길이/상세도가 부족했습니다. 반드시 각 항목을 요구 문장 수 이상으로 충분히 길게 작성하고, JSON 키를 절대 누락하지 마세요.`;
    }
  }

  if (USE_MOCK_ON_AI_ERROR) {
    const mockResult = createMockAnalysisResult(userInfo);
    await finalizeAnalysisResult(userInfo, mockResult);
    return;
  }

  alert(
    `Gemini 결과 생성에 실패했습니다.\n` +
    `API 키 또는 응답 형식을 확인해 주세요.\n` +
    `상세: ${lastError?.message || "알 수 없는 오류"}`
  );
}

function isGeminiQuotaError(error) {
  const msg = String(error?.message || "").toLowerCase();
  return (
    msg.includes("quota exceeded") ||
    msg.includes("resource_exhausted") ||
    msg.includes("rate limit") ||
    msg.includes("429")
  );
}

function isDetailedEnough(serviceId, resultJSON) {
  const textLength = (value) => String(value || "").replace(/\s+/g, "").length;

  if (serviceId === "premium") {
    return (
      textLength(resultJSON?.총평) > 200 &&
      textLength(resultJSON?.["2026년운세"]) > 200 &&
      textLength(resultJSON?.총조언) > 400 &&
      textLength(resultJSON?.재물운) > 120 &&
      textLength(resultJSON?.애정운) > 120
    );
  }

  if (serviceId === "couple") {
    return (
      Number(resultJSON?.궁합점수 || 0) > 0 &&
      textLength(resultJSON?.궁합총평) > 120 &&
      textLength(resultJSON?.연애운) > 80 &&
      textLength(resultJSON?.결혼운) > 80 &&
      textLength(resultJSON?.총조언) > 80
    );
  }

  if (serviceId === "name") {
    return (
      textLength(resultJSON?.이름분석) > 120 &&
      textLength(resultJSON?.이름의기운) > 120 &&
      textLength(resultJSON?.오행균형) > 120 &&
      Array.isArray(resultJSON?.추천이름3개) &&
      resultJSON.추천이름3개.length === 3
    );
  }

  return (
    textLength(resultJSON?.총평) > 100 &&
    textLength(resultJSON?.오늘의운세) > 100 &&
    textLength(resultJSON?.이번달운세) > 120 &&
    textLength(resultJSON?.오늘의조언) > 100
  );
}

function getServiceSchema(serviceId) {
  if (serviceId === "premium") {
    return `{
  "총평": "최소 8문장 이상 종합 평가",
  "타고난기질": "최소 6문장 이상",
  "오행분석": {
    "목": "목의 기운 분석 최소 3문장",
    "화": "화의 기운 분석 최소 3문장",
    "토": "토의 기운 분석 최소 3문장",
    "금": "금의 기운 분석 최소 3문장",
    "수": "수의 기운 분석 최소 3문장"
  },
  "2026년운세": "2026년 전체 흐름 최소 8문장 이상",
  "상반기운세": "1~6월 상세 흐름 최소 5문장 이상",
  "하반기운세": "7~12월 상세 흐름 최소 5문장 이상",
  "월별운세": [
    { "월": "1월", "운세": "이달의 상세 운세 3문장" },
    { "월": "2월", "운세": "이달의 상세 운세 3문장" },
    { "월": "3월", "운세": "이달의 상세 운세 3문장" },
    { "월": "4월", "운세": "이달의 상세 운세 3문장" },
    { "월": "5월", "운세": "이달의 상세 운세 3문장" },
    { "월": "6월", "운세": "이달의 상세 운세 3문장" },
    { "월": "7월", "운세": "이달의 상세 운세 3문장" },
    { "월": "8월", "운세": "이달의 상세 운세 3문장" },
    { "월": "9월", "운세": "이달의 상세 운세 3문장" },
    { "월": "10월", "운세": "이달의 상세 운세 3문장" },
    { "월": "11월", "운세": "이달의 상세 운세 3문장" },
    { "월": "12월", "운세": "이달의 상세 운세 3문장" }
  ],
  "재물운": "최소 6문장 이상 상세 분석",
  "애정운": "최소 6문장 이상 상세 분석",
  "건강운": "최소 6문장 이상 상세 분석",
  "직업운": "최소 6문장 이상 상세 분석",
  "행운정보": {
    "색상": "색상과 이유 2문장",
    "숫자": "숫자와 이유 2문장",
    "방향": "방향과 이유 2문장",
    "음식": "음식과 이유 2문장",
    "조심할달": "월과 이유 2문장"
  },
  "총조언": "위의 모든 분석 내용을 종합하여 고객의 삶에 실질적인 도움이 되는 12문장 이상의 매우 길고 상세한 희망적 조언"
}`;
  }

  if (serviceId === "couple") {
    return `{
  "궁합점수": 0,
  "궁합총평": "두 사람의 궁합을 최소 8문장 이상 종합 평가",
  "첫만남의기운": "두 사람이 처음 만났을 때 기운 최소 5문장",
  "연애운": "연애할 때 두 사람의 모습과 주의사항 최소 6문장",
  "결혼운": "결혼했을 때 두 사람의 모습과 행복 포인트 최소 6문장",
  "갈등포인트": "두 사람이 갈등할 수 있는 상황과 원인 최소 5문장",
  "극복방법": "갈등을 극복하는 구체적인 방법 5가지 각각 2문장",
  "재물궁합": "두 사람의 재물운 궁합 최소 5문장",
  "최고의순간": "두 사람이 가장 행복할 순간들 최소 5문장",
  "총조언": "두 사람에게 전하는 따뜻한 응원 메시지 최소 6문장"
}`;
  }

  if (serviceId === "name") {
    return `{
  "이름분석": "이름의 한자 의미, 음양오행, 획수, 소리의 기운까지 최소 5문장 이상 매우 상세하게 분석",
  "이름의기운": "이 이름이 가진 에너지와 기운이 인생에 미치는 영향을 최소 5문장 이상 구체적으로 설명",
  "오행균형": "목화토금수 각각의 비율과 강한 기운 약한 기운을 분석하고 보완 방법까지 최소 5문장 이상",
  "이름이주는운세": "이 이름으로 인해 재물운 애정운 직업운 건강운에 미치는 영향을 각각 2문장씩 총 8문장 이상 상세히",
  "개명추천여부": "개명 추천 또는 유지 권장 이유를 3문장 이상 설명",
  "추천이름3개": ["이름1", "이름2", "이름3"],
  "추천이름이유": "각 추천 이름의 의미와 기운을 각각 2문장씩 설명"
}`;
  }

  return `{
  "총평": "이 사람의 사주를 종합적으로 평가하는 내용을 최소 8문장 이상 따뜻하고 희망적으로 작성",
  "오늘의운세": "오늘 하루 조심할 것과 기회가 되는 것을 구체적으로 최소 6문장 이상 작성",
  "이번달운세": "이번달 전반적인 흐름과 재물 애정 건강 직업별로 각각 2문장씩 총 10문장 이상",
  "행운정보": {
    "색상": "색상 이름과 이유 2문장",
    "숫자": "숫자와 이유 2문장",
    "방향": "방향과 이유 2문장",
    "음식": "음식과 이유 2문장",
    "조심할달": "월과 이유 2문장"
  },
  "오늘의조언": "오늘 하루를 잘 보내기 위한 구체적인 조언 5가지를 각각 2문장씩 상세히",
  "총조언": "위의 모든 분석 내용을 종합하여 고객의 삶에 실질적인 도움이 되는 10문장 이상의 매우 길고 상세한 희망적 조언"
}`;
}

function buildServicePrompt(userInfo) {
  const basicPrompt = `
너는 30년 경력의 한국 사주명리학 전문가야.
아래 정보로 매우 상세한 사주 분석을 해줘.

이름: ${userInfo.name}
생년월일: ${userInfo.birth}
태어난시간: ${userInfo.time}
성별: ${userInfo.gender}

반드시 아래 JSON 형식으로만 반환해:
${getServiceSchema("basic")}

[공통 규칙]
- 말투: 따뜻하고 희망적으로
- 부정적 내용은 반드시 긍정적 방향 제시
- 고객 이름을 자주 언급해서 개인화
- 절대 짧게 쓰지 말고 풍부하게 작성
- JSON만 반환, 다른 말 금지
- 한국어로만 작성
`.trim();

  const premiumPrompt = `
너는 30년 경력의 한국 사주명리학 전문가야.
아래 정보로 최고급 프리미엄 사주 리포트를 작성해줘.
각 항목을 매우 상세하고 풍부하게 작성해야 해.

이름: ${userInfo.name}
생년월일: ${userInfo.birth}
태어난시간: ${userInfo.time}
성별: ${userInfo.gender}

반드시 아래 JSON 형식으로만 반환해:
${getServiceSchema("premium")}

[공통 규칙]
- 말투: 따뜻하고 희망적으로
- 부정적 내용은 반드시 긍정적 방향 제시
- 고객 이름을 자주 언급해서 개인화
- 절대 짧게 쓰지 말고 풍부하게 작성
- JSON만 반환, 다른 말 금지
- 한국어로만 작성
`.trim();

  const couplePrompt = `
너는 30년 경력의 한국 사주명리학 전문가야.
두 사람의 사주를 바탕으로 매우 상세한 궁합 분석을 해줘.

나의정보 - 이름: ${userInfo.name}
생년월일: ${userInfo.birth}
태어난시간: ${userInfo.time}
성별: ${userInfo.gender}

상대방정보 - 이름: ${userInfo.partner?.name || ""}
생년월일: ${userInfo.partner?.birth || ""}
태어난시간: ${userInfo.partner?.time || ""}
성별: ${userInfo.partner?.gender || ""}

반드시 아래 JSON 형식으로만 반환해:
${getServiceSchema("couple")}

[공통 규칙]
- 말투: 따뜻하고 희망적으로
- 부정적 내용은 반드시 긍정적 방향 제시
- 고객 이름을 자주 언급해서 개인화
- 절대 짧게 쓰지 말고 풍부하게 작성
- JSON만 반환, 다른 말 금지
- 한국어로만 작성
`.trim();

  const namePrompt = `
너는 30년 경력의 한국 최고 작명가이자 사주명리학 전문가야.
아래 정보로 매우 상세한 이름 풀이를 해줘.

이름: ${userInfo.name}
생년월일: ${userInfo.birth}
성별: ${userInfo.gender}

반드시 아래 JSON 형식으로만 반환해:
${getServiceSchema("name")}

[공통 규칙]
- 말투: 따뜻하고 희망적으로
- 부정적 내용은 반드시 긍정적 방향 제시
- 고객 이름을 자주 언급해서 개인화
- 절대 짧게 쓰지 말고 풍부하게 작성
- JSON만 반환, 다른 말 금지
- 한국어로만 작성
`.trim();

  const prompts = {
    basic: basicPrompt,
    premium: premiumPrompt,
    couple: couplePrompt,
    name: namePrompt
  };

  return prompts[userInfo.serviceId] || basicPrompt;
}

// 기존 코드가 어떻게 되어있든 이걸로 교체
async function callGeminiAPI(prompt) {
  const endpoint = `${getApiBaseURL().replace(/\/$/, "")}/api/gemini`;

  let response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
  } catch (error) {
    throw new Error(
      `API 서버에 연결할 수 없습니다. (${endpoint}) Next 서버 실행 여부를 확인해주세요.`
    );
  }

  const data = await response.json();
  console.log("Gemini 원본 응답:", data?.raw || data);

  if (!response.ok || !data?.ok) {
    const message = data?.error || "Gemini route request failed";
    throw new Error(message);
  }

  return data.result;
}

function normalizeServiceResult(userInfo, rawResult) {
  const serviceId = userInfo.serviceId || "basic";
  const luckyDefault = { 색상: "", 숫자: "", 방향: "", 음식: "", 조심할달: "" };

  if (serviceId === "premium") {
    const fiveDefault = { 목: "", 화: "", 토: "", 금: "", 수: "" };
    const luckyDefault = { 색상: "", 숫자: "", 방향: "", 음식: "", 조심할달: "" };
    
    return {
      총평: String(rawResult?.총평 || ""),
      타고난기질: String(rawResult?.타고난기질 || ""),
      오행분석: rawResult?.오행분석 || fiveDefault,
      "2026년운세": String(rawResult?.["2026년운세"] || ""),
      상반기운세: String(rawResult?.상반기운세 || ""),
      하반기운세: String(rawResult?.하반기운세 || ""),
      월별운세: Array.isArray(rawResult?.월별운세) ? rawResult.월별운세 : [],
      재물운: String(rawResult?.재물운 || ""),
      애정운: String(rawResult?.애정운 || ""),
      건강운: String(rawResult?.건강운 || ""),
      직업운: String(rawResult?.직업운 || ""),
      행운정보: rawResult?.행운정보 || luckyDefault,
      총조언: String(rawResult?.총조언 || "")
    };
  }

  if (serviceId === "couple") {
    return {
      궁합점수: Number(rawResult?.궁합점수 || 0),
      궁합총평: String(rawResult?.궁합총평 || ""),
      첫만남의기운: String(rawResult?.첫만남의기운 || ""),
      연애운: String(rawResult?.연애운 || ""),
      결혼운: String(rawResult?.결혼운 || ""),
      갈등포인트: String(rawResult?.갈등포인트 || ""),
      극복방법: String(rawResult?.극복방법 || ""),
      재물궁합: String(rawResult?.재물궁합 || ""),
      최고의순간: String(rawResult?.최고의순간 || ""),
      총조언: String(rawResult?.총조언 || "")
    };
  }

  if (serviceId === "name") {
    return {
      이름분석: String(rawResult?.이름분석 || ""),
      이름의기운: String(rawResult?.이름의기운 || ""),
      오행균형: String(rawResult?.오행균형 || ""),
      이름이주는운세: String(rawResult?.이름이주는운세 || ""),
      개명추천여부: String(rawResult?.개명추천여부 || ""),
      추천이름3개: Array.isArray(rawResult?.추천이름3개) ? rawResult.추천이름3개 : [],
      추천이름이유: String(rawResult?.추천이름이유 || "")
    };
  }

  const basicLucky = {
    행운의색: String(rawResult?.행운의색 || ""),
    행운의숫자: String(rawResult?.행운의숫자 || ""),
    행운의방향: String(rawResult?.행운의방향 || "")
  };

  return {
    총평: String(rawResult?.총평 || ""),
    오늘의운세: String(rawResult?.오늘의운세 || ""),
    이번달운세: String(rawResult?.이번달운세 || ""),
    오늘의조언: String(rawResult?.오늘의조언 || ""),
    행운의색: basicLucky.행운의색,
    행운의숫자: basicLucky.행운의숫자,
    행운의방향: basicLucky.행운의방향,
    행운정보: {
      색상: basicLucky.행운의색,
      숫자: basicLucky.행운의숫자,
      방향: basicLucky.행운의방향
    }
  };
}

async function finalizeAnalysisResult(userInfo, resultJSON) {
  const payload = {
    serviceId: userInfo.serviceId,
    serviceName: userInfo.service,
    customerName: userInfo.name,
    result: resultJSON
  };

  const insertedId = await saveResultToSupabase(userInfo, payload);
  localStorage.setItem("lastFortuneResult", JSON.stringify(payload));
  localStorage.setItem("lastUserInfo", JSON.stringify(userInfo));
  if (insertedId) {
    localStorage.setItem("lastResultId", String(insertedId));
  }

  // alert(`${userInfo.service || "사주"} 분석이 완료되었습니다! 리포트 페이지로 이동합니다.`);
  if (insertedId) {
    window.location.href = `result.html?id=${insertedId}`;
    return;
  }
  alert("데이터베이스 저장에 실패했습니다. 관리자에게 문의해주세요.");
}

function createMockAnalysisResult(userInfo) {
  const serviceId = userInfo.serviceId || "basic";
  const partnerName = userInfo.partner?.name || "상대방";

  if (serviceId === "premium") {
    return {
      총평: `${userInfo.name}님은 올해 안정과 성장의 균형을 잘 잡으면 성과가 크게 열리는 흐름입니다. 준비한 것들이 점차 결실로 이어질 가능성이 높습니다.`,
      타고난기질: `${userInfo.name}님은 신중함과 추진력을 함께 갖춘 유형으로, 중요한 순간에 집중력이 높게 발휘됩니다.`,
      오행분석: "목화토금수 기운이 전반적으로 균형을 이루지만 화의 기운이 상대적으로 강해 추진력과 표현력이 돋보입니다.",
      "2026년운세": "2026년은 기반을 다지며 확장하는 해입니다. 상반기에는 정비, 하반기에는 도약 흐름이 강화됩니다.",
      상반기운세: "1~6월은 계획 수립과 관계 정리가 핵심입니다. 장기 목표의 기준을 세우면 하반기 성과가 더 커집니다.",
      하반기운세: "7~12월은 실행과 수확 구간입니다. 쌓아온 신뢰와 실력이 좋은 기회로 연결되기 쉽습니다.",
      월별운세: {
        "1월": "기반 점검과 우선순위 설정이 유리한 달입니다.",
        "2월": "협업운이 좋아 조력자를 만나기 쉽습니다.",
        "3월": "작은 성과가 자신감으로 이어지는 시기입니다.",
        "4월": "조정과 타협 능력이 빛을 발합니다.",
        "5월": "실무 집중력이 높아지는 시기입니다.",
        "6월": "중간 점검으로 방향을 미세 조정하면 좋습니다.",
        "7월": "확장 운이 시작되며 기회가 늘어납니다.",
        "8월": "주변 평가가 좋아지고 신뢰가 강화됩니다.",
        "9월": "재물 흐름이 개선되고 실속이 생깁니다.",
        "10월": "관계운이 좋아 중요한 만남이 생깁니다.",
        "11월": "누적된 노력이 결과로 나타납니다.",
        "12월": "한 해를 정리하며 다음 도약 기반을 만듭니다."
      },
      재물운: "현금흐름 관리와 분산 전략이 안정성을 높입니다.",
      애정운: "감정 표현을 구체적으로 하면 관계 만족도가 상승합니다.",
      건강운: "수면 리듬과 소화기 관리가 핵심입니다.",
      직업운: "중장기 프로젝트에서 강점이 살아나는 흐름입니다.",
      행운정보: { 행운의색: "골드", 행운의숫자: "9", 행운의방향: "동남", 행운의음식: "따뜻한 차", 조심할달: "8월" },
      총조언: `${userInfo.name}님, 속도보다 방향을 선택하면 큰 성장을 만들 수 있습니다. 꾸준함이 올해 최고의 무기가 됩니다.`
    };
  }

  if (serviceId === "couple") {
    return {
      궁합점수: 87,
      궁합총평: `${userInfo.name}님과 ${partnerName}님은 서로의 부족한 부분을 채워주는 상호보완형 궁합입니다.`,
      첫만남의기운: "첫인상에서 끌림과 호기심이 함께 작동하는 기운입니다.",
      연애운: "감정 표현 방식만 맞추면 애정 흐름이 안정적입니다.",
      결혼운: "생활 패턴 조율이 선행되면 결혼운이 빠르게 좋아집니다.",
      갈등포인트: "기대치를 말하지 않고 추측하는 습관이 충돌을 만듭니다.",
      극복방법: "주 1회 감정 체크 대화를 고정하면 갈등이 크게 줄어듭니다.",
      재물궁합: "역할 분담을 명확히 하면 함께 만드는 재물운이 상승합니다.",
      최고의순간: "공동 목표를 세우고 함께 실행할 때 관계 에너지가 최고조입니다.",
      총조언: `${userInfo.name}님과 ${partnerName}님은 대화 규칙만 세우면 장기적으로 매우 안정적인 커플입니다.`
    };
  }

  if (serviceId === "name") {
    return {
      이름분석: `${userInfo.name}님 이름은 신뢰감과 안정감을 주는 인상이 강합니다.`,
      이름의기운: "초반은 신중, 후반은 추진력이 살아나는 기운입니다.",
      오행균형: "화/토 기운이 상대적으로 강하며 수 기운 보완이 좋습니다.",
      이름이주는운세: "대인 신뢰 기반의 기회가 점진적으로 늘어납니다.",
      개명추천여부: "현재 이름 유지 권장",
      추천이름3개: ["서윤", "지안", "하준"],
      추천이름이유: "세 이름 모두 안정과 성장의 기운이 조화를 이루며, 발음 에너지가 부드러워 대인운 보완에 도움이 됩니다."
    };
  }

  return {
    총평: `${userInfo.name}님의 기본 흐름은 안정적이며 점진적 상승 운입니다.`,
    오늘의운세: "중요한 선택은 오전보다 오후에 판단하면 유리합니다.",
    이번달운세: "관계운과 실무운이 함께 올라오는 한 달입니다.",
    행운의색: "골드 - 자신감과 집중력을 강화하는 색입니다.",
    행운의숫자: "7 - 직관과 균형 감각을 높이는 숫자입니다.",
    행운의방향: "동남 - 기회와 협력 흐름이 열리는 방향입니다.",
    오늘의조언: "1. 중요한 결정은 한 번 더 검토하세요. 2. 대화에서 결론을 명확히 하세요. 3. 지출은 우선순위를 정해 관리하세요. 4. 짧은 산책으로 컨디션을 조절하세요. 5. 오늘의 작은 성공을 기록하세요."
  };
}

async function saveResultToSupabase(userInfo, resultPayload) {
  const client = getSupabaseClient();
  if (!client || SUPABASE_KEY === "YOUR_SUPABASE_ANON_KEY") {
    return null;
  }

  const sharedPayload = {
    user_email: userInfo.email,
    user_name: userInfo.name,
    user_phone: userInfo.phone || null,
    service_type: userInfo.service || userInfo.serviceId || "사주분석",
    payment_id: userInfo.paymentId || `pid_${Date.now()}`,
    result_json: resultPayload,
    created_at: new Date().toISOString()
  };

  // Admin 대시보드 호환용 테이블
  const { error: adminInsertError } = await client
    .from("fortune_results")
    .insert([sharedPayload]);

  if (adminInsertError) {
    console.warn("fortune_results 저장 실패(계속 진행):", adminInsertError.message);
  }

  // 결과 페이지 조회용 테이블(기존 동작 유지)
  const { data, error } = await client
    .from("saju_results")
    .insert([sharedPayload])
    .select("id")
    .single();

  if (error) {
    console.error("결과 저장 실패:", error);
    return null;
  }
  return data?.id || null;
}

/**
 * [디버깅용] DB 연결 및 입력 테스트 버튼 생성
 * 화면 우측 하단에 빨간 버튼을 띄웁니다.
 */
function createDBTestButton() {
  const btn = document.createElement("button");
  btn.innerText = "DB 입력 테스트 (fortune_results)";
  btn.style.cssText = "position:fixed; bottom:20px; right:20px; z-index:99999; padding:12px 18px; background:#ef4444; color:white; font-weight:bold; border-radius:30px; border:2px solid #fff; cursor:pointer; box-shadow:0 4px 10px rgba(0,0,0,0.3);";
  
  btn.onclick = async () => {
    const client = getSupabaseClient();
    if (!client) {
      alert("Supabase 클라이언트가 초기화되지 않았습니다.");
      return;
    }
    
    const dummyData = {
      user_name: "테스트맨",
      user_email: "test@fake.com",
      user_phone: "010-0000-0000",
      service_type: "SYSTEM_TEST",
      payment_id: "test_" + Date.now(),
      result_json: { msg: "가짜 데이터 입력 테스트 성공", time: new Date().toLocaleString() },
      created_at: new Date().toISOString()
    };
    
    alert("가짜 데이터 입력을 시도합니다...");
    const { data, error } = await client.from("fortune_results").insert([dummyData]).select();
    
    if (error) {
      console.error("DB 테스트 실패:", error);
      alert(`[입력 실패]\n에러 내용: ${error.message}\n\n(Supabase 테이블 권한(RLS) 설정을 확인해주세요)`);
    } else {
      alert("✅ [입력 성공]\n데이터가 정상적으로 저장되었습니다.\nAdmin 대시보드를 새로고침하여 확인해보세요.");
    }
  };
  
  document.body.appendChild(btn);
}

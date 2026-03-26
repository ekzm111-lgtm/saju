export type ServiceIconName =
  | "flow"
  | "love"
  | "wealth"
  | "time"
  | "shield"
  | "spark"
  | "07";

export type ServiceDefinition = {
  slug: string;
  title: string;
  shortTitle: string;
  price: number;
  priceLabel: string;
  description: string;
  summary: string;
  popular: boolean;
  icon: ServiceIconName;
  accent: string;
  includes: string[];
  sampleQuestion: string;
  result: {
    headline: string;
    summary: string;
    highlights: Array<{
      title: string;
      body: string;
      icon: ServiceIconName;
    }>;
    actions: string[];
  };
};

export const serviceCards: ServiceDefinition[] = [
  {
    slug: "general-flow",
    title: "총운 리포트",
    shortTitle: "총운",
    price: 9900,
    priceLabel: "9,900원",
    description: "오늘의 흐름과 전반적인 운세를 가볍고 명확하게 정리해드립니다.",
    summary: "이번 시기의 전체 흐름을 빠르게 확인하고 싶은 분께 어울리는 기본 리포트입니다.",
    popular: false,
    icon: "flow",
    accent: "균형과 방향",
    includes: ["전반 흐름", "주의 시기", "감정 요약", "실행 포인트"],
    sampleQuestion: "지금 중요한 선택을 앞두고 있는데 전체 흐름이 어떤지 궁금해요.",
    result: {
      headline: "당신의 흐름은 무리하지 않을수록 더 선명해집니다",
      summary:
        "지금은 급하게 결론을 내리기보다 방향을 정리하고 우선순위를 세울수록 좋은 결과로 이어지는 시기입니다.",
      highlights: [
        {
          title: "총운 흐름",
          body: "새로운 확장보다 현재 가진 것을 정리하고 안정적으로 다듬는 흐름이 강하게 들어와 있습니다.",
          icon: "flow"
        },
        {
          title: "주의 사인",
          body: "결정을 서두르면 작은 오해가 커질 수 있어, 중요한 대화는 한 템포 쉬고 정리하는 편이 좋습니다.",
          icon: "shield"
        },
        {
          title: "타이밍",
          body: "이번 주 후반부터 점차 흐름이 가벼워지므로, 중요한 제안은 주말 전후로 검토하는 것이 유리합니다.",
          icon: "time"
        }
      ],
      actions: [
        "중요한 결정은 이번 주 초반보다 후반에 다시 검토해보세요.",
        "새로 시작하는 일보다 기존 선택을 다듬는 방식이 잘 맞습니다.",
        "감정 소모가 큰 관계는 잠시 거리를 두는 편이 도움이 됩니다."
      ]
    }
  },
  {
    slug: "love-deep",
    title: "연애운 심층 해석",
    shortTitle: "연애운",
    price: 19900,
    priceLabel: "19,900원",
    description: "관계의 흐름, 감정의 거리, 상대 반응까지 더 깊고 섬세하게 읽어드립니다.",
    summary: "감정선과 관계 방향을 구체적으로 보고 싶은 분에게 가장 잘 맞는 인기 리포트입니다.",
    popular: true,
    icon: "love",
    accent: "감정과 반응",
    includes: ["상대 반응 흐름", "감정 밀도 분석", "연락 타이밍", "관계 행동 조언"],
    sampleQuestion: "연락을 이어가도 될지, 지금은 기다리는 게 맞는지 궁금해요.",
    result: {
      headline: "감정은 깊지만 표현의 온도 조절이 필요한 시기입니다",
      summary:
        "마음은 이미 움직이고 있지만 관계는 서두르기보다 흐름을 읽고 반응을 확인할수록 안정적으로 이어질 가능성이 높습니다.",
      highlights: [
        {
          title: "연애 사인",
          body: "지금은 감정을 강하게 표현하기보다 상대의 반응 템포를 읽는 것이 관계를 더 오래 가져가게 해줍니다.",
          icon: "love"
        },
        {
          title: "주의 사인",
          body: "확신 없는 표현이나 애매한 태도는 오해를 만들 수 있어, 표현은 부드럽고 짧게 가져가는 편이 좋습니다.",
          icon: "shield"
        },
        {
          title: "타이밍",
          body: "이번 주말 이후로 감정 흐름이 부드럽게 열릴 가능성이 있어, 중요한 대화는 그 시기가 좋습니다.",
          icon: "time"
        }
      ],
      actions: [
        "답을 서두르기보다 상대의 리듬을 먼저 관찰해보세요.",
        "감정 표현은 강도보다 톤을 부드럽게 조절해보세요.",
        "중요한 메시지는 늦은 밤보다 이른 저녁에 보내는 쪽이 낫습니다."
      ]
    }
  },
  {
    slug: "wealth-insight",
    title: "재물운 분석",
    shortTitle: "재물운",
    price: 14900,
    priceLabel: "14,900원",
    description: "금전 흐름과 지출 패턴을 중심으로 안정적인 판단 기준을 제안합니다.",
    summary: "수입과 지출의 균형을 다시 잡고 싶은 분께 추천하는 실전형 리포트입니다.",
    popular: false,
    icon: "wealth",
    accent: "정리와 축적",
    includes: ["수입 흐름", "지출 사인", "리스크 구간", "금전 행동 제안"],
    sampleQuestion: "최근 지출이 많아졌는데 앞으로 어떻게 정리해야 할지 궁금해요.",
    result: {
      headline: "큰 기회보다 작은 정리가 더 큰 차이를 만드는 때입니다",
      summary:
        "지금은 새로운 수입보다 기존 구조를 정리할수록 안정감이 커집니다. 반복 지출과 충동 소비를 줄이는 것이 핵심입니다.",
      highlights: [
        {
          title: "재물 흐름",
          body: "돈이 들어오는 속도보다 빠져나가는 구멍을 막을수록 체감 안정감이 커지는 시기입니다.",
          icon: "wealth"
        },
        {
          title: "주의 사인",
          body: "분위기에 휩쓸린 지출이나 단기 수익 기대형 결정은 만족감보다 피로감을 남길 수 있습니다.",
          icon: "shield"
        },
        {
          title: "타이밍",
          body: "이번 달 안으로 정리 효과가 커지므로, 자동 결제나 반복 지출부터 손보는 것이 좋습니다.",
          icon: "time"
        }
      ],
      actions: [
        "반복 지출을 먼저 정리하고 신규 소비는 일주일 정도 미뤄보세요.",
        "단기 수익 기대보다 안정적인 구조를 우선해보세요.",
        "큰 지출 앞에서는 하루 정도 다시 생각하는 시간을 두는 편이 좋습니다."
      ]
    }
  }
];

export const featureCards = [
  {
    title: "정교한 AI 해석",
    description: "연애, 재물, 직장, 총운까지 여러 축으로 읽어내는 프리미엄 해석 경험을 제공합니다."
  },
  {
    title: "결제 후 즉시 확인",
    description: "복잡한 절차 없이 결제 직후 결과 페이지로 이동해 바로 흐름을 볼 수 있습니다."
  },
  {
    title: "모바일 최적화",
    description: "이동 중에도 편하게 보고, 나중에 다시 확인할 수 있도록 모바일 중심으로 설계했습니다."
  }
];

export const exampleTabs = [
  {
    label: "연애운",
    title: "지금의 감정보다 흐름을 읽어야 하는 시기",
    description:
      "이번 주는 급하게 결론을 내리기보다 상대의 반응과 템포를 먼저 읽는 편이 더 좋은 결과로 이어집니다."
  },
  {
    label: "재물운",
    title: "작은 기회를 좇기보다 구조를 정리할 때",
    description:
      "당장 눈앞의 수익보다 현재의 지출 구조를 정리할수록 심리적 안정감과 실제 여유가 커집니다."
  },
  {
    label: "총운",
    title: "방향을 세우면 흐름이 따라오는 구간",
    description:
      "확장 속도가 빠르지 않아도 선택 기준이 분명하면 이후의 결과는 훨씬 또렷해질 수 있습니다."
  }
];

export const reviews = [
  {
    author: "김OO",
    content: "가볍게 봤는데 생각보다 해석이 정교해서 놀랐어요. 특히 연애운 흐름 부분이 정말 잘 맞았습니다."
  },
  {
    author: "박OO",
    content: "결제하고 바로 결과를 볼 수 있어서 편했고, 모바일에서도 읽기 좋게 정리되어 있었어요."
  },
  {
    author: "최OO",
    content: "너무 자극적인 말투가 아니라 차분하게 읽히는 점이 좋았고, 다시 볼수록 설득력이 있었습니다."
  }
];

export const faqs = [
  {
    question: "결제 후 바로 결과를 볼 수 있나요?",
    answer: "네. 결제 완료 후 즉시 결과 페이지로 이동하며, 바로 내용을 확인할 수 있습니다."
  },
  {
    question: "모바일에서도 문제 없이 사용할 수 있나요?",
    answer: "네. 모든 주요 흐름은 모바일 우선으로 설계되어 작은 화면에서도 편하게 확인할 수 있습니다."
  },
  {
    question: "결과는 나중에 다시 볼 수 있나요?",
    answer: "주문 정보 기준으로 다시 확인할 수 있도록 연결하는 방향을 기본으로 설계하고 있습니다."
  }
];

export const premiumStats = [
  {
    value: "24H",
    label: "언제든 모바일로 확인"
  },
  {
    value: "3 MIN",
    label: "결제 후 빠른 결과 확인"
  },
  {
    value: "AI + SAJU",
    label: "현대적 UX와 사주 해석의 결합"
  }
];

export function getServiceBySlug(slug?: string | null) {
  return serviceCards.find((service) => service.slug === slug) ?? serviceCards[1];
}

export function formatPrice(price: number) {
  return `${price.toLocaleString("ko-KR")}원`;
}

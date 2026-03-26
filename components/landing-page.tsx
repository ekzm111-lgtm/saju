import Image from "next/image";
import Link from "next/link";

import heroNew from "@/img/hero_new.png";
import feature1 from "@/img/feature_1.png";
import reviewImage from "@/img/review.png";
import serviceImage from "@/img/service.png";
import resultCardImage from "@/img/result-card.png";
import { SajuIcon } from "@/components/saju-icons";
import {
  exampleTabs,
  faqs,
  featureCards,
  premiumStats,
  reviews,
  serviceCards
} from "@/data/site-content";
import { StarBackground } from "@/components/star-background";

export function LandingPage() {
  return (
    <main className="page-shell">
      <StarBackground />
      
      <header className="site-header reveal">
        <Link href="#top" className="brand" style={{ color: 'var(--gold)' }}>
          MEMORY <span style={{ color: 'var(--white)' }}>FORTUNE</span> AI
        </Link>
        <nav className="desktop-nav" aria-label="주요 메뉴">
          <a href="#services">서비스</a>
          <a href="#examples">이용방법</a>
          <a href="#reviews">고객후기</a>
          <a href="#faq">문의하기</a>
          <Link href="/history" style={{ marginLeft: '15px', color: 'var(--gold)', fontSize: '0.9rem', opacity: 0.8 }}>나의 리포트</Link>
        </nav>
        <Link href="/payment" className="btn-cta">
          지금 시작하기
        </Link>
      </header>

      <section className="hero-section section" id="top" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero-visual">
          <Image src={heroNew} alt="AI Saju Cosmic Hero" fill priority className="hero-image" style={{ objectFit: 'cover', opacity: 0.6 }} />
          <div className="hero-gradient-overlay" />
        </div>
        
        <div className="hero-inner reveal" style={{ zIndex: 3, width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
          <div className="hero-copy" style={{ margin: '0 auto' }}>
            <div className="hero-kicker" style={{ color: 'var(--gold)', letterSpacing: '0.5em', fontWeight: 700, marginBottom: '20px' }}>
              MEMORY AI ENGINE v2.0
            </div>
            <h1 className="hero-title title-lg" style={{ color: 'var(--white)', marginBottom: '30px' }}>
              당신의 <span style={{ color: 'var(--gold)' }}>운명</span>을<br />
              별이 말하다.
            </h1>
            <p className="hero-text" style={{ color: 'var(--text-ivory)', margin: '0 auto 40px', maxWidth: '700px', opacity: 0.9 }}>
              동양의 고전 사주명리학과 최첨단 AI 알고리즘의 결합.<br />
              당신의 삶을 바꾸는 정교한 데이터를 30초 만에 만나보세요.
            </p>
            <div className="hero-actions" style={{ justifyContent: 'center' }}>
              <Link href="/payment" className="btn-gold-fill">
                <span>운명 리포트 확인하기</span>
                <div style={{ width: '20px', height: '20px' }}>
                  <SajuIcon name="spark" className="btn-icon" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section stats-section reveal">
        <div className="content-grid stats-grid">
          {premiumStats.map((stat, idx) => (
            <div className={`stat-item glass-card reveal delay-${(idx % 3) + 1}`} key={idx}>
              <div className="stat-val text-grad">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section feature-section reveal">
        <div className="content-grid">
          <div className="section-head centered">
            <span className="eyebrow">Excellence</span>
            <h2 className="title-md">압도적인 <span className="text-grad">핵심 가치</span></h2>
          </div>
          
          <div className="bento-grid">
            <div className="bento-item main-feature glass-card reveal delay-1">
              <div className="bento-content">
                <h3>{featureCards[0].title}</h3>
                <p>{featureCards[0].description}</p>
              </div>
              <div className="bento-visual">
                <Image src={feature1} alt="Bento Feature" className="visual-img" />
              </div>
            </div>
            
            <div className="bento-column">
              <div className="bento-item glass-card small-feature reveal delay-2">
                <SajuIcon name="time" className="bento-icon text-primary" />
                <h3>{featureCards[1].title}</h3>
                <p>{featureCards[1].description}</p>
              </div>
              <div className="bento-item glass-card small-feature reveal delay-3">
                <SajuIcon name="shield" className="bento-icon text-secondary" />
                <h3>{featureCards[2].title}</h3>
                <p>{featureCards[2].description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section service-section" id="services">
        <div className="content-grid">
          <div className="section-head centered">
            <span className="eyebrow">Service</span>
            <h2 className="title-lg">당신을 위한 <span className="text-accent">운명 설계서</span></h2>
            <p className="subtitle">해결하고 싶은 고민에 따라 가장 적합한 분석을 선택하세요.</p>
          </div>
          
          <div className="service-cards-grid">
            {serviceCards.map((card) => (
              <div className={`service-card-v2 glass-card ${card.popular ? 'popular' : ''}`} key={card.slug}>
                {card.popular && <div className="pop-badge">Most Popular</div>}
                <div className="card-top">
                  <div className="icon-box">
                    <SajuIcon name={card.icon} className="svc-icon" />
                  </div>
                  <h3 className="svc-title">{card.title}</h3>
                </div>
                <p className="svc-desc">{card.description}</p>
                <div className="svc-tags">
                  {card.includes.slice(0, 3).map(tag => (
                    <span key={tag} className="s-tag">{tag}</span>
                  ))}
                </div>
                <div className="card-bottom">
                  <div className="price-info">
                    <span className="p-label">분석 비용</span>
                    <span className="p-val">{card.priceLabel}</span>
                  </div>
                  <Link href={`/payment?service=${card.slug}`} className="svc-btn cosmic-btn">
                    시작하기
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section samples-section" id="examples">
        <div className="content-grid sample-layout">
          <div className="sample-copy">
            <span className="eyebrow">Next Gen Report</span>
            <h2 className="title-lg">가독성을 넘어선<br /><span className="text-grad">감각적인 리포트</span></h2>
            <p className="text-display">사주명인의 분석은 단순히 글자를 나열하지 않습니다. 당신의 운명을 한눈에 조망할 수 있는 시각화 기술이 더해집니다.</p>
            
            <div className="example-box glass-panel">
              <div className="tab-pill-row">
                {exampleTabs.map((tab, idx) => (
                  <span key={tab.label} className={`tab-pill ${idx === 0 ? 'active' : ''}`}>{tab.label}</span>
                ))}
              </div>
              <h3 className="example-title">{exampleTabs[0].title}</h3>
              <p className="example-desc">{exampleTabs[0].description}</p>
              <Link href="/result" className="text-action">전체 샘플 확인하기 →</Link>
            </div>
          </div>
          <div className="sample-visual">
            <div className="visual-container">
              <Image src={resultCardImage} alt="Sample Report" className="sample-img" />
              <div className="visual-glow" />
            </div>
          </div>
        </div>
      </section>

      <section className="section reviews-section" id="reviews">
        <div className="content-grid reveal">
          <div className="section-head centered">
            <h2 className="title-md">이미 수천 명이 <span className="text-grad">삶의 궤적</span>을 바꿨습니다</h2>
          </div>
          <div className="review-carousel reveal delay-1">
            {reviews.map((rev, i) => (
              <div className="review-card-v2 glass-card" key={i}>
                <div className="stars">★★★★★</div>
                <p className="rev-text">"{rev.content}"</p>
                <div className="rev-author">— {rev.author}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section final-cta reveal">
        <div className="content-grid">
          <div className="cta-box glass-card centered animate-glow">
            <h2 className="title-lg">당신의 내일은<br />오늘보다 빛날 자격이 있습니다</h2>
            <p>Memory AI Engine이 전하는 가장 과학적인 조언을 지금 확인하세요.</p>
            <Link href="/payment" className="prime-btn large">
              지금 바로 분석 시작하기
            </Link>
          </div>
        </div>
      </section>

      <footer className="site-footer-v2 reveal">
        <div className="content-grid footer-grid">
          <div className="f-info">
            <h3 className="brand" style={{ color: 'var(--gold)' }}>
              MEMORY <span style={{ color: 'var(--white)' }}>FORTUNE</span> AI
            </h3>
            <p style={{ color: 'var(--text-muted)' }}>데이터 협업 지능 기반의 차세대 운세 분석 플랫폼</p>
          </div>
          <div className="f-links">
            <div className="link-col">
              <h4>Platform</h4>
              <Link href="/terms">이용약관</Link>
              <Link href="/privacy">개인정보처리방침</Link>
            </div>
            <div className="link-col">
              <h4>Contact</h4>
              <p>support@memory-fortune.ai</p>
              <p>02-765-4321</p>
            </div>
          </div>
        </div>
        <div className="f-bottom">
          <p>© 2026 Memory Fortune AI. All rights reserved.</p>
        </div>
      </footer>

      <Link href="/payment" className="sticky-mobile-btn">
        <span>지금 분석하기</span>
      </Link>
    </main>
  );
}

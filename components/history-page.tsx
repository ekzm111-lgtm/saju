"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { StarBackground } from "@/components/star-background";
import { SajuIcon } from "@/components/saju-icons";

type HistoryItem = {
  id: string;
  title: string;
  date: string;
};

export function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("fortune_history");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <main className="subpage-shell cosmic-theme">
      <StarBackground />
      
      <header className="subpage-header">
        <Link href="/" className="brand">
          MEMORY <span className="text-grad">FORTUNE</span> AI
        </Link>
        <Link href="/payment" className="btn-gold-fill">새 리포트 만들기</Link>
      </header>

      <section className="section history-section centered" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="content-grid" style={{ maxWidth: '800px', width: '100%' }}>
          <div className="section-head">
            <h1 className="title-lg text-grad">나의 운명 리포트 기록</h1>
            <p className="hero-text">지금까지 확인하신 소중한 운명의 기록들입니다.</p>
          </div>

          <div className="history-list" style={{ marginTop: '40px' }}>
            {history.length > 0 ? (
              history.map((item) => (
                <Link href={`/result?orderId=${item.id}`} key={item.id} className="history-item glass-card reveal">
                  <div className="h-meta">
                    <span className="h-date">{formatDate(item.date)}</span>
                    <h3>{item.title}</h3>
                  </div>
                  <div className="h-action">
                    <span>다시보기</span>
                    <SajuIcon name="spark" className="h-icon" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="empty-history glass-card centered" style={{ padding: '60px' }}>
                <p style={{ opacity: 0.6, fontSize: '1.2rem' }}>아직 생성된 리포트가 없습니다.</p>
                <Link href="/payment" className="btn-gold-fill" style={{ marginTop: '30px' }}>첫 분석 시작하기</Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <style jsx>{`
        .history-list { display: flex; flexDirection: column; gap: 20px; }
        .history-item { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          padding: 25px 40px; 
          text-decoration: none; 
          transition: all 0.3s ease;
          border: 1px solid rgba(212, 175, 55, 0.1);
        }
        .history-item:hover { 
          transform: translateY(-5px); 
          border-color: var(--gold); 
          background: rgba(212, 175, 55, 0.05); 
        }
        .h-meta h3 { color: #fff; margin-top: 5px; font-size: 1.4rem; }
        .h-date { color: var(--gold); font-size: 0.9rem; opacity: 0.8; }
        .h-action { display: flex; align-items: center; gap: 15px; color: var(--gold); font-weight: bold; }
        .h-icon { width: 24px; height: 24px; }
      `}</style>

      <footer className="site-footer-v2">
        <div className="content-grid">
          <p>© 2026 AI Saju Myeongin. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

'use client'
import { useState, useEffect, useCallback } from 'react'

const slides = [
  {
    id: 0,
    bg: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    accent: '#4a90d9',
    heading: 'সবার জন্য উন্মুক্ত শিক্ষা',
    sub: 'বাংলাদেশ সরকারের বিনামূল্যে অনলাইন শিক্ষা প্ল্যাটফর্ম',
    visual: (
      <svg width="100%" height="100%" viewBox="0 0 560 360" fill="none">
        <path d="M 120 180 Q 280 60 440 180 T 120 180" fill="rgba(255,255,255,0.05)" />
        <circle cx="280" cy="180" r="80" stroke="#4a90d9" strokeWidth="2" strokeDasharray="8 8" fill="transparent" />
        <rect x="256" y="156" width="48" height="48" rx="12" fill="#4a90d9" />
        <path d="M 274 180 L 286 180 M 280 174 L 280 186" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 1,
    bg: 'linear-gradient(135deg, #0d1b0f 0%, #1a3820 50%, #0d2b1a 100%)',
    accent: '#5ab87a',
    heading: 'বিশেষজ্ঞ শিক্ষকদের সাথে শিখুন',
    sub: 'দেশের সেরা শিক্ষকদের ভিডিও লেকচার এখন আপনার হাতের মুঠোয়',
    visual: (
      <svg width="100%" height="100%" viewBox="0 0 560 360" fill="none">
        <rect x="80" y="80" width="400" height="200" rx="24" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <path d="M 140 220 L 220 120 L 300 180 L 420 100" stroke="#5ab87a" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="420" cy="100" r="6" fill="#5ab87a" />
      </svg>
    ),
  },
  {
    id: 2,
    bg: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #1a0f3a 100%)',
    accent: '#a78bfa',
    heading: 'পরীক্ষার প্রস্তুতি নিন ঘরে বসে',
    sub: 'প্রাথমিক থেকে উচ্চ মাধ্যমিক – সব শ্রেণির জন্য সম্পূর্ণ গাইড',
    visual: (
      <svg width="100%" height="100%" viewBox="0 0 560 360" fill="none">
        <circle cx="280" cy="180" r="120" fill="rgba(255,255,255,0.02)" />
        <circle cx="280" cy="180" r="90" fill="rgba(255,255,255,0.03)" />
        <circle cx="280" cy="180" r="60" fill="rgba(255,255,255,0.04)" />
        <path d="M 265 160 L 305 180 L 265 200 Z" fill="#a78bfa" />
      </svg>
    ),
  },
]

export default function HeroSection() {
  const [active, setActive] = useState(0)
  const [animating, setAnimating] = useState(false)

  const goTo = useCallback((idx: number) => {
    if (animating) return
    setAnimating(true)
    setTimeout(() => {
      setActive(idx)
      setAnimating(false)
    }, 300)
  }, [animating])

  // Auto-play every 5s
  useEffect(() => {
    const t = setInterval(() => goTo((active + 1) % slides.length), 5000)
    return () => clearInterval(t)
  }, [active, goTo])

  const slide = slides[active]

  return (
    <section style={{
      width: '100%',
      height: '100vh',
      minHeight: 600,
      background: slide.bg,
      transition: 'background 600ms ease',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 60% 50% at 70% 40%, ${slide.accent}18 0%, transparent 70%)`,
        transition: 'background 600ms ease',
      }} />

      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 48,
        alignItems: 'center',
        width: '100%',
        maxWidth: 1160,
        padding: '0 32px',
        opacity: animating ? 0 : 1,
        transform: animating ? 'translateY(12px)' : 'translateY(0)',
        transition: 'opacity 350ms ease, transform 350ms ease',
      }}>
        {/* Left – Text */}
        <div>
          <h1 className="h1" style={{
            color: '#ffffff',
            fontFamily: "'Anek Bangla', sans-serif",
            marginBottom: 20,
          }}>
            {slide.heading}
          </h1>
          <p className="body-lg" style={{
            color: 'rgba(255,255,255,0.65)',
            fontFamily: "'Anek Bangla', sans-serif",
            marginBottom: 36,
            maxWidth: 420,
          }}>
            {slide.sub}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="btn-primary" style={{
              background: `linear-gradient(135deg, ${slide.accent}, ${slide.accent}bb)`,
              boxShadow: `0 8px 28px ${slide.accent}40`,
              fontSize: 16, padding: '13px 32px',
            }}>
              শুরু করুন
            </button>
            <button style={{
              background: 'rgba(255,255,255,0.10)',
              border: '1px solid rgba(255,255,255,0.20)',
              borderRadius: 40,
              padding: '13px 28px',
              fontSize: 16,
              color: 'rgba(255,255,255,0.90)',
              fontFamily: "'Anek Bangla', sans-serif",
              cursor: 'pointer',
              transition: 'all 300ms ease',
              backdropFilter: 'blur(8px)',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.10)')}
            >
              কোর্স দেখুন
            </button>
          </div>

          {/* Slide indicators */}
          <div style={{ display: 'flex', gap: 8, marginTop: 44 }}>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                style={{
                  width: i === active ? 28 : 8,
                  height: 8,
                  borderRadius: 999,
                  background: i === active ? '#ffffff' : 'rgba(255,255,255,0.30)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 300ms ease',
                }}
              />
            ))}
          </div>
        </div>

        {/* Right – Visual */}
        <div style={{
          width: '100%',
          aspectRatio: '560/360',
          borderRadius: 20,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.10)',
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(8px)',
          flexShrink: 0,
        }}>
          {slide.visual}
        </div>
      </div>

      {/* Left / Right arrow nav */}
      {(['prev','next'] as const).map(dir => (
        <button
          key={dir}
          onClick={() => goTo(dir === 'prev' ? (active - 1 + slides.length) % slides.length : (active + 1) % slides.length)}
          style={{
            position: 'absolute',
            top: '50%', transform: 'translateY(-50%)',
            [dir === 'prev' ? 'left' : 'right']: 24,
            width: 42, height: 42,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.20)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 300ms ease',
            zIndex: 10,
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            {dir === 'prev'
              ? <path d="M11 4l-5 5 5 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              : <path d="M7 4l5 5-5 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />}
          </svg>
        </button>
      ))}

      {/* Scroll hint */}
      <div style={{
        position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        opacity: 0.5,
      }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M5 8l5 5 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-visual { display: none; }
        }
      `}</style>
    </section>
  )
}

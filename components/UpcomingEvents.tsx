'use client'
import { useState, useEffect, useRef } from 'react'

const events = [
  {
    id: 0,
    title: 'জাতীয় বিজ্ঞান অলিম্পিয়াড ২০২৫',
    date: '১৫ মার্চ ২০২৫',
    venue: 'ঢাকা বিশ্ববিদ্যালয়',
    desc: 'সারাদেশের শিক্ষার্থীদের জন্য উন্মুক্ত বিজ্ঞান প্রতিযোগিতা। অংশগ্রহণ সম্পূর্ণ বিনামূল্যে।',
    color: '#3a7bd5',
    img: '/images/event_1.png',
    icon: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <circle cx="28" cy="28" r="26" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        <path d="M28 10l4 10h10l-8 6 3 10-9-6-9 6 3-10-8-6h10z" fill="rgba(255,255,255,0.85)" />
        <circle cx="28" cy="28" r="6" fill="rgba(255,255,255,0.20)" />
      </svg>
    ),
  },
  {
    id: 1,
    title: 'জাতীয় গণিত অলিম্পিয়াড ২০২৫',
    date: '২২ মার্চ ২০২৫',
    venue: 'রাজশাহী বিশ্ববিদ্যালয়',
    desc: 'মেধাবী শিক্ষার্থীদের গণিতের অসাধারণ জগতে স্বাগতম। ৬ষ্ঠ থেকে দ্বাদশ শ্রেণি পর্যন্ত।',
    color: '#8250d2',
    img: '/images/event_2.png',
    icon: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <rect x="10" y="10" width="36" height="36" rx="8" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        <text x="28" y="35" textAnchor="middle" fill="rgba(255,255,255,0.80)" fontSize="22" fontWeight="bold" fontFamily="serif">∑</text>
      </svg>
    ),
  },
  {
    id: 2,
    title: 'HSC পরীক্ষার্থী অরিয়েন্টেশন',
    date: '০৫ এপ্রিল ২০২৫',
    venue: 'অনলাইন (সরাসরি)',
    desc: '২০২৫ সালের HSC পরীক্ষার্থীদের জন্য বিশেষ অরিয়েন্টেশন। শিক্ষা বোর্ডের নির্দেশনা অনুযায়ী।',
    color: '#5ab87a',
    img: '/images/event_3.png',
    icon: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <rect x="10" y="8" width="36" height="40" rx="4" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        <path d="M18 20h20M18 28h20M18 36h12" stroke="rgba(255,255,255,0.75)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="38" cy="40" r="8" fill="rgba(255,255,255,0.15)" />
        <path d="M35 40l2 2 4-4" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

const upcoming = [
  { label: 'জাতীয় বিজ্ঞান অলিম্পিয়াড নিবন্ধন', date: '১৫ মার্চ',  eventIdx: 0 },
  { label: 'জাতীয় গণিত অলিম্পিয়াড',              date: '২২ মার্চ',  eventIdx: 1 },
  { label: 'HSC পরীক্ষার্থী অরিয়েন্টেশন',         date: '০৫ এপ্রিল', eventIdx: 2 },
  { label: 'শিক্ষক প্রশিক্ষণ কর্মশালা',            date: '০৫ এপ্রিল', eventIdx: null },
  { label: 'ডিজিটাল পাঠক্রম বাস্তবায়ন',            date: '০১ এপ্রিল', eventIdx: null },
]

export default function UpcomingEvents() {
  const [active, setActive] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setActive(a => (a + 1) % events.length), 4000)
  }

  useEffect(() => { startTimer(); return () => { if (timerRef.current) clearInterval(timerRef.current) } }, [])

  const handleSelect = (idx: number) => {
    setActive(idx)
    // pause for 6s then resume
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setTimeout(() => startTimer(), 6000) as unknown as ReturnType<typeof setInterval>
  }

  const ev = events[active]

  return (
    <section style={{ background: '#f5f5f7', padding: '0 0 64px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16 }} className="events-grid">

          {/* ── Left: Banner ── */}
          <div style={{
            borderRadius: 20, overflow: 'hidden', position: 'relative',
            height: 330,
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          }}>
            {/* Background Image */}
            <img 
              src={ev.img} 
              alt={ev.title}
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                objectFit: 'cover', zIndex: 0,
                transition: 'opacity 600ms ease',
              }}
            />
            {/* Dark overlay for text readability */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 1,
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.1) 100%)',
            }} />
            {/* Decorative circles */}
            <div style={{
              position: 'absolute', top: -40, right: -40,
              width: 200, height: 200, borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
            }} />
            <div style={{
              position: 'absolute', top: 20, right: 20,
              width: 100, height: 100, borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
            }} />

            {/* Icon top-left */}
            <div style={{ position: 'absolute', top: 28, left: 28 }}>
              {ev.icon}
            </div>

            {/* Content */}
            <div style={{ padding: '28px 32px', position: 'relative', zIndex: 2 }}>
              <div style={{
                display: 'inline-block',
                background: 'rgba(255,255,255,0.18)',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: 8, padding: '4px 12px',
                fontSize: 12, color: 'rgba(255,255,255,0.90)',
                fontFamily: "'Anek Bangla', sans-serif",
                fontWeight: 600, marginBottom: 10,
              }}>
                {ev.date} · {ev.venue}
              </div>
              <h2 style={{
                fontSize: 22, fontWeight: 800, color: 'white',
                fontFamily: "'Anek Bangla', sans-serif",
                marginBottom: 8, lineHeight: 1.3,
              }}>{ev.title}</h2>
              <p style={{
                fontSize: 13, color: 'rgba(255,255,255,0.78)',
                fontFamily: "'Anek Bangla', sans-serif",
                lineHeight: 1.6, marginBottom: 20,
              }}>{ev.desc}</p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <button style={{
                  background: 'white', border: 'none', borderRadius: 10,
                  padding: '9px 20px', cursor: 'pointer',
                  fontSize: 13, fontWeight: 700,
                  color: ev.color,
                  fontFamily: "'Anek Bangla', sans-serif",
                  transition: 'all 300ms ease',
                }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
                >
                  নিবন্ধন করুন
                </button>

                {/* Dots */}
                <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
                  {events.map((_, i) => (
                    <button key={i} onClick={() => handleSelect(i)} style={{
                      width: i === active ? 22 : 8, height: 8,
                      borderRadius: 4, border: 'none',
                      background: i === active ? 'white' : 'rgba(255,255,255,0.35)',
                      cursor: 'pointer', padding: 0,
                      transition: 'all 400ms ease',
                    }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Upcoming list ── */}
          <div className="glass" style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', height: 330 }}>
            <h3 style={{
              fontSize: 16, fontWeight: 700, color: '#1d1d1f',
              fontFamily: "'Anek Bangla', sans-serif",
              marginBottom: 16, flexShrink: 0,
            }}>আসন্ন অনুষ্ঠানসমূহ</h3>

            <div style={{
              display: 'flex', flexDirection: 'column', gap: 4,
              overflowY: 'auto', paddingRight: 6, flex: 1,
            }} className="custom-scroll">
              {upcoming.map((item, i) => {
                const isActive = item.eventIdx === active
                const accent   = item.eventIdx !== null ? events[item.eventIdx].color : '#3a7bd5'
                return (
                  <div key={i}
                    onClick={() => item.eventIdx !== null && handleSelect(item.eventIdx)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '11px 12px', borderRadius: 12,
                      cursor: item.eventIdx !== null ? 'pointer' : 'default',
                      transition: 'all 250ms ease',
                      gap: 10,
                      background: isActive ? `${accent}12` : 'transparent',
                      borderLeft: isActive ? `3px solid ${accent}` : '3px solid transparent',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#f5f5f7' }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                        background: isActive ? accent : '#aeaeb2',
                        transition: 'background 300ms',
                      }} />
                      <span style={{
                        fontSize: 13, fontWeight: isActive ? 700 : 500,
                        color: isActive ? '#1d1d1f' : '#3c3c43',
                        fontFamily: "'Anek Bangla', sans-serif",
                        lineHeight: 1.4,
                      }}>{item.label}</span>
                    </div>
                    <span style={{
                      fontSize: 12, fontWeight: 600,
                      color: isActive ? accent : '#6e6e73',
                      fontFamily: "'Anek Bangla', sans-serif",
                      whiteSpace: 'nowrap',
                      background: isActive ? `${accent}15` : 'rgba(0,0,0,0.05)',
                      borderRadius: 6, padding: '2px 8px', flexShrink: 0,
                      transition: 'all 300ms',
                    }}>{item.date}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .events-grid { grid-template-columns: 1fr !important; } }
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 4px; }
        .custom-scroll { scrollbar-width: thin; scrollbar-color: rgba(0,0,0,0.1) transparent; }
      `}</style>
    </section>
  )
}

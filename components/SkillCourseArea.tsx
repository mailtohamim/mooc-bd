'use client'
import { useState, useRef } from 'react'

const categories = [
  'ভাষা শিক্ষা', 'ফ্রিল্যান্সিং', 'বান্ডেল',
  'স্কিলস এন্ড আইটি', 'ডিজাইন', 'ক্যারিয়ার',
]

const CourseVisual = ({ accentColor, icon }: { accentColor: string; icon: React.ReactNode }) => (
  <div style={{
    width: '100%', height: 150,
    background: `linear-gradient(135deg, ${accentColor}12 0%, ${accentColor}20 100%)`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative', overflow: 'hidden',
    borderBottom: '1px solid rgba(0,0,0,0.05)',
  }}>
    <div style={{
      position: 'absolute', borderRadius: '50%',
      width: 110, height: 110,
      background: `radial-gradient(circle, ${accentColor}18 0%, transparent 70%)`,
    }} />
    {icon}
  </div>
)

const IELTSIcon = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <rect x="8" y="10" width="36" height="32" rx="4" stroke="rgba(58,123,213,0.55)" strokeWidth="2" />
    <path d="M16 20h20M16 26h14M16 32h10" stroke="rgba(58,123,213,0.65)" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)
const SpokenIcon = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <circle cx="26" cy="20" r="8" stroke="rgba(76,175,120,0.65)" strokeWidth="2" />
    <path d="M14 40c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="rgba(76,175,120,0.55)" strokeWidth="2" strokeLinecap="round" />
  </svg>
)
const LiveIcon = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <circle cx="26" cy="26" r="14" stroke="rgba(210,90,60,0.55)" strokeWidth="2" />
    <circle cx="26" cy="26" r="6" fill="rgba(210,90,60,0.60)" />
    <circle cx="26" cy="26" r="20" stroke="rgba(210,90,60,0.18)" strokeWidth="1" />
  </svg>
)
const JuniorIcon = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <rect x="12" y="16" width="28" height="22" rx="5" stroke="rgba(130,80,210,0.55)" strokeWidth="2" />
    <path d="M21 26l3 3 7-7" stroke="rgba(130,80,210,0.75)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const courses = [
  { title: 'IELTS কোর্স',            teacher: 'প্রফেসর আহমেদ হোসেন', color: '#3a7bd5', Visual: () => <CourseVisual accentColor="#3a7bd5" icon={<IELTSIcon />} /> },
  { title: 'ঘরে বসে Spoken English', teacher: 'মিস রাহেলা পারভীন',  color: '#4caf78', Visual: () => <CourseVisual accentColor="#4caf78" icon={<SpokenIcon />} /> },
  { title: 'IELTS LIVE ব্যাচ',        teacher: 'মি. করিম উদ্দিন',     color: '#d25a3c', Visual: () => <CourseVisual accentColor="#d25a3c" icon={<LiveIcon />} /> },
  { title: 'জুনিয়র Spoken English',  teacher: 'মিস সুমাইয়া খান',     color: '#8250d2', Visual: () => <CourseVisual accentColor="#8250d2" icon={<JuniorIcon />} /> },
]

export default function SkillCourseArea() {
  const [activeCat, setActiveCat] = useState(0)
  const [showAll, setShowAll] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const CARD_W = 280
  const scroll = (dir: 'prev'|'next') => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir === 'next' ? CARD_W : -CARD_W, behavior: 'smooth' })
  }

  const displayed = showAll ? courses : courses.slice(0, 4)

  return (
    <section className="section" style={{ background: '#f2f2f5' }}>
      <div className="container">

        <h2 className="h2" style={{
          color: '#1d1d1f',
          fontFamily: "'Anek Bangla', sans-serif",
          textAlign: 'center',
          marginBottom: 12,
        }}>
          স্কিল ডেভেলপমেন্ট
        </h2>

        {/* Stats */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 32,
          marginBottom: 40, flexWrap: 'wrap',
        }}>
          {['দেশসেরা শিক্ষক', '৫ লাখ+ শিক্ষার্থী', '৭০+ কোর্স'].map(text => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%',
                background: '#3a7bd5',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="body-sm" style={{ color: '#3c3c43', fontFamily: "'Anek Bangla', sans-serif" }}>
                {text}
              </span>
            </div>
          ))}
        </div>

        {/* Category buttons */}
        <div className="scroll-x" style={{ display: 'flex', gap: 8, marginBottom: 32, paddingBottom: 4 }}>
          {categories.map((cat, i) => (
            <button
              key={cat}
              onClick={() => setActiveCat(i)}
              style={{
                flexShrink: 0,
                padding: '9px 18px',
                borderRadius: 999,
                background: i === activeCat ? 'rgba(58,123,213,0.10)' : 'white',
                border: i === activeCat ? '1.5px solid #3a7bd5' : '1.5px solid rgba(0,0,0,0.10)',
                color: i === activeCat ? '#3a7bd5' : '#6e6e73',
                fontFamily: "'Anek Bangla', sans-serif",
                fontSize: 14, fontWeight: i === activeCat ? 700 : 400,
                cursor: 'pointer',
                transition: 'all 300ms ease',
                boxShadow: i === activeCat ? 'none' : '0 1px 4px rgba(0,0,0,0.04)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Course cards header with arrows */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 12 }}>
          {(['prev','next'] as const).map(dir => (
            <button key={dir} onClick={() => scroll(dir)} style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'white', border: '1.5px solid rgba(0,0,0,0.10)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 250ms ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f0f4ff'; e.currentTarget.style.borderColor = '#3a7bd5' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.10)' }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                {dir === 'prev'
                  ? <path d="M9 3L5 7l4 4" stroke="#3a7bd5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  : <path d="M5 3l4 4-4 4" stroke="#3a7bd5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />}
              </svg>
            </button>
          ))}
        </div>

        {/* Course cards */}
        <div ref={scrollRef} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
        }} className="course-grid">
          {displayed.map(({ title, teacher, color, Visual }) => (
            <div
              key={title}
              className="glass hover-lift"
              style={{
                overflow: 'hidden', cursor: 'pointer',
                background: 'rgba(255,255,255,0.70)',
                display: 'flex', flexDirection: 'column',
                scrollSnapAlign: 'start', minWidth: CARD_W,
              }}
            >
              <Visual />
              <div style={{ padding: '16px 18px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <p className="body-sm" style={{
                  color: '#aeaeb2',
                  fontFamily: "'Anek Bangla', sans-serif",
                  marginBottom: 4,
                }}>
                  {teacher}
                </p>
                <h3 style={{
                  fontSize: 15, fontWeight: 700,
                  color: '#1d1d1f',
                  fontFamily: "'Anek Bangla', sans-serif",
                  lineHeight: 1.45, minHeight: 44,
                  marginBottom: 14, flex: 1,
                }}>
                  {title}
                </h3>
                <button style={{
                  background: 'none', border: 'none',
                  color, fontFamily: "'Anek Bangla', sans-serif",
                  fontSize: 14, fontWeight: 600,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                  padding: 0, transition: 'gap 300ms ease',
                }}
                  onMouseEnter={e => (e.currentTarget.style.gap = '8px')}
                  onMouseLeave={e => (e.currentTarget.style.gap = '4px')}
                >
                  বিস্তারিত
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M2 6.5h9M7 3l3.5 3.5L7 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Show more */}
        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <button onClick={() => setShowAll(v => !v)} style={{
            background: 'white', border: '1.5px solid rgba(0,0,0,0.10)',
            borderRadius: 12, padding: '10px 28px',
            fontSize: 14, fontWeight: 600, color: '#3a7bd5',
            fontFamily: "'Anek Bangla', sans-serif",
            cursor: 'pointer', transition: 'all 300ms ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            display: 'inline-flex', alignItems: 'center', gap: 7,
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#3a7bd5')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.10)')}
          >
            {showAll ? 'কম দেখুন' : 'আরও দেখুন'}
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ transform: showAll ? 'rotate(180deg)' : 'none', transition: 'transform 300ms' }}>
              <path d="M2 5l4.5 4L11 5" stroke="#3a7bd5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .course-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 560px) { .course-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}

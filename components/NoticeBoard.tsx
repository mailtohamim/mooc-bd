'use client'
import { useState } from 'react'

const PlayIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <rect width="22" height="22" rx="5" fill="#000" />
    <path d="M8 7l8 4-8 4V7z" fill="white" />
  </svg>
)
const AppleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <rect width="22" height="22" rx="5" fill="#000" />
    <path d="M11 5c0-1.1.9-2 2-2a2 2 0 0 1-2 2z" fill="white" />
    <path d="M7 9.5C5.5 9.5 4 11.5 4 14c0 2.8 2 6 3.5 6 .8 0 1.5-.5 2.5-.5s1.7.5 2.5.5C14 20 16 16.8 16 14c0-2.5-1.5-4.5-3-4.5-.8 0-1.5.5-2 .5s-1.2-.5-2-.5z" fill="white" />
  </svg>
)

const events = [
  { date: '১৫ মার্চ ২০২৫', title: 'জাতীয় বিজ্ঞান অলিম্পিয়াড নিবন্ধন', desc: 'সারাদেশের শিক্ষার্থীদের জন্য উন্মুক্ত' },
  { date: '২২ মার্চ ২০২৫', title: 'HSC ফরম পূরণের শেষ তারিখ', desc: 'শিক্ষা বোর্ডের নির্দেশনা অনুযায়ী' },
  { date: '০৫ এপ্রিল ২০২৫', title: 'শিক্ষক প্রশিক্ষণ কর্মশালা', desc: 'অনলাইনে অনুষ্ঠিত হবে' },
]
const announcements = [
  '২০২৫ সালের এসএসসি পরীক্ষার সময়সূচী প্রকাশিত হয়েছে',
  'নতুন ডিজিটাল পাঠ্যক্রম বাস্তবায়ন শুরু ১ এপ্রিল থেকে',
  'জাতীয় শিক্ষা সপ্তাহ উপলক্ষে বিশেষ ওয়েবিনার',
]
const govNotices = [
  { text: '২০২৫ সালের বার্ষিক কর্মপরিকল্পনা', date: '০১ মার্চ ২০২৫' },
  { text: 'পরীক্ষা বিধিমালা সংশোধন নির্দেশিকা', date: '২৮ ফেব ২০২৫' },
  { text: 'আইটি ল্যাব স্থাপন সংক্রান্ত নির্দেশিকা', date: '১৫ ফেব ২০২৫' },
]

const DownloadIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M7.5 2v8M4 8l3.5 3.5L11 8M2.5 13h10" stroke="#3a7bd5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function NoticeBoard() {
  const [hoveredEvent, setHoveredEvent] = useState<number | null>(null)

  return (
    <section className="section" style={{ background: '#f5f5f7' }}>
      <div className="container">

        {/* 2-column */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '28% 1fr',
          gap: 24,
          marginBottom: 24,
          alignItems: 'start',
        }} className="notice-grid">

          {/* Left – app download */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 className="h3" style={{
              color: '#1d1d1f',
              fontFamily: "'Anek Bangla', sans-serif",
              marginBottom: 4,
            }}>
              মোবাইল অ্যাপ ডাউনলোড করুন
            </h2>
            {[
              { label: 'Google Play', sub: 'Google Play Store', Icon: PlayIcon },
              { label: 'App Store', sub: 'Apple App Store', Icon: AppleIcon },
            ].map(({ label, sub, Icon }) => (
              <button
                key={label}
                className="hover-lift-sm"
                style={{
                  background: '#000',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 14,
                  padding: '12px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'all 300ms ease',
                }}
              >
                <Icon />
                <div style={{ textAlign: 'left' }}>
                  <div className="label" style={{ color: 'rgba(255,255,255,0.55)', fontSize: 10 }}>ডাউনলোড করুন</div>
                  <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Anek Bangla', sans-serif" }}>{label}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Right – notice glass box */}
          <div className="glass" style={{ overflow: 'hidden' }}>
            {/* Upcoming events */}
            <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <h3 className="h3" style={{
                color: '#1d1d1f',
                fontFamily: "'Anek Bangla', sans-serif",
                marginBottom: 16,
              }}>আসন্ন অনুষ্ঠানসমূহ</h3>

              {events.map((ev, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredEvent(i)}
                  onMouseLeave={() => setHoveredEvent(null)}
                  style={{
                    display: 'flex', gap: 16, alignItems: 'flex-start',
                    padding: '10px 10px',
                    borderRadius: 12,
                    background: hoveredEvent === i ? 'rgba(255,255,255,0.60)' : 'transparent',
                    transition: 'background 300ms ease',
                    cursor: 'pointer',
                    marginBottom: 2,
                  }}
                >
                  <div style={{
                    minWidth: 100, fontSize: 13, fontWeight: 600,
                    color: '#3a7bd5',
                    fontFamily: "'Anek Bangla', sans-serif",
                    paddingTop: 2,
                  }}>
                    {ev.date}
                  </div>
                  <div>
                    <div className="body-sm" style={{
                      fontWeight: 600, color: '#1d1d1f',
                      fontFamily: "'Anek Bangla', sans-serif",
                    }}>{ev.title}</div>
                    <div className="body-sm" style={{ color: '#6e6e73', fontFamily: "'Anek Bangla', sans-serif" }}>
                      {ev.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Announcements */}
            <div style={{ padding: '16px 24px 24px' }}>
              <h3 className="h3" style={{
                color: '#1d1d1f',
                fontFamily: "'Anek Bangla', sans-serif",
                marginBottom: 14,
              }}>গুরুত্বপূর্ণ বিজ্ঞপ্তি</h3>
              {announcements.map((ann, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  marginBottom: i < announcements.length - 1 ? 12 : 0,
                }}>
                  <div style={{
                    width: 7, height: 7, marginTop: 5,
                    background: '#3a7bd5', borderRadius: '50%', flexShrink: 0,
                  }} />
                  <span className="body-sm" style={{ color: '#3c3c43', fontFamily: "'Anek Bangla', sans-serif" }}>
                    {ann}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Government notice wide container */}
        <div className="glass" style={{ padding: '24px 28px' }}>
          <h2 className="h3" style={{
            color: '#1d1d1f',
            fontFamily: "'Anek Bangla', sans-serif",
            marginBottom: 20,
          }}>
            শিক্ষা মন্ত্রণালয়ের সাধারণ বিজ্ঞপ্তি
          </h2>
          {govNotices.map((notice, i) => (
            <div
              key={i}
              className="hover-lift-sm"
              style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                padding: '13px 0',
                borderBottom: i < govNotices.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                cursor: 'pointer', gap: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="1" width="12" height="14" rx="2" stroke="#8e8e93" strokeWidth="1.4" />
                  <path d="M5 5h6M5 8h6M5 11h4" stroke="#8e8e93" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                <div>
                  <div className="body-sm" style={{ fontWeight: 500, color: '#1d1d1f', fontFamily: "'Anek Bangla', sans-serif" }}>
                    {notice.text}
                  </div>
                  <div style={{ fontSize: 12, color: '#8e8e93', fontFamily: "'Anek Bangla', sans-serif", marginTop: 2 }}>
                    {notice.date}
                  </div>
                </div>
              </div>
              <button style={{
                background: 'rgba(58,123,213,0.08)',
                border: '1px solid rgba(58,123,213,0.18)',
                borderRadius: 10, padding: '7px 12px',
                cursor: 'pointer',
                color: '#3a7bd5',
                fontSize: 13, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 5,
                transition: 'all 300ms ease',
                fontFamily: "'Anek Bangla', sans-serif",
              }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(58,123,213,0.15)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(58,123,213,0.08)')}
              >
                <DownloadIcon />
                ডাউনলোড
              </button>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .notice-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

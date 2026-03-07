'use client'
import { useState } from 'react'

const classData: Record<string, string[]> = {
  'শ্রেণি ১২': ['পদার্থবিজ্ঞান', 'রসায়নবিজ্ঞান', 'গণিত', 'জীববিজ্ঞান'],
  'শ্রেণি ১১': ['পদার্থবিজ্ঞান', 'রসায়নবিজ্ঞান', 'বেসিক পাইথন প্রোগ্রামিং', 'ইংরেজি'],
  'শ্রেণি ১০': ['বাংলা ১ম পত্র', 'গণিত', 'সাধারণ বিজ্ঞান', 'ইতিহাস'],
}

const chapterData: Record<string, { title: string; topics: string[] }[]> = {
  'পদার্থবিজ্ঞান': [
    { title: 'অধ্যায় ১: ভৌত জগৎ ও পরিমাপ', topics: ['ভৌত জগৎ', 'পরিমাপের একক', 'ত্রুটি ও পরিমাপ'] },
    { title: 'অধ্যায় ২: ভেক্টর', topics: ['ভেক্টর রাশি', 'ভেক্টর সংযোগ', 'ভেক্টর গুণন'] },
  ],
  'রসায়নবিজ্ঞান': [
    { title: 'অধ্যায় ১: ল্যাবরেটরির নিরাপদ ব্যবহার', topics: ['পোশাক ও নিরাপত্তা', 'রাসায়নিক দ্রব্য সংরক্ষণ', 'গ্লাস সামগ্রী পরিষ্কার'] },
  ],
  'গণিত': [
    { title: 'অধ্যায় ১: মেট্রিক্স ও নির্ণায়ক', topics: ['মেট্রিক্সের প্রকারভেদ', 'নির্ণায়কের ধর্মাবলি', 'ক্রেমারের নিয়ম'] },
  ],
}

const classKeys = Object.keys(classData)

const accentColors = ['#4a90d9', '#5ab87a', '#d25a3c', '#8250d2', '#e07050', '#3abf9a']

const VideoPlaceholder = ({ subject, color }: { subject: string; color: string }) => (
  <div style={{
    width: '100%', aspectRatio: '16/9',
    background: 'linear-gradient(135deg, #0d1520 0%, #12203a 100%)',
    borderRadius: 16, position: 'relative', overflow: 'hidden',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    <div style={{
      position: 'absolute', inset: 0,
      background: `radial-gradient(ellipse 50% 40% at 50% 50%, ${color}1a 0%, transparent 70%)`,
    }} />
    <div style={{ zIndex: 1, textAlign: 'center' }}>
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ marginBottom: 10 }}>
        <rect x="4" y="8" width="48" height="34" rx="5" stroke={`${color}80`} strokeWidth="1.5" />
        <text x="28" y="29" textAnchor="middle" fill={`${color}90`} fontSize="10" fontFamily="sans-serif">
          {subject.slice(0, 8)}
        </text>
        <rect x="18" y="45" width="20" height="3" rx="1.5" fill={`${color}60`} />
      </svg>
      <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, fontFamily: "'Anek Bangla', sans-serif" }}>
        {subject}
      </div>
    </div>

    {/* Info button */}
    <div style={{
      position: 'absolute', top: 12, right: 12,
      width: 26, height: 26, borderRadius: '50%',
      background: 'rgba(255,255,255,0.15)',
      border: '1px solid rgba(255,255,255,0.25)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer',
    }}>i</div>

    {/* Controls bar */}
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      padding: '28px 14px 10px',
      background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ cursor: 'pointer' }}>
        <path d="M5 4l10 5-10 5V4z" fill="white" />
      </svg>
      <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.25)', borderRadius: 2, position: 'relative' }}>
        <div style={{ width: '32%', height: '100%', background: color, borderRadius: 2 }} />
        <div style={{
          position: 'absolute', left: '32%', top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 9, height: 9, background: 'white', borderRadius: '50%',
        }} />
      </div>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ cursor: 'pointer' }}>
        <path d="M2 8c0-2.2 1.8-4 4-4V2L9 5 6 8V6C4.3 6 3 7.3 3 9s1.3 3 3 3h1v1.5H6c-2.2 0-4-1.8-4-4zM9 4.5V6c1.7 0 3 1.3 3 3s-1.3 3-3 3h-1V13.5h1c2.2 0 4-1.8 4-4s-1.8-4-4-4z" fill="white" opacity="0.75" />
      </svg>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ cursor: 'pointer' }}>
        <path d="M1 1h4M1 1v4M13 1h-4M13 1v4M1 13h4M1 13v-4M13 13h-4M13 13v-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
      </svg>
    </div>
  </div>
)

export default function VideoPlayer() {
  const [activeClassIdx, setActiveClassIdx] = useState(0)
  const [activeSubIdx, setActiveSubIdx] = useState(0)
  const [activeChapterIdx, setActiveChapterIdx] = useState(0)
  const [activeTopicIdx, setActiveTopicIdx] = useState(0)

  const activeClass = classKeys[activeClassIdx]
  const subjects = classData[activeClass]
  const subject = subjects[activeSubIdx]
  const chapters = chapterData[subject] || [{ title: 'অধ্যায় ১: সাধারণ আলোচনা', topics: ['টপিক ১', 'টপিক ২'] }]
  const activeChapter = chapters[activeChapterIdx] || chapters[0]
  const activeTopic = activeChapter.topics[activeTopicIdx] || activeChapter.topics[0]
  
  const color = accentColors[activeClassIdx % accentColors.length]

  const handleClassChange = (idx: number) => {
    setActiveClassIdx(idx)
    setActiveSubIdx(0)
    setActiveChapterIdx(0)
    setActiveTopicIdx(0)
  }

  const handleSubjectChange = (idx: number) => {
    setActiveSubIdx(idx)
    setActiveChapterIdx(0)
    setActiveTopicIdx(0)
  }

  return (
    <section className="section" style={{ background: '#f8f8fa' }}>
      <div className="container">

        {/* Class selector */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
          {classKeys.map((cls, i) => (
            <button
              key={cls}
              onClick={() => handleClassChange(i)}
              style={{
                padding: '9px 20px', borderRadius: 999, border: 'none',
                background: i === activeClassIdx ? 'white' : 'transparent',
                boxShadow: i === activeClassIdx ? '0 4px 16px rgba(0,0,0,0.08)' : 'none',
                color: i === activeClassIdx ? '#1d1d1f' : '#6e6e73',
                fontWeight: i === activeClassIdx ? 700 : 400,
                fontSize: 15, fontFamily: "'Anek Bangla', sans-serif",
                cursor: 'pointer', transition: 'all 300ms ease',
              }}
            >
              {cls}
            </button>
          ))}
        </div>

        {/* Main glass container */}
        <div className="glass" style={{ overflow: 'hidden' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '220px 1fr',
          }} className="video-grid">

            {/* Left – subject list */}
            <div style={{
              borderRight: '1px solid rgba(0,0,0,0.06)',
              padding: '20px 14px',
              background: 'rgba(255,255,255,0.35)',
              display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              <p className="label" style={{ color: '#8e8e93', paddingLeft: 8, marginBottom: 4 }}>বিষয়সমূহ</p>
              {subjects.map((sub, i) => (
                <button
                  key={`${activeClass}-${sub}`}
                  onClick={() => handleSubjectChange(i)}
                  style={{
                    background: i === activeSubIdx ? 'white' : 'transparent',
                    border: 'none', borderRadius: 12,
                    padding: '12px 14px', textAlign: 'left',
                    cursor: 'pointer',
                    color: i === activeSubIdx ? '#1d1d1f' : '#6e6e73',
                    fontWeight: i === activeSubIdx ? 600 : 400,
                    fontSize: 14, fontFamily: "'Anek Bangla', sans-serif",
                    transition: 'all 300ms ease',
                    boxShadow: i === activeSubIdx ? '0 2px 10px rgba(0,0,0,0.06)' : 'none',
                    lineHeight: 1.4,
                    borderLeft: i === activeSubIdx ? `3px solid ${color}` : '3px solid transparent',
                  }}
                  onMouseEnter={e => { if (i !== activeSubIdx) e.currentTarget.style.background = 'rgba(255,255,255,0.70)' }}
                  onMouseLeave={e => { if (i !== activeSubIdx) e.currentTarget.style.background = 'transparent' }}
                >
                  {sub}
                </button>
              ))}
            </div>

            {/* Right – video content area */}
            <div style={{ padding: '24px 32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24 }}>
                {/* Video Column */}
                <div>
                  <VideoPlaceholder subject={activeTopic} color={color} />
                  <h2 className="h3" style={{
                    color: '#1d1d1f',
                    fontFamily: "'Anek Bangla', sans-serif",
                    marginTop: 18, marginBottom: 6,
                  }}>
                    {subject} · {activeTopic}
                  </h2>
                  <p className="body-sm" style={{ color: '#8e8e93', fontFamily: "'Anek Bangla', sans-serif" }}>
                    {activeChapter.title} · পার্ট {activeTopicIdx + 1}
                  </p>
                </div>

                {/* Topics/Chapters Column */}
                <div style={{
                  background: 'rgba(255,255,255,0.4)', borderRadius: 16,
                  border: '1px solid rgba(0,0,0,0.04)', padding: 16,
                  maxHeight: 440, overflowY: 'auto'
                }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#8e8e93', marginBottom: 12, paddingLeft: 4 }}>সিলেবাস / কারিকুলাম</div>
                  {chapters.map((ch, cIdx) => (
                    <div key={cIdx} style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1d1d1f', marginBottom: 6, paddingLeft: 4 }}>{ch.title}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {ch.topics.map((top, tIdx) => {
                          const isAct = activeChapterIdx === cIdx && activeTopicIdx === tIdx
                          return (
                            <button
                              key={tIdx}
                              onClick={() => { setActiveChapterIdx(cIdx); setActiveTopicIdx(tIdx) }}
                              style={{
                                background: isAct ? `${color}10` : 'transparent',
                                border: 'none', borderRadius: 8, padding: '8px 10px',
                                textAlign: 'left', cursor: 'pointer',
                                color: isAct ? color : '#3c3c43',
                                fontSize: 13, fontWeight: isAct ? 600 : 400,
                                fontFamily: "'Anek Bangla', sans-serif",
                                transition: 'all 200ms',
                                display: 'flex', alignItems: 'center', gap: 8
                              }}
                            >
                              <div style={{
                                width: 18, height: 18, borderRadius: '50%',
                                border: `1.5px solid ${isAct ? color : '#d1d1d6'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 10, fontWeight: 700
                              }}>{isAct ? '▶' : tIdx + 1}</div>
                              {top}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1000px) {
          .video-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 900px) {
           .video-grid + div > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

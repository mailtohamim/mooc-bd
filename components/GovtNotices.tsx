'use client'
import { useState, useRef, useEffect } from 'react'

/* ── Notice data with real JS dates for filtering ── */
const allNotices = [
  { text: '২০২৫ সালের বার্ষিক কর্মপরিকল্পনা',         date: new Date(2025, 2, 1),  label: '০১ মার্চ ২০২৫',  category: 'পরিকল্পনা'  },
  { text: 'পরীক্ষা বিধিমালা সংশোধন নির্দেশিকা',        date: new Date(2025, 1, 28), label: '২৮ ফেব ২০২৫',   category: 'বিধিমালা'   },
  { text: 'আইটি ল্যাব স্থাপন সংক্রান্ত নির্দেশিকা',   date: new Date(2025, 1, 15), label: '১৫ ফেব ২০২৫',   category: 'নির্দেশিকা' },
  { text: 'বৃত্তি পরীক্ষার সময়সূচি ২০২৫',              date: new Date(2025, 1, 10), label: '১০ ফেব ২০২৫',   category: 'পরীক্ষা'    },
  { text: 'এসএসসি পরীক্ষার ফলাফল নির্দেশনা',           date: new Date(2025, 1,  5), label: '০৫ ফেব ২০২৫',   category: 'পরীক্ষা'    },
]

const categories = ['সব ক্যাটাগরি', ...Array.from(new Set(allNotices.map(n => n.category)))]

const BN_MONTHS = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর']
const BN_DAYS   = ['র','সো','মঙ','বু','বৃ','শু','শ']

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

/* ── Calendar ── */
function DateRangePicker({
  from, to, onSelect, onClear,
}: {
  from: Date | null; to: Date | null
  onSelect: (d: Date) => void
  onClear: () => void
}) {
  const [hovered, setHovered] = useState<Date | null>(null)
  const now = new Date()
  const [viewYear,  setViewYear]  = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay() // 0=Sun
  const offset = firstDayOfWeek === 0 ? 0 : firstDayOfWeek

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const cells: (Date | null)[] = []
  for (let i = 0; i < offset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(viewYear, viewMonth, d))

  const inRange = (d: Date): boolean => {
    const start = from ? startOfDay(from) : null
    const end   = to ? startOfDay(to) : (hovered ? startOfDay(hovered) : null)
    if (!start || !end) return false
    const dd = startOfDay(d)
    return dd > (start < end ? start : end) && dd < (start < end ? end : start)
  }
  const isStart = (d: Date) => !!from && isSameDay(d, from)
  const isEnd   = (d: Date) => !!to   && isSameDay(d, to)
  const isEdge  = (d: Date) => isStart(d) || isEnd(d)

  const rangeLabel = () => {
    if (!from) return 'তারিখ বেছে নিন'
    const fmt = (d: Date) => `${d.getDate()} ${BN_MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`
    if (!to) return `${fmt(from)} – ?`
    return `${fmt(from)} – ${fmt(to)}`
  }

  return (
    <div style={{ padding: '16px 18px', minWidth: 280 }}>
      {/* Month nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <button onClick={prevMonth} style={navBtn}>‹</button>
        <span style={{ fontWeight: 700, fontSize: 14, color: '#1d1d1f', fontFamily: "'Anek Bangla', sans-serif" }}>
          {BN_MONTHS[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} style={navBtn}>›</button>
      </div>

      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 6 }}>
        {BN_DAYS.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 11, color: '#aeaeb2', fontWeight: 600, padding: '3px 0', fontFamily: "'Anek Bangla', sans-serif" }}>{d}</div>
        ))}
      </div>

      {/* Date cells */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', rowGap: 2 }}>
        {cells.map((d, i) => {
          if (!d) return <div key={`e${i}`} />
          const edge   = isEdge(d)
          const middle = !edge && inRange(d)
          return (
            <div
              key={i}
              onClick={() => onSelect(d)}
              onMouseEnter={() => { if (from && !to) setHovered(d) }}
              onMouseLeave={() => setHovered(null)}
              style={{
                height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: edge ? '50%' : middle ? 0 : 4,
                background: edge ? '#3a7bd5' : middle ? 'rgba(58,123,213,0.12)' : 'transparent',
                color: edge ? 'white' : '#1d1d1f',
                fontSize: 13, fontWeight: edge ? 700 : 400,
                cursor: 'pointer',
                transition: 'background 150ms',
                borderTopLeftRadius:    (isStart(d) || (!from && middle)) ? '50%' : middle ? 0 : 4,
                borderBottomLeftRadius: (isStart(d) || (!from && middle)) ? '50%' : middle ? 0 : 4,
                borderTopRightRadius:    (isEnd(d)   || (!to   && middle)) ? '50%' : middle ? 0 : 4,
                borderBottomRightRadius: (isEnd(d)   || (!to   && middle)) ? '50%' : middle ? 0 : 4,
              }}
            >
              {d.getDate()}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: '#6e6e73', fontFamily: "'Anek Bangla', sans-serif" }}>{rangeLabel()}</span>
        {(from || to) && (
          <button onClick={onClear} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 12, color: '#ff6b6b', fontWeight: 600,
            fontFamily: "'Anek Bangla', sans-serif",
          }}>পরিষ্কার করুন</button>
        )}
      </div>
    </div>
  )
}

const navBtn: React.CSSProperties = {
  background: '#f5f5f7', border: 'none', borderRadius: 8,
  width: 28, height: 28, cursor: 'pointer', fontSize: 16,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: '#3c3c43', transition: 'background 200ms',
}

/* ── Icons ── */
const DownloadIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M7.5 2v8M4 8l3.5 3.5L11 8M2.5 13h10" stroke="#3a7bd5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const DocIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="1" width="12" height="14" rx="2" stroke="#8e8e93" strokeWidth="1.4" />
    <path d="M5 5h6M5 8h6M5 11h4" stroke="#8e8e93" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)
const CalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="1" y="2.5" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" />
    <path d="M4 1v3M10 1v3M1 6h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
)
const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/* ── Main component ── */
export default function GovtNotices() {
  const [category, setCategory] = useState('সব ক্যাটাগরি')
  const [dateFrom, setDateFrom] = useState<Date | null>(null)
  const [dateTo,   setDateTo]   = useState<Date | null>(null)
  const [calOpen,  setCalOpen]  = useState(false)
  const [showAll,  setShowAll]  = useState(false)
  const calRef = useRef<HTMLDivElement>(null)

  /* Close calendar on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (calRef.current && !calRef.current.contains(e.target as Node)) setCalOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleDateSelect = (d: Date) => {
    if (!dateFrom || (dateFrom && dateTo)) {
      setDateFrom(d); setDateTo(null)
    } else {
      if (d < dateFrom) { setDateTo(dateFrom); setDateFrom(d) }
      else setDateTo(d)
    }
  }

  const filtered = allNotices.filter(n => {
    const catOk  = category === 'সব ক্যাটাগরি' || n.category === category
    const start  = dateFrom ? startOfDay(dateFrom) : null
    const end    = dateTo   ? startOfDay(dateTo)   : null
    const nd     = startOfDay(n.date)
    const dateOk = !start || (nd >= start && (!end || nd <= end))
    return catOk && dateOk
  })
  const displayed = showAll ? filtered : filtered.slice(0, 3)

  const dateLabel = () => {
    if (!dateFrom) return 'তারিখ'
    const fmt = (d: Date) => `${d.getDate()} ${BN_MONTHS[d.getMonth()].slice(0,3)}`
    return dateTo ? `${fmt(dateFrom)} – ${fmt(dateTo)}` : `${fmt(dateFrom)} –`
  }
  const hasDateFilter = !!dateFrom

  return (
    <section style={{ background: '#f5f5f7', padding: '0 0 64px' }}>
      <div className="container">
        <div className="glass" style={{ padding: '24px 28px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <h2 className="h3" style={{ color: '#1d1d1f', fontFamily: "'Anek Bangla', sans-serif", margin: 0 }}>
              শিক্ষা মন্ত্রণালয়ের সাধারণ বিজ্ঞপ্তি
            </h2>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {/* Category select */}
              <div style={{ position: 'relative' }}>
                <select value={category} onChange={e => setCategory(e.target.value)} style={selectStyle}
                  onFocus={e => (e.target.style.borderColor = '#3a7bd5')}
                  onBlur={e  => (e.target.style.borderColor  = 'rgba(0,0,0,0.10)')}>
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
                <span style={chevronWrap}><ChevronDown /></span>
              </div>

              {/* Date range button */}
              <div ref={calRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setCalOpen(v => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    background: hasDateFilter ? 'rgba(58,123,213,0.10)' : 'rgba(255,255,255,0.90)',
                    border: `1.5px solid ${hasDateFilter ? 'rgba(58,123,213,0.35)' : 'rgba(0,0,0,0.10)'}`,
                    borderRadius: 10, padding: '8px 12px',
                    fontSize: 13, fontFamily: "'Anek Bangla', sans-serif",
                    color: hasDateFilter ? '#3a7bd5' : '#1d1d1f', fontWeight: hasDateFilter ? 600 : 500,
                    cursor: 'pointer', outline: 'none',
                    transition: 'all 300ms ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <CalIcon />
                  {dateLabel()}
                  <ChevronDown />
                </button>

                {/* Calendar popover */}
                {calOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 8px)', zIndex: 100,
                    background: 'rgba(255,255,255,0.97)',
                    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(0,0,0,0.10)',
                    borderRadius: 18, boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                    overflow: 'hidden',
                  }}>
                    <DateRangePicker
                      from={dateFrom} to={dateTo}
                      onSelect={handleDateSelect}
                      onClear={() => { setDateFrom(null); setDateTo(null) }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notices */}
          {displayed.length === 0 ? (
            <p style={{ color: '#8e8e93', fontSize: 14, fontFamily: "'Anek Bangla', sans-serif", textAlign: 'center', padding: '16px 0' }}>
              কোনো বিজ্ঞপ্তি পাওয়া যায়নি।
            </p>
          ) : displayed.map((notice, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '13px 0',
              borderBottom: i < filtered.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
              gap: 16,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                <DocIcon />
                <div>
                  <div className="body-sm" style={{ fontWeight: 500, color: '#1d1d1f', fontFamily: "'Anek Bangla', sans-serif" }}>
                    {notice.text}
                  </div>
                  <div style={{ fontSize: 12, color: '#8e8e93', fontFamily: "'Anek Bangla', sans-serif", marginTop: 2 }}>
                    {notice.label}
                  </div>
                </div>
              </div>
              <button style={{
                background: 'rgba(58,123,213,0.08)', border: '1px solid rgba(58,123,213,0.18)',
                borderRadius: 10, padding: '7px 14px',
                cursor: 'pointer', color: '#3a7bd5',
                fontSize: 13, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 5,
                transition: 'all 300ms ease', fontFamily: "'Anek Bangla', sans-serif", whiteSpace: 'nowrap',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(58,123,213,0.15)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(58,123,213,0.08)')}
              >
                <DownloadIcon />ডাউনলোড
              </button>
            </div>
          ))}

          {/* Show more */}
          {filtered.length > 3 && (
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <button onClick={() => setShowAll(v => !v)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#3a7bd5', fontSize: 13, fontWeight: 600,
                fontFamily: "'Anek Bangla', sans-serif",
                display: 'inline-flex', alignItems: 'center', gap: 5,
              }}>
                {showAll ? 'কম দেখুন' : `আরও দেখুন (${filtered.length - 3})`}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: showAll ? 'rotate(180deg)' : 'none', transition: 'transform 300ms' }}>
                  <path d="M2 4l4 4 4-4" stroke="#3a7bd5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

const selectStyle: React.CSSProperties = {
  appearance: 'none', WebkitAppearance: 'none',
  background: 'rgba(255,255,255,0.90)',
  border: '1.5px solid rgba(0,0,0,0.10)',
  borderRadius: 10, padding: '8px 32px 8px 12px',
  fontSize: 13, fontFamily: "'Anek Bangla', sans-serif",
  color: '#1d1d1f', fontWeight: 500,
  cursor: 'pointer', outline: 'none',
  transition: 'border-color 300ms ease',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
}
const chevronWrap: React.CSSProperties = {
  position: 'absolute', right: 10, top: '50%',
  transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6e6e73',
}

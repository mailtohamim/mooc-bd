'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import ForumPage from '@/components/ForumPage'
import NotebookPage from '@/components/NotebookPage'
import { Layout, ClipboardList, BarChart2, Folder, MessageSquare, Settings, Search, Bell, Edit2, TrendingUp, TrendingDown, Users, BookOpen } from 'lucide-react'

/* ─────────────────────────────────────────────
   Types & shared data
───────────────────────────────────────────── */
type Page = 'overview' | 'assignment' | 'reports' | 'files' | 'inbox' | 'forum' | 'notebook' | 'settings'

const courseCards = [
  { id: 'physics-12', title: 'পদার্থবিজ্ঞান', class: 'শ্রেণি ১২', lessons: 24, files: 8, students: 99, color: '#4a90d9', bg: 'rgba(74,144,217,0.08)' },
  { id: 'bangla-10',  title: 'বাংলা ১ম পত্র', class: 'শ্রেণি ১০', lessons: 18, files: 5, students: 64, color: '#5ab87a', bg: 'rgba(90,184,122,0.08)' },
  { id: 'english-skill', title: 'Spoken English',class: 'স্কিলস',    lessons: 30, files: 12, students: 210, color: '#8250d2', bg: 'rgba(130,80,210,0.08)' },
]

const months = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে']
const studyHours = [28, 18, 55, 42, 15]
const examHours  = [20, 32, 32, 28, 12]

const leaderboard = [
  { rank: 1, up: true,  name: 'রাহেলা পারভীন',  course: 53, hours: 250, points: 13450 },
  { rank: 2, up: false, name: 'করিম উদ্দিন',     course: 88, hours: 212, points: 10333 },
  { rank: 3, up: true,  name: 'সুমাইয়া খান',    course: 72, hours: 190, points: 9870  },
  { rank: 4, up: false, name: 'আহমেদ হোসেন',    course: 61, hours: 175, points: 8540  },
]

const assignments = [
  { subject: 'পদার্থবিজ্ঞান', title: 'নিউটনের সূত্র – সমস্যার সমাধান', due: '১০ মার্চ', done: false, time: 'রাত ১১:৫৯' },
  { subject: 'বাংলা',         title: 'গদ্য রচনা – বাংলাদেশের প্রকৃতি',  due: '১২ মার্চ', done: true,  time: 'সকাল ১১:০০'  },
  { subject: 'ইংরেজি',       title: 'Paragraph Writing: My School',     due: '১৫ মার্চ', done: false, time: 'বিকাল ৪:০০' },
  { subject: 'রসায়ন',        title: 'জৈব যৌগ – অধ্যায় ৩ প্রশ্নোত্তর', due: '১৮ মার্চ', done: false, time: 'সকাল ৯:৩০' },
  { subject: 'গণিত',          title: 'ত্রিকোণমিতি – অনুশীলনী ৪',         due: '২০ মার্চ', done: true,  time: 'সকাল ১০:৩০'  },
]

const exams = [
  { subject: 'বাংলা ১ম পত্র', topic: 'গদ্য অংশ', date: '১২ মার্চ', time: 'সকাল ১০:০০', daysLeft: 3 },
  { subject: 'পদার্থবিজ্ঞান', topic: 'অধ্যায় ১-৩', date: '১৫ মার্চ', time: 'সকাল ৯:০০', daysLeft: 6 },
]

const files = [
  { name: 'পদার্থ_অধ্যায়_১.pdf', size: '2.4 MB', date: '০১ মার্চ', type: 'pdf' },
  { name: 'বাংলা_নোটস.docx',      size: '890 KB', date: '২৮ ফেব',   type: 'doc' },
  { name: 'Math_Practice.pdf',    size: '1.1 MB', date: '২৫ ফেব',   type: 'pdf' },
  { name: 'Chemistry_Lab.pptx',   size: '3.2 MB', date: '২০ ফেব',   type: 'ppt' },
]

const messages = [
  { from: 'প্রফেসর আহমেদ',    time: '৯:৩০ AM',  text: 'আজকের ক্লাসে পদার্থবিজ্ঞানের অধ্যায় ৫ পড়ে আসবে।', unread: true  },
  { from: 'মিস রাহেলা',       time: 'গতকাল',    text: 'তোমার অ্যাসাইনমেন্ট জমা দেওয়ার তারিখ কাল পর্যন্ত।', unread: true  },
  { from: 'শিখবেই বাংলাদেশ', time: '১ মার্চ',  text: 'নতুন কোর্স: ডিজিটাল মার্কেটিং এখন উপলব্ধ!',        unread: false },
  { from: 'মডারেটর',           time: '২৮ ফেব',  text: 'তোমার কমিউনিটি পোস্টে ৩টি উত্তর এসেছে।',           unread: false },
]

const todos = [
  { text: 'পদার্থবিজ্ঞান অধ্যায় ৩ পড়া', time: '৮:০০ AM',  done: false, tag: 'পড়াশোনা' },
  { text: 'রসায়নের অ্যাসাইনমেন্ট জমা',  time: '২:৪০ PM',  done: false, tag: 'অ্যাসাইনমেন্ট' },
  { text: 'ইংরেজি প্যারাগ্রাফ',           time: '৪:৫০ PM',  done: true,  tag: 'লেখা' },
]

/* ─────────────────────────────────────────────
   Sub-icons
───────────────────────────────────────────── */
const Icon = {
  overview:    <Layout size={18} strokeWidth={1.5} />,
  assignment:  <ClipboardList size={18} strokeWidth={1.5} />,
  reports:     <BarChart2 size={18} strokeWidth={1.5} />,
  files:       <Folder size={18} strokeWidth={1.5} />,
  inbox:       <MessageSquare size={18} strokeWidth={1.5} />,
  settings:    <Settings size={18} strokeWidth={1.5} />,
  search:      <Search size={16} stroke="#8e8e93" strokeWidth={1.5} />,
  bell:        <Bell size={18} strokeWidth={1.5} />,
  edit:        <Edit2 size={15} strokeWidth={1.5} />,
  up:          <TrendingUp size={14} color="#5ab87a" strokeWidth={2} />,
  down:        <TrendingDown size={14} color="#ff6b6b" strokeWidth={2} />,
  forum:       <Users size={18} strokeWidth={1.5} />,
  notebook:    <BookOpen size={18} strokeWidth={1.5} />,
}

/* ─────────────────────────────────────────────
   Calendar mini
───────────────────────────────────────────── */
function MiniCalendar() {
  const [mounted, setMounted] = useState(false)
  const now = new Date()
  const today = now.getDate()
  const month = now.getMonth()
  const year  = now.getFullYear()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay    = new Date(year, month, 1).getDay() 
  const offset      = firstDay === 0 ? 6 : firstDay - 1

  const [hoverDay, setHoverDay] = useState<number | null>(null)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div style={{ height: 160 }} />

  const events: Record<number, string> = {
    [today + 2]: "রসায়ন পরীক্ষা",
    [today + 5]: "বঙ্গবন্ধু দিবস (ছুটি)",
    [today - 4]: "অ্যাসাইনমেন্ট সাবমিট",
  }

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6 }}>
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <div key={`${d}-${i}`} style={{ fontSize: 10, color: '#aeaeb2', textAlign: 'center', fontWeight: 700 }}>{d}</div>
        ))}
        {Array.from({ length: offset }).map((_, i) => <div key={`o-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isToday = day === today;
          const evt = events[day];
          return (
            <div key={i} 
              onMouseEnter={() => setHoverDay(day)}
              onMouseLeave={() => setHoverDay(null)}
              style={{
                position: 'relative',
                fontSize: 11, textAlign: 'center', padding: '4px 0', borderRadius: 8,
                fontWeight: 600, color: isToday ? 'white' : '#1d1d1f',
                background: isToday ? '#3a7bd5' : hoverDay === day ? 'rgba(0,0,0,0.05)' : 'transparent',
                cursor: evt ? 'pointer' : 'default', transition: 'background 200ms'
              }}>
              {day}
              {evt && <div style={{ position: 'absolute', bottom: 1, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: isToday ? 'white' : '#ff9500' }} />}
              {hoverDay === day && evt && (
                <div style={{
                  position: 'absolute', bottom: '100%', left: '50%', transform: 'translate(-50%, -4px)',
                  background: '#1d1d1f', color: 'white', fontSize: 10, padding: '4px 8px',
                  borderRadius: 6, whiteSpace: 'nowrap', zIndex: 10, pointerEvents: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}>
                  {evt}
                  <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', border: '4px solid transparent', borderTopColor: '#1d1d1f' }} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Chart Helpers
 ───────────────────────────────────────────── */
const getCurvePath = (data: number[], maxH: number, width: number, height: number) => {
  if (data.length < 2) return ""
  const points = data.map((h, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - (h / maxH) * height
  }))
  
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i]
    const p1 = points[i + 1]
    const cp1x = p0.x + (p1.x - p0.x) / 2
    d += ` C ${cp1x} ${p0.y}, ${cp1x} ${p1.y}, ${p1.x} ${p1.y}`
  }
  return d
}

/* ─────────────────────────────────────────────
   Subject Line Chart (This Week)
 ───────────────────────────────────────────── */
function SubjectLineChart() {
  const subjects = ['পদার্থ', 'রসায়ন', 'গণিত', 'জীব', 'বাংলা']
  const hours = [12, 18, 15, 22, 14]
  const maxH = 25
  const width = 280
  const height = 100
  
  const curve = getCurvePath(hours, maxH, width, height)

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: '#1d1d1f' }}>বিষয়ভিত্তিক অধ্যয়নের প্রগতি</div>
        <div style={{
          fontSize: 12, color: '#8e8e93', border: '1px solid #e5e5ea',
          padding: '4px 10px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer'
        }}>
          এ সপ্তাহ <span style={{ fontSize: 10 }}>▼</span>
        </div>
      </div>
      <div style={{ position: 'relative', height: 120, marginTop: 20 }}>
        {/* Grid lines */}
        {[0, 1, 2].map(i => (
          <div key={i} style={{ position: 'absolute', top: `${i * 50}%`, left: 0, right: 0, borderTop: '1px solid #f2f2f7', zIndex: 0 }} />
        ))}
        {/* Line */}
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, zIndex: 1, overflow: 'visible' }}>
          <defs>
            <linearGradient id="subjGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3a7bd5" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3a7bd5" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Fill */}
          <path d={`${curve} L ${width} ${height} L 0 ${height} Z`} fill="url(#subjGrad)" />
          {/* Stroke */}
          <path d={curve} fill="none" stroke="#3a7bd5" strokeWidth="2.5" strokeLinecap="round" />
          {/* Markers */}
          {hours.map((h, i) => (
            <circle key={i} cx={(i / (subjects.length - 1)) * width} cy={height - (h / maxH) * height} r="4.5" fill="white" stroke="#3a7bd5" strokeWidth="2" />
          ))}
        </svg>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
        {subjects.map(s => (
          <div key={s} style={{ fontSize: 11, color: '#aeaeb2', fontWeight: 600, width: 35, textAlign: 'center' }}>{s}</div>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Weekly Overview Line Chart (Overlapping)
 ───────────────────────────────────────────── */
function WeeklyLineChart() {
  const days = ['শনি', 'রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক্র']
  const thisWeek = [10, 24, 15, 20, 18, 32, 25]
  const lastWeek = [15, 10, 22, 18, 12, 15, 10]
  const avgWeek  = [18, 15, 20, 22, 16, 25, 18]
  
  const width = 280
  const height = 100
  const maxH = 40

  const curve1 = getCurvePath(thisWeek, maxH, width, height)
  const curve2 = getCurvePath(lastWeek, maxH, width, height)
  const curve3 = getCurvePath(avgWeek, maxH, width, height)

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: '#1d1d1f' }}>সাপ্তাহিক অধ্যয়নের তুলনা</div>
        <div style={{
          fontSize: 12, color: '#8e8e93', border: '1px solid #e5e5ea',
          padding: '4px 10px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer'
        }}>
          সব সময় <span style={{ fontSize: 10 }}>▼</span>
        </div>
      </div>

      <div style={{ position: 'relative', height: 120, marginTop: 20 }}>
        {/* Grid lines */}
        {[0, 1, 2].map(i => (
          <div key={i} style={{ position: 'absolute', top: `${i * 50}%`, left: 0, right: 0, borderTop: '1px solid #f2f2f7', zIndex: 0 }} />
        ))}
        {/* Lines */}
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, zIndex: 1, overflow: 'visible' }}>
          <defs>
            <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3a7bd5" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#3a7bd5" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff7b54" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ff7b54" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="grad3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5ab87a" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#5ab87a" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Fills */}
          <path d={`${curve1} L ${width} ${height} L 0 ${height} Z`} fill="url(#grad1)" />
          <path d={`${curve2} L ${width} ${height} L 0 ${height} Z`} fill="url(#grad2)" />
          <path d={`${curve3} L ${width} ${height} L 0 ${height} Z`} fill="url(#grad3)" />
          
          {/* Strokes */}
          <path d={curve3} fill="none" stroke="#5ab87a" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 3" />
          <path d={curve2} fill="none" stroke="#ff7b54" strokeWidth="2" strokeLinecap="round" />
          <path d={curve1} fill="none" stroke="#3a7bd5" strokeWidth="2" strokeLinecap="round" />

          {/* All Markers */}
          {thisWeek.map((h, i) => (
            <circle key={`tw-${i}`} cx={(i / (days.length - 1)) * width} cy={height - (h / maxH) * height} r="3.5" fill="white" stroke="#3a7bd5" strokeWidth="2" />
          ))}
          {lastWeek.map((h, i) => (
            <circle key={`lw-${i}`} cx={(i / (days.length - 1)) * width} cy={height - (h / maxH) * height} r="3.5" fill="white" stroke="#ff7b54" strokeWidth="2" />
          ))}
          {avgWeek.map((h, i) => (
            <circle key={`aw-${i}`} cx={(i / (days.length - 1)) * width} cy={height - (h / maxH) * height} r="2.5" fill="white" stroke="#5ab87a" strokeWidth="1.5" />
          ))}
        </svg>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
        {days.map(d => (
          <div key={d} style={{ fontSize: 11, color: '#aeaeb2', fontWeight: 600, width: 35, textAlign: 'center' }}>{d}</div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 15, marginTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3a7bd5' }} />
          <span style={{ fontSize: 10, color: '#8e8e93', fontWeight: 600 }}>এ সপ্তাহ</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff7b54' }} />
          <span style={{ fontSize: 10, color: '#8e8e93', fontWeight: 600 }}>গত সপ্তাহ</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 8, height: 2, background: '#5ab87a' }} />
          <span style={{ fontSize: 10, color: '#8e8e93', fontWeight: 600 }}>গড়</span>
        </div>
      </div>
    </div>
  )
}

const navBtn: React.CSSProperties = {
  width: 26, height: 26, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.8)',
  boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', color: '#1d1d1f', fontWeight: 800, fontSize: 12, transition: 'all 200ms'
}
/* ─────────────────────────────────────────────
   Page content renderers
───────────────────────────────────────────── */
function OverviewPage({ displayName }: { displayName: string }) {
  const { user } = useAuth()
  const enrolledCount = user?.enrolledCourses?.length || 0
  const completedCount = user?.completedTopics?.length || 0
  const progressPercent = Math.min(Math.round((completedCount / 10) * 100), 100)
  
  const [examIdx, setExamIdx] = useState(0)
  const [assignIdx, setAssignIdx] = useState(0)
  const pendingAssignments = assignments.filter(a => !a.done)
  
  const pendingAssignment = pendingAssignments[assignIdx] || assignments[0]
  const upcomingExam = exams[examIdx] || exams[0]

  return (
    <div>
      {/* Welcome Banner - Compact Refined Version */}
      <div style={{
        padding: '12px 0 24px', marginBottom: 20,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid #f2f2f7'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1d1d1f', letterSpacing: '-0.02em' }}>
            স্বাগতম, {displayName}! 👋
          </h1>
          <button 
            style={{
              padding: '8px 20px', borderRadius: 10, border: 'none',
              background: '#3a7bd5', color: 'white', fontWeight: 700, fontSize: 13,
              cursor: 'pointer', boxShadow: '0 4px 12px rgba(58,123,213,0.2)',
              transition: 'transform 200ms ease',
            }}
            onClick={() => {
              window.location.href = user?.enrolledCourses?.[0] ? `/course/${user.enrolledCourses[0]}` : '/course/physics-12'
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
          >
            শিখতে শুরু করুন →
          </button>
        </div>

        {/* Compact Global Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#f5f5f7', padding: '10px 16px', borderRadius: 14 }}>
          <div style={{ position: 'relative', width: 44, height: 44 }}>
            <svg width="44" height="44" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="19" fill="none" stroke="#e5e5ea" strokeWidth="4" />
              <circle cx="22" cy="22" r="19" fill="none" stroke="#3a7bd5" strokeWidth="4" 
                strokeDasharray={`${2 * Math.PI * 19}`} 
                strokeDashoffset={`${2 * Math.PI * 19 * (1 - progressPercent / 100)}`}
                strokeLinecap="round" transform="rotate(-90 22 22)" style={{ transition: 'stroke-dashoffset 800ms ease-out' }}
              />
              <text x="22" y="26" textAnchor="middle" fill="#1d1d1f" style={{ fontSize: 10, fontWeight: 800 }}>{progressPercent}%</text>
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#1d1d1f' }}>সামগ্রিক প্রগতি</div>
            <div style={{ fontSize: 10, color: '#8e8e93' }}>{completedCount}টি পাঠ সম্পন্ন</div>
          </div>
        </div>
      </div>

      {/* Course cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 28 }} className="course-row">
        {courseCards.map(c => (
          <div key={c.id} 
            onClick={() => window.location.href = `/course/${c.id}`}
            style={{
              background: c.bg, border: `1px solid ${c.color}25`,
              borderRadius: 18, padding: '18px 18px 16px', cursor: 'pointer',
              transition: 'transform 300ms ease, box-shadow 300ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
          >
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: `${c.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 12, color: c.color,
            }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="14" height="14" rx="3" stroke={c.color} strokeWidth="1.5" />
                <path d="M5 6h8M5 9h5" stroke={c.color} strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#1d1d1f', marginBottom: 2 }}>{c.title}</div>
            <div style={{ fontSize: 12, color: '#6e6e73', marginBottom: 12 }}>{c.class}</div>
            <div style={{ display: 'flex', gap: 10, fontSize: 11, color: '#8e8e93' }}>
              <span>📖 {c.lessons}</span>
              <span>|</span>
              <span>📄 {c.files}</span>
              <span>|</span>
              <span>👥 {c.students}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 28 }} className="charts-row">
        <div style={{ ...card, display: 'flex', flexDirection: 'column' }} className="hover-lift-sm">
          <SubjectLineChart />
        </div>
        <div style={{ ...card, display: 'flex', flexDirection: 'column' }} className="hover-lift-sm">
          <WeeklyLineChart />
        </div>
      </div>

      {/* Upcoming & Pending Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="upcoming-row">
        {/* Upcoming Exam */}
        <div style={{ ...card, position: 'relative', overflow: 'hidden' }} className="hover-lift-sm">
          <div style={{
            position: 'absolute', top: 0, right: 0, width: 80, height: 80,
            background: 'radial-gradient(circle at top right, rgba(90,184,122,0.15) 0%, transparent 70%)',
            borderBottomLeftRadius: 80, pointerEvents: 'none',
          }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: 'rgba(90,184,122,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5ab87a'
            }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="9" r="7"/>
                <polyline points="9 5 9 9 12 12"/>
              </svg>
            </div>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#1d1d1f', flex: 1 }}>আসন্ন পরীক্ষা</div>
            <div style={{ display: 'flex', gap: 6, zIndex: 10 }}>
              <button onClick={() => setExamIdx(i => Math.max(0, i - 1))} disabled={examIdx === 0} style={{ ...navBtn, opacity: examIdx === 0 ? 0.4 : 1, cursor: examIdx === 0 ? 'default' : 'pointer' }}>{"<"}</button>
              <button onClick={() => setExamIdx(i => Math.min(exams.length - 1, i + 1))} disabled={examIdx === exams.length - 1} style={{ ...navBtn, opacity: examIdx === exams.length - 1 ? 0.4 : 1, cursor: examIdx === exams.length - 1 ? 'default' : 'pointer' }}>{">"}</button>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 13, color: '#8e8e93', fontWeight: 600 }}>{upcomingExam.subject} – {upcomingExam.topic}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#1d1d1f' }}>{upcomingExam.date}, {upcomingExam.time}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <div style={{ background: 'rgba(90,184,122,0.15)', color: '#5ab87a', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
                {upcomingExam.daysLeft} দিন বাকি
              </div>
              <div style={{ fontSize: 12, color: '#6e6e73' }}>সিলেবাস দেখুন</div>
            </div>
          </div>
        </div>

        {/* Pending Assignment */}
        <div style={{ ...card, position: 'relative', overflow: 'hidden' }} className="hover-lift-sm">
          <div style={{
            position: 'absolute', top: 0, right: 0, width: 80, height: 80,
            background: 'radial-gradient(circle at top right, rgba(224,112,80,0.15) 0%, transparent 70%)',
            borderBottomLeftRadius: 80, pointerEvents: 'none',
          }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: 'rgba(224,112,80,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e07050'
            }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 2v4h4" />
                <path d="M4 2h6l4 4v10a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" />
                <line x1="7" y1="12" x2="11" y2="12" />
                <line x1="7" y1="9" x2="11" y2="9" />
              </svg>
            </div>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#1d1d1f', flex: 1 }}>অমীমাংসিত অ্যাসাইনমেন্ট</div>
            <div style={{ display: 'flex', gap: 6, zIndex: 10 }}>
              <button onClick={() => setAssignIdx(i => Math.max(0, i - 1))} disabled={assignIdx === 0} style={{ ...navBtn, opacity: assignIdx === 0 ? 0.4 : 1, cursor: assignIdx === 0 ? 'default' : 'pointer' }}>{"<"}</button>
              <button onClick={() => setAssignIdx(i => Math.min(pendingAssignments.length - 1, i + 1))} disabled={assignIdx === pendingAssignments.length - 1} style={{ ...navBtn, opacity: assignIdx === pendingAssignments.length - 1 ? 0.4 : 1, cursor: assignIdx === pendingAssignments.length - 1 ? 'default' : 'pointer' }}>{">"}</button>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 13, color: '#8e8e93', fontWeight: 600 }}>{pendingAssignment.subject} – {pendingAssignment.title}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#1d1d1f' }}>{pendingAssignment.due}, {pendingAssignment.time}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <div style={{ background: 'rgba(224,112,80,0.15)', color: '#e07050', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
                জমা দিন
              </div>
              <button style={{
                 border: 'none', background: 'none', color: '#3a7bd5', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: 0
              }} onClick={() => window.location.href = '/dashboard?page=assignment'}>এখনই জমা দিন →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AssignmentPage() {
  const [done, setDone] = useState(assignments.map(a => a.done))
  return (
    <div>
      <h2 style={pageTitle}>অ্যাসাইনমেন্ট</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {assignments.map((a, i) => (
          <div key={i} style={{
            ...card, display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px',
            borderLeft: `4px solid ${done[i] ? '#5ab87a' : '#3a7bd5'}`,
            opacity: done[i] ? 0.65 : 1, transition: 'all 300ms ease',
          }}>
            <input type="checkbox" checked={done[i]} onChange={() => setDone(d => d.map((v, j) => j === i ? !v : v))}
              style={{ width: 16, height: 16, accentColor: '#3a7bd5', cursor: 'pointer', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#1d1d1f', textDecoration: done[i] ? 'line-through' : 'none' }}>{a.title}</div>
              <div style={{ fontSize: 12, color: '#8e8e93', marginTop: 2 }}>{a.subject}</div>
            </div>
            <div style={{ fontSize: 12, color: done[i] ? '#5ab87a' : '#e07050', fontWeight: 600, whiteSpace: 'nowrap' }}>
              {done[i] ? '✓ সম্পন্ন' : `জমার তারিখ: ${a.due}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReportsPage() {
  const { user } = useAuth()
  const enrolledCount = user?.enrolledCourses.length || 0
  const completedCount = user?.completedTopics.length || 0

  return (
    <div>
      <h2 style={pageTitle}>রিপোর্ট</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'মোট অধ্যয়ন পাঠ', value: `${completedCount}টি`, color: '#3a7bd5' },
          { label: 'এনরোল করা কোর্স',  value: `${enrolledCount}টি`,       color: '#5ab87a' },
          { label: 'সফলতা সূচক', value: `${Math.min(completedCount * 120, 8966 + completedCount * 100)}`,   color: '#8250d2' },
        ].map(s => (
          <div key={s.label} style={{ ...card, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: '#6e6e73' }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="charts-row">
        <div style={card}>
          <SubjectLineChart />
        </div>
        <div style={card}>
          <WeeklyLineChart />
        </div>
      </div>
    </div>
  )
}

function FilesPage() {
  const typeColor: Record<string, string> = { pdf: '#d25a3c', doc: '#3a7bd5', ppt: '#e07050' }
  return (
    <div>
      <h2 style={pageTitle}>ফাইল স্টোরেজ</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {files.map((f, i) => (
          <div key={i} style={{ ...card, display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `${typeColor[f.type]}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 2h6l4 4v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" stroke={typeColor[f.type]} strokeWidth="1.4" />
                <path d="M10 2v4h4" stroke={typeColor[f.type]} strokeWidth="1.3" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#1d1d1f' }}>{f.name}</div>
              <div style={{ fontSize: 12, color: '#8e8e93' }}>{f.size} · {f.date}</div>
            </div>
            <span style={{
              fontSize: 11, fontWeight: 700, color: typeColor[f.type],
              background: `${typeColor[f.type]}15`, borderRadius: 6, padding: '3px 8px',
              textTransform: 'uppercase',
            }}>{f.type}</span>
            <button style={{
              background: '#f5f5f7', border: 'none', borderRadius: 10, padding: '8px 14px',
              fontSize: 13, color: '#3a7bd5', fontWeight: 600, cursor: 'pointer', fontFamily: "'Anek Bangla', sans-serif",
              transition: 'background 300ms',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#e8f0fb')}
              onMouseLeave={e => (e.currentTarget.style.background = '#f5f5f7')}>
              ডাউনলোড
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function InboxPage() {
  const { user } = useAuth()
  const myName = user?.displayName || 'User'
  const [openChats, setOpenChats] = useState<string[]>([])
  const [chatMessages, setChatMessages] = useState<Record<string, { text: string; from: 'me' | 'them'; time: string }[]>>({})
  const [chatInputs, setChatInputs] = useState<Record<string, string>>({})
  const [showStickers, setShowStickers] = useState<string | null>(null)
  const [searchInbox, setSearchInbox] = useState('')
  const [selectedContact, setSelectedContact] = useState<string | null>(null)

  const contacts = [
    { name: 'প্রফেসর আহমেদ', status: 'online' as const, lastMsg: 'আজকের ক্লাসে পদার্থবিজ্ঞানের অধ্যায় ৫ পড়ে আসবে।', time: '৯:৩০ AM', unread: 2 },
    { name: 'মিস রাহেলা', status: 'online' as const, lastMsg: 'তোমার অ্যাসাইনমেন্ট জমা দেওয়ার তারিখ কাল পর্যন্ত।', time: 'গতকাল', unread: 1 },
    { name: 'শিখবেই বাংলাদেশ', status: 'offline' as const, lastMsg: 'নতুন কোর্স: ডিজিটাল মার্কেটিং এখন উপলব্ধ!', time: '১ মার্চ', unread: 0 },
    { name: 'মডারেটর', status: 'offline' as const, lastMsg: 'তোমার কমিউনিটি পোস্টে ৩টি উত্তর এসেছে।', time: '২৮ ফেব', unread: 0 },
    { name: 'করিম উদ্দিন', status: 'online' as const, lastMsg: 'ভাই, গণিতের নোটগুলো শেয়ার করবে?', time: '১০:১৫ AM', unread: 3 },
    { name: 'সুমাইয়া খান', status: 'away' as const, lastMsg: 'TED Talks-এর লিংক পাঠাও তো!', time: 'গতকাল', unread: 0 },
  ]

  const stickers = ['😀','😂','🥰','😎','🤔','👍','👏','🎉','❤️','🔥','💪','📚','✍️','🌟','🚀','💡']

  const initials = (name: string) => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  const statusColor = (s: string) => s === 'online' ? '#5ab87a' : s === 'away' ? '#ffcc00' : '#c7c7cc'

  const openChat = (name: string) => {
    if (!openChats.includes(name)) {
      setOpenChats(prev => [...prev.slice(-2), name]) // max 3 windows
    }
    setSelectedContact(name)
    // Seed initial messages if empty
    if (!chatMessages[name]) {
      const contact = contacts.find(c => c.name === name)
      setChatMessages(prev => ({
        ...prev,
        [name]: [{ text: contact?.lastMsg || 'হ্যালো!', from: 'them' as const, time: contact?.time || 'এখন' }]
      }))
    }
  }

  const closeChat = (name: string) => {
    setOpenChats(prev => prev.filter(n => n !== name))
    if (selectedContact === name) setSelectedContact(null)
  }

  const sendMsg = (name: string) => {
    const text = chatInputs[name]?.trim()
    if (!text) return
    setChatMessages(prev => ({
      ...prev,
      [name]: [...(prev[name] || []), { text, from: 'me' as const, time: 'এখন' }]
    }))
    setChatInputs(prev => ({ ...prev, [name]: '' }))
    setShowStickers(null)
    // Simulate reply
    setTimeout(() => {
      const replies = ['বুঝেছি!', 'ঠিক আছে, ধন্যবাদ!', 'আচ্ছা, পরে কথা হবে।', 'দারুণ!', 'হ্যাঁ, অবশ্যই!', 'ওকে, দেখি কী করা যায়।']
      setChatMessages(prev => ({
        ...prev,
        [name]: [...(prev[name] || []), { text: replies[Math.floor(Math.random() * replies.length)], from: 'them' as const, time: 'এখন' }]
      }))
    }, 1500 + Math.random() * 1000)
  }

  const sendSticker = (name: string, sticker: string) => {
    setChatMessages(prev => ({
      ...prev,
      [name]: [...(prev[name] || []), { text: sticker, from: 'me' as const, time: 'এখন' }]
    }))
    setShowStickers(null)
  }

  const filteredContacts = contacts.filter(c => c.name.toLowerCase().includes(searchInbox.toLowerCase()))

  return (
    <div>
      <h2 style={pageTitle}>মেসেঞ্জার</h2>

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f0f2f5', borderRadius: 20, padding: '8px 14px', marginBottom: 16 }}>
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="#65676b" strokeWidth="1.5"/><path d="M11 11l3 3" stroke="#65676b" strokeWidth="1.5" strokeLinecap="round"/></svg>
        <input value={searchInbox} onChange={e => setSearchInbox(e.target.value)} placeholder="মেসেঞ্জারে খুঁজুন..."
          style={{ border: 'none', background: 'none', outline: 'none', flex: 1, fontSize: 13, fontFamily: "'Anek Bangla', sans-serif", color: '#050505' }} />
      </div>

      {/* Online now */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#65676b', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>অনলাইনে আছেন</div>
        <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 4 }} className="scroll-x">
          {contacts.filter(c => c.status === 'online').map(c => (
            <div key={c.name} onClick={() => openChat(c.name)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', minWidth: 56 }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #3a7bd5, #5a6cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 16 }}>{initials(c.name)}</div>
                <div style={{ position: 'absolute', bottom: 1, right: 1, width: 12, height: 12, borderRadius: '50%', background: '#5ab87a', border: '2px solid white' }} />
              </div>
              <span style={{ fontSize: 11, color: '#050505', fontWeight: 600, textAlign: 'center', lineHeight: 1.2, maxWidth: 64, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contact list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filteredContacts.map(c => (
          <div key={c.name} onClick={() => openChat(c.name)} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10,
            cursor: 'pointer', transition: 'background 150ms',
            background: selectedContact === c.name ? 'rgba(58,123,213,0.08)' : 'transparent',
          }}
            onMouseEnter={e => { if (selectedContact !== c.name) e.currentTarget.style.background = '#f2f2f5' }}
            onMouseLeave={e => { if (selectedContact !== c.name) e.currentTarget.style.background = 'transparent' }}
          >
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #3a7bd5, #5a6cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 16 }}>{initials(c.name)}</div>
              <div style={{ position: 'absolute', bottom: 1, right: 1, width: 12, height: 12, borderRadius: '50%', background: statusColor(c.status), border: '2px solid white' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: c.unread ? 800 : 600, fontSize: 14, color: '#050505' }}>{c.name}</div>
              <div style={{ fontSize: 12, color: c.unread ? '#050505' : '#65676b', fontWeight: c.unread ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.lastMsg} · {c.time}</div>
            </div>
            {c.unread > 0 && (
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#3a7bd5', color: 'white', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{c.unread}</div>
            )}
          </div>
        ))}
      </div>

      {/* ═══ Floating Messenger Windows ═══ */}
      <div style={{ position: 'fixed', bottom: 0, right: 96, zIndex: 999, display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        {openChats.map((name, idx) => {
          const msgs = chatMessages[name] || []
          const inp = chatInputs[name] || ''
          const contact = contacts.find(c => c.name === name)
          return (
            <div key={name} style={{
              width: 328, height: 420, borderRadius: '10px 10px 0 0', overflow: 'hidden',
              boxShadow: '0 -2px 16px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column',
              background: '#ffffff', animation: 'msg-slide-up 250ms ease-out',
            }}>
              {/* Chat header */}
              <div style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #e4e6eb', background: '#ffffff', flexShrink: 0 }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #3a7bd5, #5a6cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 12 }}>{initials(name)}</div>
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: 8, height: 8, borderRadius: '50%', background: statusColor(contact?.status || 'offline'), border: '1.5px solid white' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#050505', lineHeight: 1.2 }}>{name}</div>
                  <div style={{ fontSize: 10, color: '#65676b' }}>{contact?.status === 'online' ? 'সক্রিয়' : 'অফলাইন'}</div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); closeChat(name) }} style={{ width: 28, height: 28, borderRadius: '50%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#65676b', fontSize: 16, transition: 'background 150ms' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f2f2f5'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>✕</button>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 4 }} ref={el => { if (el) el.scrollTop = el.scrollHeight }}>
                {msgs.map((m, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start' }}>
                    {m.from === 'them' && <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, #3a7bd5, #5a6cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 9, marginRight: 4, flexShrink: 0, alignSelf: 'flex-end' }}>{initials(name)}</div>}
                    <div style={{
                      maxWidth: '75%', padding: m.text.length <= 3 || m.text.startsWith('[STICKER:') ? '4px 8px' : '8px 12px',
                      borderRadius: m.from === 'me' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      background: m.from === 'me' ? '#3a7bd5' : '#e4e6eb',
                      color: m.from === 'me' ? 'white' : '#050505',
                      fontSize: m.text.length <= 3 ? 28 : 13, lineHeight: m.text.length <= 3 || m.text.startsWith('[STICKER:') ? 1.2 : 1.5, wordBreak: 'break-word',
                    }}>
                      {m.text === '[STICKER:thumbsup]' ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg> :
                       m.text === '[STICKER:heart]' ? <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" color="#ff2d55"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg> :
                       m.text === '[STICKER:smile]' ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg> :
                       m.text === '[STICKER:flame]' ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" color="#ff9500"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg> :
                       m.text === '[STICKER:star]' ? <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" color="#ffcc00"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> :
                       m.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Sticker picker */}
              {showStickers === name && (
                <div style={{ padding: '8px', borderTop: '1px solid #e4e6eb', display: 'flex', gap: 14, background: '#fafafa', maxHeight: 100, overflowY: 'auto' }}>
                  <button onClick={() => sendSticker(name, '[STICKER:thumbsup]')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#65676b" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg></button>
                  <button onClick={() => sendSticker(name, '[STICKER:heart]')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><svg width="24" height="24" viewBox="0 0 24 24" fill="#ff2d55" stroke="none"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg></button>
                  <button onClick={() => sendSticker(name, '[STICKER:smile]')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#65676b" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg></button>
                  <button onClick={() => sendSticker(name, '[STICKER:flame]')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff9500" strokeWidth="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg></button>
                  <button onClick={() => sendSticker(name, '[STICKER:star]')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><svg width="24" height="24" viewBox="0 0 24 24" fill="#ffcc00" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></button>
                </div>
              )}

              {/* Input bar */}
              <div style={{ padding: '6px 8px', display: 'flex', alignItems: 'center', gap: 4, borderTop: '1px solid #e4e6eb', flexShrink: 0, background: '#ffffff' }}>
                {/* Attachment */}
                <button style={{ ...chatToolBtn }} title="ফাইল সংযুক্ত করুন">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3a7bd5" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                </button>
                {/* Photo */}
                <button style={{ ...chatToolBtn }} title="ছবি পাঠান">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5ab87a" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </button>
                {/* Sticker */}
                <button onClick={() => setShowStickers(showStickers === name ? null : name)} style={{ ...chatToolBtn, color: showStickers === name ? '#3a7bd5' : '#ff9500' }} title="স্টিকার">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                </button>
                {/* Text input */}
                <div style={{ flex: 1, display: 'flex', background: '#f0f2f5', borderRadius: 20, overflow: 'hidden' }}>
                  <input value={inp} onChange={e => setChatInputs(prev => ({ ...prev, [name]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && sendMsg(name)} placeholder="Aa"
                    style={{ flex: 1, padding: '8px 12px', border: 'none', background: 'none', fontSize: 13, fontFamily: "'Anek Bangla', sans-serif", outline: 'none', color: '#050505' }} />
                </div>
                {/* Send / Like */}
                {inp.trim() ? (
                  <button onClick={() => sendMsg(name)} style={{ ...chatToolBtn }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#3a7bd5"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                  </button>
                ) : (
                  <button onClick={() => sendSticker(name, '[STICKER:thumbsup]')} style={{ ...chatToolBtn }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3a7bd5" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <style>{`
        @keyframes msg-slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

function SettingsPage({ user }: { user: { username: string; displayName: string } }) {
  const [name, setName] = useState(user.displayName)
  const [saved, setSaved] = useState(false)
  return (
    <div>
      <h2 style={pageTitle}>সেটিংস</h2>
      <div style={{ ...card, maxWidth: 520 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1d1d1f', marginBottom: 20 }}>প্রোফাইল সম্পাদনা</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={lbl}>আপনার নাম</label>
            <input value={name} onChange={e => { setName(e.target.value); setSaved(false) }}
              style={inp}
              onFocus={e => (e.target.style.borderColor = '#3a7bd5')}
              onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.10)')} />
          </div>
          <div>
            <label style={lbl}>ব্যবহারকারী নাম</label>
            <input value={user.username} readOnly style={{ ...inp, background: '#f5f5f7', color: '#8e8e93' }} />
          </div>
          <div>
            <label style={lbl}>ইমেইল (ঐচ্ছিক)</label>
            <input type="email" placeholder="example@email.com" style={inp}
              onFocus={e => (e.target.style.borderColor = '#3a7bd5')}
              onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.10)')} />
          </div>
          <button onClick={() => setSaved(true)} className="btn-primary" style={{ padding: '12px 24px', fontSize: 14, alignSelf: 'flex-start' }}>
            {saved ? '✓ সংরক্ষিত!' : 'পরিবর্তন সংরক্ষণ করুন'}
          </button>
        </div>
      </div>
      <div style={{ ...card, maxWidth: 520, marginTop: 14 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1d1d1f', marginBottom: 16 }}>বিজ্ঞপ্তি সেটিংস</h3>
        {['নতুন কোর্স আপডেট', 'অ্যাসাইনমেন্ট রিমাইন্ডার', 'কমিউনিটি উত্তর', 'ইমেইল নিউজলেটার'].map(item => (
          <div key={item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f2f2f5' }}>
            <span style={{ fontSize: 14, color: '#3c3c43', fontFamily: "'Anek Bangla', sans-serif" }}>{item}</span>
            <input type="checkbox" defaultChecked style={{ width: 16, height: 16, accentColor: '#3a7bd5', cursor: 'pointer' }} />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Shared styles
───────────────────────────────────────────── */
const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.82)',
  backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.55)',
  borderRadius: 18, padding: '20px 22px',
  boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
}
const td: React.CSSProperties = { padding: '11px 0', color: '#3c3c43', fontSize: 13 }
const pageTitle: React.CSSProperties = { fontSize: 22, fontWeight: 800, color: '#1d1d1f', marginBottom: 20 }
const lbl: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 600, color: '#3c3c43', marginBottom: 6 }
const inp: React.CSSProperties = {
  width: '100%', padding: '12px 14px', borderRadius: 12,
  border: '1.5px solid rgba(0,0,0,0.10)', background: 'rgba(255,255,255,0.80)',
  fontSize: 14, fontFamily: "'Anek Bangla', sans-serif", color: '#1d1d1f',
  outline: 'none', transition: 'border-color 300ms',
}
const chatToolBtn: React.CSSProperties = {
  width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'none',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'background 150ms', flexShrink: 0,
}

/* ─────────────────────────────────────────────
   Sidebar nav config
───────────────────────────────────────────── */
const navItems: { id: Page; label: string; badge?: number }[] = [
  { id: 'overview',    label: 'ওভারভিউ' },
  { id: 'assignment',  label: 'অ্যাসাইনমেন্ট' },
  { id: 'reports',     label: 'রিপোর্ট', badge: 12 },
  { id: 'files',       label: 'ফাইল স্টোরেজ' },
  { id: 'inbox',       label: 'ইনবক্স', badge: 2 },
  { id: 'forum',       label: 'ফোরাম' },
  { id: 'notebook',    label: 'নোটবুক' },
  { id: 'settings',    label: 'সেটিংস' },
]

/* ─────────────────────────────────────────────
   Main Dashboard
───────────────────────────────────────────── */
export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [page, setPage] = useState<Page>('overview')
  const [search, setSearch] = useState('')
  
  // To-do states
  const [todoList, setTodoList] = useState(todos)
  const [todoPageIndex, setTodoPageIndex] = useState(0)
  const [isAddingTodo, setIsAddingTodo] = useState(false)
  const [newTodoText, setNewTodoText] = useState('')

  const handleToggleTodo = (id: number) => {
    setTodoList(prev => prev.map((t, idx) => idx === id ? { ...t, done: !t.done } : t))
  }

  const handleAddTodo = () => {
    if (!newTodoText.trim()) return
    const newTask = { text: newTodoText, time: 'নতুন', done: false, tag: 'কাজ' }
    setTodoList([newTask, ...todoList])
    setNewTodoText('')
    setIsAddingTodo(false)
    setTodoPageIndex(0)
  }

  const itemsPerPage = 6
  const paginatedTodos = todoList.slice(todoPageIndex * itemsPerPage, (todoPageIndex + 1) * itemsPerPage)
  const totalPages = Math.ceil(todoList.length / itemsPerPage)

  useEffect(() => {
    if (!user) router.replace('/login')
  }, [user, router])

  if (!user) return null

  const initials = user.displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      background: '#f5f5f7',
      fontFamily: "'Anek Bangla', sans-serif",
    }}>
      {/* ══ Sidebar ══ */}
      <aside style={{
        width: 220, flexShrink: 0,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(0,0,0,0.07)',
        display: 'flex', flexDirection: 'column',
        padding: '24px 16px',
        position: 'sticky', top: 0, height: '100vh',
        overflowY: 'auto',
      }}>
        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 28 }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="9" fill="url(#sblg)" />
            <path d="M8 8h7a3 3 0 0 1 3 3v10H8V8z" fill="rgba(255,255,255,0.92)" />
            <path d="M24 8h-7a3 3 0 0 0-3 3v10h10V8z" fill="rgba(255,255,255,0.38)" />
            <defs><linearGradient id="sblg" x1="0" y1="0" x2="32" y2="32"><stop stopColor="#3a7bd5"/><stop offset="1" stopColor="#5a6cf8"/></linearGradient></defs>
          </svg>
          <span style={{ fontWeight: 800, fontSize: 15, color: '#1d1d1f', lineHeight: 1.2 }}>শিখবেই<br />বাংলাদেশ</span>
        </a>

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {navItems.map(item => {
            const active = page === item.id
            return (
              <button key={item.id} onClick={() => setPage(item.id)} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 12, border: 'none',
                background: active ? '#1d1d1f' : 'transparent',
                color: active ? 'white' : '#3c3c43',
                fontFamily: "'Anek Bangla', sans-serif",
                fontSize: 14, fontWeight: active ? 600 : 400,
                cursor: 'pointer', transition: 'all 300ms ease',
                textAlign: 'left', width: '100%',
              }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#f5f5f7' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ color: active ? 'white' : '#8e8e93', flexShrink: 0 }}>
                  {Icon[item.id]}
                </span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span style={{
                    background: active ? 'rgba(255,255,255,0.20)' : '#3a7bd5',
                    color: 'white', fontSize: 10, fontWeight: 700,
                    borderRadius: 999, padding: '1px 6px', minWidth: 18, textAlign: 'center',
                  }}>{item.badge}</span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Logout */}
        <button onClick={() => { logout(); router.push('/') }} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px', borderRadius: 12, border: 'none',
          background: 'transparent', color: '#ff6b6b',
          fontFamily: "'Anek Bangla', sans-serif",
          fontSize: 14, cursor: 'pointer', width: '100%', marginTop: 8,
          transition: 'background 300ms',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,107,107,0.08)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M12 4h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2" stroke="#ff6b6b" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M8 13l4-4-4-4M3 9h9" stroke="#ff6b6b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          লগআউট
        </button>
      </aside>

      {/* ══ Main ══ */}
      <main style={{ flex: 1, minWidth: 0, padding: '28px 24px', overflowY: 'auto' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(255,255,255,0.80)', borderRadius: 12,
            padding: '10px 14px', border: '1px solid rgba(0,0,0,0.07)',
          }}>
            {Icon.search}
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="কোর্স বা বিষয় খুঁজুন..."
              style={{ border: 'none', background: 'none', outline: 'none', flex: 1, fontSize: 14, fontFamily: "'Anek Bangla', sans-serif", color: '#1d1d1f' }} />
          </div>
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'rgba(255,255,255,0.80)', border: '1px solid rgba(0,0,0,0.07)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3c3c43',
            }}>{Icon.bell}</div>
            <div style={{
              position: 'absolute', top: 7, right: 7,
              width: 8, height: 8, borderRadius: '50%', background: '#ff6b6b',
              border: '2px solid #f5f5f7',
            }} />
          </div>
        </div>

        {/* Page content */}
        {page === 'overview'   && <OverviewPage displayName={user.displayName} />}
        {page === 'assignment' && <AssignmentPage />}
        {page === 'reports'    && <ReportsPage />}
        {page === 'files'      && <FilesPage />}
        {page === 'inbox'      && <InboxPage />}
        {page === 'forum'      && <ForumPage />}
        {page === 'notebook'   && <NotebookPage />}
        {page === 'settings'   && <SettingsPage user={user} />}
      </main>

      {/* ══ Right panel ══ */}
      <aside style={{
        width: 268, flexShrink: 0,
        padding: '28px 20px 28px 0',
        display: (page === 'forum' || page === 'notebook') ? 'none' : 'flex', flexDirection: 'column', gap: 14,
        height: '100vh', position: 'sticky', top: 0,
      }} className="right-panel">

        {/* Profile card */}
        <div style={{ ...card, textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8e8e93' }}
              onClick={() => setPage('settings')}>
              {Icon.edit}
            </button>
          </div>
          <div style={{
            width: 60, height: 60, borderRadius: '50%',
            background: 'linear-gradient(135deg, #3a7bd5, #5a6cf8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: 20, margin: '0 auto 10px',
            boxShadow: '0 0 0 4px rgba(58,123,213,0.20)',
          }}>{initials}</div>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#1d1d1f', marginBottom: 2 }}>{user.displayName}</div>
          <div style={{ fontSize: 12, color: '#8e8e93' }}>শিক্ষার্থী</div>
        </div>

        {/* Calendar */}
        <div style={card}>
          <MiniCalendar />
        </div>

        {/* To-do list */}
        <div style={{ 
          ...card, 
          position: 'relative', 
          paddingBottom: 40,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0, // Critical for flex overflow
        }} className="todo-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#1d1d1f' }}>টু-ডু লিস্ট</div>
            {/* Add Button */}
            <button style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#1d1d1f', fontSize: 24, lineHeight: 1, padding: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 300, transition: 'transform 200ms',
            }}
            onClick={() => setIsAddingTodo(!isAddingTodo)}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>

          {isAddingTodo && (
            <div style={{ marginBottom: 14, display: 'flex', gap: 8 }}>
              <input 
                autoFocus
                value={newTodoText}
                onChange={e => setNewTodoText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddTodo()}
                placeholder="নতুন কাজ..."
                style={{
                  flex: 1, padding: '8px 12px', borderRadius: 8, border: '1.5px solid #e5e5ea',
                  fontSize: 13, fontFamily: "'Anek Bangla', sans-serif"
                }}
              />
              <button onClick={handleAddTodo} style={{
                background: '#1d1d1f', color: 'white', border: 'none', borderRadius: 8,
                padding: '0 12px', fontSize: 18, cursor: 'pointer'
              }}>+</button>
            </div>
          )}

          <div style={{ 
            display: 'flex', flexDirection: 'column', gap: 14, 
            overflowY: 'auto', flex: 1, paddingRight: 4,
          }} className="todo-scroll hide-scrollbar">
            {paginatedTodos.length > 0 ? paginatedTodos.map((t, i) => {
              const globalIdx = todoPageIndex * itemsPerPage + i
              return (
              <div key={globalIdx} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <input type="checkbox" checked={t.done}
                  onChange={() => handleToggleTodo(globalIdx)}
                  style={{
                    marginTop: 3, width: 16, height: 16,
                    accentColor: '#1d1d1f', cursor: 'pointer', flexShrink: 0,
                    borderRadius: 4
                  }} />
                <div style={{ flex: 1, paddingTop: 1 }}>
                  <div style={{
                    fontSize: 13, fontWeight: 700, color: '#1d1d1f',
                    textDecoration: t.done ? 'line-through' : 'none',
                    opacity: t.done ? 0.4 : 1, lineHeight: 1.4,
                  }}>{t.text}</div>
                  <div style={{ fontSize: 10, color: t.done ? '#5ab87a' : '#8e8e93', marginTop: 4, fontWeight: 600 }}>
                    {t.time} {t.tag && `· ${t.tag}`}
                  </div>
                </div>
              </div>
            )}) : (
              <div style={{ fontSize: 12, color: '#8e8e93', textAlign: 'center', marginTop: 20 }}>কোনো কাজ নেই</div>
            )}
          </div>

          {/* Pagination Dots */}
          {totalPages > 1 && (
            <div style={{
              position: 'absolute', bottom: 12, left: 0, right: 0,
              display: 'flex', justifyContent: 'center', gap: 6,
            }}>
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                <div key={i} 
                  onClick={() => setTodoPageIndex(i)}
                  style={{
                    width: i === todoPageIndex ? 6 : 5, height: i === todoPageIndex ? 6 : 5,
                    borderRadius: '50%',
                    background: i === todoPageIndex ? '#1d1d1f' : 'rgba(29, 29, 31, 0.2)',
                    transition: 'all 300ms',
                    cursor: 'pointer'
                  }} 
                />
              ))}
            </div>
          )}
        </div>
      </aside>

      <style>{`
        @media (max-width: 1200px) { .right-panel { display: none; } }
        @media (max-width: 860px)  { aside:first-child { width: 64px; } aside:first-child span { display: none; } aside:first-child a span { display: none; } }
        @media (max-width: 640px)  { main { padding: 16px; } }
        .course-row { grid-template-columns: repeat(3,1fr); }
        .charts-row { grid-template-columns: 1.4fr 1fr; }
        .upcoming-row { grid-template-columns: 1fr 1fr; }
        @media (max-width: 900px) { 
          .course-row { grid-template-columns: 1fr 1fr !important; } 
          .charts-row { grid-template-columns: 1fr !important; }
          .upcoming-row { grid-template-columns: 1fr !important; }
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}

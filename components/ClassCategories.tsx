'use client'
import { useRouter } from 'next/navigation'
import { classRouteFromLabel } from '@/constants/learning'

/* SVG icons */
const BagIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="14" fill="rgba(255,179,100,0.15)" />
    <path d="M16 20h16v16a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2V20z" fill="transparent" stroke="rgba(220,120,40,0.7)" strokeWidth="1.8" />
    <path d="M20 20v-3a4 4 0 0 1 8 0v3" stroke="rgba(220,120,40,0.7)" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M22 28l2 2 4-4" stroke="rgba(220,120,40,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const MicroscopeIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="14" fill="rgba(100,179,255,0.15)" />
    <circle cx="24" cy="19" r="6" stroke="rgba(40,120,220,0.70)" strokeWidth="1.8" />
    <path d="M24 25v6M20 35h8M24 13v-3" stroke="rgba(40,120,220,0.70)" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M18 16l3 3M30 16l-3 3" stroke="rgba(40,120,220,0.70)" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)
const AtomIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="14" fill="rgba(150,130,255,0.15)" />
    <circle cx="24" cy="24" r="3" fill="rgba(120,90,240,0.80)" />
    <ellipse cx="24" cy="24" rx="10" ry="5" stroke="rgba(120,90,240,0.55)" strokeWidth="1.5" />
    <ellipse cx="24" cy="24" rx="10" ry="5" stroke="rgba(120,90,240,0.55)" strokeWidth="1.5" transform="rotate(60 24 24)" />
    <ellipse cx="24" cy="24" rx="10" ry="5" stroke="rgba(120,90,240,0.55)" strokeWidth="1.5" transform="rotate(120 24 24)" />
  </svg>
)

const cards = [
  {
    title: 'প্রাথমিক',
    classes: ['শ্রেণি ১', 'শ্রেণি ২', 'শ্রেণি ৩', 'শ্রেণি ৪', 'শ্রেণি ৫'],
    Icon: BagIcon,
    blob: 'rgba(255,179,100,0.25)',
  },
  {
    title: 'মাধ্যমিক',
    classes: ['শ্রেণি ৬', 'শ্রেণি ৭', 'শ্রেণি ৮', 'শ্রেণি ৯', 'শ্রেণি ১০'],
    Icon: MicroscopeIcon,
    blob: 'rgba(100,179,255,0.25)',
  },
  {
    title: 'উচ্চ মাধ্যমিক',
    classes: ['শ্রেণি ১১', 'শ্রেণি ১২', 'এইচএসসি ভর্তি'],
    Icon: AtomIcon,
    blob: 'rgba(150,130,255,0.25)',
  },
]

export default function ClassCategories() {
  const router = useRouter()

  const goToClassCourses = (classLabel: string) => {
    router.push(`/learning/class/${classRouteFromLabel(classLabel)}`)
  }

  return (
    <section className="section" style={{ background: '#f2f2f5' }}>
      <div className="container">
        <h2 className="h2" style={{
          color: '#1d1d1f',
          fontFamily: "'Anek Bangla', sans-serif",
          textAlign: 'center',
          marginBottom: 48,
        }}>
          পরীক্ষার প্রস্তুতি
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
        }} className="cat-grid">
          {cards.map(({ title, classes, Icon, blob }) => (
            <div
              key={title}
              className="glass hover-lift"
              style={{
                padding: '32px 28px',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 240,
              }}
              onClick={() => goToClassCourses(classes[0])}
            >
              {/* blob */}
              <div style={{
                position: 'absolute',
                right: -32, top: -32,
                width: 140, height: 140,
                background: `radial-gradient(circle, ${blob} 0%, transparent 70%)`,
                borderRadius: '50%', pointerEvents: 'none',
              }} />

              {/* icon */}
              <div style={{ marginBottom: 16 }}>
                <Icon />
              </div>

              <div style={{ flex: 1 }}>
                <h3 className="h3" style={{
                  color: '#1d1d1f',
                  fontFamily: "'Anek Bangla', sans-serif",
                  marginBottom: 16,
                }}>
                  {title}
                </h3>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 24 }}>
                  {classes.map(cls => (
                    <button
                      key={cls}
                      type="button"
                      className="pill-tag"
                      onClick={e => {
                        e.stopPropagation()
                        goToClassCourses(cls)
                      }}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>

              {/* Explore link */}
              <button
                type="button"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 5,
                  color: '#800000', fontWeight: 600, fontSize: 14,
                  fontFamily: "'Anek Bangla', sans-serif", padding: 0,
                  transition: 'gap 300ms ease',
                }}
                onClick={e => {
                  e.stopPropagation()
                  goToClassCourses(classes[0])
                }}
                onMouseEnter={e => (e.currentTarget.style.gap = '10px')}
                onMouseLeave={e => (e.currentTarget.style.gap = '5px')}
              >
                বিস্তারিত দেখুন
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="#800000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .cat-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 600px) { .cat-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}

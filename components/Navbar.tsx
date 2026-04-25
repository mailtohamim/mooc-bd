'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

const navLinks = [
  { href: '/', label: 'নীড়পাতা' },
  { href: '#courses', label: 'কোর্সসমূহ' },
  { href: '#notice', label: 'নোটিশ' },
  { href: '#contact', label: 'যোগাযোগ' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const initials = user?.displayName
    ? user.displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : ''

  return (
    <>
      <nav className="main-nav" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.40)',
        transition: 'all 300ms ease',
      }}>
        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <img src="/images/Shikhbei Bangladesh.svg" alt="শিখবেই বাংলাদেশ" style={{ width: 34, height: 34, objectFit: 'contain' }} />
          <span style={{ fontWeight: 800, fontSize: 15, color: '#1d1d1f', fontFamily: "'Anek Bangla', sans-serif", letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
            শিখবেই বাংলাদেশ
          </span>
        </a>

        {/* Center links */}
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="desk-nav">
          {navLinks.map(({ href, label }) => (
            <a key={label} href={href} style={{
              fontFamily: "'Anek Bangla', sans-serif", fontSize: 14, fontWeight: 600,
              color: '#3c3c43', textDecoration: 'none', transition: 'color 300ms', whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#800000')}
              onMouseLeave={e => (e.currentTarget.style.color = '#3c3c43')}
            >{label}</a>
          ))}
        </div>

        {/* Right: download + auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Download button */}
          <a
            href="#"
            className="desk-nav"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(128,0,0,0.07)',
              border: '1.5px solid rgba(128,0,0,0.18)',
              borderRadius: 10, padding: '7px 14px',
              textDecoration: 'none',
              color: '#800000', fontSize: 13, fontWeight: 600,
              fontFamily: "'Anek Bangla', sans-serif", transition: 'all 300ms ease', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(128,0,0,0.14)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(128,0,0,0.07)'; e.currentTarget.style.transform = 'none' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v8M4 7l3 3 3-3M1.5 11.5h11" stroke="#800000" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            অ্যাপ ডাউনলোড
          </a>
          {user ? (
            // Logged in: avatar + dropdown
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setOpen(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(128,0,0,0.08)',
                  border: '1.5px solid rgba(128,0,0,0.20)',
                  borderRadius: '50%', padding: '4px',
                  cursor: 'pointer', transition: 'all 300ms ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(128,0,0,0.14)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(128,0,0,0.08)')}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #800000, #b30000)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: 13, fontWeight: 700,
                }}>
                  {initials}
                </div>
              </button>

              {open && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0,0,0,0.08)', borderRadius: 16,
                  padding: '8px', minWidth: 180,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                  zIndex: 200,
                }}>
                  {[
                    { label: 'ড্যাশবোর্ড', icon: '▤', action: () => { router.push('/dashboard'); setOpen(false) } },
                    { label: 'লগআউট', icon: '→', action: () => { logout(); setOpen(false) } },
                  ].map(item => (
                    <button key={item.label} onClick={item.action} style={{
                      width: '100%', textAlign: 'left', background: 'none', border: 'none',
                      borderRadius: 10, padding: '10px 12px',
                      display: 'flex', alignItems: 'center', gap: 8,
                      color: '#1d1d1f', fontSize: 14, fontFamily: "'Anek Bangla', sans-serif",
                      cursor: 'pointer', transition: 'background 200ms ease',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f7')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                    >
                      <span style={{ fontSize: 13, color: '#6e6e73' }}>{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button className="btn-primary" style={{ padding: '9px 22px', fontSize: 15 }}
              onClick={() => router.push('/login')}>
              লগইন
            </button>
          )}

          {/* Hamburger */}
          <button onClick={() => setOpen(v => !v)} aria-label="মেনু"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'none' }}
            className="ham-btn">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M3 6h16M3 11h16M3 16h16" stroke="#1d1d1f" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </nav>

      <style>{`
        .main-nav { padding: 0 32px; }
        @media (max-width: 768px) {
          .desk-nav { display: none !important; }
          .ham-btn  { display: block !important; }
          .main-nav { padding: 0 16px !important; }
        }
      `}</style>
    </>
  )
}

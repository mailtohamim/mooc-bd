'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const { login, register } = useAuth()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (tab === 'login') {
      const ok = login(username, password)
      if (ok) { router.push('/dashboard') }
      else setError('ব্যবহারকারী নাম বা পাসওয়ার্ড সঠিক নয়।')
    } else {
      if (!displayName.trim()) { setError('আপনার নাম দিন।'); return }
      const ok = register(username, password, displayName)
      if (ok) { router.push('/dashboard') }
      else setError('এই ব্যবহারকারী নাম ইতিমধ্যে ব্যবহৃত হচ্ছে।')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '13px 16px', borderRadius: 14,
    border: '1.5px solid rgba(0,0,0,0.10)', background: 'rgba(255,255,255,0.80)',
    fontSize: 15, fontFamily: "'Anek Bangla', sans-serif", color: '#1d1d1f',
    outline: 'none', transition: 'border-color 300ms ease',
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(160deg, #f5f5f7 0%, #eef3fb 50%, #f0f4ff 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '32px 20px',
      fontFamily: "'Anek Bangla', sans-serif",
    }}>
      {/* Back link */}
      <a href="/" style={{
        position: 'fixed', top: 24, left: 28,
        display: 'flex', alignItems: 'center', gap: 6,
        color: '#3c3c43', textDecoration: 'none', fontSize: 14, fontWeight: 500,
      }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11 4L6 9l5 5" stroke="#3c3c43" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        ফিরে যান
      </a>

      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8,
          }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="12" fill="url(#llg)" />
              <path d="M10 10h9a4 4 0 0 1 4 4v14H10V10z" fill="rgba(255,255,255,0.92)" />
              <path d="M30 10h-9a4 4 0 0 0-4 4v14h13V10z" fill="rgba(255,255,255,0.40)" />
              <defs>
                <linearGradient id="llg" x1="0" y1="0" x2="40" y2="40">
                  <stop stopColor="#800000" /><stop offset="1" stopColor="#b30000" />
                </linearGradient>
              </defs>
            </svg>
            <span style={{ fontWeight: 800, fontSize: 20, color: '#1d1d1f' }}>শিখবেই বাংলাদেশ</span>
          </div>
          <p style={{ fontSize: 15, color: '#6e6e73', marginTop: 4 }}>জ্ঞানের পথে আপনাকে স্বাগতম</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.72)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.50)',
          borderRadius: 24, padding: '32px 32px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.07)',
        }}>
          {/* Tabs */}
          <div style={{
            display: 'flex', background: '#f2f2f5', borderRadius: 12,
            padding: 4, marginBottom: 28,
          }}>
            {(['login', 'register'] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError('') }}
                style={{
                  flex: 1, padding: '9px 0', borderRadius: 9, border: 'none',
                  background: tab === t ? 'white' : 'transparent',
                  boxShadow: tab === t ? '0 2px 10px rgba(0,0,0,0.08)' : 'none',
                  color: tab === t ? '#1d1d1f' : '#6e6e73',
                  fontWeight: tab === t ? 700 : 400,
                  fontSize: 14, fontFamily: "'Anek Bangla', sans-serif",
                  cursor: 'pointer', transition: 'all 300ms ease',
                }}
              >
                {t === 'login' ? 'লগইন' : 'নিবন্ধন'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {tab === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#3c3c43', marginBottom: 6 }}>
                  আপনার নাম
                </label>
                <input
                  type="text" required value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="পূর্ণ নাম লিখুন"
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#800000')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.10)')}
                />
              </div>
            )}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#3c3c43', marginBottom: 6 }}>
                ব্যবহারকারী নাম
              </label>
              <input
                type="text" required value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="username"
                style={{ ...inputStyle, letterSpacing: 0 }}
                onFocus={e => (e.target.style.borderColor = '#800000')}
                onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.10)')}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#3c3c43', marginBottom: 6 }}>
                পাসওয়ার্ড
              </label>
              <input
                type="password" required value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#800000')}
                onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.10)')}
              />
            </div>

            {error && (
              <div style={{
                background: 'rgba(220,60,60,0.08)', border: '1px solid rgba(220,60,60,0.20)',
                borderRadius: 10, padding: '10px 14px',
                color: '#c0392b', fontSize: 13, fontFamily: "'Anek Bangla', sans-serif",
              }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary" style={{
              width: '100%', padding: '14px', fontSize: 16,
              marginTop: 6,
            }}>
              {tab === 'login' ? 'লগইন করুন' : 'নিবন্ধন করুন'}
            </button>
          </form>

          {tab === 'login' && (
            <p style={{ textAlign: 'center', fontSize: 13, color: '#aeaeb2', marginTop: 20, lineHeight: 1.6 }}>
              ডিফল্ট অ্যাকাউন্ট: <strong style={{ color: '#3c3c43' }}>userone</strong> / <strong style={{ color: '#3c3c43' }}>1234</strong>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

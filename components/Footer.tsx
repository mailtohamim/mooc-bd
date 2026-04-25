'use client'

const footerLinks = [
  {
    title: 'সম্পর্কে',
    links: ['আমাদের পরিচয়', 'গোপনীয়তা নীতি', 'ব্যবহারের শর্তাবলী'],
  },
  {
    title: 'দ্রুত লিংক',
    links: ['কোর্সসমূহ', 'পরীক্ষার সূচি', 'বৃত্তি তথ্য'],
  },
  {
    title: 'সহায়তা',
    links: ['সাহায্য কেন্দ্র', 'যোগাযোগ করুন', 'মতামত দিন'],
  },
]

export default function Footer() {
  return (
    <footer style={{
      background: '#ffffff',
      borderTop: '1px solid rgba(0,0,0,0.07)',
      padding: '64px 0 72px',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr 1fr 1fr',
          gap: 40,
          marginBottom: 48,
        }} className="footer-grid">

          {/* Brand */}
          <div>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              <img src="/images/Shikhbei Bangladesh.svg" alt="শিখবেই বাংলাদেশ" style={{ width: '100%', maxWidth: 240, height: 72, objectFit: 'contain' }} />
            </div>

            {/* App store buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16, marginTop: 4 }}>
              {[
                {
                  label: 'Google Play',
                  sub: 'ডাউনলোড করুন',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <rect width="20" height="20" rx="4" fill="#000" />
                      <path d="M5 4l10 6-10 6V4z" fill="white" />
                    </svg>
                  ),
                },
                {
                  label: 'App Store',
                  sub: 'ডাউনলোড করুন',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <rect width="20" height="20" rx="4" fill="#000" />
                      <path d="M10 3c0-1 .9-2 2-2a2 2 0 0 1-2 2z" fill="white" />
                      <path d="M6.5 8C5 8 3.5 10 3.5 12.5c0 3 2 5.5 3.5 5.5.8 0 1.5-.5 2.5-.5s1.7.5 2.5.5c1.5 0 3.5-2.5 3.5-5.5 0-2.5-1.5-4.5-3-4.5-.8 0-1.5.5-2 .5s-1.2-.5-2-.5z" fill="white" />
                    </svg>
                  ),
                },
              ].map(({ label, sub, icon }) => (
                <button
                  key={label}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: '#1d1d1f', color: 'white',
                    border: 'none', borderRadius: 12,
                    padding: '10px 14px', cursor: 'pointer',
                    transition: 'all 300ms ease',
                    width: '100%',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#3a3a3c')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#1d1d1f')}
                >
                  {icon}
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', fontFamily: "'Anek Bangla', sans-serif" }}>{sub}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Anek Bangla', sans-serif" }}>{label}</div>
                  </div>
                </button>
              ))}
            </div>

            <p className="body-sm" style={{ color: '#8e8e93', fontFamily: "'Anek Bangla', sans-serif" }}>
              স্বত্ব © বাংলাদেশ সরকার ২০২৫
            </p>
            <p className="body-sm" style={{ color: '#aeaeb2', fontFamily: "'Anek Bangla', sans-serif", marginTop: 4 }}>
              সকল অধিকার সংরক্ষিত
            </p>
          </div>


          {/* Link columns */}
          {footerLinks.map(col => (
            <div key={col.title}>
              <h4 className="label" style={{
                color: '#8e8e93',
                fontFamily: "'Anek Bangla', sans-serif",
                marginBottom: 16,
              }}>
                {col.title}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {col.links.map(link => (
                  <a
                    key={link}
                    href="#"
                    className="body-sm"
                    style={{
                      color: '#6e6e73',
                      textDecoration: 'none',
                      fontFamily: "'Anek Bangla', sans-serif",
                      transition: 'color 300ms ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#800000')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#6e6e73')}
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(0,0,0,0.07)',
          paddingTop: 22,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <p className="body-sm" style={{ color: '#aeaeb2', fontFamily: "'Anek Bangla', sans-serif" }}>
            গণপ্রজাতন্ত্রী বাংলাদেশ সরকার কর্তৃক পরিচালিত
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              <svg key="web" width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#aeaeb2" strokeWidth="1.3"/><path d="M8 1.5C8 1.5 5.5 4.5 5.5 8s2.5 6.5 2.5 6.5M8 1.5c0 0 2.5 3 2.5 6.5S8 14.5 8 14.5M1.5 8h13" stroke="#aeaeb2" strokeWidth="1.2"/></svg>,
              <svg key="fb" width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="3.5" stroke="#aeaeb2" strokeWidth="1.3"/><path d="M8.5 14V9h1.5l.25-2H8.5V6c0-.55.45-1 1-1H10V3.5h-1.5C7.12 3.5 6 4.62 6 6v1H4.5v2H6v5h2.5z" fill="#aeaeb2"/></svg>,
              <svg key="yt" width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="4" width="13" height="8" rx="2.5" stroke="#aeaeb2" strokeWidth="1.3"/><path d="M6.5 6.5l4 1.5-4 1.5v-3z" fill="#aeaeb2"/></svg>,
            ].map((icon, i) => (
              <a
                key={i}
                href="#"
                style={{
                  width: 32, height: 32,
                  background: '#f5f5f7',
                  borderRadius: 9,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  textDecoration: 'none',
                  transition: 'all 300ms ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#e8f0fb'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#f5f5f7'
                  e.currentTarget.style.transform = 'none'
                }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .footer-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 500px) { .footer-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  )
}

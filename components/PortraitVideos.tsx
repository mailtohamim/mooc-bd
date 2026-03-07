'use client'

const videos = [
  { id: 1,  title: '৫টি স্টাডি হ্যাকস যা সবার জানা উচিত', tag: 'স্টাডি হ্যাকস', img: '/images/video_1.png' },
  { id: 2,  title: 'পরীক্ষার আগের রাতের প্রস্তুতি', tag: 'গাইডলাইন', img: '/images/video_2.png' },
  { id: 3,  title: 'পড়া মনে রাখার সহজ ৩টি টেকনিক', tag: 'মেমরি ট্রিক', img: '/images/video_3.png' },
  { id: 4,  title: 'গণিতের ভয় দূর করার উপায়', tag: 'টিপস', img: '/images/video_4.png' },
  { id: 5,  title: 'সময় ব্যবস্থাপনার ৫টি নিয়ম', tag: 'টাইম ম্যানেজমেন্ট', img: '/images/video_5.png' },
  { id: 6,  title: "পরীক্ষায় করণীয় ও বর্জনীয় (Do's & Don'ts)", tag: 'সতর্কতা', img: '/images/video_1.png' },
  { id: 7,  title: 'দীর্ঘক্ষণ মনোযোগ ধরে রাখার সাইন্টিফিক পদ্ধতি', tag: 'ফোকাস', img: '/images/video_2.png' },
  { id: 8,  title: 'MCQ তে ভালো করার গোপন কৌশল', tag: 'হ্যাকস', img: '/images/video_3.png' },
  { id: 9,  title: 'সৃজনশীল প্রশ্নের উত্তর লেখার সঠিক নিয়ম', tag: 'পরীক্ষা প্রস্তুতি', img: '/images/video_4.png' },
  { id: 10, title: 'ইংরেজি ভোকাবুলারি মনে রাখার সেরা উপায়', tag: 'ভাষা শিক্ষা', img: '/images/video_5.png' },
]

export default function PortraitVideos() {
  return (
    <section className="section" style={{ background: '#ffffff', overflow: 'hidden' }}>
      <div className="container" style={{ marginBottom: 32 }}>
        <h2 className="h2" style={{
          color: '#1d1d1f',
          fontFamily: "'Anek Bangla', sans-serif",
          textAlign: 'center',
        }}>
          ভিডিও কন্টেন্ট
        </h2>
      </div>

      {/* Infinite Carousel Container */}
      <div 
        className="marquee-container"
        style={{
          display: 'flex',
          alignItems: 'center', // added so different heights align in the middle vertically
          gap: 20,
          width: 'max-content',
          padding: '20px 20px',
        }}
      >
        {/* Render the array twice to create a seamless infinite loop */}
        {[...videos, ...videos].map((vid, idx) => {
          const isPortrait = idx % 2 === 1 // alternate shapes
          return (
          <div
            key={idx}
            className="portrait-card hover-lift"
            style={{
              width: isPortrait ? 280 : 420,
              height: 380, // Same height for all to match the picture perfectly
              borderRadius: 16,
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              backgroundColor: '#1d1d1f', // fallback color
            }}
          >
            {/* Background Image */}
            <img 
              src={vid.img} 
              alt={vid.title}
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                objectFit: 'cover', zIndex: 0,
              }}
            />
            {/* Play Button Icon in Center */}
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: 'rgba(255,255,255,0.25)',
                backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.4)',
              }}
              className="play-btn">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ marginLeft: 4 }}>
                  <path d="M4 3l13 7-13 7V3z" fill="white" />
                </svg>
              </div>
            </div>

            {/* Bottom Gradient Overlay for readability */}
            <div style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              height: 180,
              background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
              zIndex: 1,
            }} />

            {/* Content (Title & Tag) */}
            <div style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              padding: '24px 20px',
              zIndex: 3,
            }}>
              <div style={{
                display: 'inline-block',
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 40,
                padding: '4px 12px',
                fontSize: 12,
                color: 'white',
                fontFamily: "'Anek Bangla', sans-serif",
                fontWeight: 600,
                marginBottom: 10,
              }}>
                {vid.tag}
              </div>
              <h3 style={{
                color: 'white',
                fontSize: 18,
                fontWeight: 700,
                fontFamily: "'Anek Bangla', sans-serif",
                lineHeight: 1.3,
              }}>
                {vid.title}
              </h3>
            </div>
          </div>
          )
        })}
      </div>

      <style>{`
        .marquee-container {
          animation: marquee 90s linear infinite;
        }
        .marquee-container:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 10px)); } /* -50% because we duplicated the array, -10px for half the gap */
        }
        .portrait-card:hover .play-btn {
          transform: scale(1.1);
          background: rgba(255,255,255,0.35);
        }
        .play-btn {
          transition: all 300ms ease;
        }
      `}</style>
    </section>
  )
}

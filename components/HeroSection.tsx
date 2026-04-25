"use client";
import { useState, useEffect, useCallback } from "react";
import { HERO_IMAGES } from "@/constants/images";

const slides = [
  {
    id: 0,
    accent: "#4a90d9",
    heading: "সবার জন্য উন্মুক্ত শিক্ষা",
    sub: "বাংলাদেশ সরকারের বিনামূল্যে অনলাইন শিক্ষা প্ল্যাটফর্ম",
    img: HERO_IMAGES.slide1,
  },
  {
    id: 1,
    accent: "#5ab87a",
    heading: "বিশেষজ্ঞ শিক্ষকদের সাথে শিখুন",
    sub: "দেশের সেরা শিক্ষকদের ভিডিও লেকচার এখন আপনার হাতের মুঠোয়",
    img: HERO_IMAGES.slide2,
  },
  {
    id: 2,
    accent: "#a78bfa",
    heading: "পরীক্ষার প্রস্তুতি নিন ঘরে বসে",
    sub: "প্রাথমিক থেকে উচ্চ মাধ্যমিক – সব শ্রেণির জন্য সম্পূর্ণ গাইড",
    img: HERO_IMAGES.slide3,
  },
];

export default function HeroSection() {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback(
    (idx: number) => {
      if (animating) return;
      setAnimating(true);
      setTimeout(() => {
        setActive(idx);
        setAnimating(false);
      }, 300);
    },
    [animating],
  );

  // Auto-play every 5s
  useEffect(() => {
    const t = setInterval(() => goTo((active + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [active, goTo]);

  const slide = slides[active];

  return (
    <section
      style={{
        width: "100%",
        height: "100vh",
        minHeight: 600,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* ── Sliding background images ── */}
      {slides.map((s, i) => (
        <img
          key={s.id}
          src={s.img}
          alt={s.heading}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
            opacity: i === active ? 1 : 0,
            transition: "opacity 800ms ease",
          }}
        />
      ))}

      {/* ── Dark overlay for text readability ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.30) 100%)",
        }}
      />

      {/* ── Accent glow ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          background: `radial-gradient(ellipse 50% 60% at 25% 50%, ${slide.accent}20 0%, transparent 70%)`,
          transition: "background 600ms ease",
        }}
      />

      {/* ── Content ── */}
      <div
        className="container"
        style={{
          position: "relative",
          zIndex: 3,
          width: "100%",
          maxWidth: 1160,
          padding: "0 32px",
        }}
      >
        <div
          style={{
            maxWidth: 600,
            opacity: animating ? 0 : 1,
            transform: animating ? "translateY(16px)" : "translateY(0)",
            transition: "opacity 350ms ease, transform 350ms ease",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 999,
              padding: "5px 16px",
              fontSize: 13,
              fontWeight: 600,
              color: "rgba(255,255,255,0.85)",
              fontFamily: "'Anek Bangla', sans-serif",
              marginBottom: 20,
              backdropFilter: "blur(8px)",
            }}
          >
            🎓 বিনামূল্যে শিক্ষা প্ল্যাটফর্ম
          </div>

          <h1
            className="h1"
            style={{
              color: "#ffffff",
              fontFamily: "'Anek Bangla', sans-serif",
              marginBottom: 20,
              fontSize: "clamp(32px, 5vw, 52px)",
              lineHeight: 1.2,
              textShadow: "0 2px 20px rgba(0,0,0,0.3)",
            }}
          >
            {slide.heading}
          </h1>
          <p
            className="body-lg"
            style={{
              color: "rgba(255,255,255,0.75)",
              fontFamily: "'Anek Bangla', sans-serif",
              marginBottom: 36,
              maxWidth: 480,
              fontSize: "clamp(16px, 2vw, 20px)",
              lineHeight: 1.6,
            }}
          >
            {slide.sub}
          </p>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              className="btn-primary"
              style={{
                background: "linear-gradient(135deg, #800000, #b30000)",
                boxShadow: "0 8px 28px rgba(128,0,0,0.40)",
                fontSize: 16,
                padding: "13px 32px",
                transition: "all 300ms ease, box-shadow 300ms ease",
              }}
            >
              শুরু করুন
            </button>
            <button
              style={{
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.20)",
                borderRadius: 40,
                padding: "13px 28px",
                fontSize: 16,
                color: "rgba(255,255,255,0.90)",
                fontFamily: "'Anek Bangla', sans-serif",
                cursor: "pointer",
                transition: "all 300ms ease",
                backdropFilter: "blur(8px)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.18)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.10)")
              }
            >
              কোর্স দেখুন
            </button>
          </div>

          {/* Slide indicators */}
          <div style={{ display: "flex", gap: 8, marginTop: 44 }}>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                style={{
                  width: i === active ? 28 : 8,
                  height: 8,
                  borderRadius: 999,
                  background:
                    i === active ? "#ffffff" : "rgba(255,255,255,0.30)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 300ms ease",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Left / Right arrow nav */}
      {(["prev", "next"] as const).map((dir) => (
        <button
          key={dir}
          onClick={() =>
            goTo(
              dir === "prev"
                ? (active - 1 + slides.length) % slides.length
                : (active + 1) % slides.length,
            )
          }
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            [dir === "prev" ? "left" : "right"]: 24,
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.20)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 300ms ease",
            zIndex: 10,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.22)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
          }
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            {dir === "prev" ? (
              <path
                d="M11 4l-5 5 5 5"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <path
                d="M7 4l5 5-5 5"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
        </button>
      ))}

      {/* Scroll hint */}
      <div
        style={{
          position: "absolute",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          opacity: 0.5,
          zIndex: 10,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M5 8l5 5 5-5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}

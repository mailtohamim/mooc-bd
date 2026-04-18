"use client";
import { useState } from "react";
import { VIDEO_PLAYER_IMAGES } from "@/constants/images";
import { videoUrls } from "@/constants/videos";

const classData: Record<string, string[]> = {
  "শ্রেণি ১২": ["পদার্থবিজ্ঞান", "রসায়নবিজ্ঞান", "গণিত", "জীববিজ্ঞান"],
  "শ্রেণি ১১": [
    "পদার্থবিজ্ঞান",
    "রসায়নবিজ্ঞান",
    "বেসিক পাইথন প্রোগ্রামিং",
    "ইংরেজি",
  ],
  "শ্রেণি ১০": ["বাংলা ১ম পত্র", "গণিত", "সাধারণ বিজ্ঞান", "ইতিহাস"],
  "শ্রেণি ৯": ["বাংলা", "ইংরেজি", "গণিত", "বিজ্ঞান"],
  "শ্রেণি ৮": ["বাংলা", "ইংরেজি", "গণিত", "বিজ্ঞান"],
  "শ্রেণি ৭": ["বাংলা", "ইংরেজি", "গণিত", "বিজ্ঞান"],
  "শ্রেণি ৬": ["বাংলা", "ইংরেজি", "গণিত", "বিজ্ঞান"],
  "শ্রেণি ৫": ["বাংলা", "ইংরেজি", "গণিত", "বিজ্ঞান"],
  "শ্রেণি ৪": ["বাংলা", "ইংরেজি", "গণিত", "বিজ্ঞান"],
  "শ্রেণি ৩": ["বাংলা", "ইংরেজি", "গণিত", "বিজ্ঞান"],
  "শ্রেণি ২": ["বাংলা", "ইংরেজি", "গণিত", "বিজ্ঞান"],
  "শ্রেণি ১": ["বাংলা", "ইংরেজি", "গণিত", "বিজ্ঞান"],
};

const classKeys = Object.keys(classData);

const accentColors = [
  "#4a90d9",
  "#5ab87a",
  "#d25a3c",
  "#8250d2",
  "#e07050",
  "#3abf9a",
];

/**
 * Renders a YouTube iframe embed or a placeholder when no video URL is available.
 */
const VideoEmbed = ({
  videoId,
  subject,
  color,
  imgSrc,
}: {
  videoId: string | undefined;
  subject: string;
  color: string;
  imgSrc: string;
}) => {
  if (videoId) {
    return (
      <div
        style={{
          width: "100%",
          aspectRatio: "16/9",
          borderRadius: 16,
          overflow: "hidden",
          background: "#000",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          title={subject}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
        />
      </div>
    );
  }

  // Fallback placeholder when no video URL is configured
  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "16/9",
        borderRadius: 16,
        position: "relative",
        overflow: "hidden",
        background: "#1a1a2e",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
      }}
    >
      {/* Background image */}
      <img
        src={imgSrc}
        alt={subject}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          opacity: 0.4,
          filter: "blur(2px)",
        }}
      />
      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%)",
        }}
      />

      {/* "No video" message */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
        }}
      >
        {/* Play icon circle */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${color}, ${color}99)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 4px 24px ${color}44`,
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M8 5v14l11-7L8 5z" fill="white" />
          </svg>
        </div>
        <p
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: 15,
            fontFamily: "'Anek Bangla', sans-serif",
            fontWeight: 500,
            margin: 0,
            textAlign: "center",
            padding: "0 24px",
          }}
        >
          ভিডিও শীঘ্রই আসছে
        </p>
      </div>
    </div>
  );
};

export default function VideoPlayer() {
  const [activeClassIdx, setActiveClassIdx] = useState(0);
  const [activeSubIdx, setActiveSubIdx] = useState(0);

  const activeClass = classKeys[activeClassIdx];
  const subjects = classData[activeClass];
  const subject = subjects[activeSubIdx];

  const color = accentColors[activeClassIdx % accentColors.length];

  // Look up the YouTube video ID for the current subject
  const videoId = videoUrls[subject] || "";

  const handleClassChange = (idx: number) => {
    setActiveClassIdx(idx);
    setActiveSubIdx(0);
  };

  const handleSubjectChange = (idx: number) => {
    setActiveSubIdx(idx);
  };

  return (
    <section className="section" style={{ background: "#f8f8fa" }}>
      <div className="container" style={{ maxWidth: "1400px" }}>
        {/* Class selector */}
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 32,
          }}
        >
          {classKeys.map((cls, i) => (
            <button
              key={cls}
              onClick={() => handleClassChange(i)}
              style={{
                padding: "9px 20px",
                borderRadius: 999,
                border: "none",
                background: i === activeClassIdx ? "white" : "transparent",
                boxShadow:
                  i === activeClassIdx ? "0 4px 16px rgba(0,0,0,0.08)" : "none",
                color: i === activeClassIdx ? "#1d1d1f" : "#6e6e73",
                fontWeight: i === activeClassIdx ? 700 : 400,
                fontSize: 15,
                fontFamily: "'Anek Bangla', sans-serif",
                cursor: "pointer",
                transition: "all 300ms ease",
              }}
            >
              {cls}
            </button>
          ))}
        </div>

        {/* Main glass container */}
        <div className="glass" style={{ overflow: "hidden" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "220px 1fr",
            }}
            className="video-grid"
          >
            {/* Left – subject list */}
            <div
              style={{
                borderRight: "1px solid rgba(0,0,0,0.06)",
                padding: "20px 14px",
                background: "rgba(255,255,255,0.35)",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <p
                className="label"
                style={{ color: "#8e8e93", paddingLeft: 8, marginBottom: 4 }}
              >
                বিষয়সমূহ
              </p>
              {subjects.map((sub, i) => (
                <button
                  key={`${activeClass}-${sub}`}
                  onClick={() => handleSubjectChange(i)}
                  style={{
                    background: i === activeSubIdx ? "white" : "transparent",
                    border: "none",
                    borderRadius: 12,
                    padding: "12px 14px",
                    textAlign: "left",
                    cursor: "pointer",
                    color: i === activeSubIdx ? "#1d1d1f" : "#6e6e73",
                    fontWeight: i === activeSubIdx ? 600 : 400,
                    fontSize: 14,
                    fontFamily: "'Anek Bangla', sans-serif",
                    transition: "all 300ms ease",
                    boxShadow:
                      i === activeSubIdx
                        ? "0 2px 10px rgba(0,0,0,0.06)"
                        : "none",
                    lineHeight: 1.4,
                    borderLeft:
                      i === activeSubIdx
                        ? `3px solid ${color}`
                        : "3px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (i !== activeSubIdx)
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.70)";
                  }}
                  onMouseLeave={(e) => {
                    if (i !== activeSubIdx)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  {sub}
                </button>
              ))}
            </div>

            {/* Right – video content area */}
            <div style={{ padding: "32px 40px" }}>
              <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
                <VideoEmbed
                  videoId={videoId}
                  subject={subject}
                  color={color}
                  imgSrc={
                    VIDEO_PLAYER_IMAGES[subject] || VIDEO_PLAYER_IMAGES._default
                  }
                />
                <h2
                  className="h3"
                  style={{
                    color: "#1d1d1f",
                    fontFamily: "'Anek Bangla', sans-serif",
                    marginTop: 24,
                    marginBottom: 8,
                    fontSize: 26,
                  }}
                >
                  {subject}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1000px) {
          .video-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { VIDEO_PLAYER_IMAGES } from "@/constants/images";
import { videoUrls } from "@/constants/videos";
import { CLASS_VIDEO_SUBJECTS } from "@/constants/learning";

const accentColors = ["#4a90d9", "#5ab87a", "#d25a3c", "#8250d2", "#e07050", "#3abf9a"];

const VideoEmbed = ({
  videoId,
  subject,
  color,
  imgSrc,
}: {
  videoId: string;
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
          style={{ width: "100%", height: "100%", border: "none" }}
        />
      </div>
    );
  }

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
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: "linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
        }}
      >
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
            color: "rgba(255,255,255,0.75)",
            fontSize: 15,
            fontFamily: "'Anek Bangla', sans-serif",
            fontWeight: 500,
            margin: 0,
          }}
        >
          ভিডিও শীঘ্রই আপলোড হবে
        </p>
      </div>
    </div>
  );
};

export default function VideoPlayer() {
  const searchParams = useSearchParams();
  const classKeys = useMemo(() => Object.keys(CLASS_VIDEO_SUBJECTS), []);
  const visibleClassKeys = useMemo(
    () => classKeys.filter((key) => key !== "স্কিলস"),
    [classKeys]
  );

  const [activeClassIdx, setActiveClassIdx] = useState(0);
  const [activeSubIdx, setActiveSubIdx] = useState(0);

  useEffect(() => {
    const classFromQuery = searchParams.get("class");
    const subjectFromQuery = searchParams.get("subject");

    let classIndex = classFromQuery ? classKeys.indexOf(classFromQuery) : -1;

    if (classIndex < 0 && subjectFromQuery) {
      classIndex = classKeys.findIndex((key) => CLASS_VIDEO_SUBJECTS[key]?.includes(subjectFromQuery));
    }

    if (classIndex < 0) {
      classIndex = 0;
    }

    const possibleSubjects = CLASS_VIDEO_SUBJECTS[classKeys[classIndex]] || [];
    let subjectIndex = subjectFromQuery ? possibleSubjects.indexOf(subjectFromQuery) : 0;

    if (subjectIndex < 0) {
      subjectIndex = 0;
    }

    setActiveClassIdx(classIndex);
    setActiveSubIdx(subjectIndex);
  }, [searchParams, classKeys]);

  const activeClass = classKeys[activeClassIdx] || classKeys[0];
  const subjects = CLASS_VIDEO_SUBJECTS[activeClass] || [];
  const subject = subjects[activeSubIdx] || subjects[0] || "";
  const moduleFromQuery = searchParams.get("module") || "";

  const color = accentColors[activeClassIdx % accentColors.length];
  const videoId = videoUrls[`${activeClass}_${subject}`] || videoUrls[subject] || "";

  useEffect(() => {
  }, [subject, activeClass]);

  const handleClassChange = (idx: number) => {
    setActiveClassIdx(idx);
    setActiveSubIdx(0);
  };

  return (
    <section className="section" style={{ background: "#f8f8fa" }}>
      <div className="container">
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          {visibleClassKeys.map((cls) => {
            const i = classKeys.indexOf(cls);
            return (
            <button
              key={cls}
              type="button"
              onClick={() => handleClassChange(i)}
              style={{
                padding: "9px 18px",
                borderRadius: 999,
                border: "none",
                background: i === activeClassIdx ? "white" : "transparent",
                boxShadow: i === activeClassIdx ? "0 4px 16px rgba(0,0,0,0.08)" : "none",
                color: i === activeClassIdx ? "#1d1d1f" : "#6e6e73",
                fontWeight: i === activeClassIdx ? 700 : 500,
                fontSize: 14,
                fontFamily: "'Anek Bangla', sans-serif",
                cursor: "pointer",
                transition: "all 300ms ease",
              }}
            >
              {cls}
            </button>
            );
          })}
        </div>

        <div className="glass" style={{ overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "28% 1fr" }} className="video-grid">
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
              <p className="label" style={{ color: "#8e8e93", paddingLeft: 8, marginBottom: 4 }}>
                বিষয়সমূহ
              </p>

              {subjects.map((sub, i) => (
                <button
                  key={`${activeClass}-${sub}`}
                  type="button"
                  onClick={() => setActiveSubIdx(i)}
                  style={{
                    background: i === activeSubIdx ? "white" : "transparent",
                    border: "none",
                    borderRadius: 12,
                    padding: "12px 14px",
                    textAlign: "left",
                    cursor: "pointer",
                    color: i === activeSubIdx ? "#1d1d1f" : "#6e6e73",
                    fontWeight: i === activeSubIdx ? 700 : 500,
                    fontSize: 14,
                    fontFamily: "'Anek Bangla', sans-serif",
                    transition: "all 300ms ease",
                    boxShadow: i === activeSubIdx ? "0 2px 10px rgba(0,0,0,0.06)" : "none",
                    lineHeight: 1.4,
                    borderLeft: i === activeSubIdx ? `3px solid ${color}` : "3px solid transparent",
                  }}
                >
                  {sub}
                </button>
              ))}
            </div>

            <div style={{ padding: "28px 32px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 16,
                  marginBottom: 16,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <p style={{ color: "#8e8e93", fontSize: 12, marginBottom: 4, fontFamily: "'Anek Bangla', sans-serif" }}>
                    {activeClass}
                  </p>
                  <h2 className="h3" style={{ color: "#1d1d1f", fontFamily: "'Anek Bangla', sans-serif", marginBottom: 4 }}>
                    {subject}
                  </h2>
                  {moduleFromQuery ? (
                    <p
                      style={{
                        fontSize: 13,
                        color: "#6e6e73",
                        margin: 0,
                        fontFamily: "'Anek Bangla', sans-serif",
                      }}
                    >
                      মডিউল: {moduleFromQuery}
                    </p>
                  ) : null}
                </div>

                <div className="video-tabs" style={{ display: "flex", gap: 8, flexWrap: "wrap" }} />
              </div>

              <div>
                <VideoEmbed
                  videoId={videoId}
                  subject={subject}
                  color={color}
                  imgSrc={VIDEO_PLAYER_IMAGES[subject] || VIDEO_PLAYER_IMAGES._default}
                />
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

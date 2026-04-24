"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { VIDEO_PLAYER_IMAGES } from "@/constants/images";
import { videoUrls } from "@/constants/videos";
import { CLASS_VIDEO_SUBJECTS, CLASS_LEADERBOARD, SKILLS_LEADERBOARD, QUIZ_BANK } from "@/constants/learning";

type ActiveTab = "video" | "quiz" | "leaderboard";

const accentColors = ["#4a90d9", "#5ab87a", "#d25a3c", "#8250d2", "#e07050", "#3abf9a"];

const getBadgeColor = (badge: string) => {
  if (badge === "Gold") return "#d4a017";
  if (badge === "Silver") return "#7f8c8d";
  return "#a05a2c";
};

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

  const [activeClassIdx, setActiveClassIdx] = useState(0);
  const [activeSubIdx, setActiveSubIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<ActiveTab>("video");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

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

  const questions = QUIZ_BANK[subject] || QUIZ_BANK.default;

  // Decide which leaderboard to use
  const leaderboard = useMemo(() => {
    let rawData = activeClass === "স্কিলস" ? SKILLS_LEADERBOARD : CLASS_LEADERBOARD;
    // Filter specifically for the current class/skill context
    rawData = rawData.filter((entry) => entry.classLabel === activeClass);
    return [...rawData].sort((a, b) => b.score - a.score);
  }, [activeClass]);

  const leaderboardTitle = activeClass === "স্কিলস" ? "স্কিলস লিডারবোর্ড" : "ক্লাস লিডারবোর্ড";

  const answeredCount = questions.filter((q) => selectedAnswers[q.id] !== undefined).length;
  const allAnswered = questions.length > 0 && answeredCount === questions.length;

  const correctCount = questions.reduce((count, q) => {
    return selectedAnswers[q.id] === q.correctIndex ? count + 1 : count;
  }, 0);

  const quizPercent = questions.length ? Math.round((correctCount / questions.length) * 100) : 0;



  useEffect(() => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setActiveTab("video");
  }, [subject, activeClass]);

  const handleClassChange = (idx: number) => {
    setActiveClassIdx(idx);
    setActiveSubIdx(0);
  };

  const tabButtonStyle = (tab: ActiveTab): React.CSSProperties => ({
    padding: "8px 14px",
    borderRadius: 999,
    border: tab === activeTab ? `1.5px solid ${color}` : "1.5px solid rgba(0,0,0,0.10)",
    background: tab === activeTab ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.65)",
    color: tab === activeTab ? "#1d1d1f" : "#6e6e73",
    fontFamily: "'Anek Bangla', sans-serif",
    fontSize: 13,
    fontWeight: tab === activeTab ? 700 : 500,
    cursor: "pointer",
    transition: "all 300ms ease",
    whiteSpace: "nowrap",
  });

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
          {classKeys.map((cls, i) => (
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
          ))}
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

                <div className="video-tabs" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button type="button" onClick={() => setActiveTab("video")} style={tabButtonStyle("video")}>
                    ভিডিও
                  </button>
                  <button type="button" onClick={() => setActiveTab("quiz")} style={tabButtonStyle("quiz")}>
                    কুইজ
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("leaderboard")}
                    style={tabButtonStyle("leaderboard")}
                  >
                    এক্সাম লিডারবোর্ড
                  </button>
                </div>
              </div>

              {activeTab === "video" ? (
                <div>
                  <VideoEmbed
                    videoId={videoId}
                    subject={subject}
                    color={color}
                    imgSrc={VIDEO_PLAYER_IMAGES[subject] || VIDEO_PLAYER_IMAGES._default}
                  />

                  <p
                    className="body-sm"
                    style={{
                      color: "#6e6e73",
                      fontFamily: "'Anek Bangla', sans-serif",
                      marginTop: 14,
                    }}
                  >
                    এই ভিডিও লেসনের পরে কুইজ দিন এবং আপনার অবস্থান এক্সাম লিডারবোর্ডে দেখুন।
                  </p>

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
                    <button
                      type="button"
                      onClick={() => setActiveTab("quiz")}
                      style={{
                        border: `1.5px solid ${color}`,
                        color: color,
                        background: "rgba(255,255,255,0.92)",
                        borderRadius: 10,
                        padding: "9px 14px",
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: "pointer",
                        fontFamily: "'Anek Bangla', sans-serif",
                      }}
                    >
                      কুইজ শুরু করুন
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("leaderboard")}
                      style={{
                        border: "1.5px solid rgba(0,0,0,0.12)",
                        color: "#3c3c43",
                        background: "rgba(255,255,255,0.92)",
                        borderRadius: 10,
                        padding: "9px 14px",
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: "pointer",
                        fontFamily: "'Anek Bangla', sans-serif",
                      }}
                    >
                      লিডারবোর্ড দেখুন
                    </button>
                  </div>
                </div>
              ) : null}

              {activeTab === "quiz" ? (
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 12,
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    <p style={{ margin: 0, fontSize: 14, color: "#6e6e73", fontFamily: "'Anek Bangla', sans-serif" }}>
                      অগ্রগতি: {answeredCount}/{questions.length}
                    </p>
                    <button
                      type="button"
                      disabled={!allAnswered || quizSubmitted}
                      onClick={() => setQuizSubmitted(true)}
                      style={{
                        border: "none",
                        background: !allAnswered || quizSubmitted ? "#d1d1d6" : color,
                        color: "white",
                        borderRadius: 10,
                        padding: "9px 14px",
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: !allAnswered || quizSubmitted ? "not-allowed" : "pointer",
                        fontFamily: "'Anek Bangla', sans-serif",
                      }}
                    >
                      {quizSubmitted ? "কুইজ জমা হয়েছে" : "কুইজ জমা দিন"}
                    </button>
                  </div>

                  <div style={{ display: "grid", gap: 12 }}>
                    {questions.map((q, index) => (
                      <div
                        key={q.id}
                        style={{
                          background: "rgba(255,255,255,0.72)",
                          border: "1px solid rgba(0,0,0,0.06)",
                          borderRadius: 14,
                          padding: "14px 14px",
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            marginBottom: 10,
                            color: "#1d1d1f",
                            fontSize: 15,
                            fontWeight: 700,
                            fontFamily: "'Anek Bangla', sans-serif",
                          }}
                        >
                          {index + 1}. {q.question}
                        </p>

                        <div style={{ display: "grid", gap: 8 }}>
                          {q.options.map((option, optionIndex) => {
                            const isSelected = selectedAnswers[q.id] === optionIndex;
                            const isCorrect = q.correctIndex === optionIndex;

                            let border = "1px solid rgba(0,0,0,0.10)";
                            let background = "white";
                            let textColor = "#3c3c43";

                            if (isSelected) {
                              border = `1.5px solid ${color}`;
                              textColor = "#1d1d1f";
                            }

                            if (quizSubmitted && isCorrect) {
                              border = "1.5px solid #2dca73";
                              background = "rgba(45,202,115,0.10)";
                              textColor = "#1d1d1f";
                            }

                            if (quizSubmitted && isSelected && !isCorrect) {
                              border = "1.5px solid #ff6b6b";
                              background = "rgba(255,107,107,0.10)";
                              textColor = "#1d1d1f";
                            }

                            return (
                              <button
                                key={option}
                                type="button"
                                disabled={quizSubmitted}
                                onClick={() => {
                                  setSelectedAnswers((prev) => ({ ...prev, [q.id]: optionIndex }));
                                }}
                                style={{
                                  textAlign: "left",
                                  background,
                                  border,
                                  borderRadius: 10,
                                  padding: "10px 12px",
                                  cursor: quizSubmitted ? "default" : "pointer",
                                  color: textColor,
                                  fontSize: 14,
                                  fontFamily: "'Anek Bangla', sans-serif",
                                  transition: "all 200ms",
                                }}
                              >
                                {option}
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted ? (
                          <p
                            style={{
                              margin: 0,
                              marginTop: 10,
                              color:
                                selectedAnswers[q.id] === q.correctIndex
                                  ? "#2dca73"
                                  : "#ff6b6b",
                              fontSize: 13,
                              fontWeight: 600,
                              fontFamily: "'Anek Bangla', sans-serif",
                            }}
                          >
                            {selectedAnswers[q.id] === q.correctIndex
                              ? "সঠিক উত্তর!"
                              : `সঠিক উত্তর: ${q.options[q.correctIndex]} - ${q.explanation}`}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>

                  {quizSubmitted ? (
                    <div
                      style={{
                        marginTop: 14,
                        borderRadius: 14,
                        border: "1px solid rgba(0,0,0,0.08)",
                        background: "rgba(255,255,255,0.85)",
                        padding: "14px 14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            margin: 0,
                            color: "#1d1d1f",
                            fontWeight: 800,
                            fontSize: 16,
                            fontFamily: "'Anek Bangla', sans-serif",
                          }}
                        >
                          আপনার স্কোর: {correctCount}/{questions.length} ({quizPercent}%)
                        </p>
                        <p
                          style={{
                            margin: 0,
                            marginTop: 2,
                            color: "#6e6e73",
                            fontSize: 13,
                            fontFamily: "'Anek Bangla', sans-serif",
                          }}
                        >
                          পারফরমেন্স লিডারবোর্ডে তুলনা করতে নিচের বাটনে যান।
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveTab("leaderboard")}
                        style={{
                          border: `1.5px solid ${color}`,
                          color: color,
                          background: "white",
                          borderRadius: 10,
                          padding: "9px 12px",
                          fontWeight: 700,
                          fontSize: 13,
                          cursor: "pointer",
                          fontFamily: "'Anek Bangla', sans-serif",
                        }}
                      >
                        লিডারবোর্ডে দেখুন
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {activeTab === "leaderboard" ? (
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1d1d1f", fontFamily: "'Anek Bangla', sans-serif", marginBottom: 16 }}>
                    {leaderboardTitle}
                  </h3>
                  {quizSubmitted ? (
                    <div
                      style={{
                        borderRadius: 14,
                        border: "1px solid rgba(45,202,115,0.35)",
                        background: "rgba(45,202,115,0.10)",
                        padding: "12px 14px",
                        marginBottom: 12,
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          color: "#1d1d1f",
                          fontWeight: 700,
                          fontFamily: "'Anek Bangla', sans-serif",
                          fontSize: 14,
                        }}
                      >
                        আপনার সর্বশেষ কুইজ স্কোর: {quizPercent}% ({correctCount}/{questions.length})
                      </p>
                    </div>
                  ) : null}

                  <div
                    style={{
                      borderRadius: 14,
                      border: "1px solid rgba(0,0,0,0.06)",
                      overflow: "hidden",
                      background: "rgba(255,255,255,0.82)",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "52px 1.3fr 0.9fr 0.7fr 0.8fr",
                        gap: 10,
                        padding: "12px 14px",
                        borderBottom: "1px solid rgba(0,0,0,0.06)",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#6e6e73",
                        fontFamily: "'Anek Bangla', sans-serif",
                      }}
                    >
                      <span>র‍্যাংক</span>
                      <span>শিক্ষার্থী</span>
                      <span>ক্লাস</span>
                      <span>স্কোর</span>
                      <span>ব্যাজ</span>
                    </div>

                    {leaderboard.map((entry, idx) => {
                      const isTop3 = idx < 3;
                      const rowBg = idx % 2 === 0 ? "rgba(255,255,255,0.4)" : "transparent";
                      const highlightBg = idx === 0 ? "rgba(212,160,23,0.08)" :
                        idx === 1 ? "rgba(127,140,141,0.08)" :
                          idx === 2 ? "rgba(160,90,44,0.08)" : rowBg;

                      return (
                        <div
                          key={`${entry.name}-${idx}`}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "52px 1.3fr 0.9fr 0.7fr 0.8fr",
                            gap: 10,
                            padding: "16px 14px",
                            borderBottom:
                              idx < leaderboard.length - 1
                                ? "1px solid rgba(0,0,0,0.05)"
                                : "none",
                            fontFamily: "'Anek Bangla', sans-serif",
                            alignItems: "center",
                            background: highlightBg,
                            transition: "background 300ms",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {idx === 0 ? (
                              <span title="Gold" style={{ fontSize: 20 }}>🥇</span>
                            ) : idx === 1 ? (
                              <span title="Silver" style={{ fontSize: 20 }}>🥈</span>
                            ) : idx === 2 ? (
                              <span title="Bronze" style={{ fontSize: 20 }}>🥉</span>
                            ) : (
                              <span style={{ fontWeight: 800, color: "#8e8e93", fontSize: 13 }}>#{idx + 1}</span>
                            )}
                          </div>
                          <div>
                            <p style={{ margin: 0, color: "#1d1d1f", fontWeight: 700, fontSize: 14 }}>
                              {entry.name}
                            </p>
                            <p style={{ margin: 0, color: "#8e8e93", fontSize: 11 }}>
                              কুইজ: {entry.quizzes} • স্ট্রীক: {entry.streak} দিন
                            </p>
                          </div>
                          <span style={{ color: "#3c3c43", fontSize: 13 }}>{entry.classLabel}</span>
                          <span style={{ color: "#1d1d1f", fontWeight: 800, fontSize: 14 }}>
                            {entry.score}%
                          </span>
                          <span
                            style={{
                              display: "inline-flex",
                              padding: "4px 10px",
                              borderRadius: 999,
                              background: `${getBadgeColor(entry.badge)}15`,
                              color: getBadgeColor(entry.badge),
                              fontWeight: 700,
                              fontSize: 11,
                              textAlign: "center",
                              justifyContent: "center",
                            }}
                          >
                            {entry.badge}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
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

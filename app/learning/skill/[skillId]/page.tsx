import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { SKILL_TRACKS } from "@/constants/learning";

type SkillPageProps = {
  params: Promise<{ skillId: string }>;
};

const trackColors: Record<string, string> = {
  "ielts-course": "#1a91cf",
  "spoken-english-home": "#2dab6f",
  "ielts-live-batch": "#d25a3c",
  "junior-spoken-english": "#8250d2",
};

export default async function SkillLearningPage({ params }: SkillPageProps) {
  const { skillId } = await params;
  const track = SKILL_TRACKS[skillId];

  if (!track) notFound();

  const accentColor = trackColors[skillId] ?? "#800000";

  return (
    <main style={{ minHeight: "100vh", background: "#f5f5f7" }}>
      <Navbar />

      <section className="section" style={{ paddingTop: 100 }}>
        <div className="container">
          {/* Breadcrumb */}
          <nav style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <Link href="/" style={{ color: "#800000", fontFamily: "'Anek Bangla', sans-serif", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
              হোম
            </Link>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4 2l4 4-4 4" stroke="#aeaeb2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <Link href="/#skills" style={{ color: "#800000", fontFamily: "'Anek Bangla', sans-serif", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
              স্কিল ডেভেলপমেন্ট
            </Link>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4 2l4 4-4 4" stroke="#aeaeb2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ color: "#1d1d1f", fontFamily: "'Anek Bangla', sans-serif", fontSize: 13, fontWeight: 700 }}>
              {track.title}
            </span>
          </nav>

          {/* Header card */}
          <div className="glass" style={{ padding: "28px 30px", marginBottom: 24 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", borderRadius: 999,
              padding: "4px 14px", fontSize: 12, fontWeight: 700,
              color: accentColor, background: `${accentColor}18`,
              marginBottom: 12, fontFamily: "'Anek Bangla', sans-serif",
            }}>
              স্কিল কোর্স
            </div>
            <h1 className="h2" style={{ color: "#1d1d1f", fontFamily: "'Anek Bangla', sans-serif", marginBottom: 8 }}>
              {track.title}
            </h1>
            <p className="body-sm" style={{ color: "#6e6e73", fontFamily: "'Anek Bangla', sans-serif", margin: 0 }}>
              শিক্ষক: <strong style={{ color: "#3c3c43" }}>{track.teacher}</strong> — মডিউল বেছে নিন এবং ভিডিও, কুইজ ও লিডারবোর্ডে অংশ নিন।
            </p>
          </div>

          {/* Module cards */}
          <div className="skill-mod-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {track.modules.map((module, idx) => (
              <article key={module.id} className="glass hover-lift" style={{ padding: "22px 20px", display: "flex", flexDirection: "column" }}>
                {/* Module number */}
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: `${accentColor}18`, color: accentColor,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, fontSize: 15, fontFamily: "Inter, sans-serif",
                  marginBottom: 14,
                }}>
                  {idx + 1}
                </div>

                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1d1d1f", fontFamily: "'Anek Bangla', sans-serif", marginBottom: 8, lineHeight: 1.4 }}>
                  {module.title}
                </h2>

                <p className="body-sm" style={{ color: "#6e6e73", marginBottom: 16, fontFamily: "'Anek Bangla', sans-serif", flex: 1 }}>
                  {module.focus}
                </p>

                {/* Duration */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 18 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="5.5" stroke="#aeaeb2" strokeWidth="1.4" />
                    <path d="M7 4v3l2 1.5" stroke="#aeaeb2" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                  <span style={{ fontSize: 12, color: "#6e6e73", fontFamily: "'Anek Bangla', sans-serif" }}>{module.duration}</span>
                </div>

                {/* CTA */}
                <Link
                  href={{ pathname: "/video", query: { class: "স্কিলস", subject: track.videoSubject, module: module.title, from: "skill" } }}
                  style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                    color: "white", background: accentColor, fontWeight: 700, fontSize: 14,
                    textDecoration: "none", fontFamily: "'Anek Bangla', sans-serif",
                    padding: "10px 18px", borderRadius: 12,
                    boxShadow: `0 4px 16px ${accentColor}44`,
                    transition: "opacity 250ms ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  ভিডিও + কুইজ শুরু করুন
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 980px) { .skill-mod-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 640px) { .skill-mod-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </main>
  );
}

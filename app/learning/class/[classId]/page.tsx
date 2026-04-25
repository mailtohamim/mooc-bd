import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  CLASS_COURSE_CATALOG,
  CLASS_LABEL_BY_ID,
  CLASS_VIDEO_SUBJECTS,
} from "@/constants/learning";

type ClassPageProps = {
  params: Promise<{ classId: string }>;
};

const subjectColors: Record<string, string> = {
  বাংলা: "#e05a2b",
  "বাংলা ১ম পত্র": "#e05a2b",
  ইংরেজি: "#2b7ae0",
  গণিত: "#8250d2",
  বিজ্ঞান: "#2dab6f",
  "সাধারণ বিজ্ঞান": "#2dab6f",
  পদার্থবিজ্ঞান: "#1a91cf",
  রসায়নবিজ্ঞান: "#d25a3c",
  জীববিজ্ঞান: "#3aab5c",
  ইতিহাস: "#b07a20",
  "বেসিক পাইথন প্রোগ্রামিং": "#2b7ae0",
};

export default async function ClassLearningPage({ params }: ClassPageProps) {
  const { classId } = await params;
  const classLabel = CLASS_LABEL_BY_ID[classId];

  if (!classLabel) notFound();

  const fallbackCourses = (CLASS_VIDEO_SUBJECTS[classLabel] || []).map((subject, index) => ({
    id: `${classId}-${index}`,
    title: `${subject} পূর্ণাঙ্গ কোর্স`,
    subject,
    lessons: 12 + index * 3,
    duration: `${4 + index} সপ্তাহ`,
    description: `${classLabel} এর জন্য ${subject} বিষয়ের অধ্যায়ভিত্তিক ভিডিও, কুইজ ও পরীক্ষা প্রস্তুতি।`,
  }));

  const courses = CLASS_COURSE_CATALOG[classId] || fallbackCourses;

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
            <Link href="/#class-categories" style={{ color: "#800000", fontFamily: "'Anek Bangla', sans-serif", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
              পরীক্ষার প্রস্তুতি
            </Link>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4 2l4 4-4 4" stroke="#aeaeb2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ color: "#1d1d1f", fontFamily: "'Anek Bangla', sans-serif", fontSize: 13, fontWeight: 700 }}>
              {classLabel}
            </span>
          </nav>

          {/* Header card */}
          <div className="glass" style={{ padding: "28px 30px", marginBottom: 24 }}>
            <h1 className="h2" style={{ color: "#1d1d1f", fontFamily: "'Anek Bangla', sans-serif", marginBottom: 8 }}>
              {classLabel} — কোর্সসমূহ
            </h1>
            <p className="body-sm" style={{ color: "#6e6e73", fontFamily: "'Anek Bangla', sans-serif", margin: 0 }}>
              পছন্দের কোর্স বেছে নিন। প্রতিটি কোর্সে ভিডিও লেসন, কুইজ এবং এক্সাম লিডারবোর্ড রয়েছে।
            </p>
          </div>

          {/* Course cards */}
          <div className="class-courses-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {courses.map((course) => {
              const accentColor = subjectColors[course.subject] ?? "#800000";
              return (
                <article key={course.id} className="glass hover-lift" style={{ padding: "22px 20px", display: "flex", flexDirection: "column" }}>
                  {/* Subject badge */}
                  <div style={{
                    display: "inline-flex", alignItems: "center", borderRadius: 999,
                    padding: "4px 12px", fontSize: 12, fontWeight: 700,
                    color: accentColor, background: `${accentColor}18`,
                    marginBottom: 14, fontFamily: "'Anek Bangla', sans-serif",
                    alignSelf: "flex-start",
                  }}>
                    {course.subject}
                  </div>

                  <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1d1d1f", fontFamily: "'Anek Bangla', sans-serif", marginBottom: 8, lineHeight: 1.4 }}>
                    {course.title}
                  </h2>

                  <p className="body-sm" style={{ color: "#6e6e73", marginBottom: 16, fontFamily: "'Anek Bangla', sans-serif", flex: 1 }}>
                    {course.description}
                  </p>

                  {/* Meta row */}
                  <div style={{ display: "flex", gap: 16, marginBottom: 18 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <rect x="1" y="3" width="12" height="9" rx="2" stroke="#aeaeb2" strokeWidth="1.4" />
                        <path d="M5 7l2 2 3-3" stroke="#aeaeb2" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span style={{ fontSize: 12, color: "#6e6e73", fontFamily: "'Anek Bangla', sans-serif" }}>{course.lessons} লেসন</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="5.5" stroke="#aeaeb2" strokeWidth="1.4" />
                        <path d="M7 4v3l2 1.5" stroke="#aeaeb2" strokeWidth="1.4" strokeLinecap="round" />
                      </svg>
                      <span style={{ fontSize: 12, color: "#6e6e73", fontFamily: "'Anek Bangla', sans-serif" }}>{course.duration}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    href={{ pathname: "/video", query: { class: classLabel, subject: course.subject, from: "class" } }}
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
              );
            })}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 980px) { .class-courses-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 640px) { .class-courses-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </main>
  );
}

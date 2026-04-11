'use client'
import { useState, use, Suspense } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

const courseData: Record<string, {
  title: string
  class: string
  chapters: { title: string; topics: { id: string; title: string }[] }[]
}> = {
  'physics-12': {
    title: 'পদার্থবিজ্ঞান',
    class: 'শ্রেণি ১২',
    chapters: [
      { 
        title: 'অধ্যায় ১: ভৌত জগৎ ও পরিমাপ', 
        topics: [
          { id: 'p12-c1-t1', title: 'ভৌত জগৎ' },
          { id: 'p12-c1-t2', title: 'পরিমাপের একক' },
          { id: 'p12-c1-t3', title: 'ত্রুটি ও পরিমাপ' }
        ] 
      },
      { 
        title: 'অধ্যায় ২: ভেক্টর', 
        topics: [
          { id: 'p12-c2-t1', title: 'ভেক্টর রাশি' },
          { id: 'p12-c2-t2', title: 'ভেক্টর সংযোগ' },
          { id: 'p12-c2-t3', title: 'ভেক্টর গুণন' }
        ] 
      }
    ]
  },
  'chemistry-12': {
    title: 'রসায়নবিজ্ঞান',
    class: 'শ্রেণি ১২',
    chapters: [
      { 
        title: 'অধ্যায় ১: ল্যাবরেটরির নিরাপদ ব্যবহার', 
        topics: [
          { id: 'c12-c1-t1', title: 'পোশাক ও নিরাপত্তা' },
          { id: 'c12-c1-t2', title: 'রাসায়নিক দ্রব্য সংরক্ষণ' }
        ] 
      }
    ]
  },
  'math-12': {
    title: 'গণিত',
    class: 'শ্রেণি ১২',
    chapters: [
      { 
        title: 'অধ্যায় ১: মেট্রিক্স ও নির্ণায়ক', 
        topics: [
          { id: 'm12-c1-t1', title: 'মেট্রিক্সের প্রকারভেদ' },
          { id: 'm12-c1-t2', title: 'নির্ণায়কের ধর্মাবলি' }
        ] 
      }
    ]
  }
}

function CourseContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user, enroll, toggleTopic } = useAuth()
  const router = useRouter()
  
  const course = courseData[id] || courseData['physics-12']
  const [activeTopic, setActiveTopic] = useState(course.chapters[0].topics[0])
  const isEnrolled = user?.enrolledCourses?.includes(id)

  if (!user) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Anek Bangla', sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: 16 }}>অনুগ্রহ করে লগইন করুন</h2>
          <button className="btn-primary" onClick={() => router.push('/login')}>লগইন করুন</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7', fontFamily: "'Anek Bangla', sans-serif" }}>
      <Navbar />
      
      <div style={{ paddingTop: 84, paddingBottom: 40 }} className="container">
        {/* Course Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
          <div>
            <div style={{ color: '#800000', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{course.class}</div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1d1d1f' }}>{course.title}</h1>
          </div>
          {!isEnrolled ? (
            <button className="btn-primary" onClick={() => enroll(id)}>কোর্সে এনরোল করুন</button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#5ab87a', fontWeight: 700 }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              এনরোল করা আছে
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }} className="course-grid">
          {/* Main Content (Video) */}
          <div>
            <div style={{
              width: '100%', aspectRatio: '16/9',
              background: '#000', borderRadius: 20, overflow: 'hidden',
              position: 'relative', boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
            }}>
              {!isEnrolled ? (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 10, color: 'white', textAlign: 'center', padding: 20
                }}>
                  <div>
                    <h3 style={{ marginBottom: 12 }}>ভিডিও দেখতে এনরোল করুন</h3>
                    <button className="btn-primary" onClick={() => enroll(id)}>এনরোল করুন</button>
                  </div>
                </div>
              ) : null}
              
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="40" r="38" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
                    <path d="M35 30l15 10-15 10V30z" fill="currentColor" />
                  </svg>
                  <div style={{ marginTop: 16, fontSize: 18 }}>{activeTopic.title} ভিডিও প্লে হচ্ছে...</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 24, padding: 24, background: 'white', borderRadius: 20, border: '1px solid rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>ক্লাস নোটস ও রিসোর্স</h2>
              <p style={{ color: '#6e6e73', lineHeight: 1.6 }}>
                এই পাঠে আমরা {activeTopic.title} সম্পর্কে বিস্তারিত আলোচনা করব। নিচের পিডিএফ লিঙ্ক থেকে আপনি আজকের ক্লাসের নোট ডাউনলোড করতে পারেন।
              </p>
              <button style={{
                marginTop: 16, padding: '10px 20px', borderRadius: 12, border: '1px solid #800000',
                color: '#800000', background: 'transparent', fontWeight: 600, fontSize: 14, cursor: 'pointer'
              }}>
                পিডিএফ ডাউনলোড করুন (২.৪ এমবি)
              </button>
            </div>
          </div>

          {/* Curriculum Sidebar */}
          <div style={{ 
            background: 'white', borderRadius: 20, padding: 20, 
            border: '1px solid rgba(0,0,0,0.05)', maxHeight: 'calc(100vh - 120px)', 
            overflowY: 'auto', position: 'sticky', top: 84
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#1d1d1f' }}>সিলেবাস</h3>
            
            {course.chapters.map((ch, cIdx) => (
              <div key={cIdx} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1d1d1f', marginBottom: 10 }}>{ch.title}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {ch.topics.map((topic, tIdx) => {
                    const isCompleted = user?.completedTopics?.includes(topic.id)
                    const isActive = activeTopic.id === topic.id
                    
                    return (
                      <div key={topic.id} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 12px', borderRadius: 12,
                        background: isActive ? 'rgba(128,0,0,0.06)' : 'transparent',
                        cursor: 'pointer', transition: 'all 200ms'
                      }}
                      onClick={() => isEnrolled && setActiveTopic(topic)}
                      >
                        <div 
                          onClick={(e) => {
                            e.stopPropagation()
                            if (isEnrolled) toggleTopic(topic.id)
                          }}
                          style={{
                            width: 22, height: 22, borderRadius: 6,
                            border: `2px solid ${isCompleted ? '#5ab87a' : '#d1d1d6'}`,
                            background: isCompleted ? '#5ab87a' : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', transition: 'all 200ms'
                          }}
                        >
                          {isCompleted && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                        <div style={{ 
                          fontSize: 14, fontWeight: isActive ? 600 : 400,
                          color: isActive ? '#800000' : '#3c3c43',
                          flex: 1
                        }}>
                          {topic.title}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CourseContent params={params} />
    </Suspense>
  )
}

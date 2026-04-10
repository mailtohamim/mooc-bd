'use client'
import { useState, useRef, useEffect } from 'react'

interface ChatMessage {
  id: string
  role: 'user' | 'bot'
  text: string
  time: number
}

/* ─── AI Response Engine ─── */
const aiResponses: { keywords: string[]; response: string }[] = [
  { keywords: ['হ্যালো', 'হাই', 'আসসালামু', 'সালাম', 'hello', 'hi', 'hey'], response: 'আসসালামু আলাইকুম! আমি শিখবেই AI সহায়ক। আপনাকে কীভাবে সাহায্য করতে পারি?' },
  { keywords: ['কোর্স', 'course', 'ক্লাস', 'class'], response: 'আমাদের প্ল্যাটফর্মে বিভিন্ন কোর্স আছে:\n- পদার্থবিজ্ঞান (শ্রেণি ১২)\n- বাংলা ১ম পত্র (শ্রেণি ১০)\n- Spoken English (স্কিলস)\n\nড্যাশবোর্ড থেকে যেকোনো কোর্সে ক্লিক করে শুরু করতে পারবেন!' },
  { keywords: ['পদার্থ', 'physics', 'নিউটন'], response: 'পদার্থবিজ্ঞান কোর্সে ২৪টি লেসন আছে। নিউটনের সূত্র, গতিবিদ্যা, তাপগতিবিদ্যা সবই কভার করা হয়েছে। ড্যাশবোর্ড থেকে "পদার্থবিজ্ঞান" কোর্সে ক্লিক করুন!' },
  { keywords: ['বাংলা', 'bangla', 'গদ্য', 'পদ্য'], response: 'বাংলা ১ম পত্র কোর্সে ১৮টি লেসন আছে। গদ্য, পদ্য, উপন্যাস সবই পাবেন। "অপরিচিতা" থেকে প্রায় প্রতি বছর পরীক্ষায় আসে!' },
  { keywords: ['ইংরেজি', 'english', 'spoken'], response: 'Spoken English কোর্সে ৩০টি লেসন আছে। প্রতিদিন ১০ মিনিট প্র্যাকটিস করলেই দারুণ উন্নতি হবে! Tips:\n- আয়নার সামনে কথা বলুন\n- ইংরেজি গান শুনুন\n- ডায়েরি লিখুন' },
  { keywords: ['পরীক্ষা', 'exam', 'test'], response: 'আসন্ন পরীক্ষার তথ্য:\n- বাংলা ১ম পত্র – ১২ মার্চ, সকাল ১০:০০\n- পদার্থবিজ্ঞান – ১৫ মার্চ, সকাল ৯:০০\n\nসময়মতো প্রস্তুতি নিন!' },
  { keywords: ['অ্যাসাইনমেন্ট', 'assignment', 'হোমওয়ার্ক', 'homework'], response: 'আপনার পেন্ডিং অ্যাসাইনমেন্ট:\n- নিউটনের সূত্র – ১০ মার্চ\n- Paragraph Writing – ১৫ মার্চ\n- জৈব যৌগ – ১৮ মার্চ\n\nড্যাশবোর্ডের "অ্যাসাইনমেন্ট" ট্যাব থেকে জমা দিতে পারবেন!' },
  { keywords: ['ফোরাম', 'forum', 'পোস্ট', 'post'], response: 'ফোরামে যেকোনো প্রশ্ন বা আলোচনা করতে পারেন! ড্যাশবোর্ডের সাইডবারে "ফোরাম" ক্লিক করুন। একাডেমিক ও অন্যান্য দুই ধরনের পোস্ট করা যায়।' },
  { keywords: ['ফ্রিল্যান্সিং', 'freelancing', 'আয়', 'income'], response: 'ফ্রিল্যান্সিং শিখতে চাইলে ফোরামের "অন্যান্য" সেকশনে যান। সেখানে ফ্রিল্যান্সিং, ডিজিটাল মার্কেটিং, গ্রাফিক্স ডিজাইন সম্পর্কে অনেক পোস্ট আছে!' },
  { keywords: ['ধন্যবাদ', 'thanks', 'thank'], response: 'আপনাকেও ধন্যবাদ! আর কোনো প্রশ্ন থাকলে নির্দ্বিধায় জিজ্ঞেস করুন। শিখতে থাকুন!' },
  { keywords: ['সাহায্য', 'help', 'কি করতে পারো', 'কী পারো'], response: 'আমি আপনাকে এসব বিষয়ে সাহায্য করতে পারি:\n- কোর্স সম্পর্কে তথ্য\n- অ্যাসাইনমেন্ট ও পরীক্ষার সময়সূচি\n- পড়াশোনার টিপস\n- প্ল্যাটফর্ম ব্যবহার গাইড\n- ফোরাম ও কমিউনিটি তথ্য\n\nযেকোনো প্রশ্ন করুন!' },
  { keywords: ['গণিত', 'math', 'ত্রিকোণ', 'জ্যামিতি'], response: 'গণিতে ভালো করতে চাইলে:\n- প্রতিদিন অন্তত ৫টি সমস্যা সমাধান করুন\n- সূত্রগুলো মুখস্থ রাখুন\n- ফোরামে গণিত ক্যাটাগরিতে সমস্যা পোস্ট করতে পারেন\n\nফোরামে ত্রিকোণমিতির মনে রাখার কৌশল আছে!' },
  { keywords: ['রসায়ন', 'chemistry', 'জৈব'], response: 'রসায়ন কোর্সের জন্য জৈব যৌগের অধ্যায়টি খুব গুরুত্বপূর্ণ। ল্যাব পিরিয়ডগুলোতে মনোযোগ দিন!' },
  { keywords: ['টিপস', 'tips', 'পরামর্শ', 'advice'], response: 'পড়াশোনার সেরা টিপস:\n- প্রতিদিন নির্দিষ্ট সময়ে পড়ুন\n- নোট করুন\n- বারবার রিভিশন দিন\n- গ্রুপ স্টাডি করুন\n- পর্যাপ্ত ঘুমান\n- ব্যায়াম করুন' },
]

function getAIResponse(input: string): string {
  const lower = input.toLowerCase()
  for (const item of aiResponses) {
    if (item.keywords.some(k => lower.includes(k.toLowerCase()))) return item.response
  }
  return 'আমি আপনার প্রশ্ন বুঝতে পেরেছি। আরও নির্দিষ্টভাবে জিজ্ঞেস করলে ভালো সাহায্য করতে পারব!\n\nআমি সাহায্য করতে পারি:\n• কোর্স সম্পর্কে\n• পরীক্ষা ও অ্যাসাইনমেন্ট\n• পড়াশোনার টিপস\n• ফোরাম ব্যবহার'
}

const uid = () => Math.random().toString(36).slice(2, 10)

export default function AIChatBot() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'bot', text: 'আসসালামু আলাইকুম!\nআমি শিখবেই AI সহায়ক। আপনাকে কীভাবে সাহায্য করতে পারি?', time: Date.now() }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [msgs, typing])

  const send = () => {
    if (!input.trim()) return
    const userMsg: ChatMessage = { id: uid(), role: 'user', text: input.trim(), time: Date.now() }
    setMsgs(prev => [...prev, userMsg])
    const q = input.trim()
    setInput('')
    setTyping(true)
    setTimeout(() => {
      const response = getAIResponse(q)
      setMsgs(prev => [...prev, { id: uid(), role: 'bot', text: response, time: Date.now() }])
      setTyping(false)
    }, 600 + Math.random() * 800)
  }

  return (
    <>
      {/* Floating button */}
      <button onClick={() => { setOpen(!open); setTimeout(() => inputRef.current?.focus(), 100) }} style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
        width: 56, height: 56, borderRadius: '50%', border: 'none', cursor: 'pointer',
        background: 'linear-gradient(135deg, #3a7bd5, #5a6cf8)',
        boxShadow: '0 4px 20px rgba(58,123,213,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'transform 200ms, box-shadow 200ms',
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(58,123,213,0.5)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(58,123,213,0.4)' }}
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="12" r="9" stroke="white" strokeWidth="2"/>
            <path d="M10 10h0M14 10h0M18 10h0" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M9 18l-2 4v-4" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M10 14.5c0 1 1.5 2 4 2s4-1 4-2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        )}
      </button>

      {/* Pulse ring animation */}
      {!open && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9998,
          width: 56, height: 56, borderRadius: '50%',
          border: '2px solid rgba(58,123,213,0.4)',
          animation: 'chatbot-pulse 2s infinite',
          pointerEvents: 'none',
        }} />
      )}

      {/* Chat window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 90, right: 24, zIndex: 9999, width: 360, height: 480,
          borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column',
          boxShadow: '0 12px 48px rgba(0,0,0,0.18)', background: '#ffffff',
          animation: 'chatbot-slide-up 250ms ease-out',
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #3a7bd5, #5a6cf8)', padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="10" r="8" opacity="0.3"/><circle cx="9" cy="9" r="1.5"/><circle cx="15" cy="9" r="1.5"/><path d="M9 13c0 1.5 1.5 2.5 3 2.5s3-1 3-2.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'white' }}>শিখবেই AI সহায়ক</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#5ab87a', display: 'inline-block' }} />
                সবসময় অনলাইন
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>✕</button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '12px 12px 8px', background: '#f0f2f5' }}>
            {msgs.map(m => (
              <div key={m.id} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
                {m.role === 'bot' && (
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #3a7bd5, #5a6cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 6, flexShrink: 0, marginTop: 'auto' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><circle cx="9" cy="9" r="1.5"/><circle cx="15" cy="9" r="1.5"/><path d="M9 13c0 1.5 1.5 2.5 3 2.5s3-1 3-2.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
                  </div>
                )}
                <div style={{
                  maxWidth: '80%', padding: '10px 14px', borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: m.role === 'user' ? '#3a7bd5' : '#ffffff',
                  color: m.role === 'user' ? 'white' : '#050505',
                  fontSize: 13, lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                  boxShadow: m.role === 'bot' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #3a7bd5, #5a6cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><circle cx="9" cy="9" r="1.5"/><circle cx="15" cy="9" r="1.5"/></svg>
                </div>
                <div style={{ background: '#ffffff', borderRadius: 18, padding: '10px 16px', display: 'flex', gap: 4, boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#aeaeb2', animation: 'chatbot-dot 1.2s infinite 0s' }} />
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#aeaeb2', animation: 'chatbot-dot 1.2s infinite 0.2s' }} />
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#aeaeb2', animation: 'chatbot-dot 1.2s infinite 0.4s' }} />
                </div>
              </div>
            )}
          </div>

          {/* Quick replies */}
          <div style={{ padding: '6px 12px', display: 'flex', gap: 6, overflowX: 'auto', flexShrink: 0, background: '#f0f2f5', borderTop: '1px solid #e4e6eb' }} className="scroll-x">
            {['কোর্স দেখুন', 'পরীক্ষার সময়', 'টিপস দিন', 'সাহায্য'].map(q => (
              <button key={q} onClick={() => { setInput(q); setTimeout(() => { setInput(q); send() }, 50) }} style={{
                padding: '5px 12px', borderRadius: 16, border: '1px solid #3a7bd5', background: 'white',
                fontSize: 12, fontWeight: 600, color: '#3a7bd5', cursor: 'pointer', whiteSpace: 'nowrap',
                fontFamily: "'Anek Bangla', sans-serif",
              }}>{q}</button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, background: '#ffffff', borderTop: '1px solid #e4e6eb', flexShrink: 0 }}>
            <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="বার্তা লিখুন..."
              style={{ flex: 1, padding: '10px 14px', borderRadius: 20, border: 'none', background: '#f0f2f5', fontSize: 13, fontFamily: "'Anek Bangla', sans-serif", outline: 'none', color: '#050505' }}
            />
            <button onClick={send} style={{
              width: 36, height: 36, borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: input.trim() ? '#3a7bd5' : '#e4e6eb',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 200ms', flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={input.trim() ? 'white' : '#bec3c9'}><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes chatbot-pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes chatbot-slide-up {
          from { opacity: 0; transform: translateY(16px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes chatbot-dot {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </>
  )
}

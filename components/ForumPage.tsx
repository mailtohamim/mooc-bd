'use client'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'

/* ─── Types ─── */
interface Reply { id: string; author: string; text: string; likes: number; likedBy: string[]; createdAt: number }
interface Comment { id: string; author: string; text: string; likes: number; likedBy: string[]; replies: Reply[]; createdAt: number }
interface Post {
  id: string; author: string; title: string; body: string; category: string; mode: 'academic' | 'others'
  image?: string; video?: string; videoViews?: number
  votes: number; upvoters: string[]; downvoters: string[]
  comments: Comment[]; createdAt: number; isQuestion: boolean
}

/* ─── Constants ─── */
const STORAGE_KEY = 'sb_forum_posts_v2'

const academicCats = [
  { id: 'all', label: 'সব', color: '#8e8e93' },
  { id: 'physics', label: 'পদার্থবিজ্ঞান', color: '#4a90d9' },
  { id: 'bangla', label: 'বাংলা', color: '#5ab87a' },
  { id: 'english', label: 'ইংরেজি', color: '#8250d2' },
  { id: 'math', label: 'গণিত', color: '#e07050' },
  { id: 'chemistry', label: 'রসায়ন', color: '#d25a3c' },
  { id: 'biology', label: 'জীববিজ্ঞান', color: '#34c759' },
  { id: 'ict', label: 'আইসিটি', color: '#007aff' },
  { id: 'question', label: 'প্রশ্ন', color: '#ff9500' },
]

const othersCats = [
  { id: 'all', label: 'সব', color: '#8e8e93' },
  { id: 'freelancing', label: 'ফ্রিল্যান্সিং', color: '#007aff' },
  { id: 'graphics', label: 'গ্রাফিক্স ডিজাইন', color: '#ff2d55' },
  { id: 'webdev', label: 'ওয়েব ডেভেলপমেন্ট', color: '#5856d6' },
  { id: 'digital-marketing', label: 'ডিজিটাল মার্কেটিং', color: '#ff9500' },
  { id: 'video-editing', label: 'ভিডিও এডিটিং', color: '#e07050' },
  { id: 'spoken-english', label: 'স্পোকেন ইংলিশ', color: '#8250d2' },
  { id: 'career', label: 'ক্যারিয়ার টিপস', color: '#34c759' },
  { id: 'motivation', label: 'মোটিভেশন', color: '#ffcc00' },
]

const SEED_POSTS: Post[] = [
  {
    id: 'seed-1', author: 'রাহেলা পারভীন', title: 'নিউটনের তৃতীয় সূত্র নিয়ে একটি সহজ ব্যাখ্যা', mode: 'academic',
    body: 'নিউটনের তৃতীয় সূত্র বলে, প্রতিটি ক্রিয়ার একটি সমান ও বিপরীত প্রতিক্রিয়া আছে। উদাহরণ: আপনি যখন মেঝেতে দাঁড়ান, আপনার ওজন মেঝেতে বল প্রয়োগ করে এবং মেঝেও আপনাকে সমান বলে উপরের দিকে ঠেলে। এটাই কারণ আপনি মেঝের মধ্য দিয়ে পড়ে যান না!',
    category: 'physics', votes: 24, upvoters: ['user1','user2'], downvoters: [],
    comments: [
      { id: 'c1', author: 'করিম উদ্দিন', text: 'অনেক সুন্দর ব্যাখ্যা! রকেট উৎক্ষেপণও কি এই সূত্রের উদাহরণ?', likes: 5, likedBy: ['user1'], replies: [
        { id: 'r1', author: 'রাহেলা পারভীন', text: 'হ্যাঁ, রকেট গ্যাসকে নিচে ঠেলে এবং গ্যাস রকেটকে উপরে ঠেলে!', likes: 3, likedBy: [], createdAt: Date.now() - 3500000 }
      ], createdAt: Date.now() - 3600000 },
      { id: 'c2', author: 'সুমাইয়া খান', text: 'ধন্যবাদ দিদি, পরীক্ষায় অনেক কাজে লাগবে।', likes: 2, likedBy: [], replies: [], createdAt: Date.now() - 1800000 }
    ],
    createdAt: Date.now() - 86400000, isQuestion: false,
  },
  {
    id: 'seed-2', author: 'আহমেদ হোসেন', title: 'বাংলা ১ম পত্র – গদ্য অংশের গুরুত্বপূর্ণ প্রশ্ন', mode: 'academic',
    body: 'আসন্ন পরীক্ষায় গদ্য অংশ থেকে কোন কোন প্রশ্ন বেশি আসতে পারে? কেউ কি গত বছরের প্রশ্নপত্র শেয়ার করতে পারবেন?',
    category: 'bangla', votes: 18, upvoters: [], downvoters: [],
    comments: [
      { id: 'c3', author: 'মিস রাহেলা', text: '"অপরিচিতা" থেকে প্রায় প্রতি বছর প্রশ্ন আসে। বিশেষ করে চরিত্র বিশ্লেষণ।', likes: 8, likedBy: [], replies: [], createdAt: Date.now() - 7200000 }
    ],
    createdAt: Date.now() - 172800000, isQuestion: true,
  },
  {
    id: 'seed-3', author: 'সুমাইয়া খান', title: 'Spoken English – Daily Practice Tips', mode: 'academic',
    body: 'প্রতিদিন ইংরেজিতে কথা বলার অভ্যাস গড়ে তুলতে কিছু সহজ টিপস:\n\n১. প্রতিদিন ১০ মিনিট আয়নার সামনে ইংরেজিতে কথা বলুন\n২. ইংরেজি গান শুনুন ও lyrics পড়ুন\n৩. ছোট ছোট ডায়েরি লিখুন ইংরেজিতে\n৪. YouTube-এ TED Talks দেখুন\n৫. একজন study buddy খুঁজুন যার সাথে ইংরেজিতে কথা বলবেন',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800',
    category: 'english', votes: 31, upvoters: [], downvoters: [],
    comments: [
      { id: 'c4', author: 'করিম উদ্দিন', text: 'TED Talks recommendation thakle share koro please!', likes: 4, likedBy: [], replies: [
        { id: 'r2', author: 'সুমাইয়া খান', text: 'Try "The power of introverts" by Susan Cain. Beginner-friendly!', likes: 6, likedBy: [], createdAt: Date.now() - 40000000 }
      ], createdAt: Date.now() - 43200000 }
    ],
    createdAt: Date.now() - 259200000, isQuestion: false,
  },
  {
    id: 'seed-4', author: 'করিম উদ্দিন', title: 'ত্রিকোণমিতির সূত্রগুলো মনে রাখার সহজ উপায়', mode: 'academic',
    body: 'ত্রিকোণমিতি নিয়ে অনেকে ভয় পায়। কিন্তু কিছু mnemonics ব্যবহার করলে সূত্রগুলো সহজেই মনে রাখা যায়।\n\nsin = লম্ব/অতিভুজ\ncos = ভূমি/অতিভুজ\ntan = লম্ব/ভূমি\n\nমনে রাখুন: "সোনার লকেট অতি সুন্দর, কোনো ভূমিই অতি সুন্দর না, তবুও লম্বা ভূমি ভালো"',
    video: 'https://www.w3schools.com/html/mov_bbb.mp4', videoViews: 3450,
    category: 'math', votes: 42, upvoters: [], downvoters: [], comments: [],
    createdAt: Date.now() - 345600000, isQuestion: false,
  },
  {
    id: 'seed-5', author: 'তানভীর আহমেদ', title: 'ফ্রিল্যান্সিং শুরু করার ৫টি ধাপ', mode: 'others',
    body: 'ফ্রিল্যান্সিং শুরু করতে চান? এই ৫টি ধাপ অনুসরণ করুন:\n\n১. একটি স্কিল ভালো করে শিখুন (ওয়েব ডেভ, গ্রাফিক্স, কনটেন্ট রাইটিং)\n২. পোর্টফোলিও তৈরি করুন\n৩. Fiverr বা Upwork-এ প্রোফাইল খুলুন\n৪. প্রথমে কম দামে কাজ নিন রিভিউ পেতে\n৫. ধৈর্য ধরুন, ৩-৬ মাস সময় লাগবে',
    category: 'freelancing', votes: 56, upvoters: [], downvoters: [],
    comments: [
      { id: 'c5', author: 'সুমাইয়া খান', text: 'আমি গ্রাফিক্স ডিজাইন শিখছি, Canva দিয়ে শুরু করেছি। কোন কোর্স recommend করবেন?', likes: 3, likedBy: [], replies: [], createdAt: Date.now() - 50000000 }
    ],
    createdAt: Date.now() - 400000000, isQuestion: false,
  },
  {
    id: 'seed-6', author: 'নাফিসা জাহান', title: 'ডিজিটাল মার্কেটিং-এ SEO কেন গুরুত্বপূর্ণ?', mode: 'others',
    body: 'SEO (Search Engine Optimization) হলো আপনার ওয়েবসাইটকে Google-এ উপরে আনার কৌশল। ভালো SEO মানে বেশি ভিজিটর, বেশি কাস্টমার। মূল বিষয়গুলো হলো: কিওয়ার্ড রিসার্চ, অন-পেজ SEO, ব্যাকলিংক বিল্ডিং।',
    category: 'digital-marketing', votes: 29, upvoters: [], downvoters: [],
    comments: [], createdAt: Date.now() - 500000000, isQuestion: false,
  },
]

/* ─── Helpers ─── */
const uid = () => Math.random().toString(36).slice(2, 10)
const timeAgo = (ts: number) => {
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 60) return 'এইমাত্র'
  if (s < 3600) return `${Math.floor(s / 60)} মিনিট আগে`
  if (s < 86400) return `${Math.floor(s / 3600)} ঘণ্টা আগে`
  return `${Math.floor(s / 86400)} দিন আগে`
}
const getInitials = (name: string) => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
const formatCount = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`

/* ─── Facebook-style card ─── */
const fbCard: React.CSSProperties = {
  background: '#ffffff', borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04)',
  overflow: 'hidden',
}

/* ─── Export: tells dashboard to hide right panel ─── */
export const forumHidesRightPanel = true

/* ═══════════════════════════════════════════
   Forum Component
═══════════════════════════════════════════ */
export default function ForumPage() {
  const { user } = useAuth()
  const username = user?.displayName || 'অতিথি'

  /* ─ State ─ */
  const [posts, setPosts] = useState<Post[]>([])
  const [activePost, setActivePost] = useState<Post | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [sortBy, setSortBy] = useState<'hot' | 'new' | 'top'>('hot')
  const [filterCat, setFilterCat] = useState('all')
  const [searchQ, setSearchQ] = useState('')
  const [masterMode, setMasterMode] = useState<'academic' | 'others'>('academic')

  // Create post
  const [newTitle, setNewTitle] = useState('')
  const [newBody, setNewBody] = useState('')
  const [newCat, setNewCat] = useState('general')
  const [newIsQ, setNewIsQ] = useState(false)
  const [newImg, setNewImg] = useState<string | undefined>(undefined)
  const fileRef = useRef<HTMLInputElement>(null)

  // Comments
  const [commentText, setCommentText] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  // Load / save
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) { setPosts(JSON.parse(raw)) } else { setPosts(SEED_POSTS); localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_POSTS)) }
    } catch { setPosts(SEED_POSTS) }
  }, [])
  const save = (p: Post[]) => { setPosts(p); localStorage.setItem(STORAGE_KEY, JSON.stringify(p)) }

  // Reset filter when mode changes
  useEffect(() => { setFilterCat('all') }, [masterMode])

  const activeCats = masterMode === 'academic' ? academicCats : othersCats

  /* ─ Actions ─ */
  const handleVote = (postId: string, dir: 'up' | 'down') => {
    const update = (p: Post): Post => {
      if (p.id !== postId) return p
      let nUp = p.upvoters.filter(u => u !== username); let nDown = p.downvoters.filter(u => u !== username)
      if (dir === 'up' && !p.upvoters.includes(username)) nUp.push(username)
      if (dir === 'down' && !p.downvoters.includes(username)) nDown.push(username)
      return { ...p, upvoters: nUp, downvoters: nDown, votes: nUp.length - nDown.length }
    }
    save(posts.map(update))
    if (activePost?.id === postId) setActivePost(prev => prev ? update(prev) : prev)
  }

  const handleLike = (postId: string) => handleVote(postId, 'up')

  const handleCreate = () => {
    if (!newTitle.trim()) return
    const post: Post = {
      id: uid(), author: username, title: newTitle, body: newBody, mode: masterMode,
      category: newIsQ ? 'question' : newCat, image: newImg,
      votes: 0, upvoters: [], downvoters: [], comments: [],
      createdAt: Date.now(), isQuestion: newIsQ,
    }
    save([post, ...posts])
    setNewTitle(''); setNewBody(''); setNewCat('general'); setNewIsQ(false); setNewImg(undefined); setShowCreate(false)
  }

  const handleAddComment = (postId: string) => {
    if (!commentText.trim()) return
    const c: Comment = { id: uid(), author: username, text: commentText, likes: 0, likedBy: [], replies: [], createdAt: Date.now() }
    const updated = posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, c] } : p)
    save(updated)
    setActivePost(prev => prev?.id === postId ? { ...prev, comments: [...prev.comments, c] } : prev)
    setCommentText('')
  }

  const handleReply = (postId: string, commentId: string) => {
    if (!replyText.trim()) return
    const r: Reply = { id: uid(), author: username, text: replyText, likes: 0, likedBy: [], createdAt: Date.now() }
    const mapComments = (comments: Comment[]) => comments.map(c => c.id === commentId ? { ...c, replies: [...c.replies, r] } : c)
    save(posts.map(p => p.id === postId ? { ...p, comments: mapComments(p.comments) } : p))
    setActivePost(prev => prev?.id === postId ? { ...prev, comments: mapComments(prev.comments) } : prev)
    setReplyText(''); setReplyTo(null)
  }

  const handleLikeComment = (postId: string, commentId: string) => {
    const mapComments = (comments: Comment[]) => comments.map(c => {
      if (c.id !== commentId) return c
      const liked = c.likedBy.includes(username)
      return { ...c, likes: liked ? c.likes - 1 : c.likes + 1, likedBy: liked ? c.likedBy.filter(u => u !== username) : [...c.likedBy, username] }
    })
    save(posts.map(p => p.id === postId ? { ...p, comments: mapComments(p.comments) } : p))
    setActivePost(prev => prev?.id === postId ? { ...prev, comments: mapComments(prev.comments) } : prev)
  }

  const handleShare = (post: Post) => {
    const url = window.location.href
    if (navigator.share) navigator.share({ title: post.title, text: post.body.slice(0, 100), url })
    else { navigator.clipboard.writeText(`${post.title}\n${url}`); alert('লিঙ্ক কপি করা হয়েছে!') }
  }

  const handleImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader(); reader.onload = () => setNewImg(reader.result as string); reader.readAsDataURL(file)
  }

  // Filter & sort
  let filtered = posts.filter(p => p.mode === masterMode)
  if (filterCat !== 'all') filtered = filtered.filter(p => p.category === filterCat)
  if (searchQ) filtered = filtered.filter(p => p.title.toLowerCase().includes(searchQ.toLowerCase()) || p.body.toLowerCase().includes(searchQ.toLowerCase()))
  if (sortBy === 'new') filtered.sort((a, b) => b.createdAt - a.createdAt)
  else if (sortBy === 'top') filtered.sort((a, b) => b.votes - a.votes)
  else filtered.sort((a, b) => (b.votes + b.comments.length * 2) - (a.votes + a.comments.length * 2))

  const catColor = (cat: string) => [...academicCats, ...othersCats].find(c => c.id === cat)?.color || '#8e8e93'
  const catLabel = (cat: string) => [...academicCats, ...othersCats].find(c => c.id === cat)?.label || cat

  /* ─── Avatars ─── */
  const Avatar = ({ name, size = 40 }: { name: string; size?: number }) => (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: 'linear-gradient(135deg, #3a7bd5, #5a6cf8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontWeight: 800, fontSize: size * 0.35,
    }}>{getInitials(name)}</div>
  )

  /* ─── Facebook-style action button ─── */
  const FbActionBtn = ({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }) => (
    <button onClick={onClick} style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      padding: '10px 0', border: 'none', background: 'none', cursor: 'pointer',
      fontSize: 13, fontWeight: 600, color: active ? '#3a7bd5' : '#65676b',
      fontFamily: "'Anek Bangla', sans-serif", borderRadius: 6, transition: 'background 150ms',
    }}
      onMouseEnter={e => e.currentTarget.style.background = '#f2f3f5'}
      onMouseLeave={e => e.currentTarget.style.background = 'none'}
    >{icon}{label}</button>
  )

  /* ═══ POST DETAIL VIEW ═══ */
  if (activePost) {
    return (
      <div style={{ display: 'flex', gap: 24, maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ flex: 1, maxWidth: 680, minWidth: 0 }}>
        <button onClick={() => setActivePost(null)} style={{
          background: 'none', border: 'none', cursor: 'pointer', color: '#3a7bd5', fontSize: 14,
          fontWeight: 600, fontFamily: "'Anek Bangla', sans-serif", marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="#3a7bd5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          ফোরামে ফিরে যান
        </button>

        <div style={fbCard}>
          {/* Header */}
          <div style={{ padding: '16px 16px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar name={activePost.author} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#050505' }}>{activePost.author}</div>
              <div style={{ fontSize: 12, color: '#65676b', display: 'flex', alignItems: 'center', gap: 4 }}>
                {timeAgo(activePost.createdAt)} · <span style={{ fontSize: 10, color: catColor(activePost.category), fontWeight: 700, background: `${catColor(activePost.category)}14`, padding: '1px 8px', borderRadius: 999 }}>{activePost.isQuestion ? '❓ ' : ''}{catLabel(activePost.category)}</span>
              </div>
            </div>
          </div>
          {/* Content */}
          <div style={{ padding: '12px 16px' }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#050505', marginBottom: 8, lineHeight: 1.4 }}>{activePost.title}</h2>
            <p style={{ fontSize: 14, color: '#050505', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{activePost.body}</p>
          </div>
          {/* Media */}
          {activePost.image && <img src={activePost.image} alt="" style={{ width: '100%', maxHeight: 600, objectFit: 'contain', background: '#f0f2f5' }} />}
          {activePost.video && (
            <div style={{ position: 'relative', background: '#000' }}>
              <video src={activePost.video} controls style={{ width: '100%', maxHeight: 600 }} />
              {activePost.videoViews && <span style={{ position: 'absolute', bottom: 10, left: 12, background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: 11, padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>👁 {formatCount(activePost.videoViews)} views</span>}
            </div>
          )}
          {/* Counts bar */}
          <div style={{ padding: '8px 16px', display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#65676b' }}>
            <span>{activePost.votes > 0 ? `👍 ${activePost.votes}` : ''}</span>
            <span>{activePost.comments.length > 0 ? `${activePost.comments.length}টি মন্তব্য` : ''}</span>
          </div>
          {/* Action bar */}
          <div style={{ borderTop: '1px solid #e4e6eb', borderBottom: '1px solid #e4e6eb', margin: '0 16px', display: 'flex' }}>
            <FbActionBtn icon={<svg width="18" height="18" viewBox="0 0 24 24" fill={activePost.upvoters.includes(username) ? '#3a7bd5' : 'none'} stroke={activePost.upvoters.includes(username) ? '#3a7bd5' : '#65676b'} strokeWidth="2"><path d="M14 9V5a3 3 0 00-6 0v4H5a2 2 0 00-2 2v.5a8.5 8.5 0 005 7.7V22h6v-2.8a8.5 8.5 0 005-7.7V11a2 2 0 00-2-2h-3z"/></svg>} label="লাইক" active={activePost.upvoters.includes(username)} onClick={() => handleLike(activePost.id)} />
            <FbActionBtn icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#65676b" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>} label="মন্তব্য" onClick={() => document.getElementById('comment-input')?.focus()} />
            <FbActionBtn icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#65676b" strokeWidth="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>} label="শেয়ার" onClick={() => handleShare(activePost)} />
          </div>
          {/* Comments section */}
          <div style={{ padding: '12px 16px' }}>
            {/* Write comment */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <Avatar name={username} size={32} />
              <div style={{ flex: 1, display: 'flex', background: '#f0f2f5', borderRadius: 20, overflow: 'hidden' }}>
                <input id="comment-input" value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="মন্তব্য লিখুন..."
                  onKeyDown={e => e.key === 'Enter' && handleAddComment(activePost.id)}
                  style={{ flex: 1, padding: '10px 14px', border: 'none', background: 'none', fontSize: 13, fontFamily: "'Anek Bangla', sans-serif", outline: 'none', color: '#050505' }}
                />
                <button onClick={() => handleAddComment(activePost.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 14px', color: commentText.trim() ? '#3a7bd5' : '#bec3c9', fontWeight: 800, fontSize: 14 }}>➤</button>
              </div>
            </div>
            {/* Comments list */}
            {activePost.comments.map(c => (
              <div key={c.id} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <Avatar name={c.author} size={32} />
                <div style={{ flex: 1 }}>
                  <div style={{ background: '#f0f2f5', borderRadius: 18, padding: '8px 14px', display: 'inline-block', maxWidth: '100%' }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#050505' }}>{c.author}</div>
                    <p style={{ fontSize: 13, color: '#050505', lineHeight: 1.5, margin: 0 }}>{c.text}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 16, paddingLeft: 14, marginTop: 4, fontSize: 12, fontWeight: 700, color: '#65676b' }}>
                    <span style={{ fontSize: 11, color: '#65676b' }}>{timeAgo(c.createdAt)}</span>
                    <button onClick={() => handleLikeComment(activePost.id, c.id)} style={{ ...tinyBtn, color: c.likedBy.includes(username) ? '#3a7bd5' : '#65676b' }}>লাইক{c.likes > 0 ? ` (${c.likes})` : ''}</button>
                    <button onClick={() => { setReplyTo(replyTo === c.id ? null : c.id); setReplyText('') }} style={{ ...tinyBtn, color: '#65676b' }}>উত্তর দিন</button>
                  </div>
                  {/* Reply input */}
                  {replyTo === c.id && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 8, marginLeft: 14 }}>
                      <Avatar name={username} size={24} />
                      <div style={{ flex: 1, display: 'flex', background: '#f0f2f5', borderRadius: 20, overflow: 'hidden' }}>
                        <input autoFocus value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="উত্তর লিখুন..."
                          onKeyDown={e => e.key === 'Enter' && handleReply(activePost.id, c.id)}
                          style={{ flex: 1, padding: '8px 12px', border: 'none', background: 'none', fontSize: 12, fontFamily: "'Anek Bangla', sans-serif", outline: 'none' }}
                        />
                        <button onClick={() => handleReply(activePost.id, c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 10px', color: replyText.trim() ? '#3a7bd5' : '#bec3c9', fontWeight: 800, fontSize: 13 }}>➤</button>
                      </div>
                    </div>
                  )}
                  {/* Replies */}
                  {c.replies.map(r => (
                    <div key={r.id} style={{ display: 'flex', gap: 8, marginTop: 8, marginLeft: 14 }}>
                      <Avatar name={r.author} size={24} />
                      <div>
                        <div style={{ background: '#f0f2f5', borderRadius: 18, padding: '6px 12px', display: 'inline-block' }}>
                          <div style={{ fontWeight: 700, fontSize: 12, color: '#050505' }}>{r.author}</div>
                          <p style={{ fontSize: 12, color: '#050505', lineHeight: 1.4, margin: 0 }}>{r.text}</p>
                        </div>
                        <div style={{ paddingLeft: 12, marginTop: 2, fontSize: 11, color: '#65676b' }}>{timeAgo(r.createdAt)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    )
  }

  /* ═══ FEED VIEW ═══ */
  return (
    <div style={{ display: 'flex', gap: 24, maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ flex: 1, maxWidth: 680, minWidth: 0, display: activePost ? 'none' : 'block' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1d1d1f', marginRight: 'auto' }}>ফোরাম</h2>

        {/* Academic / Others toggle */}
        <div style={{ display: 'flex', background: '#e4e6eb', borderRadius: 10, padding: 3 }}>
          {(['academic', 'others'] as const).map(m => (
            <button key={m} onClick={() => setMasterMode(m)} style={{
              padding: '8px 18px', borderRadius: 8, border: 'none', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', fontFamily: "'Anek Bangla', sans-serif", transition: 'all 200ms',
              background: masterMode === m ? '#ffffff' : 'transparent', color: masterMode === m ? '#050505' : '#65676b',
              boxShadow: masterMode === m ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
            }}>{m === 'academic' ? '📚 একাডেমিক' : '🌟 অন্যান্য'}</button>
          ))}
        </div>

        <button onClick={() => setShowCreate(true)} style={{
          background: 'linear-gradient(135deg, #3a7bd5, #5a6cf8)', color: 'white', border: 'none',
          borderRadius: 10, padding: '9px 18px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
          fontFamily: "'Anek Bangla', sans-serif", boxShadow: '0 2px 10px rgba(58,123,213,0.25)',
          transition: 'all 200ms', display: 'flex', alignItems: 'center', gap: 6,
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(58,123,213,0.3)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(58,123,213,0.25)' }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
          নতুন পোস্ট
        </button>
      </div>

      {/* Create post prompt (Facebook-style) */}
      <div style={{ ...fbCard, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setShowCreate(true)}>
        <Avatar name={username} size={40} />
        <div style={{ flex: 1, background: '#f0f2f5', borderRadius: 20, padding: '10px 16px', fontSize: 14, color: '#65676b' }}>
          আপনার মনে কী আছে, {username}?
        </div>
      </div>

      {/* Search + Sort */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 180, display: 'flex', alignItems: 'center', gap: 8, background: '#f0f2f5', borderRadius: 20, padding: '8px 14px' }}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="#65676b" strokeWidth="1.5"/><path d="M11 11l3 3" stroke="#65676b" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="পোস্ট খুঁজুন..." style={{ border: 'none', background: 'none', outline: 'none', flex: 1, fontSize: 13, fontFamily: "'Anek Bangla', sans-serif", color: '#050505' }} />
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {([['hot', '🔥 সেরা'], ['new', '🕐 নতুন'], ['top', '⬆ জনপ্রিয়']] as [string, string][]).map(([key, label]) => (
            <button key={key} onClick={() => setSortBy(key as 'hot' | 'new' | 'top')} style={{
              padding: '8px 12px', borderRadius: 8, border: 'none', fontSize: 12, fontWeight: 600,
              cursor: 'pointer', fontFamily: "'Anek Bangla', sans-serif", transition: 'all 200ms',
              background: sortBy === key ? '#3a7bd5' : '#e4e6eb', color: sortBy === key ? 'white' : '#65676b',
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Category pills */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }} className="scroll-x">
        {activeCats.map(cat => (
          <button key={cat.id} onClick={() => setFilterCat(cat.id)} style={{
            padding: '6px 14px', borderRadius: 20, border: 'none', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', fontFamily: "'Anek Bangla', sans-serif", whiteSpace: 'nowrap', transition: 'all 200ms',
            background: filterCat === cat.id ? cat.color : '#e4e6eb',
            color: filterCat === cat.id ? 'white' : '#65676b',
          }}>{cat.label}</button>
        ))}
      </div>

      {/* Post feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filtered.length === 0 && <div style={{ ...fbCard, textAlign: 'center', color: '#65676b', padding: 48, fontSize: 14 }}>কোনো পোস্ট পাওয়া যায়নি।</div>}
        {filtered.map(post => (
          <div key={post.id} style={{ ...fbCard, cursor: 'pointer', transition: 'box-shadow 200ms' }}
            onClick={() => setActivePost(post)}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04)'}
          >
            {/* Author header */}
            <div style={{ padding: '12px 16px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar name={post.author} size={40} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#050505' }}>{post.author}</div>
                <div style={{ fontSize: 12, color: '#65676b', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {timeAgo(post.createdAt)} · 🌍 ·
                  <span style={{ fontSize: 10, fontWeight: 700, color: catColor(post.category), background: `${catColor(post.category)}14`, padding: '1px 6px', borderRadius: 999 }}>
                    {post.isQuestion ? '❓ ' : ''}{catLabel(post.category)}
                  </span>
                </div>
              </div>
            </div>

            {/* Text content */}
            <div style={{ padding: '10px 16px' }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#050505', marginBottom: 4, lineHeight: 1.4 }}>{post.title}</div>
              <p style={{ fontSize: 14, color: '#050505', lineHeight: 1.6, margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' as const }}>{post.body}</p>
            </div>

            {/* Media — tall Facebook-like aspect ratio */}
            {post.image && (
              <img src={post.image} alt="" style={{ width: '100%', maxHeight: 520, objectFit: 'cover', background: '#f0f2f5' }} />
            )}
            {post.video && (
              <div style={{ position: 'relative', background: '#000' }} onClick={e => e.stopPropagation()}>
                <video src={post.video} controls style={{ width: '100%', maxHeight: 520 }} />
                {post.videoViews && <span style={{ position: 'absolute', bottom: 10, left: 12, background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: 11, padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>👁 {formatCount(post.videoViews)} views</span>}
              </div>
            )}

            {/* Counts bar */}
            <div style={{ padding: '6px 16px', display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#65676b' }}>
              <span>{post.votes > 0 ? `👍 ${post.votes}` : ''}</span>
              <div style={{ display: 'flex', gap: 12 }}>
                {post.comments.length > 0 && <span>{post.comments.length}টি মন্তব্য</span>}
              </div>
            </div>

            {/* Facebook action bar */}
            <div style={{ borderTop: '1px solid #e4e6eb', margin: '0 16px', display: 'flex', padding: '2px 0' }} onClick={e => e.stopPropagation()}>
              <FbActionBtn
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill={post.upvoters.includes(username) ? '#3a7bd5' : 'none'} stroke={post.upvoters.includes(username) ? '#3a7bd5' : '#65676b'} strokeWidth="2"><path d="M14 9V5a3 3 0 00-6 0v4H5a2 2 0 00-2 2v.5a8.5 8.5 0 005 7.7V22h6v-2.8a8.5 8.5 0 005-7.7V11a2 2 0 00-2-2h-3z"/></svg>}
                label="লাইক" active={post.upvoters.includes(username)} onClick={() => handleLike(post.id)}
              />
              <FbActionBtn
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#65676b" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>}
                label="মন্তব্য" onClick={() => setActivePost(post)}
              />
              <FbActionBtn
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#65676b" strokeWidth="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>}
                label="শেয়ার" onClick={() => handleShare(post)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ═══ Create Post Modal ═══ */}
      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowCreate(false)}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(4px)' }} />
          <div style={{ ...fbCard, width: '100%', maxWidth: 520, maxHeight: '85vh', overflowY: 'auto', position: 'relative', zIndex: 1, boxShadow: '0 12px 40px rgba(0,0,0,0.20)' }} onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #e4e6eb', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#050505' }}>পোস্ট তৈরি করুন</h3>
              <button onClick={() => setShowCreate(false)} style={{ position: 'absolute', right: 16, width: 32, height: 32, borderRadius: '50%', background: '#e4e6eb', border: 'none', cursor: 'pointer', fontSize: 16, color: '#65676b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div style={{ padding: 16 }}>
              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <Avatar name={username} size={40} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#050505' }}>{username}</div>
                  <div style={{ fontSize: 11, color: '#65676b', display: 'flex', alignItems: 'center', gap: 4 }}>🌍 পাবলিক · {masterMode === 'academic' ? '📚 একাডেমিক' : '🌟 অন্যান্য'}</div>
                </div>
              </div>
              <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="শিরোনাম লিখুন *"
                style={{ width: '100%', padding: '10px 0', border: 'none', fontSize: 16, fontWeight: 700, fontFamily: "'Anek Bangla', sans-serif", outline: 'none', color: '#050505', background: 'none', borderBottom: '1px solid #e4e6eb', marginBottom: 10 }}
              />
              <textarea value={newBody} onChange={e => setNewBody(e.target.value)} placeholder={`আপনার মনে কী আছে, ${username}?`} rows={4}
                style={{ width: '100%', padding: '10px 0', border: 'none', fontSize: 15, fontFamily: "'Anek Bangla', sans-serif", outline: 'none', color: '#050505', resize: 'none', background: 'none', lineHeight: 1.6 }}
              />
              {/* Image preview */}
              {newImg && (
                <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', marginBottom: 12 }}>
                  <img src={newImg} alt="preview" style={{ width: '100%', maxHeight: 300, objectFit: 'cover' }} />
                  <button onClick={() => setNewImg(undefined)} style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                </div>
              )}
              {/* Category */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#65676b', marginBottom: 8 }}>ক্যাটাগরি</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {activeCats.filter(c => c.id !== 'all' && c.id !== 'question').map(cat => (
                    <button key={cat.id} onClick={() => setNewCat(cat.id)} style={{
                      padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      border: 'none', fontFamily: "'Anek Bangla', sans-serif", transition: 'all 200ms',
                      background: newCat === cat.id ? cat.color : '#e4e6eb',
                      color: newCat === cat.id ? 'white' : '#65676b',
                    }}>{cat.label}</button>
                  ))}
                </div>
              </div>
              {/* Toolbar */}
              <div style={{ borderTop: '1px solid #e4e6eb', paddingTop: 12, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#65676b', marginRight: 8 }}>যোগ করুন</span>
                <button onClick={() => fileRef.current?.click()} style={{ ...toolBtn }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5ab87a" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </button>
                <button style={{ ...toolBtn }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff2d55" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                </button>
                <label style={{ ...toolBtn, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                  <input type="checkbox" checked={newIsQ} onChange={e => setNewIsQ(e.target.checked)} style={{ accentColor: '#ff9500', width: 14, height: 14 }} />
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff9500" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </label>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImgUpload} style={{ display: 'none' }} />
              </div>
              <button onClick={handleCreate} disabled={!newTitle.trim()} style={{
                width: '100%', padding: '10px', borderRadius: 8, border: 'none', fontSize: 15, fontWeight: 700,
                cursor: newTitle.trim() ? 'pointer' : 'default', fontFamily: "'Anek Bangla', sans-serif",
                background: newTitle.trim() ? '#3a7bd5' : '#e4e6eb', color: newTitle.trim() ? 'white' : '#bec3c9',
                transition: 'all 200ms',
              }}>পোস্ট করুন</button>
            </div>
          </div>
        </div>
      )}
      </div> {/* End of main feed or detail col */}

      {/* ═══ Right Panel: Active Users ═══ */}
      <div style={{ width: 280, flexShrink: 0, position: 'sticky', top: 20, height: 'max-content', display: 'flex', flexDirection: 'column', gap: 8 }} className="forum-right-panel">
        <div style={{ fontWeight: 700, fontSize: 14, color: '#65676b', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: 8, marginBottom: 8 }}>
          সক্রিয় ব্যবহারকারী
        </div>
        {[
          { name: 'প্রফেসর আহমেদ', status: 'online' },
          { name: 'মিস রাহেলা', status: 'online' },
          { name: 'শিখবেই বাংলাদেশ', status: 'offline' },
          { name: 'মডারেটর', status: 'offline' },
          { name: 'করিম উদ্দিন', status: 'online' },
          { name: 'সুমাইয়া খান', status: 'away' },
        ].map(u => (
          <div key={u.name} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: '8px', borderRadius: 8, transition: 'background 200ms' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.04)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ position: 'relative' }}>
              <Avatar name={u.name} size={36} />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: '50%', background: u.status === 'online' ? '#31a24c' : u.status === 'away' ? '#f5c33b' : '#c7c7cc', border: '2px solid white' }} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#050505' }}>{u.name}</div>
          </div>
        ))}
      </div>
      <style>{`
        @media (max-width: 960px) { .forum-right-panel { display: none !important; } }
      `}</style>
    </div>
  )
}

/* ─── Micro-styles ─── */
const tinyBtn: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 12,
  fontWeight: 700, fontFamily: "'Anek Bangla', sans-serif",
}
const toolBtn: React.CSSProperties = {
  width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'none',
  cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'background 150ms',
}

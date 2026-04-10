'use client'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'

/* ─── Types ─── */
interface Reply {
  id: string; author: string; text: string; likes: number; likedBy: string[]; createdAt: number
}
interface Comment {
  id: string; author: string; text: string; likes: number; likedBy: string[]; replies: Reply[]; createdAt: number
}
interface Post {
  id: string; author: string; title: string; body: string; category: string
  image?: string; votes: number; upvoters: string[]; downvoters: string[]
  comments: Comment[]; createdAt: number; isQuestion: boolean
}

/* ─── Constants ─── */
const STORAGE_KEY = 'sb_forum_posts'
const categories = [
  { id: 'all', label: 'সব', color: '#8e8e93' },
  { id: 'physics', label: 'পদার্থবিজ্ঞান', color: '#4a90d9' },
  { id: 'bangla', label: 'বাংলা', color: '#5ab87a' },
  { id: 'english', label: 'ইংরেজি', color: '#8250d2' },
  { id: 'math', label: 'গণিত', color: '#e07050' },
  { id: 'chemistry', label: 'রসায়ন', color: '#d25a3c' },
  { id: 'general', label: 'সাধারণ', color: '#3a7bd5' },
  { id: 'question', label: 'প্রশ্ন', color: '#ff9500' },
]

const SEED_POSTS: Post[] = [
  {
    id: 'seed-1', author: 'রাহেলা পারভীন', title: 'নিউটনের তৃতীয় সূত্র নিয়ে একটি সহজ ব্যাখ্যা',
    body: 'নিউটনের তৃতীয় সূত্র বলে, প্রতিটি ক্রিয়ার একটি সমান ও বিপরীত প্রতিক্রিয়া আছে। উদাহরণ: আপনি যখন মেঝেতে দাঁড়ান, আপনার ওজন মেঝেতে বল প্রয়োগ করে এবং মেঝেও আপনাকে সমান বলে উপরের দিকে ঠেলে। এটাই কারণ আপনি মেঝের মধ্য দিয়ে পড়ে যান না!',
    category: 'physics', votes: 24, upvoters: ['user1','user2'], downvoters: [],
    comments: [
      { id: 'c1', author: 'করিম উদ্দিন', text: 'অনেক সুন্দর ব্যাখ্যা! রকেট উৎক্ষেপণও কি এই সূত্রের উদাহরণ?', likes: 5, likedBy: ['user1'], replies: [
        { id: 'r1', author: 'রাহেলা পারভীন', text: 'হ্যাঁ, রকেট গ্যাসকে নিচে ঠেলে এবং গ্যাস রকেটকে উপরে ঠেলে!', likes: 3, likedBy: [], createdAt: Date.now() - 3500000 }
      ], createdAt: Date.now() - 3600000 },
      { id: 'c2', author: 'সুমাইয়া খান', text: 'ধন্যবাদ দিদি, পরীক্ষায় অনেক কাজে লাগবে।', likes: 2, likedBy: [], replies: [], createdAt: Date.now() - 1800000 }
    ],
    createdAt: Date.now() - 86400000, isQuestion: false, image: undefined
  },
  {
    id: 'seed-2', author: 'আহমেদ হোসেন', title: 'বাংলা ১ম পত্র – গদ্য অংশের গুরুত্বপূর্ণ প্রশ্ন',
    body: 'আসন্ন পরীক্ষায় গদ্য অংশ থেকে কোন কোন প্রশ্ন বেশি আসতে পারে? কেউ কি গত বছরের প্রশ্নপত্র শেয়ার করতে পারবেন?',
    category: 'bangla', votes: 18, upvoters: [], downvoters: [],
    comments: [
      { id: 'c3', author: 'মিস রাহেলা', text: '"অপরিচিতা" থেকে প্রায় প্রতি বছর প্রশ্ন আসে। বিশেষ করে চরিত্র বিশ্লেষণ।', likes: 8, likedBy: [], replies: [], createdAt: Date.now() - 7200000 }
    ],
    createdAt: Date.now() - 172800000, isQuestion: true, image: undefined
  },
  {
    id: 'seed-3', author: 'সুমাইয়া খান', title: 'Spoken English – Daily Practice Tips 🎯',
    body: 'প্রতিদিন ইংরেজিতে কথা বলার অভ্যাস গড়ে তুলতে কিছু সহজ টিপস:\n\n১. প্রতিদিন ১০ মিনিট আয়নার সামনে ইংরেজিতে কথা বলুন\n২. ইংরেজি গান শুনুন ও lyrics পড়ুন\n৩. ছোট ছোট ডায়েরি লিখুন ইংরেজিতে\n৪. YouTube-এ TED Talks দেখুন\n৫. একজন study buddy খুঁজুন যার সাথে ইংরেজিতে কথা বলবেন',
    category: 'english', votes: 31, upvoters: [], downvoters: [],
    comments: [
      { id: 'c4', author: 'করিম উদ্দিন', text: 'TED Talks recommendation thakle share koro please!', likes: 4, likedBy: [], replies: [
        { id: 'r2', author: 'সুমাইয়া খান', text: 'Try "The power of introverts" by Susan Cain. Beginner-friendly and very inspiring!', likes: 6, likedBy: [], createdAt: Date.now() - 40000000 }
      ], createdAt: Date.now() - 43200000 }
    ],
    createdAt: Date.now() - 259200000, isQuestion: false, image: undefined
  },
  {
    id: 'seed-4', author: 'করিম উদ্দিন', title: 'ত্রিকোণমিতির সূত্রগুলো মনে রাখার সহজ উপায়',
    body: 'ত্রিকোণমিতি নিয়ে অনেকে ভয় পায়। কিন্তু কিছু mnemonics ব্যবহার করলে সূত্রগুলো সহজেই মনে রাখা যায়।\n\nsin = লম্ব/অতিভুজ\ncos = ভূমি/অতিভুজ\ntan = লম্ব/ভূমি\n\nমনে রাখুন: "সোনার লকেট অতি সুন্দর, কোনো ভূমিই অতি সুন্দর না, তবুও লম্বা ভূমি ভালো"\n\nকারও এর চেয়ে ভালো কৌশল থাকলে শেয়ার করুন!',
    category: 'math', votes: 42, upvoters: [], downvoters: [],
    comments: [],
    createdAt: Date.now() - 345600000, isQuestion: false, image: undefined
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

/* ─── Shared styles ─── */
const fCard: React.CSSProperties = {
  background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.55)', borderRadius: 18, padding: '20px 22px',
  boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
}

/* ─── Forum Component ─── */
export default function ForumPage() {
  const { user } = useAuth()
  const username = user?.displayName || 'অতিথি'

  // State
  const [posts, setPosts] = useState<Post[]>([])
  const [activePost, setActivePost] = useState<Post | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [sortBy, setSortBy] = useState<'hot' | 'new' | 'top'>('hot')
  const [filterCat, setFilterCat] = useState('all')
  const [searchQ, setSearchQ] = useState('')

  // Create post state
  const [newTitle, setNewTitle] = useState('')
  const [newBody, setNewBody] = useState('')
  const [newCat, setNewCat] = useState('general')
  const [newIsQ, setNewIsQ] = useState(false)
  const [newImg, setNewImg] = useState<string | undefined>(undefined)
  const fileRef = useRef<HTMLInputElement>(null)

  // Comment state
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

  // Actions
  const handleVote = (postId: string, dir: 'up' | 'down') => {
    save(posts.map(p => {
      if (p.id !== postId) return p
      const isUp = p.upvoters.includes(username); const isDown = p.downvoters.includes(username)
      let nUp = p.upvoters.filter(u => u !== username); let nDown = p.downvoters.filter(u => u !== username)
      if (dir === 'up') { if (!isUp) nUp.push(username) } else { if (!isDown) nDown.push(username) }
      return { ...p, upvoters: nUp, downvoters: nDown, votes: nUp.length - nDown.length }
    }))
    if (activePost && activePost.id === postId) {
      setActivePost(prev => {
        if (!prev) return prev
        const isUp = prev.upvoters.includes(username); const isDown = prev.downvoters.includes(username)
        let nUp = prev.upvoters.filter(u => u !== username); let nDown = prev.downvoters.filter(u => u !== username)
        if (dir === 'up') { if (!isUp) nUp.push(username) } else { if (!isDown) nDown.push(username) }
        return { ...prev, upvoters: nUp, downvoters: nDown, votes: nUp.length - nDown.length }
      })
    }
  }

  const handleCreate = () => {
    if (!newTitle.trim()) return
    const post: Post = {
      id: uid(), author: username, title: newTitle, body: newBody,
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
    setActivePost(prev => prev && prev.id === postId ? { ...prev, comments: [...prev.comments, c] } : prev)
    setCommentText('')
  }

  const handleReply = (postId: string, commentId: string) => {
    if (!replyText.trim()) return
    const r: Reply = { id: uid(), author: username, text: replyText, likes: 0, likedBy: [], createdAt: Date.now() }
    const updated = posts.map(p => p.id === postId ? {
      ...p, comments: p.comments.map(c => c.id === commentId ? { ...c, replies: [...c.replies, r] } : c)
    } : p)
    save(updated)
    setActivePost(prev => prev && prev.id === postId ? {
      ...prev, comments: prev.comments.map(c => c.id === commentId ? { ...c, replies: [...c.replies, r] } : c)
    } : prev)
    setReplyText(''); setReplyTo(null)
  }

  const handleLikeComment = (postId: string, commentId: string) => {
    const updated = posts.map(p => p.id === postId ? {
      ...p, comments: p.comments.map(c => {
        if (c.id !== commentId) return c
        const liked = c.likedBy.includes(username)
        return { ...c, likes: liked ? c.likes - 1 : c.likes + 1, likedBy: liked ? c.likedBy.filter(u => u !== username) : [...c.likedBy, username] }
      })
    } : p)
    save(updated)
    setActivePost(prev => {
      if (!prev || prev.id !== postId) return prev
      return { ...prev, comments: prev.comments.map(c => {
        if (c.id !== commentId) return c
        const liked = c.likedBy.includes(username)
        return { ...c, likes: liked ? c.likes - 1 : c.likes + 1, likedBy: liked ? c.likedBy.filter(u => u !== username) : [...c.likedBy, username] }
      })}
    })
  }

  const handleShare = (post: Post) => {
    const url = window.location.href
    if (navigator.share) { navigator.share({ title: post.title, text: post.body.slice(0, 100), url }) }
    else { navigator.clipboard.writeText(`${post.title}\n${url}`); alert('লিঙ্ক কপি করা হয়েছে!') }
  }

  const handleImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setNewImg(reader.result as string)
    reader.readAsDataURL(file)
  }

  // Filter & sort
  let filtered = posts.filter(p => filterCat === 'all' || p.category === filterCat)
  if (searchQ) filtered = filtered.filter(p => p.title.toLowerCase().includes(searchQ.toLowerCase()) || p.body.toLowerCase().includes(searchQ.toLowerCase()))
  if (sortBy === 'new') filtered.sort((a, b) => b.createdAt - a.createdAt)
  else if (sortBy === 'top') filtered.sort((a, b) => b.votes - a.votes)
  else filtered.sort((a, b) => (b.votes + b.comments.length * 2) - (a.votes + a.comments.length * 2))

  const catColor = (cat: string) => categories.find(c => c.id === cat)?.color || '#8e8e93'
  const catLabel = (cat: string) => categories.find(c => c.id === cat)?.label || cat

  /* ─── Post Detail View ─── */
  if (activePost) {
    return (
      <div>
        <button onClick={() => setActivePost(null)} style={{
          background: 'none', border: 'none', cursor: 'pointer', color: '#3a7bd5', fontSize: 14,
          fontWeight: 600, fontFamily: "'Anek Bangla', sans-serif", marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="#3a7bd5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          ফোরামে ফিরে যান
        </button>

        <div style={{ ...fCard, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #3a7bd5, #5a6cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{getInitials(activePost.author)}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#1d1d1f' }}>{activePost.author}</div>
              <div style={{ fontSize: 12, color: '#8e8e93' }}>{timeAgo(activePost.createdAt)}</div>
            </div>
            <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: catColor(activePost.category), background: `${catColor(activePost.category)}15`, padding: '3px 10px', borderRadius: 999 }}>
              {activePost.isQuestion ? '❓ ' : ''}{catLabel(activePost.category)}
            </span>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1d1d1f', marginBottom: 10, lineHeight: 1.4 }}>{activePost.title}</h2>
          <p style={{ fontSize: 14, color: '#3c3c43', lineHeight: 1.7, whiteSpace: 'pre-wrap', marginBottom: 14 }}>{activePost.body}</p>
          {activePost.image && <img src={activePost.image} alt="" style={{ width: '100%', borderRadius: 14, marginBottom: 14, maxHeight: 400, objectFit: 'cover' }} />}

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderTop: '1px solid #f2f2f7', paddingTop: 12 }}>
            <button onClick={() => handleVote(activePost.id, 'up')} style={{ ...voteBtn, color: activePost.upvoters.includes(username) ? '#5ab87a' : '#8e8e93' }}>
              <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 3l5 7H2z" fill="currentColor"/></svg>
            </button>
            <span style={{ fontSize: 14, fontWeight: 800, color: activePost.votes > 0 ? '#5ab87a' : activePost.votes < 0 ? '#ff6b6b' : '#8e8e93', minWidth: 24, textAlign: 'center' }}>{activePost.votes}</span>
            <button onClick={() => handleVote(activePost.id, 'down')} style={{ ...voteBtn, color: activePost.downvoters.includes(username) ? '#ff6b6b' : '#8e8e93' }}>
              <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 11L2 4h10z" fill="currentColor"/></svg>
            </button>
            <div style={{ width: 1, height: 18, background: '#e5e5ea', margin: '0 8px' }} />
            <span style={{ fontSize: 13, color: '#8e8e93', fontWeight: 600 }}>💬 {activePost.comments.length} মন্তব্য</span>
            <button onClick={() => handleShare(activePost)} style={{ ...voteBtn, marginLeft: 'auto', fontSize: 13, gap: 4, color: '#8e8e93' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 8l3-5 3 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M7 3v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M2 10v2h10v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              শেয়ার
            </button>
          </div>
        </div>

        {/* Comments */}
        <div style={{ ...fCard, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#1d1d1f', marginBottom: 16 }}>মন্তব্য ({activePost.comments.length})</div>
          {/* Add comment */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #3a7bd5, #5a6cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 11, flexShrink: 0 }}>{getInitials(username)}</div>
            <div style={{ flex: 1, display: 'flex', gap: 8 }}>
              <input value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="আপনার মন্তব্য লিখুন..."
                onKeyDown={e => e.key === 'Enter' && handleAddComment(activePost.id)}
                style={{ flex: 1, padding: '10px 14px', borderRadius: 12, border: '1.5px solid rgba(0,0,0,0.10)', fontSize: 13, fontFamily: "'Anek Bangla', sans-serif", outline: 'none', transition: 'border-color 300ms', background: 'rgba(255,255,255,0.80)' }}
                onFocus={e => e.currentTarget.style.borderColor = '#3a7bd5'} onBlur={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.10)'}
              />
              <button onClick={() => handleAddComment(activePost.id)} style={{ background: 'linear-gradient(135deg, #3a7bd5, #5a6cf8)', color: 'white', border: 'none', borderRadius: 12, padding: '0 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Anek Bangla', sans-serif", transition: 'transform 200ms' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >পোস্ট</button>
            </div>
          </div>
          {/* Comment list */}
          {activePost.comments.length === 0 && <div style={{ textAlign: 'center', color: '#aeaeb2', fontSize: 13, padding: '20px 0' }}>এখনো কোনো মন্তব্য নেই। প্রথম মন্তব্য করুন!</div>}
          {activePost.comments.map(c => (
            <div key={c.id} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #f2f2f7' }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg, ${catColor(activePost.category)}, #5a6cf8)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 10, flexShrink: 0 }}>{getInitials(c.author)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: '#1d1d1f' }}>{c.author}</span>
                    <span style={{ fontSize: 11, color: '#aeaeb2' }}>{timeAgo(c.createdAt)}</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#3c3c43', lineHeight: 1.6, margin: '6px 0 8px' }}>{c.text}</p>
                  <div style={{ display: 'flex', gap: 14, fontSize: 12 }}>
                    <button onClick={() => handleLikeComment(activePost.id, c.id)} style={{ ...miniBtn, color: c.likedBy.includes(username) ? '#3a7bd5' : '#aeaeb2' }}>
                      ♥ {c.likes > 0 ? c.likes : ''}
                    </button>
                    <button onClick={() => { setReplyTo(replyTo === c.id ? null : c.id); setReplyText('') }} style={{ ...miniBtn, color: '#aeaeb2' }}>
                      ↩ উত্তর
                    </button>
                  </div>
                  {/* Reply input */}
                  {replyTo === c.id && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                      <input value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="উত্তর লিখুন..." autoFocus
                        onKeyDown={e => e.key === 'Enter' && handleReply(activePost.id, c.id)}
                        style={{ flex: 1, padding: '8px 12px', borderRadius: 10, border: '1.5px solid rgba(0,0,0,0.10)', fontSize: 12, fontFamily: "'Anek Bangla', sans-serif", outline: 'none', background: '#f9f9fb' }}
                        onFocus={e => e.currentTarget.style.borderColor = '#3a7bd5'} onBlur={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.10)'}
                      />
                      <button onClick={() => handleReply(activePost.id, c.id)} style={{ background: '#3a7bd5', color: 'white', border: 'none', borderRadius: 10, padding: '0 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Anek Bangla', sans-serif" }}>↩</button>
                    </div>
                  )}
                  {/* Replies */}
                  {c.replies.map(r => (
                    <div key={r.id} style={{ marginTop: 12, marginLeft: 16, paddingLeft: 12, borderLeft: '2px solid #e5e5ea' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg, #5a6cf8, #8250d2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 8, flexShrink: 0 }}>{getInitials(r.author)}</div>
                        <span style={{ fontWeight: 700, fontSize: 12, color: '#1d1d1f' }}>{r.author}</span>
                        <span style={{ fontSize: 10, color: '#aeaeb2' }}>{timeAgo(r.createdAt)}</span>
                      </div>
                      <p style={{ fontSize: 12, color: '#3c3c43', lineHeight: 1.5, margin: '4px 0 0 28px' }}>{r.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  /* ─── Feed View ─── */
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1d1d1f' }}>ফোরাম</h2>
        <button onClick={() => setShowCreate(true)} style={{
          background: 'linear-gradient(135deg, #3a7bd5, #5a6cf8)', color: 'white', border: 'none',
          borderRadius: 12, padding: '10px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
          fontFamily: "'Anek Bangla', sans-serif", boxShadow: '0 4px 14px rgba(58,123,213,0.25)',
          transition: 'all 300ms ease', display: 'flex', alignItems: 'center', gap: 6,
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(58,123,213,0.35)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(58,123,213,0.25)' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
          নতুন পোস্ট
        </button>
      </div>

      {/* Search + Sort */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.80)', borderRadius: 12, padding: '8px 14px', border: '1px solid rgba(0,0,0,0.07)' }}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="#8e8e93" strokeWidth="1.5"/><path d="M11 11l3 3" stroke="#8e8e93" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="পোস্ট খুঁজুন..." style={{ border: 'none', background: 'none', outline: 'none', flex: 1, fontSize: 13, fontFamily: "'Anek Bangla', sans-serif", color: '#1d1d1f' }} />
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {([['hot', '🔥 সেরা'], ['new', '🕐 নতুন'], ['top', '⬆ জনপ্রিয়']] as [string, string][]).map(([key, label]) => (
            <button key={key} onClick={() => setSortBy(key as 'hot' | 'new' | 'top')} style={{
              padding: '8px 14px', borderRadius: 10, border: 'none', fontSize: 12, fontWeight: 600,
              cursor: 'pointer', fontFamily: "'Anek Bangla', sans-serif", transition: 'all 200ms',
              background: sortBy === key ? '#1d1d1f' : 'rgba(255,255,255,0.80)', color: sortBy === key ? 'white' : '#6e6e73',
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }} className="scroll-x">
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setFilterCat(cat.id)} style={{
            padding: '6px 14px', borderRadius: 999, border: `1.5px solid ${filterCat === cat.id ? cat.color : 'rgba(0,0,0,0.08)'}`,
            fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Anek Bangla', sans-serif",
            background: filterCat === cat.id ? `${cat.color}15` : 'rgba(255,255,255,0.80)',
            color: filterCat === cat.id ? cat.color : '#6e6e73', whiteSpace: 'nowrap', transition: 'all 200ms',
          }}>{cat.label}</button>
        ))}
      </div>

      {/* Post list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.length === 0 && <div style={{ ...fCard, textAlign: 'center', color: '#aeaeb2', padding: 40 }}>কোনো পোস্ট পাওয়া যায়নি।</div>}
        {filtered.map(post => (
          <div key={post.id} style={{ ...fCard, cursor: 'pointer', transition: 'all 300ms ease', display: 'flex', gap: 14 }}
            onClick={() => setActivePost(post)}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.04)' }}
          >
            {/* Vote column */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, paddingTop: 2 }} onClick={e => e.stopPropagation()}>
              <button onClick={() => handleVote(post.id, 'up')} style={{ ...voteBtn, color: post.upvoters.includes(username) ? '#5ab87a' : '#c7c7cc' }}>
                <svg width="16" height="16" viewBox="0 0 14 14"><path d="M7 3l5 7H2z" fill="currentColor"/></svg>
              </button>
              <span style={{ fontSize: 14, fontWeight: 800, color: post.votes > 0 ? '#5ab87a' : post.votes < 0 ? '#ff6b6b' : '#aeaeb2' }}>{post.votes}</span>
              <button onClick={() => handleVote(post.id, 'down')} style={{ ...voteBtn, color: post.downvoters.includes(username) ? '#ff6b6b' : '#c7c7cc' }}>
                <svg width="16" height="16" viewBox="0 0 14 14"><path d="M7 11L2 4h10z" fill="currentColor"/></svg>
              </button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: `linear-gradient(135deg, ${catColor(post.category)}, #5a6cf8)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 9, flexShrink: 0 }}>{getInitials(post.author)}</div>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#3c3c43' }}>{post.author}</span>
                <span style={{ fontSize: 11, color: '#aeaeb2' }}>· {timeAgo(post.createdAt)}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: catColor(post.category), background: `${catColor(post.category)}12`, padding: '2px 8px', borderRadius: 999, marginLeft: 'auto' }}>
                  {post.isQuestion ? '❓ ' : ''}{catLabel(post.category)}
                </span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#1d1d1f', marginBottom: 4, lineHeight: 1.4 }}>{post.title}</div>
              <p style={{ fontSize: 13, color: '#6e6e73', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>{post.body}</p>
              {post.image && <img src={post.image} alt="" style={{ width: '100%', borderRadius: 12, marginTop: 10, maxHeight: 200, objectFit: 'cover' }} />}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 10 }} onClick={e => e.stopPropagation()}>
                <span style={{ fontSize: 12, color: '#8e8e93', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>💬 {post.comments.length} মন্তব্য</span>
                <button onClick={() => handleShare(post)} style={{ ...miniBtn, color: '#aeaeb2', gap: 4 }}>
                  ↗ শেয়ার
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ Create Post Modal ═══ */}
      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setShowCreate(false)}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)' }} />
          <div style={{ ...fCard, width: '100%', maxWidth: 560, maxHeight: '85vh', overflowY: 'auto', position: 'relative', zIndex: 1, padding: '28px 28px 24px', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1d1d1f' }}>নতুন পোস্ট তৈরি করুন</h3>
              <button onClick={() => setShowCreate(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#8e8e93', lineHeight: 1 }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="পোস্টের শিরোনাম *"
                style={{ ...inputStyle, fontWeight: 700, fontSize: 15 }} />
              <textarea value={newBody} onChange={e => setNewBody(e.target.value)} placeholder="বিস্তারিত লিখুন..." rows={5}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />

              {/* Category */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#3c3c43', marginBottom: 8 }}>ক্যাটাগরি বেছে নিন</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {categories.filter(c => c.id !== 'all' && c.id !== 'question').map(cat => (
                    <button key={cat.id} onClick={() => setNewCat(cat.id)} style={{
                      padding: '5px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      border: `1.5px solid ${newCat === cat.id ? cat.color : 'rgba(0,0,0,0.08)'}`,
                      background: newCat === cat.id ? `${cat.color}15` : 'transparent',
                      color: newCat === cat.id ? cat.color : '#6e6e73', fontFamily: "'Anek Bangla', sans-serif",
                    }}>{cat.label}</button>
                  ))}
                </div>
              </div>

              {/* Options row */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, color: '#3c3c43', fontWeight: 600 }}>
                  <input type="checkbox" checked={newIsQ} onChange={e => setNewIsQ(e.target.checked)} style={{ accentColor: '#ff9500', width: 16, height: 16 }} />
                  ❓ প্রশ্ন হিসেবে পোস্ট করুন
                </label>
                <button onClick={() => fileRef.current?.click()} style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 10,
                  border: '1.5px solid rgba(0,0,0,0.10)', background: 'rgba(255,255,255,0.80)', fontSize: 13,
                  fontWeight: 600, cursor: 'pointer', color: '#3a7bd5', fontFamily: "'Anek Bangla', sans-serif",
                }}>
                  📷 ছবি যুক্ত করুন
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImgUpload} style={{ display: 'none' }} />
              </div>

              {/* Image preview */}
              {newImg && (
                <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden' }}>
                  <img src={newImg} alt="preview" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 12 }} />
                  <button onClick={() => setNewImg(undefined)} style={{
                    position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%',
                    background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>✕</button>
                </div>
              )}

              <button onClick={handleCreate} disabled={!newTitle.trim()} style={{
                background: newTitle.trim() ? 'linear-gradient(135deg, #3a7bd5, #5a6cf8)' : '#e5e5ea',
                color: newTitle.trim() ? 'white' : '#aeaeb2', border: 'none', borderRadius: 12,
                padding: '12px 24px', fontSize: 15, fontWeight: 700, cursor: newTitle.trim() ? 'pointer' : 'default',
                fontFamily: "'Anek Bangla', sans-serif", transition: 'all 300ms', alignSelf: 'flex-end',
                boxShadow: newTitle.trim() ? '0 4px 14px rgba(58,123,213,0.25)' : 'none',
              }}>পোস্ট করুন</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Micro-styles ─── */
const voteBtn: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex',
  alignItems: 'center', justifyContent: 'center', transition: 'color 200ms, transform 150ms',
}
const miniBtn: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 12,
  fontWeight: 600, fontFamily: "'Anek Bangla', sans-serif", display: 'flex', alignItems: 'center', transition: 'color 200ms',
}
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', borderRadius: 12,
  border: '1.5px solid rgba(0,0,0,0.10)', background: 'rgba(255,255,255,0.80)',
  fontSize: 14, fontFamily: "'Anek Bangla', sans-serif", color: '#1d1d1f',
  outline: 'none', transition: 'border-color 300ms',
}

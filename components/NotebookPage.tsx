'use client'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

/* ─── Types ─── */
interface Source {
  id: string
  name: string
  type: 'pdf' | 'doc' | 'text' | 'youtube' | 'website' | 'image' | 'audio'
  content: string
  addedAt: number
  size?: string
}

interface Note {
  id: string
  title: string
  content: string
  createdAt: number
}

interface ChatMsg {
  id: string
  role: 'user' | 'ai'
  text: string
  time: number
}

/* ─── Constants ─── */
const STORAGE_KEY = 'sb_notebook_data'
const uid = () => Math.random().toString(36).slice(2, 10)

const sourceTypeIcon: Record<string, { icon: string; color: string }> = {
  pdf: { icon: '📄', color: '#d25a3c' },
  doc: { icon: '📝', color: '#3a7bd5' },
  text: { icon: '📋', color: '#5ab87a' },
  youtube: { icon: '📺', color: '#ff0000' },
  website: { icon: '🌐', color: '#8250d2' },
  image: { icon: '🖼️', color: '#ff9500' },
  audio: { icon: '🎵', color: '#e07050' },
}

const studioTools = [
  { id: 'audio', icon: '🎙️', label: 'অডিও ওভারভিউ', desc: 'সোর্স থেকে অডিও সারাংশ' },
  { id: 'slides', icon: '📊', label: 'স্লাইড ডেক', desc: 'প্রেজেন্টেশন তৈরি করুন' },
  { id: 'video', icon: '🎬', label: 'ভিডিও ওভারভিউ', desc: 'ভিডিও সারাংশ তৈরি' },
  { id: 'mindmap', icon: '🗺️', label: 'মাইন্ড ম্যাপ', desc: 'ভিজ্যুয়াল নোট ম্যাপ' },
  { id: 'report', icon: '📑', label: 'রিপোর্ট', desc: 'বিস্তারিত রিপোর্ট তৈরি' },
  { id: 'flashcard', icon: '🃏', label: 'ফ্ল্যাশকার্ড', desc: 'মুখস্থ করার কার্ড' },
  { id: 'quiz', icon: '❓', label: 'কুইজ', desc: 'প্রশ্নোত্তর তৈরি করুন' },
  { id: 'infographic', icon: '📈', label: 'ইনফোগ্রাফিক', desc: 'তথ্যচিত্র তৈরি' },
  { id: 'table', icon: '📋', label: 'ডেটা টেবিল', desc: 'তথ্য সারণি তৈরি' },
]

/* ─── AI Response for notebook ─── */
function getNotebookAI(q: string, sources: Source[]): string {
  const lower = q.toLowerCase()
  const srcCount = sources.length
  if (srcCount === 0) return 'আপনি এখনও কোনো সোর্স যোগ করেননি। বাম পাশের "সোর্স" প্যানেল থেকে PDF, ওয়েবসাইট, YouTube ভিডিও বা টেক্সট যোগ করুন। তারপর আমি আপনাকে সেগুলো নিয়ে সাহায্য করতে পারব! 📚'
  const srcNames = sources.map(s => s.name).join(', ')
  if (lower.includes('সারাংশ') || lower.includes('summary') || lower.includes('সারসংক্ষেপ'))
    return `আপনার ${srcCount}টি সোর্সের সারাংশ:\n\n${sources.map((s, i) => `${i + 1}. **${s.name}** (${sourceTypeIcon[s.type]?.icon || '📄'} ${s.type})\n   ${s.content.slice(0, 150)}...`).join('\n\n')}\n\n📝 আরও বিস্তারিত জানতে নির্দিষ্ট সোর্স সম্পর্কে জিজ্ঞেস করুন।`
  if (lower.includes('কুইজ') || lower.includes('quiz') || lower.includes('প্রশ্ন'))
    return `আপনার সোর্সের উপর ভিত্তি করে কিছু প্রশ্ন:\n\n❓ প্রশ্ন ১: "${sources[0]?.name}" এর মূল বিষয়বস্তু কী?\n❓ প্রশ্ন ২: এই বিষয়ের সাথে সম্পর্কিত ৩টি মূল ধারণা কী কী?\n❓ প্রশ্ন ৩: এই তথ্য দৈনন্দিন জীবনে কীভাবে কাজে লাগে?\n\n💡 ডানদিকে "কুইজ" বাটনে ক্লিক করে পূর্ণ কুইজ তৈরি করতে পারেন।`
  if (lower.includes('ফ্ল্যাশকার্ড') || lower.includes('flashcard'))
    return `আপনার সোর্স থেকে ফ্ল্যাশকার্ড তৈরি হচ্ছে...\n\n🃏 কার্ড ১:\n**সামনে:** মূল ধারণা কী?\n**পিছনে:** ${sources[0]?.content.slice(0, 80)}...\n\n🃏 কার্ড ২:\n**সামনে:** এটা কেন গুরুত্বপূর্ণ?\n**পিছনে:** পরীক্ষায় প্রায়ই আসে এবং মৌলিক ধারণা হিসেবে কাজ করে।\n\n📌 ডানদিকে "ফ্ল্যাশকার্ড" এ ক্লিক করে সব কার্ড দেখুন।`
  if (lower.includes('নোট') || lower.includes('note'))
    return `আপনার সোর্স থেকে স্টাডি নোট:\n\n📝 **${sources[0]?.name}** থেকে নোট:\n• ${sources[0]?.content.slice(0, 100)}\n• মূল পয়েন্টগুলো চিহ্নিত করা হয়েছে\n• গুরুত্বপূর্ণ তথ্য হাইলাইট করা হয়েছে\n\n✏️ ডানদিকে "Add note" বাটনে ক্লিক করে নিজের নোটও যোগ করতে পারেন।`
  return `আপনার ${srcCount}টি সোর্স (${srcNames}) বিশ্লেষণ করা হয়েছে। 📊\n\nআমি আপনাকে এই বিষয়ে সাহায্য করতে পারি:\n• 📝 সারাংশ তৈরি\n• ❓ কুইজ প্রশ্ন\n• 🃏 ফ্ল্যাশকার্ড\n• 📋 স্টাডি নোট\n• 🗺️ মাইন্ড ম্যাপ\n\nকী করতে চান তা জানান!`
}

/* ═══ Main Component ═══ */
export default function NotebookPage() {
  const { user } = useAuth()
  const [sources, setSources] = useState<Source[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([
    { id: 'welcome', role: 'ai', text: 'স্বাগতম! 📚 আমি আপনার স্টাডি সহকারী। সোর্স যোগ করুন এবং আমাকে যেকোনো প্রশ্ন করুন। সারাংশ, কুইজ, ফ্ল্যাশকার্ড — সবই তৈরি করতে পারব!', time: Date.now() }
  ])
  const [chatInput, setChatInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [showAddSource, setShowAddSource] = useState(false)
  const [addMode, setAddMode] = useState<'file' | 'youtube' | 'website' | 'text'>('file')
  const [urlInput, setUrlInput] = useState('')
  const [textInput, setTextInput] = useState('')
  const [textTitle, setTextTitle] = useState('')
  const [notebookTitle, setNotebookTitle] = useState('নতুন নোটবুক')
  const [editingTitle, setEditingTitle] = useState(false)
  const [showAddNote, setShowAddNote] = useState(false)
  const [noteTitle, setNoteTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')
  const [sourceSearch, setSourceSearch] = useState('')
  const chatScrollRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // Load/save
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const data = JSON.parse(raw)
        setSources(data.sources || [])
        setNotes(data.notes || [])
        if (data.title) setNotebookTitle(data.title)
        if (data.chat) setChatMsgs(data.chat)
      }
    } catch {}
  }, [])

  const saveAll = (s?: Source[], n?: Note[], t?: string, c?: ChatMsg[]) => {
    const data = { sources: s || sources, notes: n || notes, title: t || notebookTitle, chat: c || chatMsgs }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  useEffect(() => {
    if (chatScrollRef.current) chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight
  }, [chatMsgs, typing])

  // Add source
  const addSource = (source: Source) => {
    const newSources = [...sources, source]
    setSources(newSources)
    saveAll(newSources)
    setShowAddSource(false)
    setUrlInput('')
    setTextInput('')
    setTextTitle('')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    let type: Source['type'] = 'doc'
    if (ext === 'pdf') type = 'pdf'
    else if (['jpg','jpeg','png','gif','webp'].includes(ext)) type = 'image'
    else if (['mp3','wav','ogg'].includes(ext)) type = 'audio'
    const reader = new FileReader()
    reader.onload = () => {
      addSource({
        id: uid(), name: file.name, type,
        content: `${file.name} — ${(file.size / 1024).toFixed(1)} KB ফাইল আপলোড করা হয়েছে।`,
        addedAt: Date.now(), size: `${(file.size / 1024).toFixed(1)} KB`,
      })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleAddUrl = () => {
    if (!urlInput.trim()) return
    const isYT = urlInput.includes('youtube.com') || urlInput.includes('youtu.be')
    addSource({
      id: uid(), name: urlInput.length > 50 ? urlInput.slice(0, 47) + '...' : urlInput,
      type: isYT ? 'youtube' : 'website',
      content: `${isYT ? 'YouTube ভিডিও' : 'ওয়েবসাইট'}: ${urlInput}`,
      addedAt: Date.now(),
    })
  }

  const handleAddText = () => {
    if (!textInput.trim()) return
    addSource({
      id: uid(), name: textTitle || 'কপি করা টেক্সট', type: 'text',
      content: textInput, addedAt: Date.now(),
    })
  }

  const removeSource = (id: string) => {
    const newSources = sources.filter(s => s.id !== id)
    setSources(newSources)
    saveAll(newSources)
  }

  // Chat
  const sendChat = () => {
    if (!chatInput.trim()) return
    const userMsg: ChatMsg = { id: uid(), role: 'user', text: chatInput.trim(), time: Date.now() }
    const newMsgs = [...chatMsgs, userMsg]
    setChatMsgs(newMsgs)
    const q = chatInput.trim()
    setChatInput('')
    setTyping(true)
    setTimeout(() => {
      const ai: ChatMsg = { id: uid(), role: 'ai', text: getNotebookAI(q, sources), time: Date.now() }
      const final = [...newMsgs, ai]
      setChatMsgs(final)
      setTyping(false)
      saveAll(undefined, undefined, undefined, final)
    }, 800 + Math.random() * 600)
  }

  // Notes
  const addNote = () => {
    if (!noteTitle.trim() && !noteContent.trim()) return
    const note: Note = { id: uid(), title: noteTitle || 'নতুন নোট', content: noteContent, createdAt: Date.now() }
    const newNotes = [...notes, note]
    setNotes(newNotes)
    saveAll(undefined, newNotes)
    setNoteTitle('')
    setNoteContent('')
    setShowAddNote(false)
  }

  const removeNote = (id: string) => {
    const newNotes = notes.filter(n => n.id !== id)
    setNotes(newNotes)
    saveAll(undefined, newNotes)
  }

  const filteredSources = sources.filter(s => s.name.toLowerCase().includes(sourceSearch.toLowerCase()))

  const getInitials = (name: string) => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  /* ─── Render ─── */
  return (
    <div style={{ display: 'flex', gap: 0, height: 'calc(100vh - 80px)', margin: '-28px -24px', fontFamily: "'Anek Bangla', sans-serif" }}>
      {/* ═══ LEFT: Sources Panel ═══ */}
      <div style={{ width: 280, flexShrink: 0, background: '#fafafa', borderRight: '1px solid #e4e6eb', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #e4e6eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontWeight: 800, fontSize: 15, color: '#050505' }}>সোর্স</span>
            <span style={{ fontSize: 12, color: '#65676b', background: '#e4e6eb', borderRadius: 6, padding: '2px 8px', fontWeight: 700 }}>{sources.length}</span>
          </div>
          <button onClick={() => setShowAddSource(true)} style={{
            width: '100%', padding: '10px', borderRadius: 10, border: '1.5px dashed #c7c7cc',
            background: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#3a7bd5',
            fontFamily: "'Anek Bangla', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'all 200ms',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#3a7bd5'; e.currentTarget.style.background = 'rgba(58,123,213,0.04)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#c7c7cc'; e.currentTarget.style.background = 'white' }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="#3a7bd5" strokeWidth="2" strokeLinecap="round"/></svg>
            সোর্স যোগ করুন
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '8px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', borderRadius: 8, padding: '6px 10px', border: '1px solid #e4e6eb' }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="#aeaeb2" strokeWidth="1.5"/><path d="M11 11l3 3" stroke="#aeaeb2" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <input value={sourceSearch} onChange={e => setSourceSearch(e.target.value)} placeholder="সোর্স খুঁজুন..."
              style={{ border: 'none', background: 'none', outline: 'none', flex: 1, fontSize: 12, fontFamily: "'Anek Bangla', sans-serif", color: '#050505' }} />
          </div>
        </div>

        {/* Source list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 12px' }}>
          {filteredSources.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 16px', color: '#aeaeb2' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📂</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>সংরক্ষিত সোর্স এখানে দেখা যাবে</div>
              <div style={{ fontSize: 11, marginTop: 6 }}>PDF, ওয়েবসাইট, টেক্সট, ভিডিও বা অডিও যোগ করুন</div>
            </div>
          )}
          {filteredSources.map(s => (
            <div key={s.id} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px', borderRadius: 8,
              marginBottom: 4, cursor: 'pointer', transition: 'background 150ms', background: 'white',
              border: '1px solid #f0f0f0',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#f0f2f5'}
              onMouseLeave={e => e.currentTarget.style.background = 'white'}
            >
              <span style={{ fontSize: 22 }}>{sourceTypeIcon[s.type]?.icon || '📄'}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#050505', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                <div style={{ fontSize: 10, color: '#aeaeb2' }}>{s.size || s.type} · {new Date(s.addedAt).toLocaleDateString('bn-BD')}</div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); removeSource(s.id) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aeaeb2', fontSize: 14, padding: 4 }}
                onMouseEnter={e => e.currentTarget.style.color = '#ff6b6b'} onMouseLeave={e => e.currentTarget.style.color = '#aeaeb2'}>✕</button>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ CENTER: Chat Panel ═══ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#ffffff', minWidth: 0 }}>
        {/* Chat header */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e4e6eb', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>💬</span>
          <div>
            {editingTitle ? (
              <input autoFocus value={notebookTitle} onChange={e => { setNotebookTitle(e.target.value); saveAll(undefined, undefined, e.target.value) }}
                onBlur={() => setEditingTitle(false)} onKeyDown={e => e.key === 'Enter' && setEditingTitle(false)}
                style={{ fontSize: 16, fontWeight: 800, border: 'none', borderBottom: '2px solid #3a7bd5', outline: 'none', fontFamily: "'Anek Bangla', sans-serif", color: '#050505', background: 'none', padding: '2px 4px' }}
              />
            ) : (
              <div onClick={() => setEditingTitle(true)} style={{ fontWeight: 800, fontSize: 16, color: '#050505', cursor: 'pointer' }} title="নাম পরিবর্তন করতে ক্লিক করুন">
                {notebookTitle}
              </div>
            )}
            <div style={{ fontSize: 11, color: '#65676b' }}>{sources.length}টি সোর্স · চ্যাট</div>
          </div>
        </div>

        {/* Messages */}
        <div ref={chatScrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {chatMsgs.map(m => (
            <div key={m.id} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
              {m.role === 'ai' && (
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #ff9500, #ffcc00)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 8, flexShrink: 0, alignSelf: 'flex-end', fontSize: 14 }}>✨</div>
              )}
              <div style={{
                maxWidth: '78%', padding: '12px 16px',
                borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: m.role === 'user' ? '#3a7bd5' : '#f0f2f5',
                color: m.role === 'user' ? 'white' : '#050505',
                fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              }}>{m.text}</div>
            </div>
          ))}
          {typing && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #ff9500, #ffcc00)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>✨</div>
              <div style={{ background: '#f0f2f5', borderRadius: 18, padding: '10px 16px', display: 'flex', gap: 4 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#aeaeb2', animation: 'nb-dot 1.2s infinite 0s' }} />
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#aeaeb2', animation: 'nb-dot 1.2s infinite 0.2s' }} />
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#aeaeb2', animation: 'nb-dot 1.2s infinite 0.4s' }} />
              </div>
            </div>
          )}
        </div>

        {/* Chat input */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid #e4e6eb', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, display: 'flex', background: '#f0f2f5', borderRadius: 24, overflow: 'hidden', alignItems: 'center' }}>
            <input value={chatInput} onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendChat()}
              placeholder="আপনার সোর্স নিয়ে প্রশ্ন করুন..."
              style={{ flex: 1, padding: '12px 18px', border: 'none', background: 'none', fontSize: 14, fontFamily: "'Anek Bangla', sans-serif", outline: 'none', color: '#050505' }}
            />
            <span style={{ fontSize: 12, color: '#aeaeb2', paddingRight: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>{sources.length} সোর্স</span>
          </div>
          <button onClick={sendChat} style={{
            width: 40, height: 40, borderRadius: '50%', border: 'none', cursor: 'pointer', flexShrink: 0,
            background: chatInput.trim() ? 'linear-gradient(135deg, #3a7bd5, #5a6cf8)' : '#e4e6eb',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 200ms',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill={chatInput.trim() ? 'white' : '#bec3c9'}><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>

      {/* ═══ RIGHT: Studio Panel ═══ */}
      <div style={{ width: 260, flexShrink: 0, background: '#fafafa', borderLeft: '1px solid #e4e6eb', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #e4e6eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 800, fontSize: 15, color: '#050505' }}>স্টুডিও</span>
          <span style={{ fontSize: 18 }}>✨</span>
        </div>

        {/* Studio tools grid */}
        <div style={{ padding: '8px 12px', overflowY: 'auto', flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {studioTools.map(tool => (
              <button key={tool.id} onClick={() => {
                const msg: ChatMsg = { id: uid(), role: 'user', text: `${tool.label} তৈরি করো`, time: Date.now() }
                setChatMsgs(prev => [...prev, msg])
                setTyping(true)
                setTimeout(() => {
                  const ai: ChatMsg = {
                    id: uid(), role: 'ai', time: Date.now(),
                    text: sources.length === 0
                      ? `${tool.icon} ${tool.label} তৈরি করতে আগে সোর্স যোগ করুন!`
                      : `${tool.icon} **${tool.label}** তৈরি হচ্ছে...\n\nআপনার ${sources.length}টি সোর্স ব্যবহার করে ${tool.desc}। এটি শীঘ্রই প্রস্তুত হবে!\n\n✅ সম্পন্ন! আপনার ${tool.label} প্রস্তুত।`
                  }
                  setChatMsgs(prev => [...prev, ai])
                  setTyping(false)
                }, 1200)
              }}
                style={{
                  padding: '12px 8px', borderRadius: 10, border: '1px solid #e4e6eb', background: 'white',
                  cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4,
                  transition: 'all 200ms', fontFamily: "'Anek Bangla', sans-serif", textAlign: 'left',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#3a7bd5'; e.currentTarget.style.background = 'rgba(58,123,213,0.04)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e4e6eb'; e.currentTarget.style.background = 'white' }}
              >
                <span style={{ fontSize: 18 }}>{tool.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#050505', lineHeight: 1.2 }}>{tool.label}</span>
              </button>
            ))}
          </div>

          {/* Studio info */}
          <div style={{ textAlign: 'center', padding: '20px 12px', color: '#aeaeb2', fontSize: 11, lineHeight: 1.5 }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>✨</div>
            স্টুডিও আউটপুট এখানে সংরক্ষিত হবে।<br />
            সোর্স যোগ করার পর ক্লিক করুন।
          </div>

          {/* Notes section */}
          <div style={{ borderTop: '1px solid #e4e6eb', paddingTop: 12, marginTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, padding: '0 4px' }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: '#050505' }}>নোটস</span>
              <button onClick={() => setShowAddNote(true)} style={{
                background: '#1d1d1f', color: 'white', border: 'none', borderRadius: 8, padding: '6px 12px',
                fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: "'Anek Bangla', sans-serif",
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                ✏️ নোট যোগ করুন
              </button>
            </div>
            {notes.map(n => (
              <div key={n.id} style={{ background: 'white', borderRadius: 8, padding: '10px 12px', marginBottom: 6, border: '1px solid #e4e6eb', position: 'relative' }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: '#050505', marginBottom: 4 }}>{n.title}</div>
                <p style={{ fontSize: 11, color: '#65676b', lineHeight: 1.4, margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const }}>{n.content}</p>
                <button onClick={() => removeNote(n.id)} style={{ position: 'absolute', top: 6, right: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#aeaeb2', fontSize: 12 }}
                  onMouseEnter={e => e.currentTarget.style.color = '#ff6b6b'} onMouseLeave={e => e.currentTarget.style.color = '#aeaeb2'}>✕</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ Add Source Modal ═══ */}
      {showAddSource && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowAddSource(false)}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} />
          <div style={{ background: 'white', borderRadius: 16, width: '100%', maxWidth: 520, overflow: 'hidden', position: 'relative', zIndex: 1, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e4e6eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontWeight: 800, fontSize: 18, color: '#050505' }}>সোর্স যোগ করুন</h3>
              <button onClick={() => setShowAddSource(false)} style={{ width: 32, height: 32, borderRadius: '50%', background: '#e4e6eb', border: 'none', cursor: 'pointer', fontSize: 16, color: '#65676b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div style={{ padding: 24 }}>
              {/* Mode tabs */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
                {([['file', '📁 ফাইল আপলোড'], ['youtube', '📺 YouTube'], ['website', '🌐 ওয়েবসাইট'], ['text', '📋 কপি করা টেক্সট']] as [typeof addMode, string][]).map(([mode, label]) => (
                  <button key={mode} onClick={() => setAddMode(mode)} style={{
                    padding: '8px 14px', borderRadius: 20, border: 'none', fontSize: 12, fontWeight: 700,
                    cursor: 'pointer', fontFamily: "'Anek Bangla', sans-serif", transition: 'all 200ms',
                    background: addMode === mode ? '#1d1d1f' : '#e4e6eb', color: addMode === mode ? 'white' : '#65676b',
                  }}>{label}</button>
                ))}
              </div>

              {/* File upload */}
              {addMode === 'file' && (
                <div>
                  <div onClick={() => fileRef.current?.click()} style={{
                    border: '2px dashed #c7c7cc', borderRadius: 12, padding: '40px 20px', textAlign: 'center',
                    cursor: 'pointer', transition: 'all 200ms',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#3a7bd5'; e.currentTarget.style.background = 'rgba(58,123,213,0.03)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#c7c7cc'; e.currentTarget.style.background = 'transparent' }}
                  >
                    <div style={{ fontSize: 36, marginBottom: 10 }}>📂</div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#050505', marginBottom: 4 }}>ফাইল ড্রপ করুন বা আপলোড করুন</div>
                    <div style={{ fontSize: 12, color: '#aeaeb2' }}>PDF, ইমেজ, ডক, অডিও ও আরও অনেক</div>
                  </div>
                  <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.mp3,.wav" onChange={handleFileUpload} style={{ display: 'none' }} />
                </div>
              )}

              {/* YouTube / Website */}
              {(addMode === 'youtube' || addMode === 'website') && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f0f2f5', borderRadius: 12, padding: '4px 4px 4px 14px', marginBottom: 12 }}>
                    <span style={{ fontSize: 16 }}>{addMode === 'youtube' ? '📺' : '🌐'}</span>
                    <input value={urlInput} onChange={e => setUrlInput(e.target.value)} placeholder={addMode === 'youtube' ? 'YouTube লিংক পেস্ট করুন...' : 'ওয়েবসাইটের URL পেস্ট করুন...'}
                      onKeyDown={e => e.key === 'Enter' && handleAddUrl()}
                      style={{ flex: 1, padding: '10px 0', border: 'none', background: 'none', fontSize: 13, fontFamily: "'Anek Bangla', sans-serif", outline: 'none', color: '#050505' }}
                    />
                    <button onClick={handleAddUrl} style={{
                      padding: '8px 16px', borderRadius: 10, background: urlInput.trim() ? '#3a7bd5' : '#e4e6eb',
                      color: urlInput.trim() ? 'white' : '#bec3c9', border: 'none', fontWeight: 700, fontSize: 13,
                      cursor: urlInput.trim() ? 'pointer' : 'default', fontFamily: "'Anek Bangla', sans-serif",
                    }}>যোগ করুন</button>
                  </div>
                </div>
              )}

              {/* Text */}
              {addMode === 'text' && (
                <div>
                  <input value={textTitle} onChange={e => setTextTitle(e.target.value)} placeholder="শিরোনাম (ঐচ্ছিক)"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e4e6eb', fontSize: 13, fontFamily: "'Anek Bangla', sans-serif", outline: 'none', marginBottom: 10, color: '#050505', background: '#fafafa' }}
                  />
                  <textarea value={textInput} onChange={e => setTextInput(e.target.value)} placeholder="টেক্সট এখানে পেস্ট করুন..." rows={6}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e4e6eb', fontSize: 13, fontFamily: "'Anek Bangla', sans-serif", outline: 'none', resize: 'vertical', lineHeight: 1.6, color: '#050505', background: '#fafafa' }}
                  />
                  <button onClick={handleAddText} disabled={!textInput.trim()} style={{
                    marginTop: 10, padding: '10px 20px', borderRadius: 10, border: 'none', fontSize: 14, fontWeight: 700,
                    background: textInput.trim() ? '#3a7bd5' : '#e4e6eb', color: textInput.trim() ? 'white' : '#bec3c9',
                    cursor: textInput.trim() ? 'pointer' : 'default', fontFamily: "'Anek Bangla', sans-serif",
                  }}>সোর্স যোগ করুন</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══ Add Note Modal ═══ */}
      {showAddNote && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowAddNote(false)}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} />
          <div style={{ background: 'white', borderRadius: 16, width: '100%', maxWidth: 480, position: 'relative', zIndex: 1, padding: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontWeight: 800, fontSize: 18, color: '#050505', marginBottom: 16 }}>✏️ নতুন নোট</h3>
            <input value={noteTitle} onChange={e => setNoteTitle(e.target.value)} placeholder="নোটের শিরোনাম"
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e4e6eb', fontSize: 14, fontWeight: 700, fontFamily: "'Anek Bangla', sans-serif", outline: 'none', marginBottom: 10, color: '#050505' }}
            />
            <textarea value={noteContent} onChange={e => setNoteContent(e.target.value)} placeholder="নোটের বিষয়বস্তু লিখুন..." rows={5}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e4e6eb', fontSize: 13, fontFamily: "'Anek Bangla', sans-serif", outline: 'none', resize: 'vertical', lineHeight: 1.6, color: '#050505' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
              <button onClick={() => setShowAddNote(false)} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid #e4e6eb', background: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Anek Bangla', sans-serif", color: '#65676b' }}>বাতিল</button>
              <button onClick={addNote} style={{ padding: '8px 20px', borderRadius: 10, border: 'none', background: '#1d1d1f', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Anek Bangla', sans-serif" }}>সংরক্ষণ</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes nb-dot {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  )
}

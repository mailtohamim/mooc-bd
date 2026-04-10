'use client'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

/* ─── Types ─── */
interface Source {
  id: string; name: string; type: 'pdf' | 'doc' | 'text' | 'youtube' | 'website' | 'image' | 'audio'
  content: string; addedAt: number; size?: string
}
interface Note { id: string; title: string; content: string; createdAt: number }
interface ChatMsg { id: string; role: 'user' | 'ai'; text: string; time: number }

import { FileText, File, Clipboard, Globe, Image as ImageIcon, Music, Mic, Presentation, Video, Map, FileStack, ShieldQuestion, HelpCircle, FileBox, MessageCircle, FilePlus, Play, LayoutGrid, MonitorPlay, MessageSquare, Edit2, UploadCloud, Folder, Sparkles } from 'lucide-react'

/* ─── Constants ─── */
const STORAGE_KEY = 'sb_notebook_data'
const uid = () => Math.random().toString(36).slice(2, 10)
const srcIcon: Record<string, { icon: React.FC<any>; color: string }> = {
  pdf: { icon: FileText, color: '#d25a3c' }, doc: { icon: File, color: '#3a7bd5' },
  text: { icon: Clipboard, color: '#5ab87a' }, youtube: { icon: MonitorPlay, color: '#ff0000' },
  website: { icon: Globe, color: '#8250d2' }, image: { icon: ImageIcon, color: '#ff9500' },
  audio: { icon: Music, color: '#e07050' },
}
const studioTools = [
  { id: 'audio', icon: Mic, label: 'অডিও ওভারভিউ', desc: 'সোর্স থেকে অডিও সারাংশ' },
  { id: 'slides', icon: Presentation, label: 'স্লাইড ডেক', desc: 'প্রেজেন্টেশন তৈরি করুন' },
  { id: 'video', icon: Video, label: 'ভিডিও ওভারভিউ', desc: 'ভিডিও সারাংশ তৈরি' },
  { id: 'mindmap', icon: Map, label: 'মাইন্ড ম্যাপ', desc: 'ভিজ্যুয়াল নোট ম্যাপ' },
  { id: 'report', icon: FileStack, label: 'রিপোর্ট', desc: 'বিস্তারিত রিপোর্ট তৈরি' },
  { id: 'flashcard', icon: FileBox, label: 'ফ্ল্যাশকার্ড', desc: 'মুখস্থ করার কার্ড' },
  { id: 'quiz', icon: HelpCircle, label: 'কুইজ', desc: 'প্রশ্নোত্তর তৈরি করুন' },
  { id: 'infographic', icon: LayoutGrid, label: 'ইনফোগ্রাফিক', desc: 'তথ্যচিত্র তৈরি' },
  { id: 'table', icon: Clipboard, label: 'ডেটা টেবিল', desc: 'তথ্য সারণি তৈরি' },
]

/* ─── Shared glass-card style (matching dashboard) ─── */
const glassPanel: React.CSSProperties = {
  background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.55)', borderRadius: 18,
  boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
}

/* ─── AI responses ─── */
function getNotebookAI(q: string, sources: Source[]): string {
  const lower = q.toLowerCase(); const n = sources.length
  if (n === 0) return 'আপনি এখনও কোনো সোর্স যোগ করেননি। বাম পাশের "সোর্স" প্যানেল থেকে PDF, ওয়েবসাইট, YouTube ভিডিও বা টেক্সট যোগ করুন।'
  if (lower.includes('সারাংশ') || lower.includes('summary'))
    return `আপনার ${n}টি সোর্সের সারাংশ:\n\n${sources.map((s, i) => `${i + 1}. **${s.name}** (${s.type})\n   ${s.content.slice(0, 150)}...`).join('\n\n')}\n\nনির্দিষ্ট সোর্স নিয়ে জিজ্ঞাসা করুন।`
  if (lower.includes('কুইজ') || lower.includes('quiz') || lower.includes('প্রশ্ন'))
    return `সোর্স ভিত্তিক কুইজ:\n\n১: "${sources[0]?.name}" এর মূল বিষয়বস্তু কী?\n২: সম্পর্কিত ৩টি মূল ধারণা কী?\n৩: এটি দৈনন্দিন জীবনে কীভাবে প্রযোজ্য?\n\nডানদিকে "কুইজ" ক্লিক করে পূর্ণ কুইজ তৈরি করুন।`
  if (lower.includes('ফ্ল্যাশকার্ড') || lower.includes('flashcard'))
    return `ফ্ল্যাশকার্ড তৈরি হচ্ছে...\n\nকার্ড ১:\n**সামনে:** মূল ধারণা কী?\n**পিছনে:** ${sources[0]?.content.slice(0, 80)}...\n\nকার্ড ২:\n**সামনে:** কেন গুরুত্বপূর্ণ?\n**পিছনে:** পরীক্ষায় প্রায়ই আসে।\n\nডানদিকে "ফ্ল্যাশকার্ড" ক্লিক করুন।`
  if (lower.includes('নোট') || lower.includes('note'))
    return `স্টাডি নোট:\n\n**${sources[0]?.name}**:\n• ${sources[0]?.content.slice(0, 100)}\n• মূল পয়েন্ট চিহ্নিত\n• গুরুত্বপূর্ণ তথ্য হাইলাইট\n\nডানদিকে "নোট যোগ করুন" ক্লিক করুন।`
  return `${n}টি সোর্স বিশ্লেষণ সম্পন্ন।\n\nআমি সাহায্য করতে পারি:\n• সারাংশ\n• কুইজ\n• ফ্ল্যাশকার্ড\n• স্টাডি নোট\n• মাইন্ড ম্যাপ\n\nকী করতে চান?`
}

/* ═══ Component ═══ */
export default function NotebookPage() {
  const { user } = useAuth()
  const [sources, setSources] = useState<Source[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([
    { id: 'welcome', role: 'ai', text: 'স্বাগতম! আমি আপনার স্টাডি সহকারী। সোর্স যোগ করুন এবং প্রশ্ন করুন — সারাংশ, কুইজ, ফ্ল্যাশকার্ড সবই তৈরি করতে পারব!', time: Date.now() }
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

  useEffect(() => { try { const r = localStorage.getItem(STORAGE_KEY); if (r) { const d = JSON.parse(r); setSources(d.sources||[]); setNotes(d.notes||[]); if (d.title) setNotebookTitle(d.title); if (d.chat) setChatMsgs(d.chat) } } catch {} }, [])
  const saveAll = (s?: Source[], n?: Note[], t?: string, c?: ChatMsg[]) => localStorage.setItem(STORAGE_KEY, JSON.stringify({ sources: s||sources, notes: n||notes, title: t||notebookTitle, chat: c||chatMsgs }))
  useEffect(() => { if (chatScrollRef.current) chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight }, [chatMsgs, typing])

  const addSource = (source: Source) => { const ns = [...sources, source]; setSources(ns); saveAll(ns); setShowAddSource(false); setUrlInput(''); setTextInput(''); setTextTitle('') }
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    let type: Source['type'] = 'doc'
    if (ext === 'pdf') type = 'pdf'; else if (['jpg','jpeg','png','gif','webp'].includes(ext)) type = 'image'; else if (['mp3','wav','ogg'].includes(ext)) type = 'audio'
    const reader = new FileReader()
    reader.onload = () => addSource({ id: uid(), name: file.name, type, content: `${file.name} — ${(file.size/1024).toFixed(1)} KB আপলোড হয়েছে।`, addedAt: Date.now(), size: `${(file.size/1024).toFixed(1)} KB` })
    reader.readAsDataURL(file); e.target.value = ''
  }
  const handleAddUrl = () => { if (!urlInput.trim()) return; const yt = urlInput.includes('youtube.com') || urlInput.includes('youtu.be'); addSource({ id: uid(), name: urlInput.length > 50 ? urlInput.slice(0,47)+'...' : urlInput, type: yt ? 'youtube' : 'website', content: `${yt ? 'YouTube ভিডিও' : 'ওয়েবসাইট'}: ${urlInput}`, addedAt: Date.now() }) }
  const handleAddText = () => { if (!textInput.trim()) return; addSource({ id: uid(), name: textTitle || 'কপি করা টেক্সট', type: 'text', content: textInput, addedAt: Date.now() }) }
  const removeSource = (id: string) => { const ns = sources.filter(s => s.id !== id); setSources(ns); saveAll(ns) }

  const sendChat = () => {
    if (!chatInput.trim()) return
    const um: ChatMsg = { id: uid(), role: 'user', text: chatInput.trim(), time: Date.now() }
    const nm = [...chatMsgs, um]; setChatMsgs(nm); const q = chatInput.trim(); setChatInput(''); setTyping(true)
    setTimeout(() => { const ai: ChatMsg = { id: uid(), role: 'ai', text: getNotebookAI(q, sources), time: Date.now() }; const f = [...nm, ai]; setChatMsgs(f); setTyping(false); saveAll(undefined,undefined,undefined,f) }, 800 + Math.random()*600)
  }
  const addNote = () => { if (!noteTitle.trim() && !noteContent.trim()) return; const n: Note = { id: uid(), title: noteTitle||'নতুন নোট', content: noteContent, createdAt: Date.now() }; const nn = [...notes, n]; setNotes(nn); saveAll(undefined,nn); setNoteTitle(''); setNoteContent(''); setShowAddNote(false) }
  const removeNote = (id: string) => { const nn = notes.filter(n => n.id !== id); setNotes(nn); saveAll(undefined,nn) }

  const filteredSources = sources.filter(s => s.name.toLowerCase().includes(sourceSearch.toLowerCase()))

  return (
    <div style={{ display: 'flex', gap: 14, height: 'calc(100vh - 80px)', margin: '-28px -24px', padding: '20px', fontFamily: "'Anek Bangla', sans-serif" }}>

      {/* ═══ LEFT: Sources ═══ */}
      <div style={{ ...glassPanel, width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        <div style={{ padding: '18px 18px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontWeight: 800, fontSize: 16, color: '#1d1d1f', display: 'flex', alignItems: 'center', gap: 6 }}><Folder size={18} color="#3a7bd5" /> সোর্স</span>
            <span style={{ fontSize: 11, color: 'white', background: 'linear-gradient(135deg, #3a7bd5, #5a6cf8)', borderRadius: 8, padding: '2px 10px', fontWeight: 700 }}>{sources.length}</span>
          </div>
          <button onClick={() => setShowAddSource(true)} style={{
            width: '100%', padding: '11px', borderRadius: 14, border: '1.5px dashed rgba(58,123,213,0.35)',
            background: 'rgba(58,123,213,0.04)', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#3a7bd5',
            fontFamily: "'Anek Bangla', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'all 250ms',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#3a7bd5'; e.currentTarget.style.background = 'rgba(58,123,213,0.08)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(58,123,213,0.35)'; e.currentTarget.style.background = 'rgba(58,123,213,0.04)'; e.currentTarget.style.transform = 'none' }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="#3a7bd5" strokeWidth="2" strokeLinecap="round"/></svg>
            সোর্স যোগ করুন
          </button>
        </div>
        {/* Search */}
        <div style={{ padding: '0 14px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.80)', borderRadius: 12, padding: '7px 12px', border: '1px solid rgba(0,0,0,0.06)' }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="#8e8e93" strokeWidth="1.5"/><path d="M11 11l3 3" stroke="#8e8e93" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <input value={sourceSearch} onChange={e => setSourceSearch(e.target.value)} placeholder="সোর্স খুঁজুন..."
              style={{ border: 'none', background: 'none', outline: 'none', flex: 1, fontSize: 12, fontFamily: "'Anek Bangla', sans-serif", color: '#1d1d1f' }} />
          </div>
        </div>
        {/* Source list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 12px 12px' }}>
          {filteredSources.length === 0 && (
            <div style={{ textAlign: 'center', padding: '36px 14px', color: '#8e8e93' }}>
              <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'center' }}><Folder size={38} color="#8e8e93" /></div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>সংরক্ষিত সোর্স এখানে দেখা যাবে</div>
              <div style={{ fontSize: 11, marginTop: 6, lineHeight: 1.5 }}>PDF, ওয়েবসাইট, টেক্সট, ভিডিও বা অডিও যোগ করুন</div>
            </div>
          )}
          {filteredSources.map(s => {
            const IconComp = srcIcon[s.type]?.icon || FileText
            return (
              <div key={s.id} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 14,
                marginBottom: 6, cursor: 'pointer', transition: 'all 250ms',
                background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.55)',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(58,123,213,0.06)'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.06)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.7)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24 }}>
                  <IconComp size={20} color={srcIcon[s.type]?.color || '#8e8e93'} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#1d1d1f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                  <div style={{ fontSize: 10, color: '#8e8e93' }}>{s.size || s.type}</div>
                </div>
                <button onClick={e => { e.stopPropagation(); removeSource(s.id) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aeaeb2', fontSize: 13, padding: 4, transition: 'color 200ms' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#ff6b6b'} onMouseLeave={e => e.currentTarget.style.color = '#aeaeb2'}>✕</button>
              </div>
            )
          })}
        </div>
      </div>

      {/* ═══ CENTER: Chat ═══ */}
      <div style={{ ...glassPanel, flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, padding: 0, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: 'linear-gradient(135deg, #3a7bd5, #5a6cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}><MessageSquare size={18} /></div>
          <div style={{ flex: 1 }}>
            {editingTitle ? (
              <input autoFocus value={notebookTitle} onChange={e => { setNotebookTitle(e.target.value); saveAll(undefined,undefined,e.target.value) }}
                onBlur={() => setEditingTitle(false)} onKeyDown={e => e.key === 'Enter' && setEditingTitle(false)}
                style={{ fontSize: 16, fontWeight: 800, border: 'none', borderBottom: '2px solid #3a7bd5', outline: 'none', fontFamily: "'Anek Bangla', sans-serif", color: '#1d1d1f', background: 'none', padding: '2px 4px', width: '100%' }}
              />
            ) : (
              <div onClick={() => setEditingTitle(true)} style={{ fontWeight: 800, fontSize: 16, color: '#1d1d1f', cursor: 'pointer' }} title="ক্লিক করে নাম পরিবর্তন করুন">{notebookTitle}</div>
            )}
            <div style={{ fontSize: 11, color: '#8e8e93' }}>{sources.length}টি সোর্স · AI চ্যাট</div>
          </div>
        </div>
        {/* Messages */}
        <div ref={chatScrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', background: 'rgba(248,249,252,0.5)' }}>
          {chatMsgs.map(m => (
            <div key={m.id} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
              {m.role === 'ai' && (
                <div style={{ width: 30, height: 30, borderRadius: 10, background: 'linear-gradient(135deg, #3a7bd5, #5a6cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 8, flexShrink: 0, alignSelf: 'flex-end', fontSize: 13, color: 'white', fontWeight: 800 }}>AI</div>
              )}
              <div style={{
                maxWidth: '78%', padding: '12px 16px',
                borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: m.role === 'user' ? 'linear-gradient(135deg, #3a7bd5, #5a6cf8)' : 'rgba(255,255,255,0.90)',
                color: m.role === 'user' ? 'white' : '#1d1d1f',
                fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                boxShadow: m.role === 'ai' ? '0 1px 6px rgba(0,0,0,0.05)' : 'none',
                border: m.role === 'ai' ? '1px solid rgba(255,255,255,0.55)' : 'none',
              }}>{m.text}</div>
            </div>
          ))}
          {typing && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 30, height: 30, borderRadius: 10, background: 'linear-gradient(135deg, #3a7bd5, #5a6cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: 'white', fontWeight: 800, flexShrink: 0 }}>AI</div>
              <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: 18, padding: '10px 16px', display: 'flex', gap: 4, boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid rgba(255,255,255,0.55)' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#8e8e93', animation: 'nb-dot 1.2s infinite 0s' }} />
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#8e8e93', animation: 'nb-dot 1.2s infinite 0.2s' }} />
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#8e8e93', animation: 'nb-dot 1.2s infinite 0.4s' }} />
              </div>
            </div>
          )}
        </div>
        {/* Input */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, display: 'flex', background: 'rgba(255,255,255,0.80)', borderRadius: 18, overflow: 'hidden', alignItems: 'center', border: '1px solid rgba(0,0,0,0.07)' }}>
            <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()}
              placeholder="আপনার সোর্স নিয়ে প্রশ্ন করুন..."
              style={{ flex: 1, padding: '12px 18px', border: 'none', background: 'none', fontSize: 14, fontFamily: "'Anek Bangla', sans-serif", outline: 'none', color: '#1d1d1f' }}
            />
            <span style={{ fontSize: 11, color: '#8e8e93', paddingRight: 14, fontWeight: 600, whiteSpace: 'nowrap' }}>{sources.length} সোর্স</span>
          </div>
          <button onClick={sendChat} style={{
            width: 40, height: 40, borderRadius: 14, border: 'none', cursor: 'pointer', flexShrink: 0,
            background: chatInput.trim() ? 'linear-gradient(135deg, #3a7bd5, #5a6cf8)' : 'rgba(0,0,0,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 250ms',
            boxShadow: chatInput.trim() ? '0 4px 14px rgba(58,123,213,0.25)' : 'none',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill={chatInput.trim() ? 'white' : '#aeaeb2'}><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>

      {/* ═══ RIGHT: Studio ═══ */}
      <div style={{ ...glassPanel, width: 256, flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        <div style={{ padding: '18px 18px 14px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 800, fontSize: 16, color: '#1d1d1f', display: 'flex', alignItems: 'center', gap: 6 }}><Sparkles size={18} color="#e07050" /> স্টুডিও</span>
        </div>
        <div style={{ padding: '10px 12px', overflowY: 'auto', flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {studioTools.map(tool => (
              <button key={tool.id} onClick={() => {
                const msg: ChatMsg = { id: uid(), role: 'user', text: `${tool.label} তৈরি করো`, time: Date.now() }
                setChatMsgs(prev => [...prev, msg]); setTyping(true)
                setTimeout(() => {
                  const ai: ChatMsg = { id: uid(), role: 'ai', time: Date.now(), text: sources.length === 0 ? `[${tool.label}] তৈরি করতে আগে সোর্স যোগ করুন!` : `[${tool.label}] তৈরি হচ্ছে...\n\nআপনার ${sources.length}টি সোর্স ব্যবহার করে ${tool.desc}।\n\n✅ সম্পন্ন! আপনার ${tool.label} প্রস্তুত।` }
                  setChatMsgs(prev => [...prev, ai]); setTyping(false)
                }, 1200)
              }}
                style={{
                  padding: '14px 10px', borderRadius: 14,
                  background: 'rgba(255,255,255,0.70)', border: '1px solid rgba(255,255,255,0.55)',
                  cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 5,
                  transition: 'all 250ms', fontFamily: "'Anek Bangla', sans-serif", textAlign: 'left',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(58,123,213,0.06)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = 'rgba(58,123,213,0.25)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.70)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.55)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, marginBottom: 4 }}><tool.icon size={20} color="#3a7bd5" /></div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#1d1d1f', lineHeight: 1.2 }}>{tool.label}</span>
              </button>
            ))}
          </div>
          {/* Info */}
          <div style={{ textAlign: 'center', padding: '18px 12px', color: '#8e8e93', fontSize: 11, lineHeight: 1.5 }}>
            <div style={{ marginBottom: 6, display: 'flex', justifyContent: 'center' }}><Sparkles size={22} color="#8e8e93" /></div>
            স্টুডিও আউটপুট এখানে দেখা যাবে।<br />সোর্স যোগ করার পর ক্লিক করুন।
          </div>
          {/* Notes */}
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 14, marginTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, padding: '0 4px' }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: '#1d1d1f' }}>নোটস</span>
              <button onClick={() => setShowAddNote(true)} style={{
                background: 'linear-gradient(135deg, #3a7bd5, #5a6cf8)', color: 'white', border: 'none',
                borderRadius: 10, padding: '6px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                fontFamily: "'Anek Bangla', sans-serif", display: 'flex', alignItems: 'center', gap: 4,
                boxShadow: '0 2px 8px rgba(58,123,213,0.25)', transition: 'all 200ms',
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              ><Edit2 size={12} color="white" /> নোট যোগ</button>
            </div>
            {notes.map(n => (
              <div key={n.id} style={{
                background: 'rgba(255,255,255,0.70)', borderRadius: 12, padding: '10px 14px', marginBottom: 8,
                border: '1px solid rgba(255,255,255,0.55)', position: 'relative',
                boxShadow: '0 1px 6px rgba(0,0,0,0.03)',
              }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: '#1d1d1f', marginBottom: 4 }}>{n.title}</div>
                <p style={{ fontSize: 11, color: '#6e6e73', lineHeight: 1.4, margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const }}>{n.content}</p>
                <button onClick={() => removeNote(n.id)} style={{ position: 'absolute', top: 6, right: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#aeaeb2', fontSize: 12, transition: 'color 200ms' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#ff6b6b'} onMouseLeave={e => e.currentTarget.style.color = '#aeaeb2'}>✕</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ Add Source Modal ═══ */}
      {showAddSource && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowAddSource(false)}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)' }} />
          <div style={{ ...glassPanel, width: '100%', maxWidth: 540, overflow: 'hidden', position: 'relative', zIndex: 1, boxShadow: '0 24px 64px rgba(0,0,0,0.18)', padding: 0 }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontWeight: 800, fontSize: 18, color: '#1d1d1f', display: 'flex', alignItems: 'center', gap: 6 }}><FilePlus size={20} color="#3a7bd5" /> সোর্স যোগ করুন</h3>
              <button onClick={() => setShowAddSource(false)} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.04)', border: 'none', cursor: 'pointer', fontSize: 16, color: '#8e8e93', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
                {([['file','ফাইল আপলোড'],['youtube','YouTube'],['website','ওয়েবসাইট'],['text','কপি করা টেক্সট']] as [typeof addMode, string][]).map(([mode, label]) => (
                  <button key={mode} onClick={() => setAddMode(mode)} style={{
                    padding: '8px 14px', borderRadius: 12, border: 'none', fontSize: 12, fontWeight: 700,
                    cursor: 'pointer', fontFamily: "'Anek Bangla', sans-serif", transition: 'all 200ms',
                    background: addMode === mode ? 'linear-gradient(135deg, #3a7bd5, #5a6cf8)' : 'rgba(0,0,0,0.04)',
                    color: addMode === mode ? 'white' : '#6e6e73',
                    boxShadow: addMode === mode ? '0 2px 8px rgba(58,123,213,0.25)' : 'none',
                    display: 'flex', alignItems: 'center', gap: 4
                  }}>
                    {mode === 'file' && <UploadCloud size={14} />}
                    {mode === 'youtube' && <MonitorPlay size={14} />}
                    {mode === 'website' && <Globe size={14} />}
                    {mode === 'text' && <Clipboard size={14} />}
                    {label}
                  </button>
                ))}
              </div>
              {addMode === 'file' && (
                <div onClick={() => fileRef.current?.click()} style={{
                  border: '2px dashed rgba(58,123,213,0.3)', borderRadius: 18, padding: '44px 20px', textAlign: 'center',
                  cursor: 'pointer', transition: 'all 250ms', background: 'rgba(58,123,213,0.02)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#3a7bd5'; e.currentTarget.style.background = 'rgba(58,123,213,0.06)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(58,123,213,0.3)'; e.currentTarget.style.background = 'rgba(58,123,213,0.02)' }}
                >
                  <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'center' }}><Folder size={40} color="#3a7bd5" /></div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#1d1d1f', marginBottom: 4 }}>ফাইল আপলোড করুন</div>
                  <div style={{ fontSize: 12, color: '#8e8e93' }}>PDF, ইমেজ, ডক, অডিও ও আরও অনেক</div>
                </div>
              )}
              {(addMode === 'youtube' || addMode === 'website') && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.80)', borderRadius: 14, padding: '4px 4px 4px 14px', border: '1px solid rgba(0,0,0,0.07)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8e8e93' }}>
                    {addMode === 'youtube' ? <MonitorPlay size={16} /> : <Globe size={16} />}
                  </div>
                  <input value={urlInput} onChange={e => setUrlInput(e.target.value)} placeholder={addMode === 'youtube' ? 'YouTube লিংক পেস্ট করুন...' : 'ওয়েবসাইটের URL দিন...'}
                    onKeyDown={e => e.key === 'Enter' && handleAddUrl()}
                    style={{ flex: 1, padding: '10px 0', border: 'none', background: 'none', fontSize: 13, fontFamily: "'Anek Bangla', sans-serif", outline: 'none', color: '#1d1d1f' }}
                  />
                  <button onClick={handleAddUrl} style={{
                    padding: '8px 16px', borderRadius: 10, border: 'none', fontWeight: 700, fontSize: 13,
                    background: urlInput.trim() ? 'linear-gradient(135deg, #3a7bd5, #5a6cf8)' : 'rgba(0,0,0,0.04)',
                    color: urlInput.trim() ? 'white' : '#aeaeb2', cursor: urlInput.trim() ? 'pointer' : 'default',
                    fontFamily: "'Anek Bangla', sans-serif", transition: 'all 200ms',
                    boxShadow: urlInput.trim() ? '0 2px 8px rgba(58,123,213,0.20)' : 'none',
                  }}>যোগ করুন</button>
                </div>
              )}
              {addMode === 'text' && (
                <div>
                  <input value={textTitle} onChange={e => setTextTitle(e.target.value)} placeholder="শিরোনাম (ঐচ্ছিক)"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid rgba(0,0,0,0.08)', fontSize: 13, fontFamily: "'Anek Bangla', sans-serif", outline: 'none', marginBottom: 10, color: '#1d1d1f', background: 'rgba(255,255,255,0.80)' }}
                  />
                  <textarea value={textInput} onChange={e => setTextInput(e.target.value)} placeholder="টেক্সট এখানে পেস্ট করুন..." rows={5}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid rgba(0,0,0,0.08)', fontSize: 13, fontFamily: "'Anek Bangla', sans-serif", outline: 'none', resize: 'vertical', lineHeight: 1.6, color: '#1d1d1f', background: 'rgba(255,255,255,0.80)' }}
                  />
                  <button onClick={handleAddText} disabled={!textInput.trim()} style={{
                    marginTop: 10, padding: '10px 20px', borderRadius: 12, border: 'none', fontSize: 14, fontWeight: 700,
                    background: textInput.trim() ? 'linear-gradient(135deg, #3a7bd5, #5a6cf8)' : 'rgba(0,0,0,0.04)',
                    color: textInput.trim() ? 'white' : '#aeaeb2', cursor: textInput.trim() ? 'pointer' : 'default',
                    fontFamily: "'Anek Bangla', sans-serif", boxShadow: textInput.trim() ? '0 2px 10px rgba(58,123,213,0.25)' : 'none',
                  }}>সোর্স যোগ করুন</button>
                </div>
              )}
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.mp3,.wav" onChange={handleFileUpload} style={{ display: 'none' }} />
            </div>
          </div>
        </div>
      )}

      {/* ═══ Add Note Modal ═══ */}
      {showAddNote && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowAddNote(false)}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)' }} />
          <div style={{ ...glassPanel, width: '100%', maxWidth: 480, position: 'relative', zIndex: 1, padding: 24, boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontWeight: 800, fontSize: 18, color: '#1d1d1f', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}><Edit2 size={20} color="#3a7bd5" /> নতুন নোট</h3>
            <input value={noteTitle} onChange={e => setNoteTitle(e.target.value)} placeholder="নোটের শিরোনাম"
              style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid rgba(0,0,0,0.08)', fontSize: 14, fontWeight: 700, fontFamily: "'Anek Bangla', sans-serif", outline: 'none', marginBottom: 10, color: '#1d1d1f', background: 'rgba(255,255,255,0.80)' }}
            />
            <textarea value={noteContent} onChange={e => setNoteContent(e.target.value)} placeholder="নোটের বিষয়বস্তু লিখুন..." rows={5}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid rgba(0,0,0,0.08)', fontSize: 13, fontFamily: "'Anek Bangla', sans-serif", outline: 'none', resize: 'vertical', lineHeight: 1.6, color: '#1d1d1f', background: 'rgba(255,255,255,0.80)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
              <button onClick={() => setShowAddNote(false)} style={{ padding: '8px 16px', borderRadius: 12, border: '1px solid rgba(0,0,0,0.08)', background: 'rgba(255,255,255,0.80)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Anek Bangla', sans-serif", color: '#6e6e73' }}>বাতিল</button>
              <button onClick={addNote} style={{ padding: '8px 20px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #3a7bd5, #5a6cf8)', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Anek Bangla', sans-serif", boxShadow: '0 2px 10px rgba(58,123,213,0.25)' }}>সংরক্ষণ</button>
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

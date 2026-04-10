'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  username: string
  displayName: string
  profilePic?: string
  enrolledCourses: string[]
  completedTopics: string[]
}

interface AuthCtx {
  user: User | null
  login: (username: string, password: string) => boolean
  register: (username: string, password: string, displayName: string) => boolean
  logout: () => void
  enroll: (courseId: string) => void
  unenroll: (courseId: string) => void
  toggleTopic: (topicId: string) => void
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  login: () => false,
  register: () => false,
  logout: () => {},
  enroll: () => {},
  unenroll: () => {},
  toggleTopic: () => {},
})

const DEFAULT_USERS = [
  { 
    username: 'userone', 
    password: '1234', 
    displayName: 'User One',
    profilePic: '/profiles/profile_pic_student1.png',
    enrolledCourses: [],
    completedTopics: []
  }
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sb_user')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (!parsed.profilePic) {
          parsed.profilePic = DEFAULT_USERS.find(d => d.username === parsed.username)?.profilePic || '/profiles/profile_pic_student2.png'
          localStorage.setItem('sb_user', JSON.stringify(parsed))
        }
        setUser(parsed)
      }
    } catch {}
  }, [])

  const getUsers = () => {
    try {
      const raw = localStorage.getItem('sb_users')
      const saved = raw ? JSON.parse(raw) : []
      // merge defaults (avoid duplicates)
      const names = new Set(saved.map((u: typeof DEFAULT_USERS[0]) => u.username))
      const enrichedSaved = saved.map((u: any) => ({
        ...u,
        profilePic: u.profilePic || DEFAULT_USERS.find(d => d.username === u.username)?.profilePic || '/profiles/profile_pic_student2.png'
      }))
      return [...DEFAULT_USERS.filter(d => !names.has(d.username)), ...enrichedSaved]
    } catch {
      return DEFAULT_USERS
    }
  }

  const login = (username: string, password: string): boolean => {
    const users = getUsers()
    const match = users.find(
      (u: any) => u.username === username && u.password === password
    )
    if (!match) return false
    const u: User = { 
      username: match.username, 
      displayName: match.displayName,
      profilePic: match.profilePic,
      enrolledCourses: match.enrolledCourses || [],
      completedTopics: match.completedTopics || []
    }
    setUser(u)
    localStorage.setItem('sb_user', JSON.stringify(u))
    return true
  }

  const register = (username: string, password: string, displayName: string): boolean => {
    const users = getUsers()
    if (users.find((u: any) => u.username === username)) return false
    const newUser = { 
      username, password, displayName, 
      profilePic: '/profiles/profile_pic_student2.png',
      enrolledCourses: [], 
      completedTopics: [] 
    }
    const saved = users.concat(newUser)
    localStorage.setItem('sb_users', JSON.stringify(saved))
    const u: User = { 
      username, displayName, 
      profilePic: '/profiles/profile_pic_student2.png',
      enrolledCourses: [], 
      completedTopics: [] 
    }
    setUser(u)
    localStorage.setItem('sb_user', JSON.stringify(u))
    return true
  }

  const saveUserToStorage = (updatedUser: User) => {
    setUser(updatedUser)
    localStorage.setItem('sb_user', JSON.stringify(updatedUser))
    // Also update in all users list
    const users = getUsers()
    const updatedUsers = users.map((u: any) => 
      u.username === updatedUser.username ? { ...u, ...updatedUser } : u
    )
    localStorage.setItem('sb_users', JSON.stringify(updatedUsers))
  }

  const enroll = (courseId: string) => {
    if (!user) return
    if (user.enrolledCourses.includes(courseId)) return
    const updated = { ...user, enrolledCourses: [...user.enrolledCourses, courseId] }
    saveUserToStorage(updated)
  }

  const unenroll = (courseId: string) => {
    if (!user) return
    const updated = { ...user, enrolledCourses: user.enrolledCourses.filter(id => id !== courseId) }
    saveUserToStorage(updated)
  }

  const toggleTopic = (topicId: string) => {
    if (!user) return
    const isComp = user.completedTopics.includes(topicId)
    const updated = {
      ...user,
      completedTopics: isComp 
        ? user.completedTopics.filter(id => id !== topicId)
        : [...user.completedTopics, topicId]
    }
    saveUserToStorage(updated)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('sb_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, enroll, unenroll, toggleTopic }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

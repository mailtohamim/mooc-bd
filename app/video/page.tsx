import { Suspense } from "react"
import Navbar from "@/components/Navbar"
import VideoPlayer from "@/components/VideoPlayer"

export default function VideoPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f8f8fa" }}>
      <Suspense fallback={<div style={{ height: 76 }} />}>
        <Navbar />
      </Suspense>
      <div style={{ paddingTop: 76 }}>
        <Suspense
          fallback={
            <div style={{ minHeight: "70vh", background: "#f8f8fa" }} />
          }
        >
          <VideoPlayer />
        </Suspense>
      </div>
    </main>
  )
}

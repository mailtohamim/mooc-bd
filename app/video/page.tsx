import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/VideoPlayer";

export default function VideoPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f8f8fa" }}>
      <Navbar />
      <div style={{ paddingTop: 76 }}>
        <VideoPlayer />
      </div>
    </main>
  );
}

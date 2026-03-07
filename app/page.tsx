import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import ClassCategories from '@/components/ClassCategories'
import SkillCourseArea from '@/components/SkillCourseArea'
import GovtNotices from '@/components/GovtNotices'
import UpcomingEvents from '@/components/UpcomingEvents'
import PortraitVideos from '@/components/PortraitVideos'
import VideoPlayer from '@/components/VideoPlayer'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <ClassCategories />
      <SkillCourseArea />
      <GovtNotices />
      <UpcomingEvents />
      <PortraitVideos />
      <VideoPlayer />
      <Footer />
    </main>
  )
}

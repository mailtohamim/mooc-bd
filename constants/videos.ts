/**
 * Centralized YouTube video ID mapping for the Video Player section.
 *
 * Structure:  videoUrls[subjectName] = "YOUTUBE_VIDEO_ID"
 *
 * To add/change a video:
 *   1. Find the subject name from the classData in VideoPlayer.tsx
 *   2. Set the value to the YouTube video ID (the part after "v=" in a YouTube URL)
 *      e.g. for https://www.youtube.com/watch?v=dQw4w9WgXcQ  →  "dQw4w9WgXcQ"
 *
 * If a video ID is empty or missing, a placeholder will be shown.
 */

export const videoUrls: Record<string, string> = {
  // ─── শ্রেণি ১২ ─────────────────────────────────────────────────
  পদার্থবিজ্ঞান: "",
  রসায়নবিজ্ঞান: "",
  গণিত: "",
  জীববিজ্ঞান: "",

  // ─── শ্রেণি ১১ ─────────────────────────────────────────────────
  // পদার্থবিজ্ঞান & রসায়নবিজ্ঞান already listed above (shared key)
  "বেসিক পাইথন প্রোগ্রামিং": "",
  ইংরেজি: "",

  // ─── শ্রেণি ১০ ─────────────────────────────────────────────────
  // গণিত already listed above (shared key)
  "বাংলা ১ম পত্র": "",
  "সাধারণ বিজ্ঞান": "",
  ইতিহাস: "",

  // ─── শ্রেণি ১-৯ (Generic Subjects) ──────────────────────────
  বাংলা: "",
  ইংরেজি: "",
  গণিত: "",
  বিজ্ঞান: "",
};

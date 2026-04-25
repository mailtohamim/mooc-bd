/**
 * Centralized YouTube video ID mapping for the Video Player section.
 *
 * ─── HOW TO CHANGE A VIDEO ───────────────────────────────────────────────────
 *  1. Find the YouTube video URL, e.g.:
 *       https://www.youtube.com/watch?v=dQw4w9WgXcQ
 *                                         ↑ this part is the "video ID"
 *  2. For Course Subjects: Find the key in `videoUrls` (e.g., "পদার্থবিজ্ঞান")
 *     and replace the value with the new ID.
 *  3. For Class-Specific Overrides: Use "ClassName_SubjectName"
 *     (e.g., "শ্রেণি ১০_পদার্থবিজ্ঞান") to have a different video for that class.
 *  4. For Portrait Videos (Marquee): Find the key in `portraitVideoUrls`
 *     matching the video title and replace the ID.
 *  5. Save the file — changes are reflected immediately.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const videoUrls: Record<string, string> = {
  // ─── শ্রেণিভিত্তিক ভিডিও (Class Specific Overrides) ──────────
  // If you want a specific video for a specific class, use: "ClassName_SubjectName"
  "শ্রেণি ১০_পদার্থবিজ্ঞান": "b1t41Q3xRM8", // Updated by user
  "শ্রেণি ৯_বাংলা ১ম পত্র": "CfEbmvLu290", // Updated by user
  "শ্রেণি ১০_বাংলা ১ম পত্র": "CfEbmvLu290", // Updated by user

  // ─── সাধারণ বিষয় (General Subjects) ──────────────────────────
  // User provided Physics link
  পদার্থবিজ্ঞান: "b1t41Q3xRM8",

  // User provided Chemistry link
  রসায়নবিজ্ঞান: "5iTOphGnCtg",

  // User provided Mathematics link
  গণিত: "1srQ7Mq_ToI",

  // 10 Minute School — HSC Biology orientation class
  জীববিজ্ঞান: "Q7X3GHf7q-M",

  // 10 Minute School — General Science (Class 6-9)
  বিজ্ঞান: "v3E5GrFJuBc",

  // Shikho — SSC General Science
  "সাধারণ বিজ্ঞান": "k5s8IyUnTpA",

  // ─── ভাষা ও সাহিত্য ────────────────────────────────────────────
  // 10 Minute School — Bangla (SSC)
  বাংলা: "q0DBeJOOb8c",

  // User provided Bangla 1st Paper link
  "বাংলা ১ম পত্র": "CfEbmvLu290",

  // 10 Minute School — English for SSC (Grammar & Writing)
  ইংরেজি: "HAOqFdBNSH8",

  // ─── অন্যান্য বিষয় ────────────────────────────────────────────
  // 10 Minute School — History (Bangladesh Liberation War)
  ইতিহাস: "wV7vxn5eqSc",

  // Bohubrihi — Python Programming Basics (Bangla)
  "বেসিক পাইথন প্রোগ্রামিং": "fWjsdhR3z3c",

  // ─── স্কিলস কোর্স ──────────────────────────────────────────────
  // 10 Minute School — IELTS Full Course (Reading)
  "IELTS কোর্স": "lnOoH07NinE",

  // 10 Minute School — Spoken English (Home-based)
  "ঘরে বসে Spoken English": "PXsi5ee2Buk",

  // 10 Minute School — IELTS Live Batch Intro
  "IELTS LIVE ব্যাচ": "30xQ3VNCz60",

  // 10 Minute School — Junior Spoken English for kids
  "জুনিয়র Spoken English": "0XyaHK0CROU",
}

/**
 * YouTube video IDs for the Portrait Videos marquee carousel.
 *
 * HOW TO CHANGE: Replace the string value with the YouTube video ID.
 * The key name matches the video title (used as a reference only).
 */
export const portraitVideoUrls: Record<string, string> = {
  "৫টি স্টাডি হ্যাকস যা সবার জানা উচিত": "p60rN9JEapg",
  "পরীক্ষার আগের রাতের প্রস্তুতি": "mNjXEybIzdA",
  "পড়া মনে রাখার সহজ ৩টি টেকনিক": "eVajQPuZjD8",
  "গণিতের ভয় দূর করার উপায়": "Ku75garRVaI",
  "সময় ব্যবস্থাপনার ৫টি নিয়ম": "iDbdXTMnOmE",
  "পরীক্ষায় করণীয় ও বর্জনীয় (Do's & Don'ts)": "6nHi1oMv2HY",
  "দীর্ঘক্ষণ মনোযোগ ধরে রাখার সাইন্টিফিক পদ্ধতি": "p60rN9JEapg",
  "MCQ তে ভালো করার গোপন কৌশল": "HAOqFdBNSH8",
  "সৃজনশীল প্রশ্নের উত্তর লেখার সঠিক নিয়ম": "q0DBeJOOb8c",
  "ইংরেজি ভোকাবুলারি মনে রাখার সেরা উপায়": "OOWV5_JRSJc",
}

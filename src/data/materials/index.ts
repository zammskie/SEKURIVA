import type { MaterialSummary } from "@/lib/types";

/** Seluruh ringkasan dan status berikut adalah ilustrasi frontend. */
export const materials = [
  {
    id: "keamanan-digital",
    title: "Dasar Keamanan Digital",
    description: "Kenali jejak digital, risiko, dan kebiasaan aman saat beraktivitas online.",
    category: "Fondasi",
    durationMinutes: 10,
    lessonCount: 3,
    icon: "shield",
    status: "Selesai",
  },
  {
    id: "phishing",
    title: "Mengenali Phishing",
    description: "Pelajari tanda pesan, tautan, dan situs yang menyamar sebagai layanan tepercaya.",
    category: "Kenali ancaman",
    durationMinutes: 12,
    lessonCount: 4,
    icon: "phishing",
    status: "Selesai",
  },
  {
    id: "kata-sandi",
    title: "Kata Sandi & Keamanan Akun",
    description: "Pahami kata sandi yang kuat, autentikasi tambahan, dan kerahasiaan kode OTP.",
    category: "Lindungi akun",
    durationMinutes: 10,
    lessonCount: 3,
    icon: "key",
    status: "Belum dipelajari",
  },
  {
    id: "privasi",
    title: "Privasi & Data Pribadi",
    description: "Kenali data yang perlu dilindungi dan biasakan berpikir sebelum membagikannya.",
    category: "Jaga privasi",
    durationMinutes: 8,
    lessonCount: 3,
    icon: "privacy",
    status: "Belum dipelajari",
  },
] as const satisfies readonly MaterialSummary[];

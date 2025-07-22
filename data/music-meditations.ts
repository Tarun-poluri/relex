export interface MusicMeditation {
  id: string
  title: string
  description: string
  artist: string
  category: "relaxation" | "healing" | "meditation" | "sleep"
  duration: string
  thumbnail: string
  audioUrl: string
  durationMinutes: number
}

export const musicMeditations: MusicMeditation[] = [
  {
    id: "1",
    title: "Calm Ocean Waves",
    description: "Soothing ocean wave sounds for deep relaxation and meditation.",
    artist: "Nature Sound",
    category: "relaxation",
    duration: "15:30",
    thumbnail: "/images/ocean.jpg",
    audioUrl: "/audio/ocean.mp3",
    durationMinutes: 15
  },
  {
    id: "2",
    title: "Guided Mindfulness",
    description: "A 10-minute mindfulness practice led by a gentle voice.",
    artist: "Meditation Guru",
    category: "meditation",
    duration: "10:00",
    thumbnail: "/images/mindfulness.jpg",
    audioUrl: "/audio/mindfulness.mp3",
    durationMinutes: 10
  },
  {
    id: "3",
    title: "Morning Energy Boost",
    description: "Uplifting music to start your day with positive energy.",
    artist: "Zen Vibes",
    category: "healing",
    duration: "7:45",
    thumbnail: "/images/morning.jpg",
    audioUrl: "/audio/morning.mp3",
    durationMinutes: 8
  }
]

export interface MusicMeditation {
  id: string;
  title: string;
  duration: string;
  durationMinutes: number;
  category: "relaxation" | "healing" | "meditation" | "sleep";
  artist: string;
  description: string;
  thumbnail: string;
  audioUrl: string;
  createdAt: string;
  updatedAt?: string;
}

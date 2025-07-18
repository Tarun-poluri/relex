"use client"

import { useState, useRef, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Play, Pause, Volume2, MoreHorizontal, Edit, Trash2, Music } from "lucide-react"

interface MusicMeditation {
  id: string
  title: string
  duration: string
  category: "relaxation" | "healing" | "meditation" | "sleep"
  artist: string
  description: string
  thumbnail: string
  audioUrl: string
  durationMinutes: number
}

// Mock data for music meditations
const mockMeditations: MusicMeditation[] = [
  {
    id: "1",
    title: "Releasing Anger",
    duration: "11:00",
    category: "relaxation",
    artist: "RelaxFlow Studio",
    description: "A soothing meditation to help release anger and find inner peace",
    thumbnail: "/placeholder.svg?height=200&width=200",
    audioUrl: "/audio/sample1.mp3",
    durationMinutes: 11,
  },
  {
    id: "2",
    title: "174 Hz My Body is Aligned",
    duration: "11:11",
    category: "healing",
    artist: "Frequency Healing",
    description: "Healing frequency meditation for body alignment",
    thumbnail: "/placeholder.svg?height=200&width=200",
    audioUrl: "/audio/sample2.mp3",
    durationMinutes: 11,
  },
  {
    id: "3",
    title: "285 Hz I am Rejuvenated",
    duration: "11:11",
    category: "healing",
    artist: "Frequency Healing",
    description: "Rejuvenating frequency meditation for energy restoration",
    thumbnail: "/placeholder.svg?height=200&width=200",
    audioUrl: "/audio/sample3.mp3",
    durationMinutes: 11,
  },
  {
    id: "4",
    title: "Deep Sleep Journey",
    duration: "25:30",
    category: "sleep",
    artist: "Sleep Sounds",
    description: "A gentle journey into deep, restful sleep",
    thumbnail: "/placeholder.svg?height=200&width=200",
    audioUrl: "/audio/sample4.mp3",
    durationMinutes: 25,
  },
  {
    id: "5",
    title: "Morning Mindfulness",
    duration: "8:45",
    category: "meditation",
    artist: "Mindful Moments",
    description: "Start your day with mindful awareness",
    thumbnail: "/placeholder.svg?height=200&width=200",
    audioUrl: "/audio/sample5.mp3",
    durationMinutes: 8,
  },
  {
    id: "6",
    title: "Ocean Waves Relaxation",
    duration: "15:20",
    category: "relaxation",
    artist: "Nature Sounds",
    description: "Relax with the soothing sounds of ocean waves",
    thumbnail: "/placeholder.svg?height=200&width=200",
    audioUrl: "/audio/sample6.mp3",
    durationMinutes: 15,
  },
  // Add more mock data to demonstrate grid
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `${i + 7}`,
    title: `Meditation ${i + 7}`,
    duration: `${Math.floor(Math.random() * 20) + 5}:${Math.floor(Math.random() * 60)
      .toString()
      .padStart(2, "0")}`,
    category: ["relaxation", "healing", "meditation", "sleep"][
      Math.floor(Math.random() * 4)
    ] as MusicMeditation["category"],
    artist: "RelaxFlow Studio",
    description: `Description for meditation ${i + 7}`,
    thumbnail: "/placeholder.svg?height=200&width=200",
    audioUrl: `/audio/sample${i + 7}.mp3`,
    durationMinutes: Math.floor(Math.random() * 20) + 5,
  })),
]

interface MusicMeditationGridProps {
  searchQuery: string
  durationFilter: string
  categoryFilter: string
}

export function MusicMeditationGrid({ searchQuery, durationFilter, categoryFilter }: MusicMeditationGridProps) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [meditationToDelete, setMeditationToDelete] = useState<MusicMeditation | null>(null)
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({})

  // Filter meditations based on search and filters
  const filteredMeditations = useMemo(() => {
    return mockMeditations.filter((meditation) => {
      const matchesSearch =
        meditation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meditation.artist.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesDuration =
        durationFilter === "all" ||
        (durationFilter === "short" && meditation.durationMinutes <= 5) ||
        (durationFilter === "medium" && meditation.durationMinutes > 5 && meditation.durationMinutes <= 15) ||
        (durationFilter === "long" && meditation.durationMinutes > 15)

      const matchesCategory = categoryFilter === "all" || meditation.category === categoryFilter

      return matchesSearch && matchesDuration && matchesCategory
    })
  }, [searchQuery, durationFilter, categoryFilter])

  const handlePlayPause = (meditationId: string) => {
    const audio = audioRefs.current[meditationId]

    if (!audio) {
      // Create a dummy audio element for demo purposes
      const dummyAudio = new Audio()
      dummyAudio.addEventListener("ended", () => {
        setCurrentlyPlaying(null)
        setIsPlaying(false)
      })
      audioRefs.current[meditationId] = dummyAudio
    }

    // Stop any currently playing audio
    if (currentlyPlaying && currentlyPlaying !== meditationId) {
      const currentAudio = audioRefs.current[currentlyPlaying]
      if (currentAudio) {
        currentAudio.pause()
        currentAudio.currentTime = 0
      }
    }

    // Toggle play/pause for selected meditation
    if (currentlyPlaying === meditationId && isPlaying) {
      // Pause current
      if (audio) {
        audio.pause()
      }
      setIsPlaying(false)
    } else {
      // Play selected
      if (audio) {
        audio.play().catch(() => {
          // Handle play error (e.g., no actual audio file)
          console.log("Demo: Playing", meditationId)
        })
      }
      setCurrentlyPlaying(meditationId)
      setIsPlaying(true)
    }
  }

  const handleEditMeditation = (meditation: MusicMeditation) => {
    console.log("Editing meditation:", meditation.id)
    // TODO: Open edit dialog or navigate to edit page
  }

  const handleDeleteMeditation = (meditation: MusicMeditation) => {
    setMeditationToDelete(meditation)
  }

  const confirmDeletion = () => {
    if (meditationToDelete) {
      console.log("Deleting meditation:", meditationToDelete.id)
      // TODO: Implement actual deletion logic
      setMeditationToDelete(null)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "relaxation":
        return "from-purple-500 to-pink-500"
      case "healing":
        return "from-blue-500 to-purple-500"
      case "meditation":
        return "from-green-500 to-blue-500"
      case "sleep":
        return "from-indigo-500 to-purple-500"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "relaxation":
        return "bg-purple-100 text-purple-800"
      case "healing":
        return "bg-blue-100 text-blue-800"
      case "meditation":
        return "bg-green-100 text-green-800"
      case "sleep":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <>
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Showing {filteredMeditations.length} meditation{filteredMeditations.length !== 1 ? "s" : ""}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMeditations.map((meditation) => (
            <Card key={meditation.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className={`bg-gradient-to-br ${getCategoryColor(meditation.category)} p-6 text-white relative`}>
                {/* Action Menu */}
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleEditMeditation(meditation)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Meditation
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteMeditation(meditation)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Meditation
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Now Playing Indicator */}
                {currentlyPlaying === meditation.id && isPlaying && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-white/20 text-white border-white/30">
                      <Volume2 className="h-3 w-3 mr-1" />
                      Now Playing
                    </Badge>
                  </div>
                )}

                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                        <div className="text-xs font-bold text-white">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-1 bg-white rounded mb-1"></div>
                            <div className="w-6 h-1 bg-white rounded mb-1"></div>
                            <div className="w-4 h-1 bg-white rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg leading-tight">{meditation.title}</h3>
                    <div className="text-sm opacity-90">
                      Duration
                      <br />
                      <span className="font-bold">{meditation.duration}</span>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={getCategoryBadgeColor(meditation.category)}>
                      {meditation.category.charAt(0).toUpperCase() + meditation.category.slice(1)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{meditation.artist}</span>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">{meditation.description}</p>

                  <Button
                    onClick={() => handlePlayPause(meditation.id)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {currentlyPlaying === meditation.id && isPlaying ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Play
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMeditations.length === 0 && (
          <div className="text-center py-12">
            <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No meditations found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!meditationToDelete} onOpenChange={() => setMeditationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Meditation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete "{meditationToDelete?.title}"? This action cannot be undone
              and will remove the meditation from your library.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletion} className="bg-red-600 hover:bg-red-700">
              Delete Meditation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

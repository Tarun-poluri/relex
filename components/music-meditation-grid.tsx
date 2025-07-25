"use client"

import { useState, useRef, useMemo, useEffect } from "react"
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
import { Play, Pause, Volume2, MoreHorizontal, Edit, Trash2, Music, Loader2 } from "lucide-react"
import { type MusicMeditation } from '@/app/types/meditationTypes'
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchMeditations, deleteMeditation } from "@/store/actions/meditationActions"
import { recordMeditationPlay } from "@/store/actions/dailyPlayActions"
import { AddMeditationDialog } from "@/components/add-meditation-dialog"
import Image from "next/image"

interface MusicMeditationGridProps {
  searchQuery: string
  durationFilter: string
  categoryFilter: string
  onEditMeditation: (meditation: MusicMeditation) => void;
}

export function MusicMeditationGrid({ searchQuery, durationFilter, categoryFilter, onEditMeditation }: MusicMeditationGridProps) {
  const dispatch = useAppDispatch()
  const { meditations, isLoading, error } = useAppSelector((state) => state.meditations)

  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [meditationToDelete, setMeditationToDelete] = useState<MusicMeditation | null>(null)
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({})

  useEffect(() => {
    dispatch(fetchMeditations());
  }, [dispatch]);

  const filteredMeditations = useMemo(() => {
    return meditations.filter((meditation) => {
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
  }, [searchQuery, durationFilter, categoryFilter, meditations])

  const handlePlayPause = (meditation: MusicMeditation) => {
    let audio = audioRefs.current[meditation.id];

    if (!audio) {
      audio = new Audio(meditation.audioUrl);
      audio.addEventListener("ended", () => {
        setCurrentlyPlaying(null);
        setIsPlaying(false);
      });
      audioRefs.current[meditation.id] = audio;
    }

    if (currentlyPlaying && currentlyPlaying !== meditation.id) {
      const currentAudio = audioRefs.current[currentlyPlaying];
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    }

    if (currentlyPlaying === meditation.id && isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setCurrentlyPlaying(meditation.id);
        setIsPlaying(true);
        dispatch(recordMeditationPlay(meditation.id));
      }).catch(e => console.error("Audio playback error:", e));
    }
  }

  const handleDeleteMeditation = (meditation: MusicMeditation) => {
    setMeditationToDelete(meditation)
  }

  const confirmDeletion = async () => {
    if (meditationToDelete) {
      try {
        await dispatch(deleteMeditation(meditationToDelete.id));
        setMeditationToDelete(null);
      } catch (error) {
        console.error("Failed to delete meditation:", error);
      }
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

  if (isLoading) {
    return <div className="text-center py-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /><p>Loading meditations...</p></div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>
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
                      <DropdownMenuItem onClick={() => onEditMeditation(meditation)}>
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
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center overflow-hidden"> {/* Added overflow-hidden */}
                      {meditation.thumbnail && meditation.thumbnail !== "/placeholder.svg" ? (
                        <Image
                          src={meditation.thumbnail}
                          alt={meditation.title}
                          width={80}
                          height={80}
                          className="object-cover rounded-full"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                          <div className="text-xs font-bold text-white">
                            <div className="flex flex-col items-center">
                              <div className="w-8 h-1 bg-white rounded mb-1"></div>
                              <div className="w-6 h-1 bg-white rounded mb-1"></div>
                              <div className="w-4 h-1 bg-white rounded"></div>
                            </div>
                          </div>
                        </div>
                      )}
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
                    onClick={() => handlePlayPause(meditation)}
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

"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import SimpleReactValidator from "simple-react-validator" // Import SimpleReactValidator
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2, Upload, X, Play, Pause, Volume2 } from "lucide-react"
import { useAppDispatch } from "@/store/hooks"
import { createMeditation, updateMeditation, fetchMeditations } from "@/store/actions/meditationActions" // Corrected path
import { MusicMeditation } from "@/app/types/meditationTypes"

type MeditationFormValues = {
  title: string
  duration: string
  category: "relaxation" | "healing" | "meditation" | "sleep" // Keep the union type for Select component values
  artist: string
  description: string
  thumbnail: string // Now part of form values for validation
  audioUrl: string // Now part of form values for validation
}

interface MeditationFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  meditationToEdit?: MusicMeditation | null;
}

export function AddMeditationDialog({ open, onOpenChange, meditationToEdit }: MeditationFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(null)
  const [selectedAudio, setSelectedAudio] = useState<string | null>(null)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const thumbnailInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const dispatch = useAppDispatch();
  const [forceUpdate, setForceUpdate] = useState(false); // State to force re-render for validation messages

  const isEditing = !!meditationToEdit;

  // Initialize SimpleReactValidator
  const validator = useRef(new SimpleReactValidator({
    autoForceUpdate: { forceUpdate: () => setForceUpdate(!forceUpdate) },
    messages: {
      required: 'This field is required',
      min: 'Must be at least :min characters',
      max: 'Must be less than :max characters',
      email: 'Please enter a valid email address',
      regex: 'Invalid format',
      alpha_num_dash_dot: 'Only alphanumeric, dashes, and dots allowed'
    }
  }));

  const form = useForm<MeditationFormValues>({
    // No resolver needed for SimpleReactValidator
    defaultValues: {
      title: "",
      duration: "",
      category: "relaxation",
      artist: "",
      description: "",
      thumbnail: "/placeholder.svg", // Default for new, will be overwritten by selectedThumbnail
      audioUrl: "", // Default for new, will be overwritten by selectedAudio
    },
  })

  useEffect(() => {
    if (open) {
      if (isEditing && meditationToEdit) {
        form.reset({
          title: meditationToEdit.title,
          duration: meditationToEdit.duration,
          category: meditationToEdit.category,
          artist: meditationToEdit.artist,
          description: meditationToEdit.description,
          thumbnail: meditationToEdit.thumbnail,
          audioUrl: meditationToEdit.audioUrl,
        });
        setSelectedThumbnail(meditationToEdit.thumbnail);
        setSelectedAudio(meditationToEdit.audioUrl);
      } else {
        form.reset({
          title: "",
          duration: "",
          category: "relaxation",
          artist: "",
          description: "",
          thumbnail: "/placeholder.svg",
          audioUrl: "",
        });
        setSelectedThumbnail(null);
        setSelectedAudio(null);
      }
      setIsAudioPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      // Clear validator messages when dialog opens/resets
      validator.current.hideMessages();
    }
  }, [open, meditationToEdit, isEditing, form]);


  const onSubmit = async (data: MeditationFormValues) => {
    // Manually trigger validation check
    if (validator.current.allValid()) {
      setIsLoading(true)
      try {
        const commonData = {
          title: data.title,
          duration: data.duration,
          durationMinutes: parseDurationToMinutes(data.duration),
          category: data.category,
          artist: data.artist,
          description: data.description,
          thumbnail: selectedThumbnail || "/placeholder.svg",
          audioUrl: selectedAudio || "",
        };

        if (isEditing && meditationToEdit) {
          const updatedMeditation: MusicMeditation = {
            ...meditationToEdit,
            ...commonData,
          };
          await dispatch(updateMeditation(updatedMeditation));
        } else {
          const newMeditation: Omit<MusicMeditation, 'id' | 'createdAt' | 'updatedAt'> = {
            ...commonData,
          };
          await dispatch(createMeditation(newMeditation));
        }

        dispatch(fetchMeditations());
        handleClose();
      } catch (error) {
        console.error("Error saving meditation:", error)
      } finally {
        setIsLoading(false)
      }
    } else {
      // Show validation messages if form is not valid
      validator.current.showMessages();
      setForceUpdate(!forceUpdate); // Force re-render to display messages
    }
  }

  const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedThumbnail(e.target?.result as string)
        form.setValue("thumbnail", e.target?.result as string, { shouldValidate: true });
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedAudio(e.target?.result as string)
        setIsAudioPlaying(false)
        form.setValue("audioUrl", e.target?.result as string, { shouldValidate: true });
      }
      reader.readAsDataURL(file)
    }
  }

  const removeThumbnail = () => {
    setSelectedThumbnail(null)
    form.setValue("thumbnail", "", { shouldValidate: true }); // Clear thumbnail value in form
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = ""
    }
  }

  const removeAudio = () => {
    setSelectedAudio(null)
    setIsAudioPlaying(false)
    form.setValue("audioUrl", "", { shouldValidate: true });
    if (audioInputRef.current) {
      audioInputRef.current.value = ""
    }
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  const toggleAudioPlayback = () => {
    if (audioRef.current && selectedAudio) {
      if (isAudioPlaying) {
        audioRef.current.pause()
        setIsAudioPlaying(false)
      } else {
        audioRef.current.play().catch(() => {
          console.log("Audio playback failed")
        })
        setIsAudioPlaying(true)
      }
    }
  }

  const handleClose = () => {
    form.reset()
    setSelectedThumbnail(null)
    setSelectedAudio(null)
    setIsAudioPlaying(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    onOpenChange(false)
  }

  const parseDurationToMinutes = (durationString: string): number => {
    switch (durationString) {
      case "less-than-15": return 10;
      case "15-30": return 20;
      case "30-60": return 45;
      case "greater-than-60": return 75;
      default: return 0;
    }
  };


  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Meditation" : "Add New Meditation"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the details for this music meditation." : "Create a new music meditation for the RelaxFlow platform. Fill in all required fields below."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Type here" {...field} />
                    </FormControl>
                    <FormMessage />
                    <div className="text-red-500 text-xs mt-1">
                      {validator.current.message('title', field.value, 'required|min:2|max:100')}
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="less-than-15">Less than 15 mins</SelectItem>
                        <SelectItem value="15-30">15-30 mins</SelectItem>
                        <SelectItem value="30-60">30-60 mins</SelectItem>
                        <SelectItem value="greater-than-60">Greater than 60 mins</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    <div className="text-red-500 text-xs mt-1">
                      {validator.current.message('duration', field.value, 'required')}
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Please select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="relaxation">Relaxation</SelectItem>
                        <SelectItem value="healing">Healing</SelectItem>
                        <SelectItem value="meditation">Meditation</SelectItem>
                        <SelectItem value="sleep">Sleep</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    <div className="text-red-500 text-xs mt-1">
                      {validator.current.message('category', field.value, 'required')}
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="artist"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Artist</FormLabel>
                    <FormControl>
                      <Input placeholder="Type here" {...field} />
                    </FormControl>
                    <FormMessage />
                    <div className="text-red-500 text-xs mt-1">
                      {validator.current.message('artist', field.value, 'required|min:2|max:50')}
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Type here" className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                  <div className="text-red-500 text-xs mt-1">
                    {validator.current.message('description', field.value, 'required|min:10|max:500')}
                  </div>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Thumbnail *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {selectedThumbnail ? (
                    <div className="relative">
                      <div className="relative w-24 h-24 mx-auto mb-2">
                        <Image
                          src={selectedThumbnail || "/placeholder.svg"}
                          alt="Thumbnail preview"
                          fill
                          className="object-cover rounded-lg"
                          sizes="96px"
                        />
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => thumbnailInputRef.current?.click()}
                        >
                          Change
                        </Button>
                        <Button type="button" variant="outline" size="sm" onClick={removeThumbnail}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-12 h-12 bg-pink-500 rounded mx-auto flex items-center justify-center">
                        <Upload className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-sm text-gray-600">Add Image</div>
                      <Button type="button" variant="outline" onClick={() => thumbnailInputRef.current?.click()}>
                        Choose File
                      </Button>
                    </div>
                  )}
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                  />
                </div>
                <div className="text-red-500 text-xs mt-1">
                  {validator.current.message('thumbnail', selectedThumbnail, 'required')}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Audio *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {selectedAudio ? (
                    <div className="space-y-3">
                      <div className="w-12 h-12 bg-pink-500 rounded mx-auto flex items-center justify-center">
                        <Volume2 className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-sm text-gray-600">Audio Added</div>

                      <div className="flex items-center justify-center space-x-2 bg-gray-100 rounded-lg p-2">
                        <Button type="button" variant="ghost" size="sm" onClick={toggleAudioPlayback}>
                          {isAudioPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <div className="flex-1 h-1 bg-gray-300 rounded">
                          <div className="h-1 bg-pink-500 rounded" style={{ width: "30%" }}></div>
                        </div>
                        <Volume2 className="h-4 w-4 text-gray-500" />
                      </div>

                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => audioInputRef.current?.click()}
                        >
                          Change
                        </Button>
                        <Button type="button" variant="outline" size="sm" onClick={removeAudio}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>

                      {selectedAudio && (
                        <audio
                          ref={audioRef}
                          src={selectedAudio}
                          onEnded={() => setIsAudioPlaying(false)}
                          onPlay={() => setIsAudioPlaying(true)}
                          onPause={() => setIsAudioPlaying(false)}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-12 h-12 bg-pink-500 rounded mx-auto flex items-center justify-center">
                        <Volume2 className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-sm text-gray-600">Add Audio</div>
                      <Button type="button" variant="outline" onClick={() => audioInputRef.current?.click()}>
                        Choose File
                      </Button>
                    </div>
                  )}
                  <input
                    ref={audioInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioUpload}
                    className="hidden"
                  />
                </div>
                <div className="text-red-500 text-xs mt-1">
                  {validator.current.message('audio', selectedAudio, 'required')}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Save Changes" : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

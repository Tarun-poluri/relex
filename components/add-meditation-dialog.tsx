"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
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

const addMeditationSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(100, "Title must be less than 100 characters"),
  duration: z.string({
    required_error: "Please select a duration",
  }),
  category: z.string({
    required_error: "Please select a category",
  }),
  artist: z
    .string()
    .min(2, "Artist name must be at least 2 characters")
    .max(50, "Artist name must be less than 50 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
})

type AddMeditationFormValues = z.infer<typeof addMeditationSchema>

interface AddMeditationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddMeditationDialog({ open, onOpenChange }: AddMeditationDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(null)
  const [selectedAudio, setSelectedAudio] = useState<string | null>(null)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const thumbnailInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const form = useForm<AddMeditationFormValues>({
    resolver: zodResolver(addMeditationSchema),
    defaultValues: {
      title: "",
      duration: "",
      category: "",
      artist: "",
      description: "",
    },
  })

  const onSubmit = async (data: AddMeditationFormValues) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Creating meditation:", {
        ...data,
        thumbnail: selectedThumbnail,
        audio: selectedAudio,
      })

      // Reset form and close dialog
      form.reset()
      setSelectedThumbnail(null)
      setSelectedAudio(null)
      setIsAudioPlaying(false)
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating meditation:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedThumbnail(e.target?.result as string)
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
      }
      reader.readAsDataURL(file)
    }
  }

  const removeThumbnail = () => {
    setSelectedThumbnail(null)
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = ""
    }
  }

  const removeAudio = () => {
    setSelectedAudio(null)
    setIsAudioPlaying(false)
    if (audioInputRef.current) {
      audioInputRef.current.value = ""
    }
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  const toggleAudioPlayback = () => {
    if (audioRef.current) {
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Meditation</DialogTitle>
          <DialogDescription>
            Create a new music meditation for the RelaxFlow platform. Fill in all required fields below.
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
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Thumbnail Upload */}
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
              </div>

              {/* Audio Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Audio *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {selectedAudio ? (
                    <div className="space-y-3">
                      <div className="w-12 h-12 bg-pink-500 rounded mx-auto flex items-center justify-center">
                        <Volume2 className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-sm text-gray-600">Audio Added</div>

                      {/* Audio Player Controls */}
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
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

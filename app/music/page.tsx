"use client"

import { useState } from "react"
import { AppSidebar } from "../../components/app-sidebar"
import { DashboardHeader } from "../../components/dashboard-header"
import { MusicMeditationGrid } from "../../components/music-meditation-grid"
import { AddMeditationDialog } from "../../components/add-meditation-dialog"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Music } from "lucide-react"

export default function MusicPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [durationFilter, setDurationFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 space-y-6 p-6">
          {/* Page Header */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <Music className="h-6 w-6" />
              <h1 className="text-3xl font-bold tracking-tight">Music Meditation Management</h1>
            </div>
            <p className="text-muted-foreground">Manage your collection of music meditations and audio content.</p>
          </div>

          {/* Stats and Controls */}
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white">
              <div className="text-sm opacity-90">Total Music Meditations</div>
              <div className="text-4xl font-bold">186</div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search here"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={durationFilter} onValueChange={setDurationFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Durations</SelectItem>
                    <SelectItem value="short">Short (0-5 min)</SelectItem>
                    <SelectItem value="medium">Medium (5-15 min)</SelectItem>
                    <SelectItem value="long">Long (15+ min)</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="relaxation">Relaxation</SelectItem>
                    <SelectItem value="healing">Healing</SelectItem>
                    <SelectItem value="meditation">Meditation</SelectItem>
                    <SelectItem value="sleep">Sleep</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Plus className="h-4 w-4" />
                Add New Meditation
              </Button>
            </div>
          </div>

          {/* Meditation Grid */}
          <MusicMeditationGrid
            searchQuery={searchQuery}
            durationFilter={durationFilter}
            categoryFilter={categoryFilter}
          />

          {/* Add Meditation Dialog */}
          <AddMeditationDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

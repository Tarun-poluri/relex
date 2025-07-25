"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { UsersTable } from "@/components/users-table"
import { CreateUserDialog } from "@/components/create-user-dialog"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Users } from "lucide-react"

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
         />
        <main className="flex-1 space-y-6 p-6">
          {/* Page Header */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            </div>
            <p className="text-muted-foreground">Manage and monitor all RelaxFlow platform users.</p>
          </div>

          {/* Search and Actions */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create User
            </Button>
          </div>

          {/* Users Table */}
          <UsersTable searchQuery={searchQuery} />

          {/* Create User Dialog */}
          <CreateUserDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

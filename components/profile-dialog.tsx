"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { UserInterface } from "@/app/types/userTypes"

interface ProfileDialogProps {
  user: UserInterface | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileDialog({ user, open, onOpenChange }: ProfileDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>
                {user.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
              <p>{user.role}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                {user.status}
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Last Login</h3>
              <p>{user.lastLogin}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">User ID</h3>
              <p>{user.id}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
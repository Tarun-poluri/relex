"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, User, Calendar, Package } from "lucide-react"

const recentActivities = [
  {
    id: 1,
    type: "session",
    user: "Sarah Johnson",
    action: "completed a meditation session",
    time: "2 minutes ago",
    status: "completed",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 2,
    type: "user",
    user: "Mike Chen",
    action: "registered for premium subscription",
    time: "15 minutes ago",
    status: "active",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 3,
    type: "product",
    user: "System",
    action: "inHarmony Bowl restocked",
    time: "1 hour ago",
    status: "updated",
    avatar: null,
  },
  {
    id: 4,
    type: "session",
    user: "Emma Davis",
    action: "started sound therapy session",
    time: "2 hours ago",
    status: "in-progress",
    avatar: "/placeholder-user.jpg",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800"
    case "active":
      return "bg-blue-100 text-blue-800"
    case "updated":
      return "bg-yellow-100 text-yellow-800"
    case "in-progress":
      return "bg-purple-100 text-purple-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "session":
      return Calendar
    case "user":
      return User
    case "product":
      return Package
    default:
      return Clock
  }
}

export function RecentActivity() {
  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentActivities.map((activity) => {
          const TypeIcon = getTypeIcon(activity.type)
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {activity.avatar ? (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.user} />
                    <AvatarFallback>
                      {activity.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <TypeIcon className="h-4 w-4" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{activity.user}</p>
                  <Badge className={`text-xs ${getStatusColor(activity.status)}`}>{activity.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

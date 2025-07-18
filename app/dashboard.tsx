"use client"

import { AppSidebar } from "../components/app-sidebar"
import { DashboardHeader } from "../components/dashboard-header"
import { RecentActivity } from "../components/recent-activity"
import { DailyPlayChart } from "../components/daily-play-chart"
import { UsersChart } from "../components/users-chart"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users, Zap, Calendar, Music, User, Play } from "lucide-react"

export default function Dashboard() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 space-y-6 p-6">
          {/* Welcome Section */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-muted-foreground">Hi, Craig G,</p>
                <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">20 Sep, 2024</span>
              </div>
            </div>
          </div>

          {/* Dashboard Metrics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {/* Total Owners */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Owners</p>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">12</div>
                    <Users className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    <span>2 New owners</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Users */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">435</div>
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    <span>34 New Users</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Meditations */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Meditations</p>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">4532</div>
                    <Music className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    <span>45 New Meditations</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Last Login */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">User Last Login</p>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">2</div>
                    <User className="h-5 w-5 text-orange-500" />
                  </div>
                  <div className="border-t border-dotted border-gray-300 pt-2 mt-3"></div>
                </div>
              </CardContent>
            </Card>

            {/* Total Daily Play */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Daily Play</p>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">567</div>
                    <Play className="h-5 w-5 text-pink-500" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600 mt-3">
                    <TrendingUp className="h-3 w-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Total Users Chart */}
            <UsersChart />

            {/* Total Daily Play Chart */}
            <DailyPlayChart />
          </div>

          {/* Additional Dashboard Content */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Quick Stats */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Platform Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">User Engagement</span>
                    </div>
                    <div className="text-2xl font-bold">94.2%</div>
                    <p className="text-xs text-muted-foreground">Average session completion rate</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Growth Rate</span>
                    </div>
                    <div className="text-2xl font-bold">+23.1%</div>
                    <p className="text-xs text-muted-foreground">New users this quarter</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">Active Sessions</span>
                    </div>
                    <div className="text-2xl font-bold">1,247</div>
                    <p className="text-xs text-muted-foreground">Currently running sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <RecentActivity />
          </div>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm">API Status: Operational</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm">Database: Healthy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  <span className="text-sm">Storage: 78% Used</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm">CDN: Optimal</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Users, TrendingUp } from "lucide-react"

const usersData = [
  { date: "Sep 14", users: 380, newUsers: 12 },
  { date: "Sep 15", users: 395, newUsers: 15 },
  { date: "Sep 16", users: 388, newUsers: -7 },
  { date: "Sep 17", users: 410, newUsers: 22 },
  { date: "Sep 18", users: 405, newUsers: -5 },
  { date: "Sep 19", users: 425, newUsers: 20 },
  { date: "Sep 20", users: 435, newUsers: 10 },
]

export function UsersChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-500" />
          Total Users Growth
        </CardTitle>
        <CardDescription>User registration trends over the past week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-2xl font-bold">435</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span>+8.2% from last week</span>
            </div>
          </div>

          <ChartContainer
            config={{
              users: {
                label: "Total Users",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[180px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usersData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <defs>
                  <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} height={20} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} width={35} />
                <ChartTooltip content={<ChartTooltipContent />} labelFormatter={(value) => `Date: ${value}`} />
                <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} fill="url(#usersGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-lg font-semibold">148</p>
              <p className="text-xs text-muted-foreground">New users this week</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">21.1</p>
              <p className="text-xs text-muted-foreground">Avg. daily signups</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

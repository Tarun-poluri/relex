"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Play, TrendingUp } from "lucide-react"

const dailyPlayData = [
  { date: "Sep 14", plays: 445, sessions: 89 },
  { date: "Sep 15", plays: 478, sessions: 95 },
  { date: "Sep 16", plays: 512, sessions: 102 },
  { date: "Sep 17", plays: 489, sessions: 97 },
  { date: "Sep 18", plays: 534, sessions: 106 },
  { date: "Sep 19", plays: 556, sessions: 111 },
  { date: "Sep 20", plays: 567, sessions: 113 },
]

export function DailyPlayChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5 text-pink-500" />
          Daily Play Activity
        </CardTitle>
        <CardDescription>Meditation plays and session activity trends</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-2xl font-bold">567</p>
              <p className="text-sm text-muted-foreground">Today's Plays</p>
            </div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span>+12.4% from yesterday</span>
            </div>
          </div>

          <ChartContainer
            config={{
              plays: {
                label: "Daily Plays",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[180px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyPlayData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }} barCategoryGap="20%">
                <defs>
                  <linearGradient id="playsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity={0.9} />
                    <stop offset="50%" stopColor="#f472b6" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="#fce7f3" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  height={20}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#6b7280" }} width={35} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  labelFormatter={(value) => `Date: ${value}`}
                  formatter={(value, name) => [value, "Plays"]}
                />
                <Bar
                  dataKey="plays"
                  fill="url(#playsGradient)"
                  radius={[6, 6, 0, 0]}
                  stroke="#ec4899"
                  strokeWidth={1}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-lg font-semibold">3,581</p>
              <p className="text-xs text-muted-foreground">Total plays this week</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">511</p>
              <p className="text-xs text-muted-foreground">Avg. daily plays</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

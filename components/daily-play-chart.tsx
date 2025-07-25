"use client"

import { useEffect, useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Play, TrendingUp, Loader2 } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchDailyPlay } from "@/store/actions/dailyPlayActions" // Corrected path

export function DailyPlayChart() {
  const dispatch = useAppDispatch();
  const { dailyPlays, isLoading, error } = useAppSelector((state) => state.dailyPlay);

  useEffect(() => {
    dispatch(fetchDailyPlay());
  }, [dispatch]);

  const { chartData, todayPlays, yesterdayPlays, totalPlaysThisWeek, avgDailyPlays, trendFromYesterday } = useMemo(() => {
    // Sort data by date to ensure correct chart display and calculations
    const sortedData = [...dailyPlays].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const chartFormattedData = sortedData.map(record => ({
      name: new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      plays: record.plays,
    }));

    const now = new Date();
    const todayString = now.toISOString().split('T')[0];
    const yesterday = new Date(now);
    yesterday.setUTCDate(now.getUTCDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setUTCDate(now.getUTCDate() - 7);
    const sevenDaysAgoString = sevenDaysAgo.toISOString().split('T')[0];
    const sevenDaysAgoDate = new Date(sevenDaysAgoString + 'T00:00:00.000Z');
    const todayDate = new Date(todayString + 'T00:00:00.000Z');
    const todayRecord = sortedData.find(record => record.date === todayString);
    const yesterdayRecord = sortedData.find(record => record.date === yesterdayString);
    const todayP = todayRecord ? todayRecord.plays : 0;
    const yesterdayP = yesterdayRecord ? yesterdayRecord.plays : 0;

    const playsLastWeek = sortedData.filter(record => {
      const recordDate = new Date(record.date + 'T00:00:00.000Z');
      return recordDate >= sevenDaysAgoDate && recordDate <= todayDate;
    });

    const totalPThisWeek = playsLastWeek.reduce((sum, record) => sum + record.plays, 0);
    const avgDP = playsLastWeek.length > 0 ? Math.round(totalPThisWeek / playsLastWeek.length) : 0;

    const trend = yesterdayP > 0 ? ((todayP - yesterdayP) / yesterdayP) * 100 : (todayP > 0 ? 100 : 0);

    return {
      chartData: chartFormattedData,
      todayPlays: todayP,
      yesterdayPlays: yesterdayP,
      totalPlaysThisWeek: totalPThisWeek,
      avgDailyPlays: avgDP,
      trendFromYesterday: trend,
    };
  }, [dailyPlays]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-pink-500" />
            Daily Play Activity
          </CardTitle>
          <CardDescription>Meditation plays and session activity trends</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
          <span className="ml-2 text-muted-foreground">Loading chart data...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-pink-500" />
            Daily Play Activity
          </CardTitle>
          <CardDescription>Meditation plays and session activity trends</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px] text-red-500">
          Error loading chart data: {error}
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0 && !isLoading && !error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-pink-500" />
            Daily Play Activity
          </CardTitle>
          <CardDescription>Meditation plays and session activity trends</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
          No daily play data available. Play some meditations to see activity here!
        </CardContent>
      </Card>
    );
  }

  const trendColor = trendFromYesterday >= 0 ? "text-green-600" : "text-red-600";
  const trendIcon = trendFromYesterday >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingUp className="h-4 w-4 rotate-180" />;

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
              <p className="text-2xl font-bold">{todayPlays}</p>
              <p className="text-sm text-muted-foreground">Today's Plays</p>
            </div>
            <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
              {trendIcon}
              <span>{Math.abs(trendFromYesterday).toFixed(1)}% from yesterday</span>
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
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }} barCategoryGap="20%">
                <defs>
                  <linearGradient id="playsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity={0.9} />
                    <stop offset="50%" stopColor="#f472b6" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="#fce7f3" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
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
              <p className="text-lg font-semibold">{totalPlaysThisWeek}</p>
              <p className="text-xs text-muted-foreground">Total plays this week</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">{avgDailyPlays}</p>
              <p className="text-xs text-muted-foreground">Avg. daily plays</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

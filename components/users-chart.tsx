"use client"

import { useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Users, TrendingUp, Loader2 } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchUsers } from "@/store/actions/userActions"
import { UserInterface as UserType } from "@/app/types/userTypes"

export function UsersChart() {
  const dispatch = useAppDispatch();
  const { users, isLoading, error } = useAppSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const { chartData, totalUsers, newUsersThisWeek, avgDailySignups, usersTrendFromLastWeek } = useMemo(() => {
    const parseDateString = (dateString: string): Date => {
      const [datePart, timePart] = dateString.split(', ');
      const [day, month, year] = datePart.split('/').map(Number);
      const [hours, minutes, seconds] = timePart.split(':').map(Number);
      return new Date(year, month - 1, day, hours, minutes, seconds);
    };

    const sortedUsers = [...users].sort((a, b) => {
      const dateA = parseDateString(a.lastLogin);
      const dateB = parseDateString(b.lastLogin);
      return dateA.getTime() - dateB.getTime();
    });

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const fourteenDaysAgo = new Date(today);
    fourteenDaysAgo.setDate(today.getDate() - 14);

    const newUsersCountThisWeek = sortedUsers.filter(user => {
      const loginDate = parseDateString(user.lastLogin);
      return loginDate >= sevenDaysAgo && loginDate <= now;
    }).length;
    const usersInCurrentWeek = sortedUsers.filter(user => {
      const loginDate = parseDateString(user.lastLogin);
      return loginDate >= sevenDaysAgo && loginDate <= now;
    }).length;

    const usersInPreviousWeek = sortedUsers.filter(user => {
      const loginDate = parseDateString(user.lastLogin);
      return loginDate >= fourteenDaysAgo && loginDate < sevenDaysAgo;
    }).length;

    const trend = usersInPreviousWeek > 0 ? ((usersInCurrentWeek - usersInPreviousWeek) / usersInPreviousWeek) * 100 : (usersInCurrentWeek > 0 ? 100 : 0);
    const dailyUserCounts: { [key: string]: number } = {};
    const uniqueDates = new Set<string>();

    sortedUsers.forEach(user => {
      const loginDate = parseDateString(user.lastLogin);
      if (loginDate >= fourteenDaysAgo && loginDate <= now) {
        const dateKey = loginDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        uniqueDates.add(dateKey);
      }
    });

    const datesForChart = Array.from(uniqueDates).sort((a, b) => {
      const dateA = new Date(a + ' ' + new Date().getFullYear());
      const dateB = new Date(b + ' ' + new Date().getFullYear());
      return dateA.getTime() - dateB.getTime();
    });

    let cumulativeUsers = 0;
    const formattedChartData = datesForChart.map(dateKey => {
      const usersOnThisDate = sortedUsers.filter(user =>
        parseDateString(user.lastLogin).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) === dateKey
      ).length;

      cumulativeUsers += usersOnThisDate;
      return {
        date: dateKey,
        users: cumulativeUsers,
      };
    });

    const avgDailySignupsCalculated = newUsersCountThisWeek > 0 ? Math.round(newUsersCountThisWeek / 7) : 0;

    return {
      chartData: formattedChartData,
      totalUsers: users.length,
      newUsersThisWeek: newUsersCountThisWeek,
      avgDailySignups: avgDailySignupsCalculated,
      usersTrendFromLastWeek: trend,
    };
  }, [users]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Total Users Growth
          </CardTitle>
          <CardDescription>User registration trends over the past week</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-muted-foreground">Loading user data...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Total Users Growth
          </CardTitle>
          <CardDescription>User registration trends over the past week</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px] text-red-500">
          Error loading user data: {error}
        </CardContent>
      </Card>
    );
  }

  if (users.length === 0 && !isLoading && !error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Total Users Growth
          </CardTitle>
          <CardDescription>User registration trends over the past week</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
          No user data available.
        </CardContent>
      </Card>
    );
  }

  const trendColor = usersTrendFromLastWeek >= 0 ? "text-green-600" : "text-red-600";
  const trendIcon = usersTrendFromLastWeek >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingUp className="h-4 w-4 rotate-180" />;

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
              <p className="text-2xl font-bold">{totalUsers}</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
            <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
              {trendIcon}
              <span>{Math.abs(usersTrendFromLastWeek).toFixed(1)}% from last week</span>
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
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
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
              <p className="text-lg font-semibold">{newUsersThisWeek}</p>
              <p className="text-xs text-muted-foreground">New users this week</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">{avgDailySignups}</p>
              <p className="text-xs text-muted-foreground">Avg. daily signups</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

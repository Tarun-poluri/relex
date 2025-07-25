"use client"

import { useEffect, useMemo, useState } from "react"
import { AppSidebar } from "./app-sidebar"
import { DashboardHeader } from "./dashboard-header"
import { RecentActivity } from "./recent-activity"
import { DailyPlayChart } from "./daily-play-chart"
import { UsersChart } from "./users-chart"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users, Zap, Calendar, Music, User, Play, Loader2 } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchMeditations } from "@/store/actions/meditationActions"
import { fetchOwners } from "@/store/actions/ownersactions"
import { fetchDailyPlay } from "@/store/actions/dailyPlayActions"
import { fetchUsers } from "@/store/actions/userActions"
//import { fetchActivities } from "@/store/actions/activityActions"
import { UserInterface as UserType } from "@/app/types/userTypes"

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { meditations, isLoading: meditationsLoading, error: meditationsError } = useAppSelector((state) => state.meditations);
  const { owners, isLoading: ownersLoading, error: ownersError } = useAppSelector((state) => state.owners);
  const { dailyPlays, isLoading: dailyPlayLoading, error: dailyPlayError } = useAppSelector((state) => state.dailyPlay);
  const { users, isLoading: usersLoading, error: usersError } = useAppSelector((state) => state.users);

  const [currentDate, setCurrentDate] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State for global search query

  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    setCurrentDate(today.toLocaleDateString('en-US', options));

    dispatch(fetchMeditations());
    dispatch(fetchOwners());
    dispatch(fetchDailyPlay());
    dispatch(fetchUsers());
    //dispatch(fetchActivities());
  }, [dispatch]);

  const totalMeditations = meditations.length;
  const totalOwners = owners.length;
  const totalUsers = users.length;

  const newOwnersLastWeek = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    return owners.filter(owner => {
      const createdAtDate = new Date(owner.createdAt);
      return createdAtDate >= sevenDaysAgo;
    }).length;
  }, [owners]);

  const newMeditationsLastWeek = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    return meditations.filter(meditation => {
      const createdAtDate = new Date(meditation.createdAt);
      return createdAtDate >= sevenDaysAgo;
    }).length;
  }, [meditations]);

  const { totalPlaysThisWeek, playDifferenceLastWeek } = useMemo(() => {
    const now = new Date();
    const todayDate = new Date(now.toISOString().split('T')[0] + 'T00:00:00.000Z');

    const startOfCurrentWeek = new Date(todayDate);
    startOfCurrentWeek.setUTCDate(todayDate.getUTCDate() - 6);
    startOfCurrentWeek.setUTCHours(0, 0, 0, 0);

    const endOfPreviousWeek = new Date(startOfCurrentWeek);
    endOfPreviousWeek.setUTCDate(startOfCurrentWeek.getUTCDate() - 1);
    endOfPreviousWeek.setUTCHours(23, 59, 59, 999);

    const startOfPreviousWeek = new Date(endOfPreviousWeek);
    startOfPreviousWeek.setUTCDate(endOfPreviousWeek.getUTCDate() - 6);
    startOfPreviousWeek.setUTCHours(0, 0, 0, 0);

    const currentWeekPlays = dailyPlays.filter(record => {
      const recordDate = new Date(record.date + 'T00:00:00.000Z');
      return recordDate >= startOfCurrentWeek && recordDate <= todayDate;
    }).reduce((sum, record) => sum + record.plays, 0);

    const previousWeekPlays = dailyPlays.filter(record => {
      const recordDate = new Date(record.date + 'T00:00:00.000Z');
      return recordDate >= startOfPreviousWeek && recordDate <= endOfPreviousWeek;
    }).reduce((sum, record) => sum + record.plays, 0);

    const difference = currentWeekPlays - previousWeekPlays;

    return {
      totalPlaysThisWeek: currentWeekPlays,
      playDifferenceLastWeek: difference,
    };
  }, [dailyPlays]);

  const totalUsersLoginLastWeek = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    return users.filter(user => {
      const [datePart, timePart] = user.lastLogin.split(', ');
      const [day, month, year] = datePart.split('/').map(Number);
      const [hours, minutes, seconds] = timePart.split(':').map(Number);
      const lastLoginDate = new Date(year, month - 1, day, hours, minutes, seconds);
      
      return lastLoginDate >= sevenDaysAgo;
    }).length;
  }, [users]);

  const { newUsersThisQuarter, activeSessions, userEngagementRate } = useMemo(() => {
    const now = new Date();
    const ninetyDaysAgo = new Date(now);
    ninetyDaysAgo.setDate(now.getDate() - 90);
    ninetyDaysAgo.setHours(0, 0, 0, 0);

    const newUsersCountThisQuarter = users.filter(user => {
      const [datePart, timePart] = user.lastLogin.split(', ');
      const [day, month, year] = datePart.split('/').map(Number);
      const [hours, minutes, seconds] = timePart.split(':').map(Number);
      const loginDate = new Date(year, month - 1, day, hours, minutes, seconds);
      return loginDate >= ninetyDaysAgo;
    }).length;

    const mockActiveSessions = Math.floor(Math.random() * 500) + 1000;
    const mockUserEngagementRate = (Math.random() * (98 - 90) + 90).toFixed(1);

    return {
      newUsersThisQuarter: newUsersCountThisQuarter,
      activeSessions: mockActiveSessions,
      userEngagementRate: mockUserEngagementRate,
    };
  }, [users]);


  const dailyPlayTrendColor = playDifferenceLastWeek >= 0 ? "text-green-600" : "text-red-600";
  const dailyPlayTrendIcon = playDifferenceLastWeek >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingUp className="h-3 w-3 rotate-180" />;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <main className="flex-1 space-y-6 p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-muted-foreground">Hi, Craig G,</p>
                <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{currentDate}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Owners</p>
                  <div className="flex items-center justify-between">
                    {ownersLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                    ) : ownersError ? (
                      <span className="text-sm text-red-500">Error</span>
                    ) : (
                      <div className="text-3xl font-bold">{totalOwners}</div>
                    )}
                    <Users className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    <span>{newOwnersLastWeek} New owners</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <div className="flex items-center justify-between">
                    {usersLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                    ) : usersError ? (
                      <span className="text-sm text-red-500">Error</span>
                    ) : (
                      <div className="text-3xl font-bold">{totalUsers}</div>
                    )}
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    <span>{totalUsersLoginLastWeek} Total users login last week</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Meditations</p>
                  <div className="flex items-center justify-between">
                    {meditationsLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-green-500" />
                    ) : meditationsError ? (
                      <span className="text-sm text-red-500">Error</span>
                    ) : (
                      <div className="text-3xl font-bold">{totalMeditations}</div>
                    )}
                    <Music className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    <span>{newMeditationsLastWeek} New Meditations</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">User Last Login</p>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">2</div>
                    <User className="h-5 w-5 text-orange-500" />
                  </div>
                  <div className="border-t border-dotted border-gray-300 pt-2 mt-3"></div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    <span>{totalUsersLoginLastWeek} Total users login last week</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Daily Play</p>
                  <div className="flex items-center justify-between">
                    {dailyPlayLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-pink-500" />
                    ) : dailyPlayError ? (
                      <span className="text-sm text-red-500">Error</span>
                    ) : (
                      <div className="text-3xl font-bold">{totalPlaysThisWeek}</div>
                    )}
                    <Play className="h-5 w-5 text-pink-500" />
                  </div>
                  <div className={`flex items-center gap-1 text-xs ${dailyPlayTrendColor} mt-3`}>
                    {dailyPlayTrendIcon}
                    <span>{Math.abs(playDifferenceLastWeek)} from last week</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <UsersChart />
            <DailyPlayChart />
          </div>

          <Card className="lg:col-span-3">
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
                  <div className="text-2xl font-bold">{userEngagementRate}%</div>
                  <p className="text-xs text-muted-foreground">Average session completion rate</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Growth Rate</span>
                  </div>
                  <div className="text-2xl font-bold">+{newUsersThisQuarter}</div>
                  <p className="text-xs text-muted-foreground">New users this quarter</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium">Active Sessions</span>
                  </div>
                  <div className="text-2xl font-bold">{activeSessions}</div>
                  <p className="text-xs text-muted-foreground">Currently running sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <RecentActivity />

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

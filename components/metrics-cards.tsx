"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Package, Activity, TrendingUp } from "lucide-react"

const metricsData = [
  {
    title: "Active Users",
    value: "2,847",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: Users,
    description: "Currently active users",
  },
  {
    title: "Total Sessions",
    value: "18,392",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: Calendar,
    description: "Sessions conducted this month",
  },
  {
    title: "Products in Stock",
    value: "156",
    change: "-2.1%",
    changeType: "negative" as const,
    icon: Package,
    description: "Available inventory items",
  },
  {
    title: "Last Active Sessions",
    value: "47",
    change: "+5.7%",
    changeType: "positive" as const,
    icon: Activity,
    description: "Sessions in the last hour",
  },
]

export function MetricsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metricsData.map((metric, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span
                className={`flex items-center ${metric.changeType === "positive" ? "text-green-600" : "text-red-600"}`}
              >
                <TrendingUp className="mr-1 h-3 w-3" />
                {metric.change}
              </span>
              <span>from last month</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

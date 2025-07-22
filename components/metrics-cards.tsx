"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import {metrics} from "@/data/metrics"

const metricsData = [
  ...metrics
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
                className={`f
                  lex items-center ${metric.changeType === "positive" ? "text-green-600" : "text-red-600"}`}
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

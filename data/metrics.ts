import { Users, Calendar, Package, Activity } from "lucide-react"

export interface Metric {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative"
  icon: React.ElementType
  description: string
}

export const metrics: Metric[] = [
  {
    title: "Active Users",
    value: "2,847",
    change: "+12.5%",
    changeType: "positive",
    icon: Users,
    description: "Currently active users",
  },
  {
    title: "Total Sessions",
    value: "18,392",
    change: "+8.2%",
    changeType: "positive",
    icon: Calendar,
    description: "Sessions conducted this month",
  },
  {
    title: "Products in Stock",
    value: "156",
    change: "-2.1%",
    changeType: "negative",
    icon: Package,
    description: "Available inventory items",
  },
  {
    title: "Last Active Sessions",
    value: "47",
    change: "+5.7%",
    changeType: "positive",
    icon: Activity,
    description: "Sessions in the last hour",
  },
]

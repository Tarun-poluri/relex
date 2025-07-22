export interface UserInterface {
  id: string
  name: string
  email: string
  role: "Admin" | "User"
  status: "Active" | "Inactive"
  lastLogin: string
  avatar?: string
}

export const defaultUsers: UserInterface[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@inharmony.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2024-01-15 14:30",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike.chen@email.com",
    role: "User",
    status: "Active",
    lastLogin: "2024-01-15 09:15",
  },
  {
    id: "3",
    name: "Emma Davis",
    email: "emma.davis@email.com",
    role: "User",
    status: "Active",
    lastLogin: "2024-01-14 16:45",
  },
  {
    id: "4",
    name: "James Wilson",
    email: "james.wilson@email.com",
    role: "User",
    status: "Inactive",
    lastLogin: "2024-01-10 11:20",
  },
  {
    id: "5",
    name: "Lisa Anderson",
    email: "lisa.anderson@email.com",
    role: "User",
    status: "Active",
    lastLogin: "2024-01-15 13:10",
  },
  
]

export const getUsers = (): UserInterface[] => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("users")
    if (stored) return JSON.parse(stored)
    localStorage.setItem("users", JSON.stringify(defaultUsers))
  }
  return defaultUsers
}

export const saveUsers = (users: UserInterface[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("users", JSON.stringify(users))
  }
}
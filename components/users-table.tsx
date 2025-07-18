"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { MoreHorizontal, Edit, UserX, UserCheck, ChevronLeft, ChevronRight, Trash2, User } from "lucide-react"

// Mock data for demonstration
const mockUsers = [
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
  // Add more mock users to demonstrate pagination
  ...Array.from({ length: 25 }, (_, i) => ({
    id: `${i + 6}`,
    name: `User ${i + 6}`,
    email: `user${i + 6}@email.com`,
    role: "User" as const,
    status: Math.random() > 0.3 ? ("Active" as const) : ("Inactive" as const),
    lastLogin: `2024-01-${Math.floor(Math.random() * 15) + 1} ${Math.floor(Math.random() * 24)}:${Math.floor(
      Math.random() * 60,
    )
      .toString()
      .padStart(2, "0")}`,
  })),
]

interface UserInterface {
  id: string
  name: string
  email: string
  role: "Admin" | "User"
  status: "Active" | "Inactive"
  lastLogin: string
  avatar?: string
}

interface UsersTableProps {
  searchQuery: string
}

export function UsersTable({ searchQuery }: UsersTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [userToDeactivate, setUserToDeactivate] = useState<UserInterface | null>(null)
  const [userToDelete, setUserToDelete] = useState<UserInterface | null>(null)
  const [userToActivate, setUserToActivate] = useState<UserInterface | null>(null)
  const usersPerPage = 20

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    return mockUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [searchQuery])

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const startIndex = (currentPage - 1) * usersPerPage
  const endIndex = startIndex + usersPerPage
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

  const handleDeactivateUser = (user: UserInterface) => {
    setUserToDeactivate(user)
  }

  const confirmDeactivation = () => {
    if (userToDeactivate) {
      // Here you would typically make an API call to deactivate the user
      console.log("Deactivating user:", userToDeactivate.id)
      setUserToDeactivate(null)
    }
  }

  const handleDeleteUser = (user: UserInterface) => {
    setUserToDelete(user)
  }

  const confirmDeletion = () => {
    if (userToDelete) {
      console.log("Deleting user:", userToDelete.id)
      setUserToDelete(null)
    }
  }

  const handleActivateUser = (user: UserInterface) => {
    setUserToActivate(user)
  }

  const confirmActivation = () => {
    if (userToActivate) {
      console.log("Activating user:", userToActivate.id)
      setUserToActivate(null)
    }
  }

  const getStatusBadge = (status: string) => {
    return <Badge variant={status === "Active" ? "default" : "secondary"}>{status}</Badge>
  }

  const getRoleBadge = (role: string) => {
    const variants = {
      Admin: "destructive",
      User: "secondary",
    } as const

    return <Badge variant={variants[role as keyof typeof variants] || "secondary"}>{role}</Badge>
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <User className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.status === "Active" ? (
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeactivateUser(user)}>
                            <UserX className="mr-2 h-4 w-4" />
                            Deactivate User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-green-600" onClick={() => handleActivateUser(user)}>
                            <UserCheck className="mr-2 h-4 w-4" />
                            Activate User
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteUser(user)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = i + 1
              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNumber)}
                  className="w-8"
                >
                  {pageNumber}
                </Button>
              )
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Deactivation Confirmation Dialog */}
      <AlertDialog open={!!userToDeactivate} onOpenChange={() => setUserToDeactivate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate {userToDeactivate?.name}? This action will prevent them from accessing
              the platform until reactivated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeactivation} className="bg-red-600 hover:bg-red-700">
              Deactivate User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete {userToDelete?.name}? This action cannot be undone and will
              remove all user data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletion} className="bg-red-600 hover:bg-red-700">
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={!!userToActivate} onOpenChange={() => setUserToActivate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Activate User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to activate {userToActivate?.name}? This will restore their access to the RelaxFlow
              platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmActivation} className="bg-green-600 hover:bg-green-700">
              Activate User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

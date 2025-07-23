// users-table.tsx
"use client"

import { useState, useMemo, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchUsers, updateUser, removeUser } from "@/store/actions/userActions"
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
import { CreateUserDialog } from "@/components/create-user-dialog"
import { ProfileDialog } from "@/components/profile-dialog"
import { UserInterface } from "@/app/types/userTypes"

interface UsersTableProps {
  searchQuery: string
}

export function UsersTable({ searchQuery }: UsersTableProps) {
  const dispatch = useAppDispatch()
  const { users, isLoading } = useAppSelector((state) => state.users)
  const [currentPage, setCurrentPage] = useState(1)
  const [userToDeactivate, setUserToDeactivate] = useState<UserInterface | null>(null)
  const [userToDelete, setUserToDelete] = useState<UserInterface | null>(null)
  const [userToActivate, setUserToActivate] = useState<UserInterface | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [userToEdit, setUserToEdit] = useState<UserInterface | null>(null)
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
  const [userToView, setUserToView] = useState<UserInterface | null>(null)
  
  const usersPerPage = 10

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, users])

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const startIndex = (currentPage - 1) * usersPerPage
  const endIndex = startIndex + usersPerPage
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

  const handleEditUser = (user: UserInterface) => {
    setUserToEdit(user)
    setIsEditDialogOpen(true)
  }

  const handleViewProfile = (user: UserInterface) => {
    setUserToView(user)
    setIsProfileDialogOpen(true)
  }

  const handleDeactivateUser = (user: UserInterface) => {
    setUserToDeactivate(user)
  }

  const confirmDeactivation = async () => {
    if (userToDeactivate) {
      const updatedUser = { 
        ...userToDeactivate, 
        status: "Inactive",
        lastLogin: new Date().toLocaleString()
      }
      await dispatch(updateUser(updatedUser))
      setUserToDeactivate(null)
    }
  }

  const handleDeleteUser = (user: UserInterface) => {
    setUserToDelete(user)
  }

  const confirmDeletion = async () => {
    if (userToDelete) {
      await dispatch(removeUser(userToDelete.id))
      setUserToDelete(null)
      // Reset to first page after deletion if needed
      if (currentPage > 1 && users.length % usersPerPage === 1) {
        setCurrentPage(currentPage - 1)
      }
    }
  }

  const handleActivateUser = (user: UserInterface) => {
    setUserToActivate(user)
  }

  const confirmActivation = async () => {
    if (userToActivate) {
      const updatedUser = { 
        ...userToActivate, 
        status: "Active",
        lastLogin: new Date().toLocaleString()
      }
      await dispatch(updateUser(updatedUser))
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : currentUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                currentUsers.map((user) => (
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
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewProfile(user)}>
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
                ))
              )}
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
              let pageNumber
              if (totalPages <= 5) {
                pageNumber = i + 1
              } else if (currentPage <= 3) {
                pageNumber = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i
              } else {
                pageNumber = currentPage - 2 + i
              }

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
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="px-2">...</span>
            )}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                className="w-8"
              >
                {totalPages}
              </Button>
            )}
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

      {/* Confirmation Dialogs */}
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
              Are you sure you want to activate {userToActivate?.name}? This will restore their access to the platform.
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

      {/* Edit User Dialog */}
      <CreateUserDialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen}
        userToEdit={userToEdit}
        onUserUpdated={() => dispatch(fetchUsers())}
      />

      {/* Profile View Dialog */}
      <ProfileDialog 
        user={userToView}
        open={isProfileDialogOpen}
        onOpenChange={setIsProfileDialogOpen}
      />
    </>
  )
}
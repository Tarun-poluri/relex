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
import { MoreHorizontal, Edit, Trash2, ChevronLeft, ChevronRight, MapPin, Phone, Mail } from "lucide-react"
import { type Owner, owners } from "@/data/owners"

// Mock data for demonstration
const mockOwners: Owner[] = [
  ...owners,
]

interface OwnersTableProps {
  searchQuery: string
  statusFilter: string
}

export function OwnersTable({ searchQuery, statusFilter }: OwnersTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [ownerToDelete, setOwnerToDelete] = useState<Owner | null>(null)
  const ownersPerPage = 10

  // Filter owners based on search query and status
  const filteredOwners = useMemo(() => {
    return mockOwners.filter((owner) => {
      const matchesSearch =
        owner.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        owner.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        owner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        owner.phone.includes(searchQuery)

      const matchesStatus = statusFilter === "all" || owner.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [searchQuery, statusFilter])

  // Calculate pagination
  const totalPages = Math.ceil(filteredOwners.length / ownersPerPage)
  const startIndex = (currentPage - 1) * ownersPerPage
  const endIndex = startIndex + ownersPerPage
  const currentOwners = filteredOwners.slice(startIndex, endIndex)

  const handleDeleteOwner = (owner: Owner) => {
    setOwnerToDelete(owner)
  }

  const confirmDeletion = () => {
    if (ownerToDelete) {
      console.log("Deleting owner:", ownerToDelete.id)
      setOwnerToDelete(null)
    }
  }

  const getStatusBadge = (status: string) => {
    return <Badge variant={status === "active" ? "default" : "secondary"}>{status}</Badge>
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Owner</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Locations</TableHead>
                <TableHead>Devices</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOwners.map((owner) => (
                <TableRow key={owner.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" alt={`${owner.firstName} ${owner.lastName}`} />
                        <AvatarFallback>
                          {owner.firstName[0]}
                          {owner.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {owner.firstName} {owner.lastName}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{owner.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{owner.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {owner.locations.map((location) => (
                        <div key={location.id} className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span>{location.name}</span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {owner.locations.map((location) =>
                        location.deviceIds.map((deviceId) => (
                          <Badge key={deviceId} variant="outline" className="text-xs">
                            {deviceId}
                          </Badge>
                        )),
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(owner.status)}</TableCell>
                  <TableCell className="text-muted-foreground">{owner.createdAt}</TableCell>
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
                          Edit Owner
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteOwner(owner)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Owner
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
          Showing {startIndex + 1} to {Math.min(endIndex, filteredOwners.length)} of {filteredOwners.length} owners
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!ownerToDelete} onOpenChange={() => setOwnerToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Owner</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete {ownerToDelete?.firstName} {ownerToDelete?.lastName}? This
              action cannot be undone and will remove all associated location and device assignments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletion} className="bg-red-600 hover:bg-red-700">
              Delete Owner
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

"use client"

import { useState, useRef, useEffect } from "react"
import { useAppDispatch } from "@/store/hooks"
import { createUser, updateUser } from "@/store/actions/userActions"
import SimpleReactValidator from "simple-react-validator"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { UserInterface } from "@/app/types/userTypes"

interface CreateUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userToEdit?: UserInterface | null
  onUserUpdated?: () => void
}

export function CreateUserDialog({ open, onOpenChange, userToEdit, onUserUpdated }: CreateUserDialogProps) {
  const dispatch = useAppDispatch()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "User",
  })

  const [forceUpdate, setForceUpdate] = useState(false)
  const validator = useRef(
    new SimpleReactValidator({
      autoForceUpdate: { forceUpdate: () => setForceUpdate(!forceUpdate) },
    })
  )

  useEffect(() => {
    if (userToEdit) {
      const nameParts = userToEdit.name.split(" ")
      setFormData({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: userToEdit.email || "",
        role: userToEdit.role || "User",
      })
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        role: "User",
      })
    }
  }, [userToEdit, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }))
  }

  const handleClose = () => {
    setFormData({ firstName: "", lastName: "", email: "", role: "User" })
    onOpenChange(false)
    if (userToEdit && onUserUpdated) {
      onUserUpdated()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validator.current.allValid()) {
      try {
        if (userToEdit) {
          // Update existing user
          const updatedUser = {
            ...userToEdit,
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            role: formData.role as "Admin" | "User",
            lastLogin: new Date().toLocaleString(),
          }
          
          await dispatch(updateUser(updatedUser))
          if (onUserUpdated) {
            onUserUpdated()
          }
        } else {
          // Create new user
          const newUser = {
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            role: formData.role as "Admin" | "User",
            status: "Active" as const,
            lastLogin: new Date().toLocaleString(),
            avatar: "/placeholder.svg",
          }
          
          await dispatch(createUser(newUser))
        }
        
        handleClose()
      } catch (error) {
        console.error("Error saving user:", error)
      }
    } else {
      validator.current.showMessages()
      setForceUpdate(!forceUpdate)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{userToEdit ? "Edit User" : "Create New User"}</DialogTitle>
          <DialogDescription>
            {userToEdit ? "Update user information" : "Add a new user to the platform"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="block text-sm font-medium">First Name</label>
            <Input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
            />
            <div className="text-red-500 text-xs">
              {validator.current.message("first name", formData.firstName, "required|alpha|min:2")}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Last Name</label>
            <Input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
            />
            <div className="text-red-500 text-xs">
              {validator.current.message("last name", formData.lastName, "required|alpha|min:2")}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <Input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              type="email"
            />
            <div className="text-red-500 text-xs">
              {validator.current.message("email", formData.email, "required|email")}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <Select value={formData.role} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="User">User</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-red-500 text-xs">
              {validator.current.message("role", formData.role, "required")}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">{userToEdit ? "Update User" : "Create User"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
"use client"

import { useState, useRef } from "react"
import SimpleReactValidator from "simple-react-validator"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { getUsers, saveUsers } from "@/data/users"


interface CreateUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateUserDialog({ open, onOpenChange }: CreateUserDialogProps) {
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

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }))
  }

  const handleClose = () => {
    setFormData({ firstName: "", lastName: "", email: "", role: "User" })
    onOpenChange(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validator.current.allValid()) {
      const currentUsers = getUsers()
      const newId = String(Math.max(...currentUsers.map((u) => parseInt(u.id))) + 1)

      const newUser = {
        id: newId,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        role: formData.role as "Admin" | "User",
        status: "Active" as const,
        lastLogin: new Date().toLocaleString(),
        avatar: "/placeholder.svg",
      }

      const updatedUsers = [...currentUsers, newUser]
      saveUsers(updatedUsers)

      handleClose()
    } else {
      validator.current.showMessages()
      setForceUpdate(!forceUpdate)
    }
  }


  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>Add a new user to the RelaxFlow platform.</DialogDescription>
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
            <Button type="submit">Create User</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

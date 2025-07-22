export interface Owner {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  status: "active" | "inactive"
  locations: {
    id: string
    name: string
    deviceIds: string[]
  }[]
  createdAt: string
}

export const owners: Owner[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    status: "active",
    locations: [
      {
        id: "loc1",
        name: "Main Office",
        deviceIds: ["RFB-001", "HH-PRO-2024"],
      },
      {
        id: "loc2",
        name: "Home Studio",
        deviceIds: ["VM-2024"],
      },
    ],
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 987-6543",
    status: "active",
    locations: [
      {
        id: "loc3",
        name: "Wellness Center",
        deviceIds: ["RFB-001", "MC-SET-01"],
      },
    ],
    createdAt: "2024-01-12",
  },
  {
    id: "3",
    firstName: "Mike",
    lastName: "Chen",
    email: "mike.chen@email.com",
    phone: "+1 (555) 456-7890",
    status: "inactive",
    locations: [
      {
        id: "loc4",
        name: "Therapy Room",
        deviceIds: ["HH-PRO-2024"],
      },
    ],
    createdAt: "2024-01-10",
  }
]

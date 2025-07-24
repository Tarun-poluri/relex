export interface OwnerLocation {
  id: string;
  name: string;
  deviceIds: string[];
}

export interface Owner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  createdAt: string;
  locations: OwnerLocation[];
}
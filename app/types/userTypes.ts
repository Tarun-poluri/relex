export interface UserInterface {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "User";
  status: "Active" | "Inactive";
  lastLogin: string;
  avatar?: string;
}
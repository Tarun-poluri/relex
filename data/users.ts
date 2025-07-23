export interface UserInterface {
  id: string
  name: string
  email: string
  role: "Admin" | "User"
  status: "Active" | "Inactive"
  lastLogin: string
  avatar?: string
}

export const defaultUsers: UserInterface[] = []

export const getUsers = async (): Promise<UserInterface[]> => {
  try {
    const response = await fetch('/api/users');
    if (!response.ok) throw new Error('Failed to fetch users');
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    return defaultUsers;
  }
}

export const saveUsers = async (users: UserInterface[]): Promise<boolean> => {
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(users),
    });
    return response.ok;
  } catch (error) {
    console.error('Error saving users:', error);
    return false;
  }
}

export const updateUser = async (user: UserInterface): Promise<boolean> => {
  try {
    const response = await fetch('/api/users', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error updating user:', error);
    return false;
  }
}

export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/users', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
}
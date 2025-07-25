import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User';
  status: 'Active' | 'Inactive';
  lastLogin: string;
  avatar?: string;
}

async function readUsers(): Promise<User[]> {
  try {
    const fileContents = await fs.readFile(usersFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    await fs.writeFile(usersFilePath, JSON.stringify(defaultUsers, null, 2));
    return defaultUsers;
  }
}

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');

const defaultUsers: User[] = [];

export async function GET() {
  try {
    const fileContents = await fs.readFile(usersFilePath, 'utf8');
    return NextResponse.json(JSON.parse(fileContents) as User[]);
  } catch (error) {
    await fs.writeFile(usersFilePath, JSON.stringify(defaultUsers, null, 2));
    return NextResponse.json(defaultUsers);
  }
}

export async function POST(request: Request) {
  try {
    const users = await request.json() as User[];
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to save users' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const updatedUser: User = await request.json();
    const users = await readUsers();
    
    const userIndex = users.findIndex(user => user.id === updatedUser.id);
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    users[userIndex] = updatedUser;
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const users = await readUsers();
    
    const updatedUsers = users.filter(user => user.id !== id);
    await fs.writeFile(usersFilePath, JSON.stringify(updatedUsers, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
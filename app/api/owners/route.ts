import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import { Owner } from '@/app/types/ownerTypes';

const ownersFilePath = path.join(process.cwd(), 'data', 'owners.json');

async function readOwners(): Promise<Owner[]> {
  try {
    const fileContents = await fs.readFile(ownersFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    await fs.writeFile(ownersFilePath, JSON.stringify([], null, 2));
    return [];
  }
}

export async function GET() {
  try {
    const owners = await readOwners();
    return NextResponse.json(owners);
  } catch (error) {
    console.error('Failed to read owners:', error);
    return NextResponse.json(
      { message: 'Error reading owners data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const newOwnerData = await request.json();
    const owners = await readOwners();

    const newId = owners.length > 0 ? String(Math.max(...owners.map(o => parseInt(o.id))) + 1) : '1';

    const newOwner: Owner = {
      id: newId,
      ...newOwnerData,
      status: 'active',
      createdAt: new Date().toLocaleDateString('en-US'),
    };

    const updatedOwners = [newOwner, ...owners];

    await fs.writeFile(ownersFilePath, JSON.stringify(updatedOwners, null, 2));

    return NextResponse.json(newOwner, { status: 201 });
  } catch (error) {
    console.error('Failed to create owner:', error);
    return NextResponse.json(
      { message: 'Error creating owner' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const updatedOwner: Owner = await request.json();
    const owners = await readOwners();

    const ownerIndex = owners.findIndex(owner => owner.id === updatedOwner.id);

    if (ownerIndex === -1) {
      return NextResponse.json({ message: 'Owner not found' }, { status: 404 });
    }

    owners[ownerIndex] = updatedOwner;

    await fs.writeFile(ownersFilePath, JSON.stringify(owners, null, 2));

    return NextResponse.json(updatedOwner);
  } catch (error) {
    console.error('Failed to update owner:', error);
    return NextResponse.json(
      { message: 'Error updating owner' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
        return NextResponse.json({ message: 'Owner ID is required' }, { status: 400 });
    }
    
    const owners = await readOwners();

    const updatedOwners = owners.filter(owner => owner.id !== id);

    if (owners.length === updatedOwners.length) {
      return NextResponse.json({ message: 'Owner not found' }, { status: 404 });
    }

    await fs.writeFile(ownersFilePath, JSON.stringify(updatedOwners, null, 2));

    return NextResponse.json({ message: 'Owner deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete owner:', error);
    return NextResponse.json(
      { message: 'Error deleting owner' },
      { status: 500 }
    );
  }
}

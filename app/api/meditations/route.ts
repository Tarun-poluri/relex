import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import { MusicMeditation } from '@/app/types/meditationTypes';

const meditationsFilePath = path.join(process.cwd(), 'data', 'music-meditations.json');

async function readMeditations(): Promise<MusicMeditation[]> {
  try {
    const fileContents = await fs.readFile(meditationsFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    await fs.writeFile(meditationsFilePath, JSON.stringify([], null, 2));
    return [];
  }
}

async function saveMeditations(meditations: MusicMeditation[]): Promise<void> {
  try {
    await fs.writeFile(meditationsFilePath, JSON.stringify(meditations, null, 2));
  } catch (error) {
    console.error('Error saving meditations:', error);
    throw error;
  }
}

export async function GET() {
  try {
    const meditations = await readMeditations();
    return NextResponse.json(meditations);
  } catch (error) {
    console.error('Failed to read meditations:', error);
    return NextResponse.json(
      { message: 'Error reading meditations data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const newMeditationData = await request.json();
    const meditations = await readMeditations();

    const maxId = Math.max(0, ...meditations.map(m => parseInt(m.id)));
    const newId = String(maxId + 1);

    const newMeditation: MusicMeditation = {
      id: newId,
      ...newMeditationData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedMeditations = [newMeditation, ...meditations];
    await saveMeditations(updatedMeditations);

    return NextResponse.json(newMeditation, { status: 201 });
  } catch (error) {
    console.error('Failed to create meditation:', error);
    return NextResponse.json(
      { message: 'Error creating meditation' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const updatedMeditationData: MusicMeditation = await request.json();
    const meditations = await readMeditations();

    const meditationIndex = meditations.findIndex(meditation => meditation.id === updatedMeditationData.id);

    if (meditationIndex === -1) {
      return NextResponse.json({ message: 'Meditation not found' }, { status: 404 });
    }

    meditations[meditationIndex] = {
      ...updatedMeditationData,
      updatedAt: new Date().toISOString(), // Update timestamp on edit
    };

    await saveMeditations(meditations);

    return NextResponse.json(meditations[meditationIndex]);
  } catch (error) {
    console.error('Failed to update meditation:', error);
    return NextResponse.json(
      { message: 'Error updating meditation' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
        return NextResponse.json({ message: 'Meditation ID is required' }, { status: 400 });
    }
    
    const meditations = await readMeditations();

    const updatedMeditations = meditations.filter(meditation => meditation.id !== id);

    if (meditations.length === updatedMeditations.length) {
      return NextResponse.json({ message: 'Meditation not found' }, { status: 404 });
    }

    await saveMeditations(updatedMeditations);

    return NextResponse.json({ message: 'Meditation deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete meditation:', error);
    return NextResponse.json(
      { message: 'Error deleting meditation' },
      { status: 500 }
    );
  }
}

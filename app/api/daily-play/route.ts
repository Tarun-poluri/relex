import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import { DailyPlayRecord } from '@/app/types/dailyPlayTypes';

const dailyPlayFilePath = path.join(process.cwd(), 'data', 'daily-play.json');

async function readDailyPlayData(): Promise<DailyPlayRecord[]> {
  try {
    const fileContents = await fs.readFile(dailyPlayFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading daily play data file:', error);
    await fs.writeFile(dailyPlayFilePath, JSON.stringify([], null, 2)); // Create if not exists
    return [];
  }
}

async function saveDailyPlayData(data: DailyPlayRecord[]): Promise<void> {
  try {
    await fs.writeFile(dailyPlayFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving daily play data:', error);
    throw error;
  }
}

export async function GET() {
  try {
    const dailyPlayData = await readDailyPlayData();
    return NextResponse.json(dailyPlayData);
  } catch (error) {
    console.error('Failed to fetch daily play data:', error);
    return NextResponse.json(
      { message: 'Error fetching daily play data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { date, meditationId } = await request.json(); // Expecting date and meditationId
    if (!date) {
      return NextResponse.json({ message: 'Date is required' }, { status: 400 });
    }

    const dailyPlayData = await readDailyPlayData();
    const today = new Date(date);
    const todayString = today.toISOString().split('T')[0]; // Ensure consistent YYYY-MM-DD format

    let recordFound = false;
    const updatedDailyPlayData = dailyPlayData.map(record => {
      if (record.date === todayString) {
        recordFound = true;
        return { ...record, plays: record.plays + 1 }; // Increment plays for today
      }
      return record;
    });

    if (!recordFound) {
      // If no record for today, create a new one
      updatedDailyPlayData.push({ date: todayString, plays: 1 });
    }

    await saveDailyPlayData(updatedDailyPlayData);

    // Return the updated record for the day
    const responseRecord = updatedDailyPlayData.find(record => record.date === todayString);
    return NextResponse.json(responseRecord);

  } catch (error) {
    console.error('Failed to update daily play data:', error);
    return NextResponse.json(
      { message: 'Error updating daily play data' },
      { status: 500 }
    );
  }
}

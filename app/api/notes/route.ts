import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const NOTES_FILE = path.join(process.cwd(), 'notes.txt');
const SEPARATOR = '\n---NOTE_SEPARATOR---\n';

export async function GET() {
  try {
    if (!fs.existsSync(NOTES_FILE)) {
      return NextResponse.json({ notes: [] });
    }
    const data = fs.readFileSync(NOTES_FILE, 'utf8');
    const notes = data.split(SEPARATOR).filter(note => note.trim() !== '');
    return NextResponse.json({ notes });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read notes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { note } = await request.json();
    
    if (!note || typeof note !== 'string') {
      return NextResponse.json({ error: 'Invalid note data' }, { status: 400 });
    }

    const noteEntry = note.trim() + SEPARATOR;
    
    // Append to file
    fs.appendFileSync(NOTES_FILE, noteEntry);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save note' }, { status: 500 });
  }
}

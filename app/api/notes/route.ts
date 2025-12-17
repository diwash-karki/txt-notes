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

export async function DELETE(request: Request) {
  try {
    const { index } = await request.json();

    if (typeof index !== 'number') {
      return NextResponse.json({ error: 'Invalid index' }, { status: 400 });
    }

    if (!fs.existsSync(NOTES_FILE)) {
      return NextResponse.json({ error: 'Notes file not found' }, { status: 404 });
    }

    const data = fs.readFileSync(NOTES_FILE, 'utf8');
    const notes = data.split(SEPARATOR).filter(note => note.trim() !== '');

    if (index < 0 || index >= notes.length) {
      return NextResponse.json({ error: 'Index out of bounds' }, { status: 400 });
    }

    notes.splice(index, 1);
    
    // Reconstruct file content
    const newContent = notes.length > 0 ? notes.join(SEPARATOR) + SEPARATOR : '';
    fs.writeFileSync(NOTES_FILE, newContent);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}

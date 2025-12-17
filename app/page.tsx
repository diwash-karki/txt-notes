'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [notes, setNotes] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/notes');
      const data = await res.json();
      if (data.notes) {
        setNotes(data.notes);
      }
    } catch (error) {
      console.error('Failed to fetch notes', error);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: input }),
      });

      if (res.ok) {
        setInput('');
        fetchNotes(); // Refresh list
      }
    } catch (error) {
      console.error('Failed to save note', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (index: number) => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        const res = await fetch('/api/notes', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ index }),
        });

        if (res.ok) {
          fetchNotes();
        }
      } catch (error) {
        console.error('Failed to delete note', error);
      }
    }
  };

  return (
    <main className="container">
      <h1>Antigravity Notes</h1>

      <div className="input-area">
        <textarea
          placeholder="Write your thought here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !input.trim()}
        >
          {loading ? 'Saving...' : 'Add Note'}
        </button>
      </div>

      <div className="notes-grid">
        {fetching ? (
          <p style={{ textAlign: 'center', gridColumn: '1/-1', opacity: 0.7 }}>Loading thoughts...</p>
        ) : notes.length === 0 ? (
          <div style={{ textAlign: 'center', gridColumn: '1/-1', opacity: 0.5 }}>
            <p>No notes yet. Start writing!</p>
          </div>
        ) : (
          notes.map((note, index) => (
            <div key={index} className="note-card" style={{ animationDelay: `${index * 0.05}s` }}>
              <button
                className="delete-btn"
                onClick={() => handleDelete(index)}
                aria-label="Delete note"
              >
                ×
              </button>
              <div className="note-content">{note}</div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

// storage.ts
import {
  notesStore,
  setNotesStore,
  STORAGE_KEY_NOTES,
  bookmarks,
  setBookmarks,
} from '../state/state.js';

const STORAGE_KEY_BOOKMARKS = 'mystery_road_bookmarks';

// --- BOOKMARKS STORAGE ---
export function saveBookmarksToStorage(): void {
  localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarks));
}

export function loadBookmarksFromStorage(): void {
  var raw = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
  if (raw) {
    try {
      setBookmarks(JSON.parse(raw) as string[]);
    } catch (e) {
      setBookmarks([]);
    }
  } else {
    setBookmarks([]);
  }
}

// --- NOTES STORAGE ---
export function saveNoteForEvidence(evidenceId: string, text: string): void {
  var updatedNotes = Object.assign({}, notesStore);
  updatedNotes[evidenceId] = text;
  setNotesStore(updatedNotes);
  localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(updatedNotes));
}

export function loadNoteForEvidence(evidenceId: string): string {
  return notesStore[evidenceId] || '';
}

export function loadNotesFromStorage(): void {
  var raw = localStorage.getItem(STORAGE_KEY_NOTES);
  if (!raw) {
    setNotesStore({});
    return;
  }
  try {
    setNotesStore(JSON.parse(raw) as Record<string, string>);
  } catch (e) {
    setNotesStore({});
  }
}

export function loadNoteAsync(evidenceId: string): Promise<string> {
  return new Promise<string>(function (resolve) {
    resolve(notesStore[evidenceId] || '');
  });
}

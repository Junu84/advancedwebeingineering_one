// storage.js
import { 
  notesStore, 
  setNotesStore, 
  STORAGE_KEY_NOTES, 
  bookmarks, 
  setBookmarks 
} from '../state/state.js';

const STORAGE_KEY_BOOKMARKS = "mystery_road_bookmarks";

// --- BOOKMARKS STORAGE ---
export function saveBookmarksToStorage() {
  localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarks));
}

export function loadBookmarksFromStorage() {
  var raw = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
  if (raw) {
    try {
      setBookmarks(JSON.parse(raw));
    } catch (e) {
      setBookmarks([]);
    }
  } else {
    setBookmarks([]);
  }
}

// --- NOTES STORAGE ---
export function saveNoteForEvidence(evidenceId, text) {
  var updatedNotes = Object.assign({}, notesStore);
  updatedNotes[evidenceId] = text;
  setNotesStore(updatedNotes);
  localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(updatedNotes));
}

export function loadNoteForEvidence(evidenceId) {
  return notesStore[evidenceId] || "";
}

export function loadNotesFromStorage() {
  var raw = localStorage.getItem(STORAGE_KEY_NOTES);
  if (!raw) {
    setNotesStore({});
    return;
  }
  try {
    setNotesStore(JSON.parse(raw));
  } catch (e) {
    setNotesStore({});
  }
}

export function loadNoteAsync(evidenceId) {
  return new Promise(function (resolve) {
    resolve(notesStore[evidenceId] || "");
  });
}
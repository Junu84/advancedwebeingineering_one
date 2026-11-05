
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';

import {
  loadReactBookmarks,
  saveReactBookmarks,
} from '../../storage/storage';

import { saveBookmarksToStorage } from '../../storage/storage';

type BookmarksContextValue = {
  bookmarks: string[];
  toggleBookmark: (id: string) => void;
};

const BookmarksContext =
  createContext<BookmarksContextValue | undefined>(undefined);

export function BookmarksProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [bookmarks, setBookmarks] = useState<string[]>(
    () => loadReactBookmarks()
  );

  function toggleBookmark(id: string) {
    const updatedBookmarks = bookmarks.includes(id)
      ? bookmarks.filter((bookmarkId) => bookmarkId !== id)
      : [...bookmarks, id];
    // Update Context state
    setBookmarks(updatedBookmarks);

    // persist the same updated array
    saveReactBookmarks(updatedBookmarks);
  }

  return (
    <BookmarksContext.Provider
      value={{ bookmarks, toggleBookmark }}
    >
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarksContext);

  if (!context) {
    throw new Error(
      'useBookmarks must be used inside BookmarksProvider'
    );
  }

  return context;
}

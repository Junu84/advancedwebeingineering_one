import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { loadReactData } from '../data/data.ts';
import { allEvidence } from '../state/state.ts';

import App from './App';
import { BookmarksProvider } from './context/BookmarksContext';

async function initReactApp() {
  try {
    // Load application data before rendering React
    await loadReactData();

    console.log('Loaded evidence count:', allEvidence.length);

    // Find the root container for React
    const rootElement = document.getElementById('react-root');

    if (!rootElement) {
      throw new Error('React root element not found');
    }

    // React owns all UI rendering inside this root
    createRoot(rootElement).render(
      <BookmarksProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </BookmarksProvider>,
    );
  } catch (error) {
    console.error('Failed to initialize React:', error);
  }
}

void initReactApp();

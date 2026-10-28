
import { createRoot } from 'react-dom/client';
import { loadReactData } from '../data/data.ts';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

async function initReactApp() {
  try {
    // Load all data before rendering React
    await loadReactData();

    const rootElement = document.getElementById('react-root');

    if (!rootElement) {
      throw new Error('React root element not found');
    }

    createRoot(rootElement).render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );

  } catch (error) {
    console.error('Failed to initialize React:', error);
  }
}

void initReactApp();

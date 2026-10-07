import { useEffect, useState } from 'react';
import Dashboard from './Dashboard';

type ViewId = 'dashboard' | 'evidence' | 'people' | 'timeline' | 'workspace';

const VALID_VIEWS: ViewId[] = [
  'dashboard',
  'evidence',
  'people',
  'timeline',
  'workspace',
];

function getViewFromHash(): ViewId {
  const hash = window.location.hash.replace('#', '');

  return VALID_VIEWS.includes(hash as ViewId)
    ? (hash as ViewId)
    : 'dashboard';
}

export default function App() {
  const [currentView, setCurrentView] = useState<ViewId>(getViewFromHash());

  useEffect(() => {
    function handleHashChange() {
      setCurrentView(getViewFromHash());
    }

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  function navigateTo(view: ViewId) {
    window.location.hash = view;
  }

  return (
    <>
      <header>
        <h1>Project ReMotion</h1>
      </header>

      <nav>
        <button onClick={() => navigateTo('dashboard')}>Dashboard</button>
        <button onClick={() => navigateTo('evidence')}>Evidence</button>
        <button onClick={() => navigateTo('people')}>People</button>
        <button onClick={() => navigateTo('timeline')}>Timeline</button>
        <button onClick={() => navigateTo('workspace')}>Workspace</button>
      </nav>

      <main>
        {currentView === 'dashboard' && <h2>Dashboard</h2>}
        {currentView === 'evidence' && <h2>Evidence</h2>}
        {currentView === 'people' && <h2>People</h2>}
        {currentView === 'timeline' && <h2>Timeline</h2>}
        {currentView === 'workspace' && <h2>Workspace</h2>}
      </main>
    </>
  );
}
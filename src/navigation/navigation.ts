// navigation.ts
import {
  type ViewId,
  viewRendered,
  setCurrentPage,
  currentPeopleTab,
} from '../state/state.ts';
import { renderDashboard } from '../views/dashboard.ts';
import { renderEvidenceList } from '../views/evidence.ts';
import { renderPeopleView } from '../views/people.ts';
import { renderTimeline } from '../views/timeline.ts';
import { renderWorkspace } from '../views/workspace.ts';

const VALID_VIEWS = new Set([
  'dashboard',
  'evidence',
  'people',
  'timeline',
  'workspace',
]);

function isViewId(value: string): value is ViewId {
  return VALID_VIEWS.has(value);
}

export function handleHashChange(): void {
  const rawHash = window.location.hash.replace('#', '');
  const hash = isViewId(rawHash) ? rawHash : 'dashboard';

  // Update current page in global state
  setCurrentPage(hash);

  // Toggle active view container
  document.querySelectorAll('.view').forEach((section) => {
    section.classList.toggle('active', section.id === `view-${hash}`);
  });

  // Toggle active navigation button
  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-view') === hash);
  });

  // Render view lazy/on-demand based on flags
  if (hash === 'dashboard' && !viewRendered.dashboard) {
    renderDashboard();
    viewRendered.dashboard = true;
  } else if (hash === 'evidence' && !viewRendered.evidence) {
    renderEvidenceList();
    viewRendered.evidence = true;
  } else if (hash === 'people') {
    // Delegates to renderPeopleView() which respects currentPeopleTab ("people" vs "locations")
    renderPeopleView();
    viewRendered.people = true;
  } else if (hash === 'timeline' && !viewRendered.timeline) {
    renderTimeline();
    viewRendered.timeline = true;
  } else if (hash === 'workspace') {
    renderWorkspace();
  }
}

export function navigateTo(viewId: string): void {
  window.location.hash = viewId;
}

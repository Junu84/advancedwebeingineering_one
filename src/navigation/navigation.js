// navigation.js
import {
  viewRendered,
  setCurrentPage,
  currentPeopleTab,
} from '../state/state.js';
import { renderDashboard } from '../views/dashboard.js';
import { renderEvidenceList } from '../views/evidence.js';
import { renderPeopleView } from '../views/people.js';
import { renderTimeline } from '../views/timeline.js';
import { renderWorkspace } from '../views/workspace.js';

const VALID_VIEWS = new Set([
  'dashboard',
  'evidence',
  'people',
  'timeline',
  'workspace',
]);

export function handleHashChange() {
  const rawHash = window.location.hash.replace('#', '');
  const hash = VALID_VIEWS.has(rawHash) ? rawHash : 'dashboard';

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

export function navigateTo(viewId) {
  window.location.hash = viewId;
}

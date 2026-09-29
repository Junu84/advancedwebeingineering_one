// app.js

// 1. Module Imports
import { loadAllData } from './data/data.js';
import { handleHashChange, navigateTo } from './navigation/navigation.js';
import {
  renderEvidenceList,
  handleSearchInput,
  clearFilters,
  handleSortChange,
} from './views/evidence.js';
import { renderTimeline } from './views/timeline.js';
import {
  loadBookmarksFromStorage,
  loadNotesFromStorage,
  loadNoteAsync,
} from './storage/storage.js';
import { switchPeopleTab, renderPeopleView } from './views/people.js';

// Expose functions to window for global inline event handlers
Object.assign(window, {
  navigateTo,
  switchPeopleTab,
});

// Helper function to safely attach event listeners
function bindEvent(elementId, eventType, handler) {
  const element = document.getElementById(elementId);
  if (element) {
    element.addEventListener(eventType, handler);
  }
}

// ---------------------------------------------------------------------
// EVENT LISTENER SETUP
// ---------------------------------------------------------------------
function setupEventListeners() {
  // Navigation & Hash Routing
  window.addEventListener('hashchange', handleHashChange);

  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const targetView = e.currentTarget.getAttribute('data-view');
      if (targetView) {
        window.location.hash = targetView;
      }
    });
  });

  // Evidence Filter & Search Listeners
  bindEvent('evidenceSearch', 'input', handleSearchInput);
  bindEvent('filterType', 'change', renderEvidenceList);
  bindEvent('filterPerson', 'change', renderEvidenceList);
  bindEvent('filterLocation', 'change', renderEvidenceList);
  bindEvent('filterStatus', 'change', renderEvidenceList);
  bindEvent('filterRelevance', 'change', renderEvidenceList);
  bindEvent('clearFiltersBtn', 'click', clearFilters);
  bindEvent('sortEvidence', 'change', handleSortChange);

  // Timeline Filter Listeners
  bindEvent('timelineOrder', 'change', renderTimeline);
  bindEvent('timelinePersonFilter', 'change', renderTimeline);
  bindEvent('timelineLocationFilter', 'change', renderTimeline);
  bindEvent('timelineTypeFilter', 'change', renderTimeline);

  // Workspace / Hypothesis Controls
  bindEvent('hypConfidence', 'input', (e) => {
    const display = document.getElementById('hypConfidenceValue');
    if (display) display.textContent = e.target.value;
  });
}

// ---------------------------------------------------------------------
// INIT
// ---------------------------------------------------------------------
async function initApp() {
  loadBookmarksFromStorage();
  loadNotesFromStorage();
  setupEventListeners();

  await loadAllData();

  handleHashChange();
  renderEvidenceList(); // Force re-render after async data load completes
  renderPeopleView(); // Force re-render of people/locations after async data load completes

  try {
    const firstNote = await loadNoteAsync('E01');
    console.log('First note preview:', firstNote);
  } catch (err) {
    console.error('Failed to preview initial note:', err);
  }
}

// Application Lifecycle Bootstrap
window.addEventListener('DOMContentLoaded', initApp);

// data.ts
import type {
  CaseMetadata,
  Evidence,
  Location,
  Person,
  RawEvidence,
  TimelineEvent,
} from './types.ts';
import {
  allPeople,
  loadingStepsRemaining,
  currentPage,
  setCaseData,
  setAllPeople,
  setAllLocations,
  setAllEvidence,
  setFilteredEvidence,
  setAllTimeline,
  setLoadingStepsRemaining,
  setEvidenceViewLoading,
} from '../state/state.js';

import { renderDashboard } from '../views/dashboard.js';
import {
  renderEvidenceList,
  populateEvidenceFilterDropdowns,
  applyStoredBookmarkFlags,
} from '../views/evidence.js';
import {
  renderTimeline,
  populateTimelineDropdowns,
} from '../views/timeline.js';
import { renderPeopleView } from '../views/people.js';

export function showLoadingOverlay(msg: string): void {
  const overlay = document.getElementById('loadingOverlay');
  const text = document.getElementById('loadingText');
  if (text) text.textContent = msg;
  if (overlay) overlay.classList.remove('hidden');
}

export function hideLoadingStep(): void {
  const steps = loadingStepsRemaining - 1;
  setLoadingStepsRemaining(steps);
  if (steps <= 0) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.classList.add('hidden');
  }
}

function populateAllDropdowns(): void {
  populateEvidenceFilterDropdowns();
  populateTimelineDropdowns();
}

export async function loadCorePeopleAndLocations(): Promise<void> {
  try {
    const caseRes = await fetch('./data/case.json');
    const caseJson: CaseMetadata = await caseRes.json();
    setCaseData(caseJson);

    const peopleRes = await fetch('./data/people.json');
    const peopleJson: Person[] = await peopleRes.json();
    setAllPeople(peopleJson);

    const locationsRes = await fetch('./data/locations.json');
    const locationsJson: Location[] = await locationsRes.json();
    setAllLocations(locationsJson);

    hideLoadingStep();
    renderDashboard();
    populateAllDropdowns();

    if (currentPage === 'people') {
      renderPeopleView();
    }
  } catch (err) {
    console.error('Failed to load core people or locations:', err);
    hideLoadingStep();
  }
}

export async function loadEvidenceData(): Promise<void> {
  try {
    const res = await fetch('./data/evidence.json');
    const rawData: RawEvidence[] = await res.json();
    const data: Evidence[] = rawData.map((evidence) => ({
      ...evidence,
      personIds: evidence.personIds.map((reference) => {
        const person = allPeople.find(
          (person) => person.id === reference || person.name === reference,
        );
        if (!person) throw new Error(`Unknown person reference: ${reference}`);
        return person.id;
      }),
    }));

    setAllEvidence(data);
    applyStoredBookmarkFlags();
    setFilteredEvidence(data);
    setEvidenceViewLoading(false);
    renderDashboard();
    populateAllDropdowns();

    if (currentPage === 'evidence') {
      renderEvidenceList();
    }
  } catch (err) {
    console.error('Failed to load evidence.json', err);
    alert('Evidence could not be loaded. Some views may be incomplete.');
    setEvidenceViewLoading(false);
  }
}

export async function loadTimelineData(): Promise<void> {
  try {
    const res = await fetch('./data/timeline.json');
    const data: TimelineEvent[] = await res.json();

    setAllTimeline(data);
    renderDashboard();
    populateAllDropdowns();

    if (currentPage === 'timeline') {
      renderTimeline();
    }
  } catch (err) {
    console.log('timeline load error', err);
  } finally {
    hideLoadingStep();
  }
}

export async function loadAllData(): Promise<void> {
  showLoadingOverlay('Loading case file…');
  setLoadingStepsRemaining(2);

  await loadCorePeopleAndLocations();
  await Promise.all([loadEvidenceData(), loadTimelineData()]);
}


import type {
  CaseMetadata,
  Evidence,
  Location,
  Person,
  RawEvidence,
  TimelineEvent,
} from './types.ts';

import {
  allEvidence,
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
} from '../state/state.ts';

import { renderDashboard } from '../views/dashboard.ts';

import {
  renderEvidenceList,
  populateEvidenceFilterDropdowns,
  applyStoredBookmarkFlags,
} from '../views/evidence.ts';

import {
  renderTimeline,
  populateTimelineDropdowns,
} from '../views/timeline.ts';

import { renderPeopleView } from '../views/people.ts';

// -----------------------------------------------------
// LOADING OVERLAY — VANILLA
// -----------------------------------------------------

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

// -----------------------------------------------------
// VANILLA — CORE DATA
// -----------------------------------------------------

export async function loadCorePeopleAndLocations(): Promise<void> {
  try {
    const caseRes = await fetch('./data/case.json');
    const caseJson: CaseMetadata = await caseRes.json();
    setCaseData(caseJson);

    const peopleRes = await fetch('./data/people.json');
    const peopleJson: Person[] = await peopleRes.json();
    setAllPeople(peopleJson);

    console.log('People loaded from JSON:', peopleJson.length);

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

// -----------------------------------------------------
// VANILLA — EVIDENCE DATA
// -----------------------------------------------------

export async function loadEvidenceData(): Promise<void> {
  try {
    const res = await fetch('./data/evidence.json');
    const rawData: RawEvidence[] = await res.json();

    const data: Evidence[] = rawData.map((evidence) => ({
      ...evidence,
      personIds: evidence.personIds.map((reference) => {
        const person = allPeople.find(
          (p) => p.id === reference || p.name === reference,
        );

        if (!person) {
          throw new Error(`Unknown person reference: ${reference}`);
        }

        return person.id;
      }),
    }));

    // Update shared application state
    setAllEvidence(data);

    console.log('Vanilla parsed evidence:', data.length);
    console.log('Shared evidence after setter:', allEvidence.length);

    applyStoredBookmarkFlags();
    setFilteredEvidence(data);
    setEvidenceViewLoading(false);

    // Preserve existing vanilla rendering
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

// -----------------------------------------------------
// VANILLA — TIMELINE DATA
// -----------------------------------------------------

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

// -----------------------------------------------------
// VANILLA — LOAD ALL DATA
// -----------------------------------------------------

export async function loadAllData(): Promise<void> {
  showLoadingOverlay('Loading case file…');
  setLoadingStepsRemaining(2);

  await loadCorePeopleAndLocations();
  await Promise.all([loadEvidenceData(), loadTimelineData()]);
}

// -----------------------------------------------------
// REACT — DATA LOADING
// -----------------------------------------------------

export async function loadReactData(): Promise<void> {
  // Case metadata
  const caseRes = await fetch('/data/case.json');

  if (!caseRes.ok) {
    throw new Error('Failed to load case.json');
  }

  const caseJson: CaseMetadata = await caseRes.json();
  setCaseData(caseJson);

  // People
  const peopleRes = await fetch('/data/people.json');

  if (!peopleRes.ok) {
    throw new Error('Failed to load people.json');
  }

  const peopleJson: Person[] = await peopleRes.json();
  setAllPeople(peopleJson);

  console.log('People loaded from JSON:', peopleJson.length);

  // Locations
  const locationsRes = await fetch('/data/locations.json');

  if (!locationsRes.ok) {
    throw new Error('Failed to load locations.json');
  }

  const locationsJson: Location[] = await locationsRes.json();
  setAllLocations(locationsJson);

  // Evidence
  const evidenceRes = await fetch('/data/evidence.json');

  if (!evidenceRes.ok) {
    throw new Error('Failed to load evidence.json');
  }

  const rawEvidence: RawEvidence[] = await evidenceRes.json();

  const evidence: Evidence[] = rawEvidence.map((item) => ({
    ...item,
    personIds: item.personIds.map((reference) => {
      const person = peopleJson.find(
        (p) => p.id === reference || p.name === reference,
      );

      if (!person) {
        throw new Error(`Unknown person reference: ${reference}`);
      }

      return person.id;
    }),
  }));

  setAllEvidence(evidence);
  console.log('React parsed evidence:', evidence.length);
  console.log('React shared evidence:', allEvidence.length);  
  setFilteredEvidence(evidence);

  console.log('React parsed evidence:', evidence.length);
  console.log('React shared evidence:', allEvidence.length);

  // Timeline
  const timelineRes = await fetch('/data/timeline.json');

  if (!timelineRes.ok) {
    throw new Error('Failed to load timeline.json');
  }

  const timelineJson: TimelineEvent[] = await timelineRes.json();
  setAllTimeline(timelineJson);
}

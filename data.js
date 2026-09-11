// data.js
import { 
  loadingStepsRemaining, 
  currentPage,
  setCaseData, 
  setAllPeople, 
  setAllLocations, 
  setAllEvidence, 
  setFilteredEvidence, 
  setAllTimeline, 
  setLoadingStepsRemaining,
  setEvidenceViewLoading
} from './state.js';

import { renderDashboard } from './dashboard.js';
import { renderEvidenceList, populateEvidenceFilterDropdowns, applyStoredBookmarkFlags } from './evidence.js';
import { renderTimeline, populateTimelineDropdowns } from './timeline.js';
import { renderPeopleView } from './people.js';

export function showLoadingOverlay(msg) {
  const overlay = document.getElementById("loadingOverlay");
  const text = document.getElementById("loadingText");
  if (text) text.textContent = msg;
  if (overlay) overlay.classList.remove("hidden");
}

export function hideLoadingStep() {
  const steps = loadingStepsRemaining - 1;
  setLoadingStepsRemaining(steps);
  if (steps <= 0) {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) overlay.classList.add("hidden");
  }
}

function populateAllDropdowns() {
  populateEvidenceFilterDropdowns();
  populateTimelineDropdowns();
}

export async function loadCorePeopleAndLocations() {
  try {
    const caseRes = await fetch("./data/case.json");
    const caseJson = await caseRes.json();
    setCaseData(caseJson);

    const peopleRes = await fetch("./data/people.json");
    const peopleJson = await peopleRes.json();
    setAllPeople(peopleJson);

    const locationsRes = await fetch("./data/locations.json");
    const locationsJson = await locationsRes.json();
    setAllLocations(locationsJson);

    hideLoadingStep();
    renderDashboard();
    populateAllDropdowns();

    if (currentPage === "people") {
      renderPeopleView();
    }
  } catch (err) {
    console.error("Failed to load core people or locations:", err);
    hideLoadingStep();
  }
}

export async function loadEvidenceData() {
  try {
    const res = await fetch("./data/evidence.json");
    const data = await res.json();
    
    setAllEvidence(data);
    applyStoredBookmarkFlags();
    setFilteredEvidence(data);
    setEvidenceViewLoading(false);
    renderDashboard();
    populateAllDropdowns();

    if (currentPage === "evidence") {
      renderEvidenceList();
    }
  } catch (err) {
    console.error("Failed to load evidence.json", err);
    alert("Evidence could not be loaded. Some views may be incomplete.");
    setEvidenceViewLoading(false);
  }
}

export async function loadTimelineData() {
  try {
    const res = await fetch("./data/timeline.json");
    const data = await res.json();

    setAllTimeline(data);
    renderDashboard();
    populateAllDropdowns();

    if (currentPage === "timeline") {
      renderTimeline();
    }
  } catch (err) {
    console.log("timeline load error", err);
  } finally {
    hideLoadingStep();
  }
}

export async function loadAllData() {
  showLoadingOverlay("Loading case file…");
  setLoadingStepsRemaining(2);

  await loadCorePeopleAndLocations();
  await Promise.all([
    loadEvidenceData(),
    loadTimelineData()
  ]);
}
// state.js

// ---------------------------------------------------------------------
// GLOBAL DATA STORES
// ---------------------------------------------------------------------
export let allEvidence = [];
export let filteredEvidence = [];
export let selectedEvidence = null;
export let bookmarks = [];
export let currentPage = 'dashboard';

export let allPeople = [];
export let allLocations = [];
export let allTimeline = [];
export let caseData = {};

export let currentPeopleTab = 'people';
export let loadingStepsRemaining = 2;
export let evidenceViewLoading = true;

export const viewRendered = {
  dashboard: false,
  evidence: false,
  people: false,
  timeline: false,
  workspace: false,
};

export let notesStore = {};
export let modalCloseListenerCount = 0;

// ---------------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------------
export const STORAGE_KEY_BOOKMARKS = 'remotion_bookmarks';
export const STORAGE_KEY_NOTES = 'remotion_notes';
export const STORAGE_KEY_HYPOTHESIS = 'remotion_hypothesis';

// ---------------------------------------------------------------------
// STATE SETTERS & MUTATORS
// ---------------------------------------------------------------------
export function setAllEvidence(data) {
  allEvidence = data;
}
export function setFilteredEvidence(data) {
  filteredEvidence = data;
}
export function setSelectedEvidence(data) {
  selectedEvidence = data;
}
export function setBookmarks(data) {
  bookmarks = data;
}
export function setAllPeople(data) {
  allPeople = data;
}
export function setAllLocations(data) {
  allLocations = data;
}
export function setAllTimeline(data) {
  allTimeline = data;
}
export function setCaseData(data) {
  caseData = data;
}
export function setNotesStore(data) {
  notesStore = data;
}
export function setCurrentPage(page) {
  currentPage = page;
}
export function setCurrentPeopleTab(tab) {
  currentPeopleTab = tab;
}
export function setLoadingStepsRemaining(count) {
  loadingStepsRemaining = count;
}
export function setEvidenceViewLoading(loading) {
  evidenceViewLoading = loading;
}
export function setModalCloseListenerCount(count) {
  modalCloseListenerCount = count;
}
export function setViewRendered(view, status) {
  viewRendered[view] = status;
}

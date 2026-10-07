// state.js

// ---------------------------------------------------------------------
// GLOBAL DATA STORES
// ---------------------------------------------------------------------
/** @type {import('../data/types.ts').Evidence[]} */
export let allEvidence = [];
/** @type {import('../data/types.ts').Evidence[]} */
export let filteredEvidence = [];
/** @type {import('../data/types.ts').Evidence | null} */
export let selectedEvidence = null;
/** @type {string[]} */
export let bookmarks = [];
export let currentPage = 'dashboard';

/** @type {import('../data/types.ts').Person[]} */
export let allPeople = [];
/** @type {import('../data/types.ts').Location[]} */
export let allLocations = [];
/** @type {import('../data/types.ts').TimelineEvent[]} */
export let allTimeline = [];
/** @type {Partial<import('../data/types.ts').CaseMetadata>} */
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

/** @type {Record<string, string>} */
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
/** @param {import('../data/types.ts').Evidence[]} data */
export function setAllEvidence(data) {
  allEvidence = data;
}
/** @param {import('../data/types.ts').Evidence[]} data */
export function setFilteredEvidence(data) {
  filteredEvidence = data;
}
/** @param {import('../data/types.ts').Evidence | null} data */
export function setSelectedEvidence(data) {
  selectedEvidence = data;
}
/** @param {string[]} data */
export function setBookmarks(data) {
  bookmarks = data;
}
/** @param {import('../data/types.ts').Person[]} data */
export function setAllPeople(data) {
  allPeople = data;
}
/** @param {import('../data/types.ts').Location[]} data */
export function setAllLocations(data) {
  allLocations = data;
}
/** @param {import('../data/types.ts').TimelineEvent[]} data */
export function setAllTimeline(data) {
  allTimeline = data;
}
/** @param {import('../data/types.ts').CaseMetadata} data */
export function setCaseData(data) {
  caseData = data;
}
/** @param {Record<string, string>} data */
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

import type {
  CaseMetadata,
  Evidence,
  Person,
  Location,
  TimelineEvent,
} from '../data/types.ts';

export type ViewId =
  'dashboard' | 'evidence' | 'people' | 'timeline' | 'workspace';
export type PeopleTab = 'people' | 'locations';

// state.ts

// ---------------------------------------------------------------------
// GLOBAL DATA STORES
// ---------------------------------------------------------------------
export let allEvidence: Evidence[] = [];
export let filteredEvidence: Evidence[] = [];
export let selectedEvidence: Evidence | null = null;
export let bookmarks: string[] = [];
export let currentPage: ViewId = "dashboard";

export let allPeople: Person[] = [];
export let allLocations: Location[] = [];
export let allTimeline: TimelineEvent[] = [];
export let caseData: Partial<CaseMetadata> = {};

export let currentPeopleTab: PeopleTab = 'people';
export let loadingStepsRemaining = 2;
export let evidenceViewLoading = true;

export const viewRendered = {
  dashboard: false,
  evidence: false,
  people: false,
  timeline: false,
  workspace: false,
};

export let notesStore: Record<string, string> = {};
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
export function setAllEvidence(data: Evidence[]): void {
  allEvidence = data;
}
export function setFilteredEvidence(data: Evidence[]): void {
  filteredEvidence = data;
}
export function setSelectedEvidence(data: Evidence | null): void {
  selectedEvidence = data;
}
export function setBookmarks(data: string[]): void {
  bookmarks = data;
}
export function setAllPeople(data: Person[]): void {
  allPeople = data;
}
export function setAllLocations(data: Location[]): void {
  allLocations = data;
}
export function setAllTimeline(data: TimelineEvent[]): void {
  allTimeline = data;
}
export function setCaseData(data: CaseMetadata): void {
  caseData = data;
}
export function setNotesStore(data: Record<string, string>): void {
  notesStore = data;
}
export function setCurrentPage(page: ViewId): void {
  currentPage = page;
}
export function setCurrentPeopleTab(tab: PeopleTab): void {
  currentPeopleTab = tab;
}
export function setLoadingStepsRemaining(count: number): void {
  loadingStepsRemaining = count;
}
export function setEvidenceViewLoading(loading: boolean): void {
  evidenceViewLoading = loading;
}
export function setModalCloseListenerCount(count: number): void {
  modalCloseListenerCount = count;
}
export function setViewRendered(view: ViewId, status: boolean): void {
  viewRendered[view] = status;
}

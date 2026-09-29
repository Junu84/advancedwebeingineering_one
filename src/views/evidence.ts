import type { Evidence } from '../data/types.ts';
// evidence.ts
import {
  allEvidence,
  filteredEvidence,
  setFilteredEvidence,
  bookmarks,
  setBookmarks,
  currentPage,
  allPeople,
  allLocations,
  evidenceViewLoading,
} from '../state/state.ts';

import {
  findEvidenceById,
  findPersonById,
  findLocationById,
  formatDate,
  evidenceMentionsPerson,
  getStatusBadgeClass,
  getRelevanceBadgeClass,
} from '../utils/utils.ts';

import {
  saveBookmarksToStorage,
  saveNoteForEvidence,
  loadNoteForEvidence,
} from '../storage/storage.ts';

import { populateTimelineDropdowns } from './timeline.ts';

// ---------------------------------------------------------------------
// DROPDOWN & FILTER MANAGEMENT
// ---------------------------------------------------------------------
export function populateAllDropdowns() {
  populateEvidenceDropdowns();
  populateTimelineDropdowns();
}

export function populateEvidenceDropdowns() {
  var typeSelect = document.querySelector<HTMLSelectElement>('#filterType');
  var personSelect = document.querySelector<HTMLSelectElement>('#filterPerson');
  var locationSelect =
    document.querySelector<HTMLSelectElement>('#filterLocation');
  if (!typeSelect || !personSelect || !locationSelect) return;

  var types = [];
  for (var i = 0; i < allEvidence.length; i++) {
    var t = allEvidence[i].type.toLowerCase();
    if (types.indexOf(t) === -1) types.push(t);
  }
  typeSelect.innerHTML = '<option value="">All types</option>';
  for (var ti = 0; ti < types.length; ti++) {
    typeSelect.innerHTML +=
      '<option value="' + types[ti] + '">' + types[ti] + '</option>';
  }

  personSelect.innerHTML = '<option value="">All people</option>';
  for (var p = 0; p < allPeople.length; p++) {
    personSelect.innerHTML +=
      '<option value="' +
      allPeople[p].id +
      '">' +
      allPeople[p].name +
      '</option>';
  }

  locationSelect.innerHTML = '<option value="">All locations</option>';
  for (var l = 0; l < allLocations.length; l++) {
    locationSelect.innerHTML +=
      '<option value="' +
      allLocations[l].id +
      '">' +
      allLocations[l].id +
      ' - ' +
      allLocations[l].name +
      '</option>';
  }
}

function getFilteredEvidence() {
  var searchBox = document.querySelector<HTMLInputElement>('#evidenceSearch');
  var searchTerm = searchBox ? searchBox.value.toLowerCase().trim() : '';

  var typeEl = document.querySelector<HTMLSelectElement>('#filterType');
  var personEl = document.querySelector<HTMLSelectElement>('#filterPerson');
  var locationEl = document.querySelector<HTMLSelectElement>('#filterLocation');
  var statusEl = document.querySelector<HTMLSelectElement>('#filterStatus');
  var relevanceEl =
    document.querySelector<HTMLSelectElement>('#filterRelevance');
  var sortEl = document.querySelector<HTMLSelectElement>('#sortEvidence');

  var typeVal = typeEl ? typeEl.value : '';
  var personVal = personEl ? personEl.value : '';
  var locationVal = locationEl ? locationEl.value : '';
  var statusVal = statusEl ? statusEl.value : '';
  var relevanceVal = relevanceEl ? relevanceEl.value : '';
  var sortVal = sortEl ? sortEl.value : 'date-desc';

  var results = [];
  for (var i = 0; i < allEvidence.length; i++) {
    var item = allEvidence[i];
    var matches = true;

    if (searchTerm) {
      var haystack = (
        item.title +
        ' ' +
        item.summary +
        ' ' +
        (item.tags ? item.tags.join(' ') : '')
      ).toLowerCase();
      if (haystack.indexOf(searchTerm) === -1) matches = false;
    }
    if (matches && typeVal && item.type.toLowerCase() !== typeVal)
      matches = false;
    if (matches && personVal) {
      var person = findPersonById(personVal);
      if (!person || !evidenceMentionsPerson(item, person)) matches = false;
    }
    if (
      matches &&
      locationVal &&
      item.locationIds &&
      item.locationIds.indexOf(locationVal) === -1
    )
      matches = false;
    if (matches && statusVal && (item.status || '').toLowerCase() !== statusVal)
      matches = false;
    if (
      matches &&
      relevanceVal &&
      (item.relevance || '').toLowerCase() !== relevanceVal
    )
      matches = false;

    if (matches) results.push(item);
  }
  if (sortVal === 'title-asc') {
    results.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
  } else if (sortVal === 'title-desc') {
    results.sort(function (a, b) {
      return b.title.localeCompare(a.title);
    });
  } else if (sortVal === 'date-asc') {
    results.sort(function (a, b) {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });
  } else {
    results.sort(function (a, b) {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }

  setFilteredEvidence(results);
  return results;
}

// ---------------------------------------------------------------------
// EVIDENCE LIST RENDERING & EVENTS
// ---------------------------------------------------------------------
export function renderEvidenceList() {
  var container = document.getElementById('evidenceList');
  if (!container) return;

  var loadingIndicator = document.getElementById('evidenceLoadingIndicator');
  if (evidenceViewLoading) {
    if (loadingIndicator) loadingIndicator.classList.remove('hidden');
    container.innerHTML = '';
    return;
  }
  if (loadingIndicator) loadingIndicator.classList.add('hidden');

  var results = getFilteredEvidence();

  var html = '';
  if (results.length === 0) {
    html = '<p>No evidence matches the current filters.</p>';
  }
  for (var i = 0; i < results.length; i++) {
    html += renderEvidenceCardHTML(results[i]);
  }
  container.innerHTML = html;

  container.onclick = handleEvidenceListClick;
}

export function renderEvidenceCardHTML(ev: Evidence): string {
  var isBookmarked = bookmarks.indexOf(ev.id) !== -1;
  var html = '<div class="evidence-card" data-id="' + ev.id + '">';
  html +=
    '<button class="bookmark-btn ' +
    (isBookmarked ? 'active' : '') +
    '" data-action="bookmark" data-id="' +
    ev.id +
    '" aria-label="Toggle bookmark for ' +
    ev.title +
    '"><span class="bookmark-icon">' +
    (isBookmarked ? '★' : '☆') +
    '</span></button>';
  html += '<h3>' + ev.title + '</h3>';
  html +=
    '<div class="evidence-meta">' +
    ev.id +
    ' &middot; ' +
    ev.type +
    ' &middot; ' +
    formatDate(ev.timestamp) +
    '</div>';
  html += '<div class="evidence-summary">' + ev.summary + '</div>';

  if (ev.tags && ev.tags.indexOf('critical') !== -1) {
    html += '<span class="badge badge-critical">Critical</span>';
  }
  html +=
    '<span class="badge ' +
    getStatusBadgeClass(ev.status) +
    '">' +
    ev.status +
    '</span>';
  html +=
    '<span class="badge ' +
    getRelevanceBadgeClass(ev.relevance) +
    '">' +
    ev.relevance +
    '</span>';
  html += '<div>';
  if (ev.tags) {
    for (var t = 0; t < ev.tags.length; t++) {
      html += '<span class="tag-chip">' + ev.tags[t] + '</span>';
    }
  }
  html += '</div>';
  html += '</div>';
  return html;
}

export function handleEvidenceListClick(event: MouseEvent): void {
  var target = event.target;
  if (!(target instanceof Element)) return;

  var bookmarkBtn = target.closest('[data-action="bookmark"]');
  if (bookmarkBtn) {
    event.stopPropagation();
    handleBookmarkClick(bookmarkBtn.getAttribute('data-id'));
    return;
  }

  var card = target.closest('.evidence-card');
  if (card) {
    renderEvidenceDetail(card.getAttribute('data-id'));
  }
}

export function handleBookmarkClick(evidenceId: string | null): void {
  const ev = findEvidenceById(evidenceId);
  if (!ev) return;

  var newBookmarks = bookmarks.slice();
  var idx = newBookmarks.indexOf(ev.id);

  if (idx === -1) {
    newBookmarks.push(ev.id);
    ev.bookmarked = true;
  } else {
    newBookmarks.splice(idx, 1);
    ev.bookmarked = false;
  }

  setBookmarks(newBookmarks);
  saveBookmarksToStorage();
  if (currentPage === 'evidence') renderEvidenceList();
}

export function applyStoredBookmarkFlags() {
  for (var i = 0; i < allEvidence.length; i++) {
    allEvidence[i].bookmarked = bookmarks.indexOf(allEvidence[i].id) !== -1;
  }
}

// ---------------------------------------------------------------------
// SORTING & SEARCH HELPERS
// ---------------------------------------------------------------------
export function handleSortChange() {
  var sortEl = document.querySelector<HTMLSelectElement>('#sortEvidence');
  if (!sortEl) return;
  var sortValue = sortEl.value;
  var sorted = filteredEvidence.slice();

  if (sortValue === 'title-asc') {
    sorted.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
  } else if (sortValue === 'title-desc') {
    sorted.sort(function (a, b) {
      return b.title.localeCompare(a.title);
    });
  } else if (sortValue === 'date-asc') {
    sorted.sort(function (a, b) {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });
  } else {
    sorted.sort(function (a, b) {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }

  setFilteredEvidence(sorted);
  renderEvidenceList();
}

export function clearFilters() {
  var searchBox = document.querySelector<HTMLInputElement>('#evidenceSearch');
  var typeEl = document.querySelector<HTMLSelectElement>('#filterType');
  var personEl = document.querySelector<HTMLSelectElement>('#filterPerson');
  var locationEl = document.querySelector<HTMLSelectElement>('#filterLocation');
  var statusEl = document.querySelector<HTMLSelectElement>('#filterStatus');
  var relevanceEl =
    document.querySelector<HTMLSelectElement>('#filterRelevance');

  if (searchBox) searchBox.value = '';
  if (typeEl) typeEl.value = '';
  if (personEl) personEl.value = '';
  if (locationEl) locationEl.value = '';
  if (statusEl) statusEl.value = '';
  if (relevanceEl) relevanceEl.value = '';

  renderEvidenceList();
}

export function simulateAsyncSearch(term: string): Promise<string> {
  return new Promise<string>(function (resolve) {
    setTimeout(function () {
      resolve(term);
    }, 300);
  });
}

var latestSearchRequestId = 0;

export function handleSearchInput(event: Event): void {
  if (!(event.target instanceof HTMLInputElement)) return;
  var term = event.target.value;
  var requestId = ++latestSearchRequestId;

  simulateAsyncSearch(term).then(function () {
    if (requestId !== latestSearchRequestId) return;
    renderEvidenceList();
  });
}

// ---------------------------------------------------------------------
// DETAIL VIEW RENDERING
// ---------------------------------------------------------------------
export function renderEvidenceDetail(evidenceId: string | null): void {
  const ev = findEvidenceById(evidenceId);
  if (!ev) return;

  var detailContainer = document.getElementById('evidenceDetailSection');
  if (!detailContainer) return;

  detailContainer.classList.remove('hidden');

  var storedNote = loadNoteForEvidence(ev.id);

  var html = '<div class="evidence-detail-card">';
  html += '<h2>' + ev.title + '</h2>';
  html +=
    '<p class="evidence-meta">' +
    ev.id +
    ' &middot; ' +
    ev.type +
    ' &middot; ' +
    formatDate(ev.timestamp) +
    '</p>';

  html += '<div class="evidence-content"><p>' + ev.summary + '</p></div>';

  html += '<div class="detail-field">';
  html += '<strong>Investigator note</strong>';
  html += '<textarea id="evidenceNoteInput" class="note-textarea" rows="3" ';
  html +=
    'placeholder="Add a private note about this evidence...">' +
    storedNote +
    '</textarea>';

  html += '<button type="button" id="saveNoteBtn" ';
  html += 'class="btn btn-primary btn-small" style="margin-top:6px;">';
  html += 'Save note</button>';
  html += '</div>';

  html += '<div class="detail-field">';
  html += '<strong>Note preview</strong>';
  html += '<div id="notePreview">' + storedNote + '</div>';
  html += '</div>';

  html += '</div>';

  detailContainer.innerHTML = html;

  var saveButton = document.getElementById('saveNoteBtn');

  if (saveButton) {
    saveButton.addEventListener('click', function () {
      var textarea =
        document.querySelector<HTMLTextAreaElement>('#evidenceNoteInput');
      if (!textarea) return;

      var text = textarea.value;

      saveNoteForEvidence(ev.id, text);

      var preview = document.getElementById('notePreview');
      if (preview) {
        preview.textContent = text;
      }
    });
  }
}
// Alias to maintain full backwards compatibility
export var openEvidenceDetail = renderEvidenceDetail;
// Add to the bottom of evidence.ts
export var populateEvidenceFilterDropdowns = populateEvidenceDropdowns;

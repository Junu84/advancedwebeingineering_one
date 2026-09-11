// evidence.js
import { 
  allEvidence, 
  filteredEvidence, 
  setFilteredEvidence, 
  bookmarks, 
  setBookmarks, 
  currentPage, 
  allPeople, 
  allLocations, 
  evidenceViewLoading 
} from './state.js';

import { 
  findEvidenceById, 
  findPersonById, 
  findLocationById, 
  formatDate, 
  evidenceMentionsPerson, 
  getStatusBadgeClass, 
  getRelevanceBadgeClass 
} from './utils.js';

import { saveBookmarksToStorage } from './storage.js';
import { populateTimelineDropdowns } from './timeline.js';

// ---------------------------------------------------------------------
// DROPDOWN & FILTER MANAGEMENT
// ---------------------------------------------------------------------
export function populateAllDropdowns() {
  populateEvidenceDropdowns();
  populateTimelineDropdowns();
}

export function populateEvidenceDropdowns() {
  var typeSelect = document.getElementById("filterType");
  var personSelect = document.getElementById("filterPerson");
  var locationSelect = document.getElementById("filterLocation");
  if (!typeSelect || !personSelect || !locationSelect) return;

  var types = [];
  for (var i = 0; i < allEvidence.length; i++) {
    var t = allEvidence[i].type.toLowerCase();
    if (types.indexOf(t) === -1) types.push(t);
  }
  typeSelect.innerHTML = '<option value="">All types</option>';
  for (var ti = 0; ti < types.length; ti++) {
    typeSelect.innerHTML += '<option value="' + types[ti] + '">' + types[ti] + "</option>";
  }

  personSelect.innerHTML = '<option value="">All people</option>';
  for (var p = 0; p < allPeople.length; p++) {
    personSelect.innerHTML += '<option value="' + allPeople[p].id + '">' + allPeople[p].name + "</option>";
  }

  locationSelect.innerHTML = '<option value="">All locations</option>';
  for (var l = 0; l < allLocations.length; l++) {
    locationSelect.innerHTML += '<option value="' + allLocations[l].id + '">' + allLocations[l].id + " - " + allLocations[l].name + "</option>";
  }
}

function getFilteredEvidence() {
  var searchBox = document.getElementById("evidenceSearch");
  var searchTerm = searchBox ? searchBox.value.toLowerCase().trim() : "";
  
  var typeEl = document.getElementById("filterType");
  var personEl = document.getElementById("filterPerson");
  var locationEl = document.getElementById("filterLocation");
  var statusEl = document.getElementById("filterStatus");
  var relevanceEl = document.getElementById("filterRelevance");

  var typeVal = typeEl ? typeEl.value : "";
  var personVal = personEl ? personEl.value : "";
  var locationVal = locationEl ? locationEl.value : "";
  var statusVal = statusEl ? statusEl.value : "";
  var relevanceVal = relevanceEl ? relevanceEl.value : "";

  var results = [];
  for (var i = 0; i < allEvidence.length; i++) {
    var item = allEvidence[i];
    var matches = true;

    if (searchTerm) {
      var haystack = (item.title + " " + item.summary + " " + (item.tags ? item.tags.join(" ") : "")).toLowerCase();
      if (haystack.indexOf(searchTerm) === -1) matches = false;
    }
    if (matches && typeVal && item.type.toLowerCase() !== typeVal) matches = false;
    if (matches && personVal) {
      var person = findPersonById(personVal);
      if (!person || !evidenceMentionsPerson(item, person)) matches = false;
    }
    if (matches && locationVal && item.locationIds && item.locationIds.indexOf(locationVal) === -1) matches = false;
    if (matches && statusVal && (item.status || "").toLowerCase() !== statusVal) matches = false;
    if (matches && relevanceVal && (item.relevance || "").toLowerCase() !== relevanceVal) matches = false;

    if (matches) results.push(item);
  }

  setFilteredEvidence(results);
  return results;
}

// ---------------------------------------------------------------------
// EVIDENCE LIST RENDERING & EVENTS
// ---------------------------------------------------------------------
export function renderEvidenceList() {
  var container = document.getElementById("evidenceList");
  if (!container) return;

  var loadingIndicator = document.getElementById("evidenceLoadingIndicator");
  if (evidenceViewLoading) {
    if (loadingIndicator) loadingIndicator.classList.remove("hidden");
    container.innerHTML = "";
    return;
  }
  if (loadingIndicator) loadingIndicator.classList.add("hidden");

  var results = getFilteredEvidence();

  var html = "";
  if (results.length === 0) {
    html = "<p>No evidence matches the current filters.</p>";
  }
  for (var i = 0; i < results.length; i++) {
    html += renderEvidenceCardHTML(results[i]);
  }
  container.innerHTML = html;

  container.onclick = handleEvidenceListClick;
}

export function renderEvidenceCardHTML(ev) {
  var isBookmarked = bookmarks.indexOf(ev.id) !== -1;
  var html = '<div class="evidence-card" data-id="' + ev.id + '">';
  html += '<button class="bookmark-btn ' + (isBookmarked ? "active" : "") + '" data-action="bookmark" data-id="' + ev.id + '" aria-label="Toggle bookmark for ' + ev.title + '"><span class="bookmark-icon">' + (isBookmarked ? "★" : "☆") + "</span></button>";
  html += "<h3>" + ev.title + "</h3>";
  html += '<div class="evidence-meta">' + ev.id + " &middot; " + ev.type + " &middot; " + formatDate(ev.timestamp) + "</div>";
  html += '<div class="evidence-summary">' + ev.summary + "</div>";

  if (ev.tags && ev.tags.indexOf("critical") !== -1) {
    html += '<span class="badge badge-critical">Critical</span>';
  }
  html += '<span class="badge ' + getStatusBadgeClass(ev.status) + '">' + ev.status + "</span>";
  html += '<span class="badge ' + getRelevanceBadgeClass(ev.relevance) + '">' + ev.relevance + "</span>";
  html += "<div>";
  if (ev.tags) {
    for (var t = 0; t < ev.tags.length; t++) {
      html += '<span class="tag-chip">' + ev.tags[t] + "</span>";
    }
  }
  html += "</div>";
  html += "</div>";
  return html;
}

export function handleEvidenceListClick(event) {
  var target = event.target;

  var bookmarkBtn = target.closest('[data-action="bookmark"]');
  if (bookmarkBtn) {
    event.stopPropagation();
    handleBookmarkClick(bookmarkBtn.getAttribute("data-id"));
    return;
  }

  var card = target.closest(".evidence-card");
  if (card) {
    renderEvidenceDetail(card.getAttribute("data-id"));
  }
}

export function handleBookmarkClick(evidenceId) {
  var ev = findEvidenceById(evidenceId);
  if (!ev) return;

  var newBookmarks = bookmarks.slice();
  var idx = newBookmarks.indexOf(evidenceId);

  if (idx === -1) {
    newBookmarks.push(evidenceId);
    ev.bookmarked = true;
  } else {
    newBookmarks.splice(idx, 1);
    ev.bookmarked = false;
  }

  setBookmarks(newBookmarks);
  saveBookmarksToStorage();
  if (currentPage === "evidence") renderEvidenceList();
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
  var sortEl = document.getElementById("sortEvidence");
  if (!sortEl) return;
  var sortValue = sortEl.value;
  var sorted = filteredEvidence.slice();

  if (sortValue === "title-asc") {
    sorted.sort(function (a, b) { return a.title.localeCompare(b.title); });
  } else if (sortValue === "title-desc") {
    sorted.sort(function (a, b) { return b.title.localeCompare(a.title); });
  } else if (sortValue === "date-asc") {
    sorted.sort(function (a, b) { return new Date(a.timestamp) - new Date(b.timestamp); });
  } else {
    sorted.sort(function (a, b) { return new Date(b.timestamp) - new Date(a.timestamp); });
  }

  setFilteredEvidence(sorted);
  renderEvidenceList();
}

export function clearFilters() {
  var searchBox = document.getElementById("evidenceSearch");
  var typeEl = document.getElementById("filterType");
  var personEl = document.getElementById("filterPerson");
  var locationEl = document.getElementById("filterLocation");
  var statusEl = document.getElementById("filterStatus");
  var relevanceEl = document.getElementById("filterRelevance");

  if (searchBox) searchBox.value = "";
  if (typeEl) typeEl.value = "";
  if (personEl) personEl.value = "";
  if (locationEl) locationEl.value = "";
  if (statusEl) statusEl.value = "";
  if (relevanceEl) relevanceEl.value = "";

  renderEvidenceList();
}

export function simulateAsyncSearch(term) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(term);
    }, 300);
  });
}

var latestSearchRequestId = 0;

export function handleSearchInput(event) {
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
export function renderEvidenceDetail(evidenceId) {
  var ev = findEvidenceById(evidenceId);
  if (!ev) return;

  var detailContainer = document.getElementById("evidenceDetail");
  if (!detailContainer) return;

  var html = '<div class="evidence-detail-card">';
  html += '<h2>' + ev.title + '</h2>';
  html += '<p class="evidence-meta">' + ev.id + ' &middot; ' + ev.type + ' &middot; ' + formatDate(ev.timestamp) + '</p>';
  html += '<div class="evidence-content"><p>' + (ev.description || ev.summary) + '</p></div>';
  html += '</div>';

  detailContainer.innerHTML = html;
}

// Alias to maintain full backwards compatibility
export var openEvidenceDetail = renderEvidenceDetail;
// Add to the bottom of evidence.js
export var populateEvidenceFilterDropdowns = populateEvidenceDropdowns;
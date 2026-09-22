// workspace.js
import { 
  allEvidence, 
  allPeople, 
  notesStore, 
  STORAGE_KEY_HYPOTHESIS 
} from '../state/state.js';

import { renderEvidenceDetail } from './evidence.js';

// ---------------------------------------------------------------------
// MAIN WORKSPACE RENDERER
// ---------------------------------------------------------------------
export function renderWorkspace() {
  renderBookmarksList();
  renderNotesList();
  populateHypothesisDropdowns();
  loadHypothesisFromStorage();
}

// ---------------------------------------------------------------------
// BOOKMARKS & NOTES PANELS
// ---------------------------------------------------------------------
export function renderBookmarksList() {
  var container = document.getElementById("bookmarksList");
  if (!container) return;

  var bookmarkedItems = allEvidence.filter(function (ev) {
    return ev.bookmarked;
  });

  if (bookmarkedItems.length === 0) {
    container.innerHTML = "<p>No bookmarked evidence yet. Bookmark items from the Evidence view.</p>";
    return;
  }

  var html = "";
  for (var i = 0; i < bookmarkedItems.length; i++) {
    var ev = bookmarkedItems[i];
    html += '<div class="mini-list-item"><strong>' + ev.id + "</strong> &mdash; " + ev.title +
      ' <button type="button" class="btn btn-small btn-secondary" data-open-evidence="' + ev.id + '">Open</button></div>';
  }
  container.innerHTML = html;

  var openButtons = container.querySelectorAll("[data-open-evidence]");
  for (var b = 0; b < openButtons.length; b++) {
    openButtons[b].addEventListener("click", function (e) {
      window.location.hash = "evidence";
      var id = e.target.getAttribute("data-open-evidence");
      setTimeout(function () {
        renderEvidenceDetail(id);
      }, 0);
    });
  }
}

export function renderNotesList() {
  var container = document.getElementById("notesList");
  if (!container) return;

  var noteEntries = [];
  for (var i = 0; i < allEvidence.length; i++) {
    var note = notesStore[allEvidence[i].id];
    if (note) {
      noteEntries.push({ index: i, evidenceId: allEvidence[i].id, title: allEvidence[i].title, text: note });
    }
  }

  if (noteEntries.length === 0) {
    container.innerHTML = "<p>No notes yet. Add one from an evidence item's detail view.</p>";
    return;
  }

  var html = "";
  for (var n = 0; n < noteEntries.length; n++) {
    var entry = noteEntries[n];
    html += '<div class="mini-list-item"><strong>' + entry.evidenceId + "</strong> &mdash; " + entry.title;
    html += '<div id="noteText-' + entry.index + '">' + entry.text + "</div></div>";
  }
  container.innerHTML = html;
}

// ---------------------------------------------------------------------
// HYPOTHESIS FORM CONTROLS
// ---------------------------------------------------------------------
export function populateHypothesisDropdowns() {
  var suspectSelect = document.getElementById("hypSuspect");
  var evidenceSelect = document.getElementById("hypEvidence");
  if (!suspectSelect || !evidenceSelect) return;

  var currentSuspect = suspectSelect.value;
  suspectSelect.innerHTML = '<option value="">Select a person…</option>';
  for (var p = 0; p < allPeople.length; p++) {
    suspectSelect.innerHTML += '<option value="' + allPeople[p].id + '">' + allPeople[p].name + "</option>";
  }
  suspectSelect.value = currentSuspect;

  evidenceSelect.innerHTML = "";
  for (var i = 0; i < allEvidence.length; i++) {
    evidenceSelect.innerHTML += '<option value="' + allEvidence[i].id + '">' + allEvidence[i].id + " - " + allEvidence[i].title + "</option>";
  }
}

export function saveHypothesis() {
  var draft = {
    suspectId: document.getElementById("hypSuspect").value,
    nature: document.getElementById("hypNature").value,
    evidenceIds: getSelectedOptions(document.getElementById("hypEvidence")),
    confidence: document.getElementById("hypConfidence").value,
    explanation: document.getElementById("hypExplanation").value,
    alternative: document.getElementById("hypAlternative").value,
    savedAt: new Date().toISOString()
  };

  try {
    localStorage.setItem(STORAGE_KEY_HYPOTHESIS, JSON.stringify(draft));
  } catch (err) {
    console.error("Could not save hypothesis draft", err);
    alert("Your hypothesis could not be saved to local storage.");
    return;
  }

  var msg = document.getElementById("hypothesisSavedMsg");
  if (msg) {
    msg.classList.remove("hidden");
    setTimeout(function () {
      msg.classList.add("hidden");
    }, 2000);
  }
  var saveHypothesisBtn = document.getElementById("saveHypothesisBtn");

if (saveHypothesisBtn) {
  saveHypothesisBtn.addEventListener("click", saveHypothesis);
}
}

export function getSelectedOptions(selectEl) {
  var result = [];
  if (!selectEl) return result;
  for (var i = 0; i < selectEl.options.length; i++) {
    if (selectEl.options[i].selected) result.push(selectEl.options[i].value);
  }
  return result;
}

export function loadHypothesisFromStorage() {
  var raw = localStorage.getItem(STORAGE_KEY_HYPOTHESIS);
  if (!raw) return;

  var draft = JSON.parse(raw); 

  if (document.getElementById("hypSuspect")) document.getElementById("hypSuspect").value = draft.suspectId || "";
  if (document.getElementById("hypNature")) document.getElementById("hypNature").value = draft.nature || "";
  if (document.getElementById("hypConfidence")) document.getElementById("hypConfidence").value = draft.confidence || 50;
  if (document.getElementById("hypConfidenceValue")) document.getElementById("hypConfidenceValue").textContent = draft.confidence || 50;
  if (document.getElementById("hypExplanation")) document.getElementById("hypExplanation").value = draft.explanation || "";
  if (document.getElementById("hypAlternative")) document.getElementById("hypAlternative").value = draft.alternative || "";

  var evidenceSelect = document.getElementById("hypEvidence");
  if (evidenceSelect) {
    var savedIds = draft.evidenceIds || [];
    for (var i = 0; i < evidenceSelect.options.length; i++) {
      evidenceSelect.options[i].selected = savedIds.indexOf(evidenceSelect.options[i].value) !== -1;
    }
  }
}
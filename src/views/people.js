// people.js
import {
  allPeople,
  allLocations,
  allEvidence,
  currentPeopleTab,
  setCurrentPeopleTab,
} from '../state/state.js';

import { evidenceMentionsPerson } from '../utils/utils.js';

/**
 * Main render controller for the People / Directory view.
 */
export function renderPeopleView() {
  if (currentPeopleTab === 'locations') {
    renderLocations();
  } else {
    renderPeople();
  }
}

/**
 * Switches active sub-tab between 'people' and 'locations'.
 */
export function switchPeopleTab(tabName) {
  setCurrentPeopleTab(tabName);

  var peopleBtn = document.getElementById('tabPeopleBtn');
  var locationsBtn = document.getElementById('tabLocationsBtn');

  var peoplePanel = document.getElementById('peoplePanel');
  var locationsPanel = document.getElementById('locationsPanel');

  if (tabName === 'locations') {
    if (peopleBtn) peopleBtn.classList.remove('active');
    if (locationsBtn) locationsBtn.classList.add('active');

    // Hide people and show locations
    if (peoplePanel) peoplePanel.classList.add('hidden');
    if (locationsPanel) locationsPanel.classList.remove('hidden');

    renderLocations();
  } else {
    if (locationsBtn) locationsBtn.classList.remove('active');
    if (peopleBtn) peopleBtn.classList.add('active');

    // Hide locations and show people
    if (locationsPanel) locationsPanel.classList.add('hidden');
    if (peoplePanel) peoplePanel.classList.remove('hidden');

    renderPeople();
  }
}

/**
 * Renders the list of persons involved in the case.
 */
export function renderPeople() {
  var container = document.getElementById('peoplePanel');
  if (!container) return;

  if (!allPeople || allPeople.length === 0) {
    container.innerHTML =
      '<p class="text-muted text-center py-4">No people found.</p>';
    return;
  }

  var html = '<div class="row">';
  for (var i = 0; i < allPeople.length; i++) {
    var p = allPeople[i];
    var evCount = countEvidenceForPerson(p.id);

    html += `
      <div class="col-md-4 mb-3">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">${p.name || p.id}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${p.role || 'Role unspecified'}</h6>
            <p class="card-text small">${p.description || 'No description available.'}</p>
          </div>
          <div class="card-footer bg-transparent border-0 pt-0">
            <span class="badge bg-secondary">${evCount} linked evidence item(s)</span>
          </div>
        </div>
      </div>
    `;
  }
  html += '</div>';

  container.innerHTML = html;
}

/**
 * Renders the list of key locations.
 */
export function renderLocations() {
  var container = document.getElementById('locationsPanel');
  if (!container) return;

  if (!allLocations || allLocations.length === 0) {
    container.innerHTML =
      '<p class="text-muted text-center py-4">No locations found.</p>';
    return;
  }

  var html = '<div class="row">';
  for (var i = 0; i < allLocations.length; i++) {
    var loc = allLocations[i];

    html += `
      <div class="col-md-4 mb-3">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">${loc.name || loc.id}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${loc.address || 'Address unknown'}</h6>
            <p class="card-text small">${loc.description || 'No location details provided.'}</p>
          </div>
        </div>
      </div>
    `;
  }
  html += '</div>';

  container.innerHTML = html;
}

/**
 * Helper to count how many evidence items reference a given person.
 */
export function countEvidenceForPerson(personId) {
  var count = 0;
  if (!allEvidence) return count;

  for (var i = 0; i < allEvidence.length; i++) {
    var ev = allEvidence[i];
    if (ev.personIds && ev.personIds.indexOf(personId) !== -1) {
      count++;
    }
  }
  return count;
}

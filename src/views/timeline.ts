import type { TimelineEvent } from '../data/types.ts';
// timeline.ts
import {
  allTimeline,
  allPeople,
  allLocations,
  modalCloseListenerCount,
  setModalCloseListenerCount,
} from '../state/state.ts';

import {
  formatDate,
  findLocationById,
  findEvidenceById,
} from '../utils/utils.ts';

import { renderEvidenceDetail } from './evidence.ts';

// ---------------------------------------------------------------------
// DROPDOWN POPULATION & RENDERING
// ---------------------------------------------------------------------
export function populateTimelineDropdowns() {
  var personSelect = document.querySelector<HTMLSelectElement>(
    '#timelinePersonFilter',
  );
  var locationSelect = document.querySelector<HTMLSelectElement>(
    '#timelineLocationFilter',
  );
  var typeSelect = document.querySelector<HTMLSelectElement>(
    '#timelineTypeFilter',
  );
  if (!personSelect || !locationSelect || !typeSelect) return;

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
      '</option>';
  }

  var types = [];
  for (var i = 0; i < allTimeline.length; i++) {
    if (types.indexOf(allTimeline[i].type) === -1)
      types.push(allTimeline[i].type);
  }
  typeSelect.innerHTML = '<option value="">All event types</option>';
  for (var t = 0; t < types.length; t++) {
    typeSelect.innerHTML +=
      '<option value="' + types[t] + '">' + types[t] + '</option>';
  }
}

export function renderTimeline() {
  var container = document.getElementById('timelineContainer');
  if (!container) return;

  var orderEl = document.querySelector<HTMLSelectElement>('#timelineOrder');
  var personEl = document.querySelector<HTMLSelectElement>(
    '#timelinePersonFilter',
  );
  var locationEl = document.querySelector<HTMLSelectElement>(
    '#timelineLocationFilter',
  );
  var typeEl = document.querySelector<HTMLSelectElement>('#timelineTypeFilter');

  var order = orderEl ? orderEl.value : 'asc';
  var personFilter = personEl ? personEl.value : '';
  var locationFilter = locationEl ? locationEl.value : '';
  var typeFilter = typeEl ? typeEl.value : '';

  var events = [];
  for (var i = 0; i < allTimeline.length; i++) {
    var evt = allTimeline[i];
    if (personFilter && !evt.personIds.some((id) => id === personFilter))
      continue;
    if (locationFilter && evt.locationIds.indexOf(locationFilter) === -1)
      continue;
    if (typeFilter && evt.type !== typeFilter) continue;
    events.push(evt);
  }

  events = events.slice().sort(function (a, b) {
    var diff = new Date(a.time).getTime() - new Date(b.time).getTime();
    return order === 'desc' ? -diff : diff;
  });

  var html = '';
  for (var e = 0; e < events.length; e++) {
    var item = events[e];
    html += '<div class="timeline-event certainty-' + item.certainty + '">';
    html +=
      '<div class="timeline-time">' +
      formatDate(item.time) +
      '&nbsp;&middot;&nbsp;<span class="badge badge-' +
      certaintyBadgeClass(item.certainty) +
      '">' +
      item.certainty +
      '</span></div>';
    html += '<h3>' + item.title + '</h3>';
    html += '<p>' + item.description + '</p>';

    var eventLocationNames = [];
    if (item.locationIds) {
      for (var el = 0; el < item.locationIds.length; el++) {
        var evtLoc = findLocationById(item.locationIds[el]);
        eventLocationNames.push(
          evtLoc ? evtLoc.name || evtLoc.id : item.locationIds[el],
        );
      }
    }
    if (eventLocationNames.length > 0) {
      html +=
        '<p class="evidence-meta">Location: ' +
        eventLocationNames.join(', ') +
        '</p>';
    }

    if (item.evidenceIds) {
      for (var ev2 = 0; ev2 < item.evidenceIds.length; ev2++) {
        html +=
          '<button type="button" class="evidence-link-btn" data-evidence-id="' +
          item.evidenceIds[ev2] +
          '">View ' +
          item.evidenceIds[ev2] +
          '</button>';
      }
    }
    html += '</div>';
  }
  if (events.length === 0) {
    html = '<p>No timeline events match the current filters.</p>';
  }
  container.innerHTML = html;

  var linkButtons = container.querySelectorAll('.evidence-link-btn');
  for (var b = 0; b < linkButtons.length; b++) {
    linkButtons[b].addEventListener('click', function (e) {
      if (e.target instanceof Element)
        openEvidenceModal(e.target.getAttribute('data-evidence-id'));
    });
  }
}

export function certaintyBadgeClass(
  certainty: TimelineEvent['certainty'],
): string {
  if (certainty === 'confirmed') return 'reviewed';
  if (certainty === 'contradictory') return 'critical';
  if (certainty === 'reported') return 'flagged';
  return 'unreviewed';
}

// ---------------------------------------------------------------------
// QUICK-VIEW MODAL CONTROLS
// ---------------------------------------------------------------------
export function openEvidenceModal(evidenceId: string | null): void {
  var ev = findEvidenceById(evidenceId);
  if (!ev) return;

  var modal = document.getElementById('quickViewModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'quickViewModal';
    document.body.appendChild(modal);
  }

  modal.innerHTML =
    '<div class="modal-backdrop"><div class="modal-box">' +
    '<button type="button" class="modal-close-btn" aria-label="Close">&times;</button>' +
    '<h3>' +
    ev.title +
    '</h3>' +
    '<p class="evidence-meta">' +
    ev.id +
    ' &middot; ' +
    ev.type +
    ' &middot; ' +
    formatDate(ev.timestamp) +
    '</p>' +
    '<p>' +
    ev.summary +
    '</p>' +
    '<button type="button" class="btn btn-primary btn-small" data-open-full="' +
    ev.id +
    '">Open full evidence</button>' +
    '</div></div>';

  setModalCloseListenerCount(modalCloseListenerCount + 1);

  const activeModal = modal;
  modal.onclick = function (e) {
    if (!(e.target instanceof Element)) return;
    if (
      e.target.classList.contains('modal-close-btn') ||
      e.target.classList.contains('modal-backdrop')
    ) {
      activeModal.innerHTML = '';
    }
    if (e.target.getAttribute && e.target.getAttribute('data-open-full')) {
      var fullId = e.target.getAttribute('data-open-full');
      activeModal.innerHTML = '';
      window.location.hash = 'evidence';
      setTimeout(function () {
        renderEvidenceDetail(fullId);
      }, 0);
    }
  };
}

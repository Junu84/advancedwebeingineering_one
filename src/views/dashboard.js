// dashboard.js
import {
  allEvidence,
  allPeople,
  allLocations,
  caseData,
} from '../state/state.js';

import { formatDate, getStatusBadgeClass } from '../utils/utils.js';

// No navigation import needed!

export function renderDashboard() {
  renderCaseSummary();
  renderStatCards();
  renderRecentEvidence();
  setupDashboardQuickLinks();
}

function renderCaseSummary() {
  var titleEl = document.getElementById('dashCaseTitle');
  var descEl = document.getElementById('dashCaseDesc');

  if (titleEl) titleEl.textContent = caseData.title || 'Investigation Overview';
  if (descEl)
    descEl.textContent =
      caseData.description ||
      'Overview of current evidence, key personnel, and timeline events.';
}

function renderStatCards() {
  var container = document.getElementById('dashboardStats');
  if (!container) return;

  var totalEv = allEvidence.length;
  var totalPeopleCount = allPeople.length;
  var totalLocationsCount = allLocations.length;

  var reviewedCount = 0;
  var flaggedCount = 0;

  for (var i = 0; i < allEvidence.length; i++) {
    var status = (allEvidence[i].status || '').toLowerCase();
    if (status === 'reviewed') reviewedCount++;
    if (status === 'flagged') flaggedCount++;
  }

  var html = '';
  html += statCardHTML('Total Evidence', totalEv, 'text-primary', 'evidence');
  html += statCardHTML('Reviewed', reviewedCount, 'text-success', 'evidence');
  html += statCardHTML('Flagged', flaggedCount, 'text-danger', 'evidence');
  html += statCardHTML('People', totalPeopleCount, 'text-info', 'people');
  html += statCardHTML(
    'Locations',
    totalLocationsCount,
    'text-warning',
    'people',
  );

  container.innerHTML = html;
}

function renderRecentEvidence() {
  var container = document.getElementById('dashboardRecentEvidence');
  if (!container) return;

  if (allEvidence.length === 0) {
    container.innerHTML = '<p class="text-muted">No evidence loaded.</p>';
    return;
  }

  var recent = allEvidence
    .slice()
    .sort(function (a, b) {
      return new Date(b.timestamp || 0) - new Date(a.timestamp || 0);
    })
    .slice(0, 5);

  var html = '<ul class="list-group list-group-flush">';
  for (var i = 0; i < recent.length; i++) {
    var item = recent[i];
    var badgeClass = getStatusBadgeClass(item.status);
    html += `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <strong>${item.id}: ${item.title}</strong>
          <br>
          <small class="text-muted">${formatDate(item.timestamp)}</small>
        </div>
        <span class="badge ${badgeClass}">${item.status || 'unreviewed'}</span>
      </li>
    `;
  }
  html += '</ul>';

  container.innerHTML = html;
}

export function statCardHTML(title, value, colorClass, targetView) {
  return `
    <div class="col-md-2 col-sm-4 mb-3">
      <div class="card stat-card text-center h-100" style="cursor: pointer;" data-target="${targetView}">
        <div class="card-body">
          <h6 class="card-subtitle mb-2 text-muted">${title}</h6>
          <h3 class="card-title ${colorClass} mb-0">${value}</h3>
        </div>
      </div>
    </div>
  `;
}

function setupDashboardQuickLinks() {
  var statCards = document.querySelectorAll('.stat-card');
  statCards.forEach(function (card) {
    card.addEventListener('click', function () {
      var view = this.getAttribute('data-target');
      if (view) {
        window.location.hash = view;
      }
    });
  });
}

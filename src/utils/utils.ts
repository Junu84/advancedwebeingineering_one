import type { Evidence, RawEvidence, Person, Location } from '../data/types.ts';
import { allEvidence, allPeople, allLocations } from '../state/state.ts';
export function findEvidenceById(id: string | null): Evidence | null {
  for (var i = 0; i < allEvidence.length; i++) {
    if (allEvidence[i].id === id) return allEvidence[i];
  }
  return null;
}

export function findPersonById(id: string): Person | null {
  for (var i = 0; i < allPeople.length; i++) {
    if (allPeople[i].id === id) return allPeople[i];
  }
  return null;
}

export function findLocationById(id: string): Location | null {
  for (var i = 0; i < allLocations.length; i++) {
    if (allLocations[i].id === id) return allLocations[i];
  }
  return null;
}

export function evidenceMentionsPerson(
  ev: Evidence | RawEvidence,
  person: Person,
): boolean {
  if (!ev.personIds) return false;
  return (
    ev.personIds.indexOf(person.id) !== -1 ||
    ev.personIds.some((id) => id === person.name)
  );
}

export function formatDate(ts: string | null | undefined): string {
  if (!ts) return 'Unknown date';
  var d = new Date(ts);
  if (isNaN(d.getTime())) return ts;
  return (
    d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }) +
    ' ' +
    d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  );
}

export function getStatusBadgeClass(status: string): string {
  var s = (status || '').toLowerCase();
  if (s === 'reviewed') return 'badge-reviewed';
  if (s === 'flagged') return 'badge-flagged';
  return 'badge-unreviewed';
}

export function getRelevanceBadgeClass(relevance: string): string {
  var r = (relevance || '').toLowerCase();
  if (r === 'relevant') return 'badge-relevant';
  return 'badge-unreviewed';
}

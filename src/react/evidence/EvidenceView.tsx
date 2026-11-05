
import { useReducer } from 'react';
import EvidenceCard from './EvidenceCard';
import type { Evidence } from '../../data/types';

import {
  evidenceFilterReducer,
  initialFilterState,
} from './evidenceFilterReducer';

// Demo 9: No bookmark props.
// Bookmarks are managed through React Context.
type EvidenceViewProps = {
  evidence: Evidence[];
  onReviewStatusChange: (
    id: string,
    status: Evidence['status']
  ) => void;
};

export default function EvidenceView({
  evidence,
  onReviewStatusChange,
}: EvidenceViewProps) {
  // Demo 7: One reducer manages all filter and sort state
  const [filters, dispatch] = useReducer(
    evidenceFilterReducer,
    initialFilterState
  );

  // Derive filter options from the full evidence list
  const types = [
    ...new Set(evidence.map((item) => item.type)),
  ];

  const personIds = [
    ...new Set(evidence.flatMap((item) => item.personIds)),
  ];

  const locationIds = [
    ...new Set(evidence.flatMap((item) => item.locationIds)),
  ];

  const statuses = [
    ...new Set(
      evidence.map((item) => item.status.toLowerCase())
    ),
  ];

  const relevances = [
    ...new Set(
      evidence.map((item) => item.relevance.toLowerCase())
    ),
  ];

  // Demo 4 + Demo 7:
  // Derive visible evidence without mutating the source array.
  const visibleEvidence = evidence
    .filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(filters.search.toLowerCase());

      const matchesType =
        !filters.type ||
        item.type === filters.type;

      const matchesPerson =
        !filters.person ||
        item.personIds.some(
          (personId) => personId === filters.person
        );

      const matchesLocation =
        !filters.location ||
        item.locationIds.includes(filters.location);

      const matchesStatus =
        !filters.status ||
        item.status.toLowerCase() === filters.status;

      const matchesRelevance =
        !filters.relevance ||
        item.relevance.toLowerCase() === filters.relevance;

      return (
        matchesSearch &&
        matchesType &&
        matchesPerson &&
        matchesLocation &&
        matchesStatus &&
        matchesRelevance
      );
    })
    .sort((a, b) => {
      const difference =
        new Date(a.timestamp).getTime() -
        new Date(b.timestamp).getTime();

      return filters.sortOrder === 'newest'
        ? -difference
        : difference;
    });

  return (
    <div>
      <h2>Evidence Catalogue</h2>

      <p>
        Showing {visibleEvidence.length} of{' '}
        {evidence.length} evidence items
      </p>

      {/* Search filter */}
      <input
        type="text"
        placeholder="Search evidence..."
        aria-label="Search evidence"
        value={filters.search}
        onChange={(event) =>
          dispatch({
            type: 'SET_FILTER',
            field: 'search',
            value: event.target.value,
          })
        }
      />

      {/* Type filter */}
      <select
        aria-label="Filter by type"
        value={filters.type}
        onChange={(event) =>
          dispatch({
            type: 'SET_FILTER',
            field: 'type',
            value: event.target.value,
          })
        }
      >
        <option value="">All types</option>
        {types.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      {/* Person filter */}
      <select
        aria-label="Filter by person"
        value={filters.person}
        onChange={(event) =>
          dispatch({
            type: 'SET_FILTER',
            field: 'person',
            value: event.target.value,
          })
        }
      >
        <option value="">All people</option>
        {personIds.map((id) => (
          <option key={id} value={id}>
            {id}
          </option>
        ))}
      </select>

      {/* Location filter */}
      <select
        aria-label="Filter by location"
        value={filters.location}
        onChange={(event) =>
          dispatch({
            type: 'SET_FILTER',
            field: 'location',
            value: event.target.value,
          })
        }
      >
        <option value="">All locations</option>
        {locationIds.map((id) => (
          <option key={id} value={id}>
            {id}
          </option>
        ))}
      </select>

      {/* Status filter */}
      <select
        aria-label="Filter by status"
        value={filters.status}
        onChange={(event) =>
          dispatch({
            type: 'SET_FILTER',
            field: 'status',
            value: event.target.value,
          })
        }
      >
        <option value="">All statuses</option>
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      {/* Relevance filter */}
      <select
        aria-label="Filter by relevance"
        value={filters.relevance}
        onChange={(event) =>
          dispatch({
            type: 'SET_FILTER',
            field: 'relevance',
            value: event.target.value,
          })
        }
      >
        <option value="">All relevance</option>
        {relevances.map((relevance) => (
          <option key={relevance} value={relevance}>
            {relevance}
          </option>
        ))}
      </select>

      {/* Sort order */}
      <select
        aria-label="Sort evidence"
        value={filters.sortOrder}
        onChange={(event) =>
          dispatch({
            type: 'SET_SORT',
            value: event.target.value as
              'newest' | 'oldest',
          })
        }
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
      </select>

      {/* Reset all filter and sort values */}
      <button
        type="button"
        onClick={() =>
          dispatch({ type: 'CLEAR_FILTERS' })
        }
      >
        Clear Filters
      </button>

      {/* Evidence cards */}
      {visibleEvidence.map((item) => (
        <EvidenceCard
          key={item.id}
          evidence={item}
          onReviewStatusChange={
            onReviewStatusChange
          }
        />
      ))}
    </div>
  );
}

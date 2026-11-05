import { useState } from 'react';
import { NavLink, Routes, Route, Navigate } from 'react-router-dom';

import { allEvidence, allPeople } from '../state/state.ts';

import type { Evidence } from '../data/types';

import Dashboard from './dashboard/Dashboard';
import EvidenceView from './evidence/EvidenceView';
import WorkspaceView from './workspace/WorkspaceView';
import PeopleView from './people-locations/PeopleView';
import PersonalDetail from './people-locations/PersonalDetail';
import TimelineView from './timeline/TimelineView';

export default function App() {
  // Demo 6: App owns evidence review state
  const [evidence, setEvidence] = useState<Evidence[]>(() => [...allEvidence]);

  // Demo 6: Callback for review-status changes
  function handleReviewStatusChange(
    evidenceId: string,
    newStatus: Evidence['status'],
  ) {
    setEvidence((previousEvidence) =>
      previousEvidence.map((item) =>
        item.id === evidenceId ? { ...item, status: newStatus } : item,
      ),
    );
  }

  return (
    <>
      <header>
        <h1>Project ReMotion</h1>
      </header>

      <nav className="react-nav">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/evidence">Evidence</NavLink>
        <NavLink to="/team/people">People</NavLink>
        <NavLink to="/team/locations">Locations</NavLink>
        <NavLink to="/timeline">Timeline</NavLink>
        <NavLink to="/workspace">Workspace</NavLink>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={<Dashboard evidence={evidence} />}
          />

          {/* Evidence Catalogue */}
          <Route
            path="/evidence"
            element={
              <EvidenceView
                evidence={evidence}
                onReviewStatusChange={handleReviewStatusChange}
              />
            }
          />

          {/* People */}
          <Route path="/team/people" element={<PeopleView mode="people" />} />

          {/* Person detail */}
          <Route path="/team/people/:personId" element={<PersonalDetail />} />

          {/* Locations */}
          <Route
            path="/team/locations"
            element={<PeopleView mode="locations" />}
          />

          {/* Timeline */}
          <Route path="/timeline" element={<TimelineView />} />

          {/* Workspace */}
          <Route
            path="/workspace"
            element={<WorkspaceView evidence={evidence} people={allPeople} />}
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </>
  );
}

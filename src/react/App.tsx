import { NavLink, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './dashboard/Dashboard';
import PeopleView from './people-locations/PeopleView';
import PersonalDetail from './people-locations/PersonalDetail';
import TimelineView from './timeline/TimelineView';

export default function App() {
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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/evidence" element={<h2>Evidence</h2>} />
          <Route path="/team/people" element={<PeopleView mode="people" />} />
          /* Demo 9: Dynamic route parameters */
          <Route path="/team/people/:personId" element={<PersonalDetail />} />
          <Route
            path="/team/locations"
            element={<PeopleView mode="locations" />}
          />
          <Route path="/timeline" element={<TimelineView />} />
          <Route path="/workspace" element={<h2>Workspace</h2>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </>
  );
}

import { Link } from 'react-router-dom';
import './Dashboard.css';

import {
  allPeople,
  allLocations,
  allTimeline,
  caseData,
} from '../../state/state.ts';

import { formatDate, getStatusBadgeClass } from '../../utils/utils.ts';

import type { Evidence } from '../../data/types';
import { useBookmarks } from '../context/BookmarksContext';

type StatCardProps = {
  title: string;
  value: number;
  colorClass: string;
  to: '/evidence' | '/team/people' | '/team/locations';
};

type DashboardProps = {
  evidence: Evidence[];
};

function StatCard({ title, value, colorClass, to }: StatCardProps) {
  return (
    <Link to={to} className="dashboard-stat-card">
      <h3 className="dashboard-stat-title">{title}</h3>

      <div className={`dashboard-stat-value ${colorClass}`}>{value}</div>
    </Link>
  );
}

export default function Dashboard({ evidence }: DashboardProps) {
  // Demo 8: Shared bookmark state from React Context
  const { bookmarks } = useBookmarks();

  // Temporary debugging for Context synchronization
  console.log('Dashboard Context bookmarks:', bookmarks);
  console.log('Dashboard bookmark count:', bookmarks.length);

  // Derived statistics
  const totalEvidence = evidence.length;
  const totalPeople = allPeople.length;
  const totalLocations = allLocations.length;

  // Demo 4 + Demo 8: Derived bookmark count
  const bookmarkCount = bookmarks.length;

  // Use React evidence state instead of legacy allEvidence
  const reviewedCount = evidence.filter(
    (item) => item.status.toLowerCase() === 'reviewed',
  ).length;

  const flaggedCount = evidence.filter(
    (item) => item.status.toLowerCase() === 'flagged',
  ).length;

  const reviewPercentage =
    totalEvidence === 0 ? 0 : Math.round((reviewedCount / totalEvidence) * 100);

  // Immutable sorting: never modify original evidence array
  const recentEvidence = [...evidence]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
    .slice(0, 5);

  const recentTimeline = allTimeline.slice(-5).reverse();

  return (
    <section>
      {/* Case summary */}
      <div className="mb-4">
        <h2>{caseData.title || 'Investigation Overview'}</h2>

        <p className="text-muted">
          Overview of current evidence, key personnel, and timeline events.
        </p>
      </div>

      {/* Statistic cards */}
      <div className="dashboard-stats">
        <StatCard
          title="Total Evidence"
          value={totalEvidence}
          colorClass="text-primary"
          to="/evidence"
        />

        <StatCard
          title="Bookmarks"
          value={bookmarkCount}
          colorClass="text-secondary"
          to="/evidence"
        />

        <StatCard
          title="Reviewed"
          value={reviewedCount}
          colorClass="text-success"
          to="/evidence"
        />

        <StatCard
          title="Flagged"
          value={flaggedCount}
          colorClass="text-danger"
          to="/evidence"
        />

        <StatCard
          title="People"
          value={totalPeople}
          colorClass="text-info"
          to="/team/people"
        />

        <StatCard
          title="Locations"
          value={totalLocations}
          colorClass="text-warning"
          to="/team/locations"
        />
      </div>

      {/* Review progress */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>Review Progress</h5>

          <p>
            {reviewedCount} of {totalEvidence} evidence items reviewed (
            {reviewPercentage}%)
          </p>

          <div className="progress">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${reviewPercentage}%` }}
              aria-valuenow={reviewPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              {reviewPercentage}%
            </div>
          </div>
        </div>
      </div>

      {/* Recent evidence */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>Recent Evidence</h5>

          {recentEvidence.length === 0 ? (
            <p className="text-muted">No evidence loaded.</p>
          ) : (
            <ul className="list-group list-group-flush">
              {recentEvidence.map((item) => (
                <li
                  key={item.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>
                      {item.id}: {item.title}
                    </strong>

                    <br />

                    <small className="text-muted">
                      {formatDate(item.timestamp)}
                    </small>
                  </div>

                  <span className={`badge ${getStatusBadgeClass(item.status)}`}>
                    {item.status || 'unreviewed'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Recent timeline */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>Recent Timeline</h5>

          {recentTimeline.length === 0 ? (
            <p className="text-muted">No timeline events loaded.</p>
          ) : (
            <ul className="list-group list-group-flush">
              {recentTimeline.map((event) => (
                <li key={event.id} className="list-group-item">
                  <strong>{event.title}</strong>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

import {
  allEvidence,
  allPeople,
  allLocations,
  allTimeline,
  caseData,
  type ViewId,
} from '../state/state.ts';

import { formatDate, getStatusBadgeClass } from '../utils/utils.ts';

type StatCardProps = {
  title: string;
  value: number;
  colorClass: string;
  targetView: ViewId;
};

function StatCard({
  title,
  value,
  colorClass,
  targetView,
}: StatCardProps) {
  function handleClick() {
    window.location.hash = targetView;
  }

  return (
    <div className="col-md-2 col-sm-4 mb-3">
      <div
        className="card stat-card text-center h-100"
        style={{ cursor: 'pointer' }}
        onClick={handleClick}
      >
        <div className="card-body">
          <h6 className="card-subtitle mb-2 text-muted">{title}</h6>
          <h3 className={`card-title ${colorClass} mb-0`}>{value}</h3>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const totalEvidence = allEvidence.length;
  const totalPeople = allPeople.length;
  const totalLocations = allLocations.length;

  const reviewedCount = allEvidence.filter(
    (item) => (item.status || '').toLowerCase() === 'reviewed',
  ).length;

  const flaggedCount = allEvidence.filter(
    (item) => (item.status || '').toLowerCase() === 'flagged',
  ).length;

  const reviewPercentage =
    totalEvidence === 0
      ? 0
      : Math.round((reviewedCount / totalEvidence) * 100);

  const recentEvidence = allEvidence
    .slice()
    .sort(
      (a, b) =>
        new Date(b.timestamp || 0).getTime() -
        new Date(a.timestamp || 0).getTime(),
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

      {/* Stat cards */}
      <div className="row">
        <StatCard
          title="Total Evidence"
          value={totalEvidence}
          colorClass="text-primary"
          targetView="evidence"
        />

        <StatCard
          title="Reviewed"
          value={reviewedCount}
          colorClass="text-success"
          targetView="evidence"
        />

        <StatCard
          title="Flagged"
          value={flaggedCount}
          colorClass="text-danger"
          targetView="evidence"
        />

        <StatCard
          title="People"
          value={totalPeople}
          colorClass="text-info"
          targetView="people"
        />

        <StatCard
          title="Locations"
          value={totalLocations}
          colorClass="text-warning"
          targetView="people"
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

                  <span
                    className={`badge ${getStatusBadgeClass(item.status)}`}
                  >
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
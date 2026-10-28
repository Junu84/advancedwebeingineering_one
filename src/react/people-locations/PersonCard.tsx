type PersonCardProps = {
  name: string;
  role: string;
  evidenceCount: number;
};

// Function component with typed props
export function PersonCard({ name, role, evidenceCount }: PersonCardProps) {
  return (
    <div className="col-md-4 mb-3">
      <div className="card h-100">
        <div className="card-body">
          {/* Display person's name */}
          <h5 className="card-title">{name}</h5>

          {/* Fallback if role is empty */}
          <h6 className="card-subtitle mb-2 text-muted">
            {role || 'Role unspecified'}
          </h6>

          <p className="card-text small">No description available.</p>
        </div>

        <div className="card-footer bg-transparent border-0 pt-0">
          <span className="badge bg-secondary">
            {evidenceCount} linked evidence item(s)
          </span>
        </div>
      </div>
    </div>
  );
}

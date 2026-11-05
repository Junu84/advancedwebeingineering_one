
import type { Evidence } from '../../data/types';
import { useBookmarks } from '../context/BookmarksContext';

type EvidenceCardProps = {
  evidence: Evidence;
  onReviewStatusChange: (
    id: string,
    status: Evidence['status']
  ) => void;
};

export default function EvidenceCard({
  evidence,
  onReviewStatusChange,
}: EvidenceCardProps) {
  // Demo 8: Read bookmark state and callback from Context
  const { bookmarks, toggleBookmark } = useBookmarks();

  const isBookmarked = bookmarks.includes(evidence.id);

  const isReviewed =
    evidence.status.toLowerCase() === 'reviewed';

  return (
    <div className="evidence-card">
      <h3>{evidence.title}</h3>

      {/* Demo 8: Bookmark toggle through Context */}
      <button
        type="button"
        onClick={() => toggleBookmark(evidence.id)}
        aria-label={
          isBookmarked ? 'Remove bookmark' : 'Add bookmark'
        }
        aria-pressed={isBookmarked}
      >
        {isBookmarked ? '★' : '☆'}
      </button>

      <p>{evidence.summary}</p>

      {/* Demo 6: Review status */}
      <p>
        <strong>Status:</strong> {evidence.status}
      </p>

      <button
        type="button"
        onClick={() =>
          onReviewStatusChange(evidence.id, 'reviewed')
        }
        disabled={isReviewed}
      >
        {isReviewed ? 'Reviewed ✓' : 'Mark as Reviewed'}
      </button>
    </div>
  );
}

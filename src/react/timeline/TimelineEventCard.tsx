import type { TimelineEvent } from '../../data/types.ts';

type TimelineEventCardProps = {
  event: TimelineEvent;
};

export function TimelineEventCard({ event }: TimelineEventCardProps) {
  return (
    <div className="card">
      <p>Event ID: {event.id}</p>
    </div>
  );
}


import { useSearchParams } from 'react-router-dom';
import { allTimeline } from '../../state/state.ts';
import { TimelineEventCard } from './TimelineEventCard';
import { Card } from '../components/Card';

export default function TimelineView() {
  // Demo 10: Read query parameter from URL
  const [searchParams] = useSearchParams();
  const personId = searchParams.get('person');

  // Filter timeline events by person ID
  const filteredEvents = personId
    ? allTimeline.filter((event) =>
       event.personIds.some((id) => String(id) === personId)
      )
    : allTimeline;

  return (
    <section>
      <h2>Investigation Timeline</h2>

      <Card>
        <h3>Timeline Overview</h3>
        <p>Timeline events: {filteredEvents.length}</p>

        {personId && (
          <p>Filtered by person: {personId}</p>
        )}
      </Card>

      {filteredEvents.length === 0 ? (
        <p>No timeline events found.</p>
      ) : (
        <div className="row">
          {filteredEvents.map((event) => (
            <TimelineEventCard
              key={event.id}
              event={event}
            />
          ))}
        </div>
      )}
    </section>
  );
}

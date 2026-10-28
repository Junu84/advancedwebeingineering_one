
import {
  allPeople,
  allEvidence,
  allLocations,
} from '../../state/state.ts';

import { Card } from '../components/Card';
import { LocationCard } from './LocationCard';
import PeopleList from './PeopleList';

type PeopleViewProps = {
  mode: 'people' | 'locations';
};

export default function PeopleView({ mode }: PeopleViewProps) {
  return (
    <section>
      <h2>People & Locations</h2>

      {mode === 'people' ? (
        <>
          <Card>
            <h3>Investigation Team</h3>
            <p>People loaded: {allPeople.length}</p>
          </Card>

          <PeopleList
            people={allPeople}
            evidence={allEvidence}
          />

          {allPeople.length > 0 && (
            <p>Showing {allPeople.length} people.</p>
          )}
        </>
      ) : (
        <>
          <h3>Investigation Locations</h3>

          <div className="row">
            {allLocations.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

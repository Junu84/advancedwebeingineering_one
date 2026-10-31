
import { Link } from 'react-router-dom';
import { PersonCard } from './PersonCard.tsx';
import type { Person, Evidence } from '../../data/types.ts';

type PeopleListProps = {
  people: Person[];
  evidence: Evidence[];
};

// DEMO 5: Feature-specific list component.
// Calculates evidence counts and delegates UI to PersonCard.
export default function PeopleList({
  people,
  evidence,
}: PeopleListProps) {
  if (people.length === 0) {
    return <p>No people found.</p>;
  }

  return (
    <div className="people-grid">
      {people.map((person) => {
        const evidenceCount = evidence.filter(
          (item) => item.personIds.includes(person.id)
        ).length;

        return (
          <Link
            key={person.id}
            to={`/team/people/${person.id}`}
            className="person-link"
          >
            <PersonCard
              person={person}
              evidenceCount={evidenceCount}
            />
          </Link>
        );
      })}
    </div>
  );
}

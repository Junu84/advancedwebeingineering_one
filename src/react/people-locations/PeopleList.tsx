
import { PersonCard } from './PersonCard.tsx';
import type { Person, Evidence } from '../../data/types.ts';
import { Link } from 'react-router-dom';

type PeopleListProps = {
  people: Person[];
  evidence: Evidence[];
};

export default function PeopleList({
  people,
  evidence,
}: PeopleListProps) {
  if (people.length === 0) {
    return <p>No people found.</p>;
  }

  return (
    <div className="row">
      {people.map((person) => {
        const evidenceCount = evidence.filter(
          (item) => item.personIds?.includes(person.id)
        ).length;

        return (
          /* Demo 9: Dynamic route parameters */
          <Link
            key={person.id}
            to={`/team/people/${person.id}`}
            className="person-link"
          >
            <PersonCard
              name={person.name || person.id}
              role={person.role}
              evidenceCount={evidenceCount}
            />
          </Link>
        );
      })}
    </div>
  );
}


import type { Person } from '../../data/types.ts';

type PersonCardProps = {
  person: Person;
  evidenceCount: number;
};

// DEMO 5: Presentational component.
// Receives data through typed props and only displays the UI.
export function PersonCard({
  person,
  evidenceCount,
}: PersonCardProps) {
  return (
    <article className="person-card">
      <div className="person-card-header">
        <img
          src={`/${person.avatar.replace(/^\/+/, '')}`}
          alt={person.name}
          className="person-avatar"
        />     

        <div>
          <h3>{person.name}</h3>
          <p>{person.role}</p>
        </div>
      </div>

      <p>
        <strong>Speciality:</strong> {person.speciality}
      </p>

      <ul>
        {person.responsibilities.map((responsibility) => (
          <li key={responsibility}>
            {responsibility}
          </li>
        ))}
      </ul>

      <blockquote>
        "{person.statement}"
      </blockquote>

      <p>{person.background}</p>

      <p>{evidenceCount} related evidence items</p>
    </article>
  );
}

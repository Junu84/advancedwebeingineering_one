import { useParams, Link } from 'react-router-dom';
import { allPeople } from '../../state/state.ts';

export default function PersonDetail() {
  const { personId } = useParams<{ personId: string }>();

  console.log('Route personId:', personId);
  console.log('Loaded people:', allPeople.length);
  console.log(
    'Available IDs:',
    allPeople.map((p) => p.id),
  );

  const person = allPeople.find((p) => String(p.id) === personId);

  if (!person) {
    return (
      <section>
        <h2>Person not found</h2>
        <p>No person matches the requested ID.</p>
        <Link to="/team/people">Back to People</Link>
      </section>
    );
  }

  return (
    <section>
      <h2>{person.name}</h2>
      <p>Person ID: {person.id}</p>

      <Link to="/team/people">Back to People</Link>
    </section>
  );
}

import { useState } from 'react';

const initialPeople = [
  { id: 'P01', name: 'Alice' },
  { id: 'P02', name: 'Bob' },
  { id: 'P03', name: 'Charlie' },
];

function PersonRow({ name }: { name: string }) {
  return (
    <div>
      <strong>{name}</strong>
      <input defaultValue={name} />
    </div>
  );
}

export default function KeyDemo() {
  const [people, setPeople] = useState(initialPeople);
  const [useIndex, setUseIndex] = useState(true);
  function removeFirst() {
    setPeople((prev) => prev.slice(1));
  }

  function reset() {
    setPeople(initialPeople);
  }
  return (
    <section>
      <h2>Demo 4 — Stable Keys</h2>

      <button onClick={removeFirst}>
        Remove first person
      </button>

      <button onClick={reset}>Reset</button>

      <button
        onClick={() => {
          setUseIndex(!useIndex);
          reset();
        }}
      >
        Switch to {useIndex ? 'ID keys' : 'index keys'}
      </button>

      <p>
        Current key: {useIndex ? 'index' : 'person.id'}
      </p>

      <div key={String(useIndex)}>
        {people.map((person, index) => (
          <PersonRow
            key={useIndex ? index : person.id}
            name={person.name}
          />
        ))}
      </div>
    </section>
  );
}
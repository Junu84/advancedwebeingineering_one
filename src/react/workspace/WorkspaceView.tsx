import { useState, type ChangeEvent } from 'react';

import type { Evidence, Person } from '../../data/types';
import { useBookmarks } from '../context/BookmarksContext';

// Props received from App.tsx
type WorkspaceViewProps = {
  evidence: Evidence[];
  people: Person[];
};

// Demo 2: Controlled hypothesis form
type HypothesisForm = {
  suspect: string;
  nature: string;
  evidenceIds: string[];
  confidence: number;
  explanation: string;
  alternative: string;
};

export default function WorkspaceView({
  evidence,
  people,
}: WorkspaceViewProps) {
  // Demo 8: Read shared bookmarks from React Context
  const { bookmarks } = useBookmarks();

  // Demo 2: Controlled form state
  const [hypothesis, setHypothesis] = useState<HypothesisForm>({
    suspect: '',
    nature: '',
    evidenceIds: [],
    confidence: 50,
    explanation: '',
    alternative: '',
  });

  // Update one field without mutating the other fields
  function updateField<K extends keyof HypothesisForm>(
    field: K,
    value: HypothesisForm[K],
  ) {
    setHypothesis((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  // Handle multiple evidence selections
  function handleEvidenceChange(event: ChangeEvent<HTMLSelectElement>) {
    const selectedIds = Array.from(
      event.target.selectedOptions,
      (option) => option.value,
    );

    updateField('evidenceIds', selectedIds);
  }

  // Demo 4 + Demo 8:
  // Derive bookmarked evidence from Context during render
  const bookmarkedEvidence = evidence.filter((item) =>
    bookmarks.includes(item.id),
  );

  return (
    <section>
      <h2>Investigation Workspace</h2>

      {/* Demo 2: Controlled hypothesis form */}
      <form onSubmit={(event) => event.preventDefault()}>
        {/* Suspect */}
        <div>
          <label htmlFor="suspect">Suspect</label>

          <select
            id="suspect"
            value={hypothesis.suspect}
            onChange={(event) => updateField('suspect', event.target.value)}
          >
            <option value="">Select a suspect</option>

            {people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </div>

        {/* Nature */}
        <div>
          <label htmlFor="nature">Nature</label>

          <select
            id="nature"
            value={hypothesis.nature}
            onChange={(event) => updateField('nature', event.target.value)}
          >
            <option value="">Select nature</option>
            <option value="sabotage">Sabotage</option>
            <option value="accident">Accident</option>
            <option value="negligence">Negligence</option>
          </select>
        </div>

        {/* Evidence multi-select */}
        <div>
          <label htmlFor="evidence">Evidence</label>

          <select
            id="evidence"
            multiple
            size={6}
            value={hypothesis.evidenceIds}
            onChange={handleEvidenceChange}
            style={{
              minWidth: '300px',
              maxWidth: '100%',
            }}
          >
            {evidence.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>

          <p>Use Ctrl or Cmd to select multiple items.</p>
        </div>

        {/* Confidence slider */}
        <div>
          <label htmlFor="confidence">
            Confidence: {hypothesis.confidence}%
          </label>

          <input
            id="confidence"
            type="range"
            min="0"
            max="100"
            value={hypothesis.confidence}
            onChange={(event) =>
              updateField('confidence', Number(event.target.value))
            }
          />
        </div>

        {/* Explanation */}
        <div>
          <label htmlFor="explanation">Explanation</label>

          <textarea
            id="explanation"
            rows={4}
            value={hypothesis.explanation}
            onChange={(event) => updateField('explanation', event.target.value)}
          />
        </div>

        {/* Alternative explanation */}
        <div>
          <label htmlFor="alternative">Alternative explanation</label>

          <textarea
            id="alternative"
            rows={4}
            value={hypothesis.alternative}
            onChange={(event) => updateField('alternative', event.target.value)}
          />
        </div>
      </form>

      {/* Demo 8: Bookmarks from React Context */}
      <div>
        <h3>Bookmarked Evidence</h3>

        {bookmarkedEvidence.length === 0 ? (
          <p>No bookmarked evidence yet.</p>
        ) : (
          <ul>
            {bookmarkedEvidence.map((item) => (
              <li key={item.id}>{item.title}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

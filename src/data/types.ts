export type PersonId =
  | 'signal-scholar'
  | 'kernel-colt'
  | 'nova-byte'
  | 'patch-vector'
  | 'refactor-rex'
  | 'root-harbor';

export interface CaseMetadata {
  caseId: string;
  title: string;
  subtitle: string;
  status: string;
  opened: string;
  summary: string;
  location: string;
  leadInvestigator: string;
  notes: string;
}

export interface Person {
  id: PersonId;
  name: string;
  role: string;
  speciality: string;
  responsibilities: string[];
  statement: string;
  background: string;
  avatar: string;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  contains: string[];
}

export interface Evidence {
  id: string;
  type: string;
  title: string;
  timestamp: string;
  summary: string;
  content: string;
  personIds: PersonId[];
  locationIds: string[];
  tags: string[];
  // Preserve legacy casing present in the JSON alongside the UI's choices.
  status: 'unreviewed' | 'reviewed' | 'Reviewed' | 'flagged';
  relevance: 'unknown' | 'Unknown' | 'relevant' | 'irrelevant';
  // Added by the application after loading; absent from the JSON.
  bookmarked?: boolean;
}

// JSON may contain a display name; application state uses canonical IDs only.
export type RawEvidence = Omit<Evidence, 'personIds'> & {
  personIds: string[];
};

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  type: string;
  certainty: 'confirmed' | 'reported' | 'contradictory';
  personIds: PersonId[];
  locationIds: string[];
  evidenceIds: string[];
}

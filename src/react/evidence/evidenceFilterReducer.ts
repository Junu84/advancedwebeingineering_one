export type SortOrder = 'newest' | 'oldest';

export type EvidenceFilterState = {
  search: string;
  type: string;
  person: string;
  location: string;
  status: string;
  relevance: string;
  sortOrder: SortOrder;
};

type FilterField = Exclude<keyof EvidenceFilterState, 'sortOrder'>;

export type EvidenceFilterAction =
  | {
      type: 'SET_FILTER';
      field: FilterField;
      value: string;
    }
  | {
      type: 'SET_SORT';
      value: SortOrder;
    }
  | {
      type: 'CLEAR_FILTERS';
    };

export const initialFilterState: EvidenceFilterState = {
  search: '',
  type: '',
  person: '',
  location: '',
  status: '',
  relevance: '',
  sortOrder: 'newest',
};

export function evidenceFilterReducer(
  state: EvidenceFilterState,
  action: EvidenceFilterAction,
): EvidenceFilterState {
  switch (action.type) {
    case 'SET_FILTER':
      return {
        ...state,
        [action.field]: action.value,
      };

    case 'SET_SORT':
      return {
        ...state,
        sortOrder: action.value,
      };

    case 'CLEAR_FILTERS':
      return { ...initialFilterState };

    default:
      return state;
  }
}

interface JournalEntry {
  title: string;
  photoUrl: string;
  notes: string;
  entryId: number;
}

interface Data {
  view: 'entries' | 'entry-form';
  entries: JournalEntry[];
  editing: null | JournalEntry;
  nextEntryId: number;
}

const data: Data = {
  view: 'entry-form',
  entries: [],
  editing: null,
  nextEntryId: 1,
};

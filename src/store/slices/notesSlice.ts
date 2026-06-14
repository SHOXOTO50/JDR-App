import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Note } from '../../types';

interface NotesState {
  notes: Note[];
}

const initialState: NotesState = { notes: [] };

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    addNote(state, action: PayloadAction<Note>) {
      state.notes.push(action.payload);
    },
    updateNote(state, action: PayloadAction<Note>) {
      const idx = state.notes.findIndex((n) => n.id === action.payload.id);
      if (idx !== -1) {
        state.notes[idx] = { ...action.payload, updatedAt: new Date().toISOString() };
      }
    },
    deleteNote(state, action: PayloadAction<string>) {
      state.notes = state.notes.filter((n) => n.id !== action.payload);
    },
    deleteNotesByCharacter(state, action: PayloadAction<string>) {
      state.notes = state.notes.filter((n) => n.characterId !== action.payload);
    },
  },
});

export const { addNote, updateNote, deleteNote, deleteNotesByCharacter } = notesSlice.actions;
export default notesSlice.reducer;

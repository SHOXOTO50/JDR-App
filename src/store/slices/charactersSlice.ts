import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Character, CharacterStat, CharacterSkill, Spell, Currency } from '../../types';

interface CharactersState {
  characters: Character[];
  currentCharacterId: string | null;
}

const initialState: CharactersState = {
  characters: [],
  currentCharacterId: null,
};

const charactersSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    addCharacter(state, action: PayloadAction<Character>) {
      state.characters.push(action.payload);
    },
    updateCharacter(state, action: PayloadAction<Character>) {
      const idx = state.characters.findIndex((c) => c.id === action.payload.id);
      if (idx !== -1) {
        state.characters[idx] = { ...action.payload, updatedAt: new Date().toISOString() };
      }
    },
    deleteCharacter(state, action: PayloadAction<string>) {
      state.characters = state.characters.filter((c) => c.id !== action.payload);
      if (state.currentCharacterId === action.payload) {
        state.currentCharacterId = null;
      }
    },
    selectCharacter(state, action: PayloadAction<string | null>) {
      state.currentCharacterId = action.payload;
    },
    updateCharacterStats(state, action: PayloadAction<{ id: string; stats: CharacterStat[] }>) {
      const char = state.characters.find((c) => c.id === action.payload.id);
      if (char) {
        char.stats = action.payload.stats;
        char.updatedAt = new Date().toISOString();
      }
    },
    updateCharacterSkills(state, action: PayloadAction<{ id: string; skills: CharacterSkill[] }>) {
      const char = state.characters.find((c) => c.id === action.payload.id);
      if (char) {
        char.skills = action.payload.skills;
        char.updatedAt = new Date().toISOString();
      }
    },
    updateCharacterSpells(state, action: PayloadAction<{ id: string; spells: Spell[] }>) {
      const char = state.characters.find((c) => c.id === action.payload.id);
      if (char) {
        char.spells = action.payload.spells;
        char.updatedAt = new Date().toISOString();
      }
    },
    updateCharacterHP(
      state,
      action: PayloadAction<{ id: string; currentHP: number; maxHP?: number; tempHP?: number }>
    ) {
      const char = state.characters.find((c) => c.id === action.payload.id);
      if (char) {
        char.currentHP = Math.max(0, action.payload.currentHP);
        if (action.payload.maxHP !== undefined) char.maxHP = action.payload.maxHP;
        if (action.payload.tempHP !== undefined) char.tempHP = Math.max(0, action.payload.tempHP);
        char.updatedAt = new Date().toISOString();
      }
    },
    updateCharacterCurrency(state, action: PayloadAction<{ id: string; currency: Currency }>) {
      const char = state.characters.find((c) => c.id === action.payload.id);
      if (char) {
        char.currency = action.payload.currency;
        char.updatedAt = new Date().toISOString();
      }
    },
    updateDeathSaves(
      state,
      action: PayloadAction<{ id: string; successes: number; failures: number }>
    ) {
      const char = state.characters.find((c) => c.id === action.payload.id);
      if (char) {
        char.deathSaves = {
          successes: action.payload.successes,
          failures: action.payload.failures,
        };
        char.updatedAt = new Date().toISOString();
      }
    },
    toggleInspiration(state, action: PayloadAction<string>) {
      const char = state.characters.find((c) => c.id === action.payload);
      if (char) {
        char.inspiration = !char.inspiration;
        char.updatedAt = new Date().toISOString();
      }
    },
  },
});

export const {
  addCharacter,
  updateCharacter,
  deleteCharacter,
  selectCharacter,
  updateCharacterStats,
  updateCharacterSkills,
  updateCharacterSpells,
  updateCharacterHP,
  updateCharacterCurrency,
  updateDeathSaves,
  toggleInspiration,
} = charactersSlice.actions;

export default charactersSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SpellSlotLevel {
  level: number;
  total: number;
  used: number;
}

export interface CharacterResources {
  characterId: string;
  spellSlots: SpellSlotLevel[];
  ki: { total: number; used: number };
  bardicInspiration: { total: number; used: number };
  rage: { total: number; used: number };
  sorcery: { total: number; used: number };
  customResources: Array<{ id: string; name: string; total: number; used: number }>;
}

interface ResourcesState {
  resources: CharacterResources[];
}

const defaultResources = (characterId: string): CharacterResources => ({
  characterId,
  spellSlots: [1,2,3,4,5,6,7,8,9].map((l) => ({ level: l, total: 0, used: 0 })),
  ki: { total: 0, used: 0 },
  bardicInspiration: { total: 0, used: 0 },
  rage: { total: 0, used: 0 },
  sorcery: { total: 0, used: 0 },
  customResources: [],
});

const initialState: ResourcesState = { resources: [] };

const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    ensureResources(state, action: PayloadAction<string>) {
      if (!state.resources.find((r) => r.characterId === action.payload)) {
        state.resources.push(defaultResources(action.payload));
      }
    },
    updateSlotTotal(state, action: PayloadAction<{ characterId: string; level: number; total: number }>) {
      let res = state.resources.find((r) => r.characterId === action.payload.characterId);
      if (!res) { state.resources.push(defaultResources(action.payload.characterId)); res = state.resources[state.resources.length - 1]; }
      const slot = res.spellSlots.find((s) => s.level === action.payload.level);
      if (slot) { slot.total = action.payload.total; if (slot.used > slot.total) slot.used = slot.total; }
    },
    useSpellSlot(state, action: PayloadAction<{ characterId: string; level: number }>) {
      const res = state.resources.find((r) => r.characterId === action.payload.characterId);
      if (!res) return;
      const slot = res.spellSlots.find((s) => s.level === action.payload.level);
      if (slot && slot.used < slot.total) slot.used += 1;
    },
    restoreSpellSlot(state, action: PayloadAction<{ characterId: string; level: number }>) {
      const res = state.resources.find((r) => r.characterId === action.payload.characterId);
      if (!res) return;
      const slot = res.spellSlots.find((s) => s.level === action.payload.level);
      if (slot && slot.used > 0) slot.used -= 1;
    },
    updateResourceTotal(state, action: PayloadAction<{ characterId: string; resource: 'ki' | 'bardicInspiration' | 'rage' | 'sorcery'; total: number }>) {
      let res = state.resources.find((r) => r.characterId === action.payload.characterId);
      if (!res) { state.resources.push(defaultResources(action.payload.characterId)); res = state.resources[state.resources.length - 1]; }
      const r = res[action.payload.resource];
      r.total = action.payload.total;
      if (r.used > r.total) r.used = r.total;
    },
    useResource(state, action: PayloadAction<{ characterId: string; resource: 'ki' | 'bardicInspiration' | 'rage' | 'sorcery' }>) {
      const res = state.resources.find((r) => r.characterId === action.payload.characterId);
      if (!res) return;
      const r = res[action.payload.resource];
      if (r.used < r.total) r.used += 1;
    },
    restoreResource(state, action: PayloadAction<{ characterId: string; resource: 'ki' | 'bardicInspiration' | 'rage' | 'sorcery' }>) {
      const res = state.resources.find((r) => r.characterId === action.payload.characterId);
      if (!res) return;
      const r = res[action.payload.resource];
      if (r.used > 0) r.used -= 1;
    },
    shortRest(state, action: PayloadAction<string>) {
      const res = state.resources.find((r) => r.characterId === action.payload);
      if (!res) return;
      res.bardicInspiration.used = 0;
      res.ki.used = 0;
      res.rage.used = 0;
    },
    longRest(state, action: PayloadAction<string>) {
      const res = state.resources.find((r) => r.characterId === action.payload);
      if (!res) return;
      res.spellSlots.forEach((s) => { s.used = 0; });
      res.ki.used = 0;
      res.bardicInspiration.used = 0;
      res.rage.used = 0;
      res.sorcery.used = 0;
      res.customResources.forEach((r) => { r.used = 0; });
    },
    addCustomResource(state, action: PayloadAction<{ characterId: string; name: string; total: number }>) {
      let res = state.resources.find((r) => r.characterId === action.payload.characterId);
      if (!res) { state.resources.push(defaultResources(action.payload.characterId)); res = state.resources[state.resources.length - 1]; }
      res.customResources.push({ id: Date.now().toString(), name: action.payload.name, total: action.payload.total, used: 0 });
    },
    useCustomResource(state, action: PayloadAction<{ characterId: string; id: string }>) {
      const res = state.resources.find((r) => r.characterId === action.payload.characterId);
      if (!res) return;
      const r = res.customResources.find((c) => c.id === action.payload.id);
      if (r && r.used < r.total) r.used += 1;
    },
    restoreCustomResource(state, action: PayloadAction<{ characterId: string; id: string }>) {
      const res = state.resources.find((r) => r.characterId === action.payload.characterId);
      if (!res) return;
      const r = res.customResources.find((c) => c.id === action.payload.id);
      if (r && r.used > 0) r.used -= 1;
    },
    deleteCustomResource(state, action: PayloadAction<{ characterId: string; id: string }>) {
      const res = state.resources.find((r) => r.characterId === action.payload.characterId);
      if (!res) return;
      res.customResources = res.customResources.filter((r) => r.id !== action.payload.id);
    },
  },
});

export const {
  ensureResources, updateSlotTotal, useSpellSlot, restoreSpellSlot,
  updateResourceTotal, useResource, restoreResource,
  shortRest, longRest,
  addCustomResource, useCustomResource, restoreCustomResource, deleteCustomResource,
} = resourcesSlice.actions;
export default resourcesSlice.reducer;

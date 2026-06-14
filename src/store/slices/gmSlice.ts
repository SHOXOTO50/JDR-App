import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NPC, Monster, Faction, Location, InventoryItem } from '../../types';

interface GMState {
  npcs: NPC[];
  monsters: Monster[];
  factions: Faction[];
  locations: Location[];
  specialItems: InventoryItem[];
}

const initialState: GMState = {
  npcs: [],
  monsters: [],
  factions: [],
  locations: [],
  specialItems: [],
};

const gmSlice = createSlice({
  name: 'gm',
  initialState,
  reducers: {
    addNPC(state, action: PayloadAction<NPC>) { state.npcs.push(action.payload); },
    updateNPC(state, action: PayloadAction<NPC>) {
      const idx = state.npcs.findIndex((n) => n.id === action.payload.id);
      if (idx !== -1) state.npcs[idx] = action.payload;
    },
    deleteNPC(state, action: PayloadAction<string>) {
      state.npcs = state.npcs.filter((n) => n.id !== action.payload);
    },
    addMonster(state, action: PayloadAction<Monster>) { state.monsters.push(action.payload); },
    updateMonster(state, action: PayloadAction<Monster>) {
      const idx = state.monsters.findIndex((m) => m.id === action.payload.id);
      if (idx !== -1) state.monsters[idx] = action.payload;
    },
    deleteMonster(state, action: PayloadAction<string>) {
      state.monsters = state.monsters.filter((m) => m.id !== action.payload);
    },
    addFaction(state, action: PayloadAction<Faction>) { state.factions.push(action.payload); },
    updateFaction(state, action: PayloadAction<Faction>) {
      const idx = state.factions.findIndex((f) => f.id === action.payload.id);
      if (idx !== -1) state.factions[idx] = action.payload;
    },
    deleteFaction(state, action: PayloadAction<string>) {
      state.factions = state.factions.filter((f) => f.id !== action.payload);
    },
    addLocation(state, action: PayloadAction<Location>) { state.locations.push(action.payload); },
    updateLocation(state, action: PayloadAction<Location>) {
      const idx = state.locations.findIndex((l) => l.id === action.payload.id);
      if (idx !== -1) state.locations[idx] = action.payload;
    },
    deleteLocation(state, action: PayloadAction<string>) {
      state.locations = state.locations.filter((l) => l.id !== action.payload);
    },
    updateFactionReputation(state, action: PayloadAction<{ id: string; reputation: number }>) {
      const faction = state.factions.find((f) => f.id === action.payload.id);
      if (faction) faction.reputation = Math.max(-100, Math.min(100, action.payload.reputation));
    },
    addSpecialItem(state, action: PayloadAction<InventoryItem>) {
      state.specialItems.push(action.payload);
    },
    deleteSpecialItem(state, action: PayloadAction<string>) {
      state.specialItems = state.specialItems.filter((i) => i.id !== action.payload);
    },
  },
});

export const {
  addNPC, updateNPC, deleteNPC,
  addMonster, updateMonster, deleteMonster,
  addFaction, updateFaction, deleteFaction,
  addLocation, updateLocation, deleteLocation,
  updateFactionReputation,
  addSpecialItem, deleteSpecialItem,
} = gmSlice.actions;

export default gmSlice.reducer;

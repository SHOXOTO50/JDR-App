import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AdventureRunState {
  adventureId: string | null;
  currentSceneId: string | null;
  visitedSceneIds: string[];
  flags: Record<string, string | number | boolean>;
  totalXP: number;
  totalGold: number;
  isComplete: boolean;
  startedAt: string | null;
}

const initialState: AdventureRunState = {
  adventureId: null,
  currentSceneId: null,
  visitedSceneIds: [],
  flags: {},
  totalXP: 0,
  totalGold: 0,
  isComplete: false,
  startedAt: null,
};

const adventureSlice = createSlice({
  name: 'adventure',
  initialState,
  reducers: {
    startAdventure(state, action: PayloadAction<{ adventureId: string; firstSceneId: string }>) {
      state.adventureId = action.payload.adventureId;
      state.currentSceneId = action.payload.firstSceneId;
      state.visitedSceneIds = [action.payload.firstSceneId];
      state.flags = {};
      state.totalXP = 0;
      state.totalGold = 0;
      state.isComplete = false;
      state.startedAt = new Date().toISOString();
    },
    goToScene(state, action: PayloadAction<string>) {
      state.currentSceneId = action.payload;
      if (!state.visitedSceneIds.includes(action.payload)) {
        state.visitedSceneIds.push(action.payload);
      }
    },
    setFlag(state, action: PayloadAction<{ key: string; value: string | number | boolean }>) {
      state.flags[action.payload.key] = action.payload.value;
    },
    gainReward(state, action: PayloadAction<{ xp?: number; gold?: number }>) {
      if (action.payload.xp) state.totalXP += action.payload.xp;
      if (action.payload.gold) state.totalGold += action.payload.gold;
    },
    markComplete(state) {
      state.isComplete = true;
    },
    resetAdventure() {
      return initialState;
    },
  },
});

export const { startAdventure, goToScene, setFlag, gainReward, markComplete, resetAdventure } = adventureSlice.actions;
export default adventureSlice.reducer;

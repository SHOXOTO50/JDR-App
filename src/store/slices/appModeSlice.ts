import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AppMode = 'solo' | 'local' | 'passplay';

interface AppModeState {
  mode: AppMode | null;
  groupReady: boolean;
  tutorialSeen: boolean;
}

const initialState: AppModeState = {
  mode: null,
  groupReady: false,
  tutorialSeen: false,
};

const appModeSlice = createSlice({
  name: 'appMode',
  initialState,
  reducers: {
    setAppMode(state, action: PayloadAction<AppMode | null>) {
      state.mode = action.payload;
      state.groupReady = false;
    },
    setGroupReady(state, action: PayloadAction<boolean>) {
      state.groupReady = action.payload;
    },
    setTutorialSeen(state) {
      state.tutorialSeen = true;
    },
  },
});

export const { setAppMode, setGroupReady, setTutorialSeen } = appModeSlice.actions;
export default appModeSlice.reducer;

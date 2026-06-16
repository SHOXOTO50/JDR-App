import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AppMode = 'solo' | 'local' | 'passplay';

interface AppModeState {
  mode: AppMode | null;
  groupReady: boolean;
}

const initialState: AppModeState = {
  mode: null,
  groupReady: false,
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
  },
});

export const { setAppMode, setGroupReady } = appModeSlice.actions;
export default appModeSlice.reducer;

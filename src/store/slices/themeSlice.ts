import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AppTheme = 'dark' | 'parchment' | 'modern' | 'legendary';

interface ThemeState {
  activeTheme: AppTheme;
  secretUnlocked: boolean;
  secretTapCount: number;
  secretLastTap: number;
  effectsEnabled: boolean;
  secretCampaignTapCount: number;
  secretCampaignUnlocked: boolean;
  secretCampaignLastTap: number;
}

const initialState: ThemeState = {
  activeTheme: 'dark',
  secretUnlocked: false,
  secretTapCount: 0,
  secretLastTap: 0,
  effectsEnabled: true,
  secretCampaignTapCount: 0,
  secretCampaignUnlocked: false,
  secretCampaignLastTap: 0,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<AppTheme>) {
      state.activeTheme = action.payload;
    },
    tapSecret(state) {
      const now = Date.now();
      if (now - state.secretLastTap > 2000) {
        state.secretTapCount = 1;
      } else {
        state.secretTapCount += 1;
      }
      state.secretLastTap = now;
      if (state.secretTapCount >= 7) {
        state.secretUnlocked = true;
        state.secretTapCount = 0;
      }
    },
    toggleEffects(state) {
      state.effectsEnabled = !state.effectsEnabled;
    },
    tapSecretCampaign(state) {
      if (!state.secretUnlocked) return;
      const now = Date.now();
      if (now - state.secretCampaignLastTap > 3000) {
        state.secretCampaignTapCount = 1;
      } else {
        state.secretCampaignTapCount += 1;
      }
      state.secretCampaignLastTap = now;
      if (state.secretCampaignTapCount >= 50) {
        state.secretCampaignUnlocked = true;
        state.secretCampaignTapCount = 0;
      }
    },
  },
});

export const { setTheme, tapSecret, toggleEffects, tapSecretCampaign } = themeSlice.actions;
export default themeSlice.reducer;

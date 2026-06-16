import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Campaign, CampaignSession } from '../../types';

interface CampaignSliceState {
  campaigns: Campaign[];
  activeCampaignId: string | null;
}

const initialState: CampaignSliceState = {
  campaigns: [],
  activeCampaignId: null,
};

const campaignSlice = createSlice({
  name: 'campaign',
  initialState,
  reducers: {
    addCampaign(state, action: PayloadAction<Campaign>) {
      state.campaigns.push(action.payload);
    },
    updateCampaign(state, action: PayloadAction<Campaign>) {
      const idx = state.campaigns.findIndex((c) => c.id === action.payload.id);
      if (idx !== -1) {
        state.campaigns[idx] = { ...action.payload, updatedAt: new Date().toISOString() };
      }
    },
    deleteCampaign(state, action: PayloadAction<string>) {
      state.campaigns = state.campaigns.filter((c) => c.id !== action.payload);
      if (state.activeCampaignId === action.payload) state.activeCampaignId = null;
    },
    setActiveCampaign(state, action: PayloadAction<string | null>) {
      state.activeCampaignId = action.payload;
    },
    setCampaignGMNotes(state, action: PayloadAction<{ campaignId: string; notes: string }>) {
      const campaign = state.campaigns.find((c) => c.id === action.payload.campaignId);
      if (campaign) {
        campaign.gmNotes = action.payload.notes;
        campaign.updatedAt = new Date().toISOString();
      }
    },
    addSession(state, action: PayloadAction<{ campaignId: string; session: CampaignSession }>) {
      const campaign = state.campaigns.find((c) => c.id === action.payload.campaignId);
      if (campaign) {
        campaign.sessions.push(action.payload.session);
        campaign.sessionCount = campaign.sessions.length;
        campaign.updatedAt = new Date().toISOString();
      }
    },
    updateSession(state, action: PayloadAction<{ campaignId: string; session: CampaignSession }>) {
      const campaign = state.campaigns.find((c) => c.id === action.payload.campaignId);
      if (campaign) {
        const idx = campaign.sessions.findIndex((s) => s.id === action.payload.session.id);
        if (idx !== -1) campaign.sessions[idx] = action.payload.session;
      }
    },
    deleteSession(state, action: PayloadAction<{ campaignId: string; sessionId: string }>) {
      const campaign = state.campaigns.find((c) => c.id === action.payload.campaignId);
      if (campaign) {
        campaign.sessions = campaign.sessions.filter((s) => s.id !== action.payload.sessionId);
        campaign.sessionCount = campaign.sessions.length;
      }
    },
    addCharacterToCampaign(state, action: PayloadAction<{ campaignId: string; characterId: string }>) {
      const campaign = state.campaigns.find((c) => c.id === action.payload.campaignId);
      if (campaign && !campaign.characterIds.includes(action.payload.characterId)) {
        campaign.characterIds.push(action.payload.characterId);
      }
    },
    removeCharacterFromCampaign(state, action: PayloadAction<{ campaignId: string; characterId: string }>) {
      const campaign = state.campaigns.find((c) => c.id === action.payload.campaignId);
      if (campaign) {
        campaign.characterIds = campaign.characterIds.filter((id) => id !== action.payload.characterId);
      }
    },
  },
});

export const {
  addCampaign,
  updateCampaign,
  deleteCampaign,
  setActiveCampaign,
  setCampaignGMNotes,
  addSession,
  updateSession,
  deleteSession,
  addCharacterToCampaign,
  removeCharacterFromCampaign,
} = campaignSlice.actions;

export default campaignSlice.reducer;

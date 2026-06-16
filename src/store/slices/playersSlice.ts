import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Player } from '../../types';

interface PlayersState {
  players: Player[];
}

const initialState: PlayersState = {
  players: [],
};

const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    addPlayer(state, action: PayloadAction<Player>) {
      state.players.push(action.payload);
    },
    updatePlayer(state, action: PayloadAction<Player>) {
      const idx = state.players.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.players[idx] = action.payload;
    },
    deletePlayer(state, action: PayloadAction<string>) {
      state.players = state.players.filter((p) => p.id !== action.payload);
    },
    deletePlayersByCampaign(state, action: PayloadAction<string>) {
      state.players = state.players.filter((p) => p.campaignId !== action.payload);
    },
  },
});

export const {
  addPlayer,
  updatePlayer,
  deletePlayer,
  deletePlayersByCampaign,
} = playersSlice.actions;

export default playersSlice.reducer;

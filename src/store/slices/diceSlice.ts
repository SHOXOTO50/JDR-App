import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DiceRoll } from '../../types';

interface DiceSliceState {
  rolls: DiceRoll[];
  maxHistory: number;
}

const initialState: DiceSliceState = {
  rolls: [],
  maxHistory: 100,
};

const diceSlice = createSlice({
  name: 'dice',
  initialState,
  reducers: {
    addRoll(state, action: PayloadAction<DiceRoll>) {
      state.rolls.unshift(action.payload);
      if (state.rolls.length > state.maxHistory) {
        state.rolls = state.rolls.slice(0, state.maxHistory);
      }
    },
    clearHistory(state) {
      state.rolls = [];
    },
  },
});

export const { addRoll, clearHistory } = diceSlice.actions;
export default diceSlice.reducer;

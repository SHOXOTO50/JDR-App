import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InventoryItem } from '../../types';

interface InventoryState {
  items: InventoryItem[];
}

const initialState: InventoryState = { items: [] };

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<InventoryItem>) {
      state.items.push(action.payload);
    },
    updateItem(state, action: PayloadAction<InventoryItem>) {
      const idx = state.items.findIndex((i) => i.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    deleteItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    deleteItemsByCharacter(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.characterId !== action.payload);
    },
    toggleEquipped(state, action: PayloadAction<string>) {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.equipped = !item.equipped;
    },
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) item.quantity = Math.max(0, action.payload.quantity);
    },
  },
});

export const {
  addItem,
  updateItem,
  deleteItem,
  deleteItemsByCharacter,
  toggleEquipped,
  updateQuantity,
} = inventorySlice.actions;

export default inventorySlice.reducer;

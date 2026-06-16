import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameMap, MapMarker } from '../../types';

interface MapsState {
  maps: GameMap[];
}

const initialState: MapsState = {
  maps: [],
};

const mapsSlice = createSlice({
  name: 'maps',
  initialState,
  reducers: {
    addMap(state, action: PayloadAction<GameMap>) {
      state.maps.push(action.payload);
    },
    updateMap(state, action: PayloadAction<GameMap>) {
      const idx = state.maps.findIndex((m) => m.id === action.payload.id);
      if (idx !== -1) state.maps[idx] = action.payload;
    },
    deleteMap(state, action: PayloadAction<string>) {
      state.maps = state.maps.filter((m) => m.id !== action.payload);
    },
    deleteMapsByCampaign(state, action: PayloadAction<string>) {
      state.maps = state.maps.filter((m) => m.campaignId !== action.payload);
    },
    addMarker(state, action: PayloadAction<{ mapId: string; marker: MapMarker }>) {
      const map = state.maps.find((m) => m.id === action.payload.mapId);
      if (map) map.markers.push(action.payload.marker);
    },
    updateMarker(state, action: PayloadAction<{ mapId: string; marker: MapMarker }>) {
      const map = state.maps.find((m) => m.id === action.payload.mapId);
      if (map) {
        const idx = map.markers.findIndex((mk) => mk.id === action.payload.marker.id);
        if (idx !== -1) map.markers[idx] = action.payload.marker;
      }
    },
    removeMarker(state, action: PayloadAction<{ mapId: string; markerId: string }>) {
      const map = state.maps.find((m) => m.id === action.payload.mapId);
      if (map) map.markers = map.markers.filter((mk) => mk.id !== action.payload.markerId);
    },
  },
});

export const {
  addMap,
  updateMap,
  deleteMap,
  deleteMapsByCampaign,
  addMarker,
  updateMarker,
  removeMarker,
} = mapsSlice.actions;

export default mapsSlice.reducer;

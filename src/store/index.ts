import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

import charactersReducer from './slices/charactersSlice';
import inventoryReducer from './slices/inventorySlice';
import notesReducer from './slices/notesSlice';
import questsReducer from './slices/questsSlice';
import combatReducer from './slices/combatSlice';
import gmReducer from './slices/gmSlice';
import campaignReducer from './slices/campaignSlice';
import diceReducer from './slices/diceSlice';
import mapsReducer from './slices/mapsSlice';
import playersReducer from './slices/playersSlice';
import appModeReducer from './slices/appModeSlice';
import themeReducer from './slices/themeSlice';
import resourcesReducer from './slices/resourcesSlice';
import adventureReducer from './slices/adventureSlice';

const rootReducer = combineReducers({
  characters: charactersReducer,
  inventory: inventoryReducer,
  notes: notesReducer,
  quests: questsReducer,
  combat: combatReducer,
  gm: gmReducer,
  campaign: campaignReducer,
  dice: diceReducer,
  maps: mapsReducer,
  players: playersReducer,
  appMode: appModeReducer,
  theme: themeReducer,
  resources: resourcesReducer,
  adventure: adventureReducer,
});

const persistConfig = {
  key: 'jdr-app-root',
  storage: AsyncStorage,
  whitelist: ['characters', 'inventory', 'notes', 'quests', 'gm', 'campaign', 'dice', 'maps', 'players', 'appMode', 'theme', 'resources', 'adventure'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Quest, QuestStatus, QuestObjective } from '../../types';

interface QuestsState {
  quests: Quest[];
}

const initialState: QuestsState = { quests: [] };

const questsSlice = createSlice({
  name: 'quests',
  initialState,
  reducers: {
    addQuest(state, action: PayloadAction<Quest>) {
      state.quests.push(action.payload);
    },
    updateQuest(state, action: PayloadAction<Quest>) {
      const idx = state.quests.findIndex((q) => q.id === action.payload.id);
      if (idx !== -1) {
        state.quests[idx] = { ...action.payload, updatedAt: new Date().toISOString() };
      }
    },
    deleteQuest(state, action: PayloadAction<string>) {
      state.quests = state.quests.filter((q) => q.id !== action.payload);
    },
    deleteQuestsByCharacter(state, action: PayloadAction<string>) {
      state.quests = state.quests.filter((q) => q.characterId !== action.payload);
    },
    updateQuestStatus(state, action: PayloadAction<{ id: string; status: QuestStatus }>) {
      const quest = state.quests.find((q) => q.id === action.payload.id);
      if (quest) {
        quest.status = action.payload.status;
        quest.updatedAt = new Date().toISOString();
      }
    },
    toggleObjective(state, action: PayloadAction<{ questId: string; objectiveId: string }>) {
      const quest = state.quests.find((q) => q.id === action.payload.questId);
      if (quest) {
        const obj = quest.objectives.find((o) => o.id === action.payload.objectiveId);
        if (obj) {
          obj.completed = !obj.completed;
          quest.updatedAt = new Date().toISOString();
        }
      }
    },
    addObjective(state, action: PayloadAction<{ questId: string; objective: QuestObjective }>) {
      const quest = state.quests.find((q) => q.id === action.payload.questId);
      if (quest) quest.objectives.push(action.payload.objective);
    },
    removeObjective(state, action: PayloadAction<{ questId: string; objectiveId: string }>) {
      const quest = state.quests.find((q) => q.id === action.payload.questId);
      if (quest) {
        quest.objectives = quest.objectives.filter((o) => o.id !== action.payload.objectiveId);
      }
    },
  },
});

export const {
  addQuest,
  updateQuest,
  deleteQuest,
  deleteQuestsByCharacter,
  updateQuestStatus,
  toggleObjective,
  addObjective,
  removeObjective,
} = questsSlice.actions;

export default questsSlice.reducer;

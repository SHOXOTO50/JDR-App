import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CombatState as CombatStateType, Combatant, CombatLogEntry } from '../../types';
import { generateId } from '../../utils/helpers';

interface CombatSliceState {
  combats: CombatStateType[];
  activeCombatId: string | null;
}

const initialState: CombatSliceState = {
  combats: [],
  activeCombatId: null,
};

const addLog = (combat: CombatStateType, message: string, type: CombatLogEntry['type']) => {
  combat.log.unshift({
    id: generateId(),
    message,
    timestamp: new Date().toISOString(),
    type,
  });
  if (combat.log.length > 100) combat.log = combat.log.slice(0, 100);
};

const combatSlice = createSlice({
  name: 'combat',
  initialState,
  reducers: {
    startCombat(state, action: PayloadAction<CombatStateType>) {
      state.combats.push(action.payload);
      state.activeCombatId = action.payload.id;
    },
    endCombat(state, action: PayloadAction<string>) {
      const combat = state.combats.find((c) => c.id === action.payload);
      if (combat) {
        combat.active = false;
        addLog(combat, 'Combat terminé', 'system');
      }
      if (state.activeCombatId === action.payload) state.activeCombatId = null;
    },
    deleteCombat(state, action: PayloadAction<string>) {
      state.combats = state.combats.filter((c) => c.id !== action.payload);
      if (state.activeCombatId === action.payload) state.activeCombatId = null;
    },
    setActiveCombat(state, action: PayloadAction<string | null>) {
      state.activeCombatId = action.payload;
    },
    addCombatant(state, action: PayloadAction<{ combatId: string; combatant: Combatant }>) {
      const combat = state.combats.find((c) => c.id === action.payload.combatId);
      if (combat) {
        combat.combatants.push(action.payload.combatant);
        combat.combatants.sort((a, b) => b.initiative - a.initiative);
        addLog(combat, `${action.payload.combatant.name} rejoint le combat (Init: ${action.payload.combatant.initiative})`, 'system');
      }
    },
    removeCombatant(state, action: PayloadAction<{ combatId: string; combatantId: string }>) {
      const combat = state.combats.find((c) => c.id === action.payload.combatId);
      if (combat) {
        const removed = combat.combatants.find((cb) => cb.id === action.payload.combatantId);
        combat.combatants = combat.combatants.filter((cb) => cb.id !== action.payload.combatantId);
        if (removed) addLog(combat, `${removed.name} quitte le combat`, 'system');
        if (combat.currentTurnIndex >= combat.combatants.length && combat.combatants.length > 0) {
          combat.currentTurnIndex = 0;
        }
      }
    },
    updateCombatant(
      state,
      action: PayloadAction<{ combatId: string; combatant: Combatant }>
    ) {
      const combat = state.combats.find((c) => c.id === action.payload.combatId);
      if (combat) {
        const idx = combat.combatants.findIndex((cb) => cb.id === action.payload.combatant.id);
        if (idx !== -1) combat.combatants[idx] = action.payload.combatant;
      }
    },
    dealDamage(
      state,
      action: PayloadAction<{ combatId: string; combatantId: string; amount: number }>
    ) {
      const combat = state.combats.find((c) => c.id === action.payload.combatId);
      if (combat) {
        const cb = combat.combatants.find((c) => c.id === action.payload.combatantId);
        if (cb) {
          const prev = cb.currentHP;
          cb.currentHP = Math.max(0, cb.currentHP - action.payload.amount);
          addLog(combat, `${cb.name} reçoit ${action.payload.amount} dégâts (${prev} → ${cb.currentHP} PV)`, 'damage');
          if (cb.currentHP === 0) addLog(combat, `${cb.name} tombe à 0 PV !`, 'system');
        }
      }
    },
    healCombatant(
      state,
      action: PayloadAction<{ combatId: string; combatantId: string; amount: number }>
    ) {
      const combat = state.combats.find((c) => c.id === action.payload.combatId);
      if (combat) {
        const cb = combat.combatants.find((c) => c.id === action.payload.combatantId);
        if (cb) {
          const prev = cb.currentHP;
          cb.currentHP = Math.min(cb.maxHP, cb.currentHP + action.payload.amount);
          addLog(combat, `${cb.name} récupère ${action.payload.amount} PV (${prev} → ${cb.currentHP} PV)`, 'heal');
        }
      }
    },
    nextTurn(state, action: PayloadAction<string>) {
      const combat = state.combats.find((c) => c.id === action.payload);
      if (combat && combat.combatants.length > 0) {
        combat.combatants[combat.currentTurnIndex].isActive = false;
        combat.currentTurnIndex = (combat.currentTurnIndex + 1) % combat.combatants.length;
        if (combat.currentTurnIndex === 0) {
          combat.round += 1;
          addLog(combat, `--- Round ${combat.round} ---`, 'system');
        }
        combat.combatants[combat.currentTurnIndex].isActive = true;
        const active = combat.combatants[combat.currentTurnIndex];
        addLog(combat, `Tour de ${active.name}`, 'action');
      }
    },
    addConditionToCombatant(
      state,
      action: PayloadAction<{ combatId: string; combatantId: string; condition: string }>
    ) {
      const combat = state.combats.find((c) => c.id === action.payload.combatId);
      if (combat) {
        const cb = combat.combatants.find((c) => c.id === action.payload.combatantId);
        if (cb && !cb.conditions.includes(action.payload.condition)) {
          cb.conditions.push(action.payload.condition);
          addLog(combat, `${cb.name} est ${action.payload.condition}`, 'condition');
        }
      }
    },
    removeConditionFromCombatant(
      state,
      action: PayloadAction<{ combatId: string; combatantId: string; condition: string }>
    ) {
      const combat = state.combats.find((c) => c.id === action.payload.combatId);
      if (combat) {
        const cb = combat.combatants.find((c) => c.id === action.payload.combatantId);
        if (cb) {
          cb.conditions = cb.conditions.filter((cond) => cond !== action.payload.condition);
          addLog(combat, `${cb.name} n'est plus ${action.payload.condition}`, 'condition');
        }
      }
    },
    addLogEntry(state, action: PayloadAction<{ combatId: string; message: string; type: CombatLogEntry['type'] }>) {
      const combat = state.combats.find((c) => c.id === action.payload.combatId);
      if (combat) addLog(combat, action.payload.message, action.payload.type);
    },
  },
});

export const {
  startCombat,
  endCombat,
  deleteCombat,
  setActiveCombat,
  addCombatant,
  removeCombatant,
  updateCombatant,
  dealDamage,
  healCombatant,
  nextTurn,
  addConditionToCombatant,
  removeConditionFromCombatant,
  addLogEntry,
} = combatSlice.actions;

export default combatSlice.reducer;

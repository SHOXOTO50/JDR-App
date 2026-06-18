import { Vibration } from 'react-native';

export type EffectId =
  | 'dice_roll'
  | 'dice_critical'
  | 'dice_fumble'
  | 'weapon_equip'
  | 'armor_equip'
  | 'item_add'
  | 'combat_start'
  | 'combat_next_turn'
  | 'damage_dealt'
  | 'heal_received'
  | 'spell_cast'
  | 'spell_kamehameha'
  | 'spell_final_flash'
  | 'condition_applied'
  | 'quest_complete'
  | 'level_up'
  | 'secret_unlock';

interface EffectDef {
  vibration: number | number[];
  flashColor?: string;
  flashDuration?: number;
}

const EFFECTS: Record<EffectId, EffectDef> = {
  dice_roll:        { vibration: [0, 50, 30, 50],              flashColor: '#C9A84C', flashDuration: 150 },
  dice_critical:    { vibration: [0, 100, 50, 100, 50, 200],   flashColor: '#FFD700', flashDuration: 400 },
  dice_fumble:      { vibration: [0, 200, 100, 200],           flashColor: '#FF2222', flashDuration: 400 },
  weapon_equip:     { vibration: [0, 80, 40, 40],              flashColor: '#C9A84C', flashDuration: 200 },
  armor_equip:      { vibration: [0, 120, 60, 60],             flashColor: '#4488FF', flashDuration: 200 },
  item_add:         { vibration: 30 },
  combat_start:     { vibration: [0, 100, 50, 100, 50, 100],   flashColor: '#FF4444', flashDuration: 300 },
  combat_next_turn: { vibration: [0, 40, 20, 40] },
  damage_dealt:     { vibration: [0, 60, 30, 60],              flashColor: '#FF4444', flashDuration: 150 },
  heal_received:    { vibration: [0, 40, 20, 40],              flashColor: '#44FF88', flashDuration: 150 },
  spell_cast:       { vibration: [0, 50, 30, 80, 30, 50],      flashColor: '#7C3AED', flashDuration: 300 },
  spell_kamehameha: { vibration: [0, 50, 50, 100, 50, 200, 100, 400], flashColor: '#00AAFF', flashDuration: 600 },
  spell_final_flash:{ vibration: [0, 100, 50, 200, 100, 400],  flashColor: '#FFFF00', flashDuration: 500 },
  condition_applied:{ vibration: [0, 30, 30, 30] },
  quest_complete:   { vibration: [0, 100, 50, 100, 50, 100, 50, 200], flashColor: '#FFD700', flashDuration: 500 },
  level_up:         { vibration: [0, 100, 50, 100, 50, 200, 50, 300], flashColor: '#FFD700', flashDuration: 600 },
  secret_unlock:    { vibration: [0, 100, 50, 100, 50, 100, 50, 100, 50, 500], flashColor: '#FF00FF', flashDuration: 800 },
};

let _enabled = true;
let _flashCb: ((color: string, duration: number) => void) | null = null;

export const setEffectsEnabled = (enabled: boolean) => { _enabled = enabled; };
export const registerFlashCallback = (cb: typeof _flashCb) => { _flashCb = cb; };

export const triggerEffect = (effectId: EffectId) => {
  if (!_enabled) return;
  const effect = EFFECTS[effectId];
  if (!effect) return;
  try {
    Vibration.vibrate(effect.vibration as any);
  } catch (_) {}
  if (effect.flashColor && effect.flashDuration && _flashCb) {
    _flashCb(effect.flashColor, effect.flashDuration);
  }
};

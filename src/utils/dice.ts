import { DiceRoll } from '../types';
import { generateId } from './helpers';

export type DiceSides = 4 | 6 | 8 | 10 | 12 | 20 | 100;

export const DICE_TYPES: DiceSides[] = [4, 6, 8, 10, 12, 20, 100];

export const rollDie = (sides: number): number =>
  Math.floor(Math.random() * sides) + 1;

interface ParsedFormula {
  count: number;
  sides: number;
  modifier: number;
  valid: boolean;
}

export const parseDiceFormula = (formula: string): ParsedFormula => {
  const cleaned = formula.replace(/\s/g, '').toUpperCase();
  const match = cleaned.match(/^(\d+)?D(\d+)([+-]\d+)?$/);
  if (!match) return { count: 0, sides: 0, modifier: 0, valid: false };
  const count = parseInt(match[1] ?? '1', 10);
  const sides = parseInt(match[2], 10);
  const modifier = match[3] ? parseInt(match[3], 10) : 0;
  return { count, sides, modifier, valid: true };
};

export const rollFormula = (formula: string, characterId?: string): DiceRoll => {
  const parsed = parseDiceFormula(formula);
  if (!parsed.valid) {
    return {
      id: generateId(),
      formula,
      dice: [],
      modifier: 0,
      total: 0,
      characterId,
      timestamp: new Date().toISOString(),
    };
  }
  const dice = Array.from({ length: parsed.count }, () => ({
    sides: parsed.sides,
    result: rollDie(parsed.sides),
  }));
  const diceSum = dice.reduce((sum, d) => sum + d.result, 0);
  return {
    id: generateId(),
    formula,
    dice,
    modifier: parsed.modifier,
    total: diceSum + parsed.modifier,
    characterId,
    timestamp: new Date().toISOString(),
  };
};

export const rollWithAdvantage = (characterId?: string): DiceRoll => {
  const roll1 = rollDie(20);
  const roll2 = rollDie(20);
  const best = Math.max(roll1, roll2);
  return {
    id: generateId(),
    formula: '1D20 (Avantage)',
    dice: [{ sides: 20, result: roll1 }, { sides: 20, result: roll2 }],
    modifier: 0,
    total: best,
    advantage: true,
    characterId,
    timestamp: new Date().toISOString(),
  };
};

export const rollWithDisadvantage = (characterId?: string): DiceRoll => {
  const roll1 = rollDie(20);
  const roll2 = rollDie(20);
  const worst = Math.min(roll1, roll2);
  return {
    id: generateId(),
    formula: '1D20 (Désavantage)',
    dice: [{ sides: 20, result: roll1 }, { sides: 20, result: roll2 }],
    modifier: 0,
    total: worst,
    disadvantage: true,
    characterId,
    timestamp: new Date().toISOString(),
  };
};

export const formatRollResult = (roll: DiceRoll): string => {
  if (roll.dice.length === 0) return 'Formule invalide';
  const diceStr = roll.dice.map((d) => d.result).join(' + ');
  if (roll.modifier !== 0) {
    const modStr = roll.modifier > 0 ? ` + ${roll.modifier}` : ` - ${Math.abs(roll.modifier)}`;
    return `[${diceStr}]${modStr} = ${roll.total}`;
  }
  if (roll.dice.length === 1) return `${roll.total}`;
  return `[${diceStr}] = ${roll.total}`;
};

export const getDiceEmoji = (sides: number): string => {
  const map: Record<number, string> = {
    4: 'D4',
    6: 'D6',
    8: 'D8',
    10: 'D10',
    12: 'D12',
    20: 'D20',
    100: 'D%',
  };
  return map[sides] ?? `D${sides}`;
};

export const getDiceColor = (sides: number): string => {
  const map: Record<number, string> = {
    4: '#EF4444',
    6: '#F97316',
    8: '#EAB308',
    10: '#22C55E',
    12: '#3B82F6',
    20: '#8B5CF6',
    100: '#EC4899',
  };
  return map[sides] ?? '#C9A84C';
};

export const isCritical = (roll: DiceRoll): boolean =>
  roll.dice.length > 0 && roll.dice[0].sides === 20 && roll.dice[0].result === 20;

export const isCriticalFail = (roll: DiceRoll): boolean =>
  roll.dice.length > 0 && roll.dice[0].sides === 20 && roll.dice[0].result === 1;

// Protocole réseau pour le multijoueur LAN (même Wi-Fi).
// L'hôte (MJ) ouvre un serveur TCP ; les joueurs s'y connectent.
// Le code d'invitation encode directement l'IP locale de l'hôte :
// pas de serveur central, tout reste sur le réseau local.

export const LAN_PORT = 47820;

export interface CharacterSnapshot {
  id: string;
  name: string;
  characterClass: string;
  level: number;
  currentHP: number;
  maxHP: number;
  armorClass: number;
  conditions: string[];
}

export interface NetPlayer {
  peerId: string;
  playerName: string;
  isGM: boolean;
  character: CharacterSnapshot | null;
}

export type NetMessage =
  | { type: 'join'; playerName: string; character: CharacterSnapshot | null }
  | { type: 'update'; character: CharacterSnapshot | null }
  | { type: 'roster'; players: NetPlayer[] }
  | { type: 'kicked'; reason?: string };

// IP "a.b.c.d" -> code base36 de 7 caractères (port fixe, non encodé).
export const encodeCode = (ip: string): string => {
  const parts = ip.split('.').map((n) => parseInt(n, 10));
  if (parts.length !== 4 || parts.some((n) => isNaN(n) || n < 0 || n > 255)) return '';
  const num = ((parts[0] * 256 + parts[1]) * 256 + parts[2]) * 256 + parts[3];
  return (num >>> 0).toString(36).toUpperCase().padStart(7, '0');
};

// Code -> IP "a.b.c.d", ou null si invalide.
export const decodeCode = (code: string): string | null => {
  const num = parseInt(code.trim(), 36);
  if (isNaN(num) || num < 0 || num > 0xffffffff) return null;
  const a = (num >>> 24) & 255;
  const b = (num >>> 16) & 255;
  const c = (num >>> 8) & 255;
  const d = num & 255;
  return `${a}.${b}.${c}.${d}`;
};

export const serialize = (msg: NetMessage): string => JSON.stringify(msg) + '\n';

// Découpe un buffer en messages complets (délimités par \n) + reste non terminé.
export const parseMessages = (buffer: string): { messages: NetMessage[]; rest: string } => {
  const parts = buffer.split('\n');
  const rest = parts.pop() ?? '';
  const messages: NetMessage[] = [];
  for (const p of parts) {
    if (!p.trim()) continue;
    try {
      messages.push(JSON.parse(p) as NetMessage);
    } catch {
      // message corrompu ignoré
    }
  }
  return { messages, rest };
};

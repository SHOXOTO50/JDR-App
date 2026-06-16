import { useCallback, useEffect, useRef, useState } from 'react';
import * as Network from 'expo-network';
import {
  LAN_PORT, NetMessage, NetPlayer, CharacterSnapshot,
  encodeCode, decodeCode, serialize, parseMessages,
} from './lanProtocol';

// Chargement défensif du module natif : s'il manque, on dégrade
// proprement au lieu de faire planter le bundle entier.
let TcpSocket: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  TcpSocket = require('react-native-tcp-socket').default ?? require('react-native-tcp-socket');
} catch {
  TcpSocket = null;
}

export type LanMode = 'idle' | 'hosting' | 'joining' | 'connected' | 'kicked' | 'error';

interface HostClient {
  peerId: string;
  socket: any;
  player: NetPlayer;
  buffer: string;
}

let peerCounter = 0;
const nextPeerId = () => `p${Date.now().toString(36)}${(peerCounter++).toString(36)}`;

export const useLanSession = () => {
  const [mode, setMode] = useState<LanMode>('idle');
  const [code, setCode] = useState<string>('');
  const [hostIp, setHostIp] = useState<string>('');
  const [roster, setRoster] = useState<NetPlayer[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const serverRef = useRef<any>(null);
  const clientsRef = useRef<Map<string, HostClient>>(new Map());
  const bannedRef = useRef<Set<string>>(new Set());
  const selfPlayerRef = useRef<NetPlayer | null>(null);

  const clientSocketRef = useRef<any>(null);
  const clientBufferRef = useRef<string>('');

  const available = !!TcpSocket;

  const cleanup = useCallback(() => {
    try {
      clientsRef.current.forEach((c) => { try { c.socket.destroy(); } catch {} });
      clientsRef.current.clear();
    } catch {}
    try { serverRef.current?.close?.(); } catch {}
    serverRef.current = null;
    try { clientSocketRef.current?.destroy?.(); } catch {}
    clientSocketRef.current = null;
    clientBufferRef.current = '';
  }, []);

  useEffect(() => cleanup, [cleanup]);

  // ---- HÔTE ----------------------------------------------------------------

  const broadcastRoster = useCallback(() => {
    const players: NetPlayer[] = [];
    if (selfPlayerRef.current) players.push(selfPlayerRef.current);
    clientsRef.current.forEach((c) => players.push(c.player));
    setRoster(players);
    const msg = serialize({ type: 'roster', players });
    clientsRef.current.forEach((c) => { try { c.socket.write(msg); } catch {} });
  }, []);

  const handleHostData = useCallback((peerId: string, chunk: string) => {
    const client = clientsRef.current.get(peerId);
    if (!client) return;
    client.buffer += chunk;
    const { messages, rest } = parseMessages(client.buffer);
    client.buffer = rest;
    let changed = false;
    for (const m of messages) {
      if (m.type === 'join') {
        client.player.playerName = m.playerName || 'Joueur';
        client.player.character = m.character;
        changed = true;
      } else if (m.type === 'update') {
        client.player.character = m.character;
        changed = true;
      }
    }
    if (changed) broadcastRoster();
  }, [broadcastRoster]);

  const host = useCallback(async (playerName: string, character: CharacterSnapshot | null) => {
    if (!available) { setErrorMsg("Le module réseau n'est pas disponible dans cette version."); setMode('error'); return; }
    setErrorMsg('');
    try {
      let ip = '';
      try { ip = await Network.getIpAddressAsync(); } catch {}
      if (!ip || ip === '0.0.0.0') {
        setErrorMsg("Impossible de récupérer l'adresse IP locale. Vérifiez que le Wi-Fi est activé.");
        setMode('error');
        return;
      }
      setHostIp(ip);
      setCode(encodeCode(ip));
      selfPlayerRef.current = {
        peerId: 'host', playerName: playerName || 'MJ', isGM: true, character,
      };

      const server = TcpSocket.createServer((socket: any) => {
        const remote = socket.remoteAddress ?? '';
        if (bannedRef.current.has(remote)) { try { socket.destroy(); } catch {} return; }
        const peerId = nextPeerId();
        const client: HostClient = {
          peerId, socket, buffer: '',
          player: { peerId, playerName: 'Joueur…', isGM: false, character: null },
        };
        clientsRef.current.set(peerId, client);
        socket.on('data', (data: any) => handleHostData(peerId, data.toString()));
        socket.on('error', () => {});
        socket.on('close', () => {
          clientsRef.current.delete(peerId);
          broadcastRoster();
        });
        broadcastRoster();
      });
      server.on('error', (e: any) => {
        setErrorMsg('Erreur serveur : ' + (e?.message ?? 'inconnue'));
        setMode('error');
      });
      server.listen({ port: LAN_PORT, host: '0.0.0.0' });
      serverRef.current = server;
      setMode('hosting');
      broadcastRoster();
    } catch (e: any) {
      setErrorMsg('Erreur : ' + (e?.message ?? 'inconnue'));
      setMode('error');
    }
  }, [available, broadcastRoster, handleHostData]);

  const kick = useCallback((peerId: string) => {
    const client = clientsRef.current.get(peerId);
    if (!client) return;
    const remote = client.socket.remoteAddress;
    if (remote) bannedRef.current.add(remote);
    try { client.socket.write(serialize({ type: 'kicked', reason: 'Expulsé par le MJ' })); } catch {}
    try { client.socket.destroy(); } catch {}
    clientsRef.current.delete(peerId);
    broadcastRoster();
  }, [broadcastRoster]);

  // ---- CLIENT --------------------------------------------------------------

  const join = useCallback((inviteCode: string, playerName: string, character: CharacterSnapshot | null) => {
    if (!available) { setErrorMsg("Le module réseau n'est pas disponible dans cette version."); setMode('error'); return; }
    const ip = decodeCode(inviteCode);
    if (!ip) { setErrorMsg('Code invalide.'); setMode('error'); return; }
    setErrorMsg('');
    setHostIp(ip);
    setMode('joining');
    try {
      const socket = TcpSocket.createConnection({ port: LAN_PORT, host: ip, timeout: 8000 }, () => {
        try {
          socket.write(serialize({ type: 'join', playerName: playerName || 'Joueur', character }));
        } catch {}
        setMode('connected');
      });
      clientSocketRef.current = socket;
      socket.on('data', (data: any) => {
        clientBufferRef.current += data.toString();
        const { messages, rest } = parseMessages(clientBufferRef.current);
        clientBufferRef.current = rest;
        for (const m of messages) {
          if (m.type === 'roster') setRoster(m.players);
          else if (m.type === 'kicked') {
            setMode('kicked');
            try { socket.destroy(); } catch {}
          }
        }
      });
      socket.on('error', (e: any) => {
        setErrorMsg("Connexion impossible. Même Wi-Fi ? Code correct ? (" + (e?.message ?? '') + ')');
        setMode('error');
      });
      socket.on('close', () => {
        setMode((prev) => (prev === 'kicked' ? 'kicked' : prev === 'error' ? 'error' : 'idle'));
      });
    } catch (e: any) {
      setErrorMsg('Erreur : ' + (e?.message ?? 'inconnue'));
      setMode('error');
    }
  }, [available]);

  // Diffuse la fiche locale mise à jour (PV/CA/états) vers les pairs.
  const pushUpdate = useCallback((character: CharacterSnapshot | null) => {
    if (mode === 'hosting') {
      if (selfPlayerRef.current) {
        selfPlayerRef.current.character = character;
        broadcastRoster();
      }
    } else if (mode === 'connected') {
      try { clientSocketRef.current?.write(serialize({ type: 'update', character })); } catch {}
    }
  }, [mode, broadcastRoster]);

  const leave = useCallback(() => {
    cleanup();
    selfPlayerRef.current = null;
    bannedRef.current.clear();
    setRoster([]);
    setCode('');
    setHostIp('');
    setErrorMsg('');
    setMode('idle');
  }, [cleanup]);

  return {
    available, mode, code, hostIp, roster, errorMsg,
    host, join, kick, pushUpdate, leave,
  };
};

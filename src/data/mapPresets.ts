import { Image } from 'react-native';

export interface MapPreset {
  id: string;
  name: string;
  icon: string;
  source: number;
}

export const MAP_PRESETS: MapPreset[] = [
  {
    id: 'dungeon-stone',
    name: 'Donjon de pierre',
    icon: '🏰',
    source: require('../../assets/maps/dungeon-stone.png'),
  },
  {
    id: 'dungeon-cave',
    name: 'Caverne souterraine',
    icon: '🕳️',
    source: require('../../assets/maps/dungeon-cave.png'),
  },
  {
    id: 'town-square',
    name: 'Place du village',
    icon: '🏘️',
    source: require('../../assets/maps/town-square.png'),
  },
  {
    id: 'town-river',
    name: 'Ville fluviale',
    icon: '🌊',
    source: require('../../assets/maps/town-river.png'),
  },
];

// Les modules require()s sont des nombres en React Native ; on les résout
// en URI utilisable par <Image source={{ uri }} /> comme pour les imports.
export const resolvePresetUri = (source: number): string => Image.resolveAssetSource(source).uri;

import type { Language } from '../types.js';

export const byName = <T extends { name: string }>(list: T[], language?: Language): T[] =>
  list.sort((a, b) => a.name.localeCompare(b.name, language || 'en'));

export const byIso = <T extends { iso: string }>(list: T[]): T[] =>
  list.sort((a, b) => (a.iso < b.iso ? -1 : a.iso > b.iso ? 1 : 0));

export const normalizeCode = (code: string): string => (typeof code === 'string' ? code.trim().toUpperCase() : '');

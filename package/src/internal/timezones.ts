import zones from '../generated/timezones.js';

export const timezoneNames: string[] = zones;

export const zoneList = (indexes: number[]): string[] => indexes.map((i) => timezoneNames[i]);

import continentRows from './generated/continents.js';
import countryRows from './generated/countries.js';
import { timezoneNames, zoneList } from './internal/timezones.js';
import { normalizeCode } from './internal/util.js';

const countries = countryRows as [string, string, string, string, number, string, number, number, number[]][];
const continents = continentRows as [string, string, string, number, number, number[]][];

/** IANA time zones of a country ("GH" or "GHA"), most populous first. */
const getByCountry = (iso: string): string[] => {
  const code = normalizeCode(iso);
  const row = countries.find((c) => c[0] === code || c[1] === code);
  return row ? zoneList(row[8]) : [];
};

/** IANA time zones of a continent ("AF" or "AFR"). */
const getByContinent = (iso: string): string[] => {
  const code = normalizeCode(iso);
  const row = continents.find((c) => c[0] === code || c[1] === code);
  return row ? zoneList(row[5]) : [];
};

/**
 * Current UTC offset of an IANA time zone in minutes (e.g. 330 for Asia/Kolkata), taking
 * daylight saving time into account for the given date. Computed with the runtime's Intl data.
 */
const getOffset = (timeZone: string, date: Date = new Date()): number => {
  const part = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'longOffset' })
    .formatToParts(date)
    .find((p) => p.type === 'timeZoneName')?.value;
  const match = /GMT([+-])(\d{1,2})(?::(\d{2}))?/.exec(part ?? '');
  if (!match) return 0;
  const minutes = Number(match[2]) * 60 + Number(match[3] ?? 0);
  return match[1] === '-' ? -minutes : minutes;
};

/** Current UTC offset formatted as "+05:30" / "-03:00" / "+00:00". */
const getOffsetString = (timeZone: string, date: Date = new Date()): string => {
  const offset = getOffset(timeZone, date);
  const abs = Math.abs(offset);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${offset < 0 ? '-' : '+'}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
};

export default {
  /** Every IANA time zone referenced by the dataset, sorted alphabetically. */
  get getAll(): string[] {
    return timezoneNames.slice();
  },
  getByCountry,
  getByContinent,
  getOffset,
  getOffsetString,
};

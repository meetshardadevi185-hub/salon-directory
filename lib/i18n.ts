// Server-side message loading for a locale, on top of the shared i18n/t.mjs formatter.
import fs from 'node:fs';
import path from 'node:path';
import { createT } from '@/i18n/t.mjs';
import { DEFAULT_LOCALE } from '@/i18n/locales.mjs';
import en from '@/messages/en.json';
import hi from '@/messages/hi.json';

const bundledMessages: Record<string, unknown> = { en, hi };
const readJSON = (code: string) => bundledMessages[code] ?? JSON.parse(fs.readFileSync(path.join(process.cwd(), 'messages', `${code}.json`), 'utf8'));

export type T = ((key: string, vars?: Record<string, unknown>) => any) & { raw: (key: string) => any };

export function getT(locale: string): T {
  return createT(readJSON(locale), readJSON(DEFAULT_LOCALE), locale) as T;
}

// URL of a locale's home page.
export const localeHref = (code: string) => (code === DEFAULT_LOCALE ? '/' : `/${code}/`);

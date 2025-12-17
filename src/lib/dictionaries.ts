import type { Locale } from './i18n-config';
import en from '../locales/en.json';
import ar from '../locales/ar.json';

const dictionaries = {
  en,
  ar,
};

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale];
};

export type Dictionary = typeof en;

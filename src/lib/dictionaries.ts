import en from '../locales/en.json';

const dictionaries = {
  en,
};

export const getDictionary = async (locale: string) => {
  return dictionaries['en']; // English only
};

export type Dictionary = typeof en;

'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/language-context';

export const useDictionary = () => {
    const { language } = useLanguage();
    const [dictionary, setDictionary] = useState<any>(null);

    useEffect(() => {
        const fetchDictionary = async () => {
            try {
                const dict = await import(`@/locales/${language}.json`);
                setDictionary(dict.default || dict);
            } catch (error) {
                console.error(`Failed to load dictionary for locale: ${language}`, error);
            }
        };

        fetchDictionary();
    }, [language]);

    return { dictionary, language };
};
